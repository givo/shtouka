import React, { useRef, useEffect, useState, useCallback } from 'react';
import { zones } from './zones/zoneConfig.js';
import AudioManager from './game/audio.js';
import {
  GAME_STATES,
  createGameState,
  initSolPosition,
  getCurrentZone,
  handleJump,
  updateGame,
  updateTransition,
  advanceToNextZone,
  renderGame,
  restartFromZone,
  restartGame,
} from './game/engine.js';

import LoadingScreen from './components/LoadingScreen.jsx';
import StartScreen from './components/StartScreen.jsx';
import HUD from './components/HUD.jsx';
import PauseMenu from './components/PauseMenu.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';
import FinalMessage from './components/FinalMessage.jsx';
import OrientationPrompt from './components/OrientationPrompt.jsx';

export default function App() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const gameRef = useRef(createGameState());
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(0);

  // UI state (React-managed for re-renders)
  const [uiState, setUiState] = useState(GAME_STATES.LOADING);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentZone, setCurrentZone] = useState(zones[0]);
  const [zoneProgress, setZoneProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: zones.length });
  const [showOrientation, setShowOrientation] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // Check saved game
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sol-game-progress');
      if (saved) {
        const data = JSON.parse(saved);
        const hours = (Date.now() - data.timestamp) / 1000 / 60 / 60;
        if (hours < 24) {
          setHasSavedGame(true);
        }
      }
    } catch (e) { /* ignore */ }
  }, []);

  // Check mobile orientation
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const checkOrientation = () => {
        const isPortrait = window.innerHeight > window.innerWidth;
        setShowOrientation(isPortrait);
      };
      checkOrientation();
      window.addEventListener('resize', checkOrientation);
      window.addEventListener('orientationchange', () => setTimeout(checkOrientation, 200));

      // Try to lock orientation
      try {
        screen.orientation?.lock?.('landscape').catch(() => {});
      } catch (e) { /* ignore */ }

      return () => {
        window.removeEventListener('resize', checkOrientation);
      };
    }
  }, []);

  // Initialize audio and preload
  useEffect(() => {
    const audio = new AudioManager();
    audioRef.current = audio;

    async function preload() {
      await audio.init();
      await audio.preloadAll(zones, (loaded, total) => {
        setLoadProgress({ loaded, total });
      });
      setUiState(GAME_STATES.START);
    }

    preload();

    return () => {
      audio.destroy();
    };
  }, []);

  // Canvas resize
  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const game = gameRef.current;
      initSolPosition(game, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Sync UI state from game state (on each frame, we push critical state to React)
  const syncUI = useCallback(() => {
    const game = gameRef.current;
    setScore(game.score);
    setLives(game.lives);
    setCurrentZone(getCurrentZone(game));
    setZoneProgress(game.zoneProgress);
  }, []);

  // Main game loop
  useEffect(() => {
    function gameLoop(timestamp) {
      animFrameRef.current = requestAnimationFrame(gameLoop);

      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      const game = gameRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      if (game.state === GAME_STATES.PLAYING) {
        updateGame(game, canvas.width, canvas.height, deltaTime, audioRef.current);
        renderGame(ctx, game, canvas.width, canvas.height);
        syncUI();

        // Check if game state changed
        if (game.state === GAME_STATES.GAME_OVER) {
          setUiState(GAME_STATES.GAME_OVER);
        } else if (game.state === GAME_STATES.FINALE) {
          setUiState(GAME_STATES.FINALE);
        } else if (game.state === GAME_STATES.ZONE_TRANSITION) {
          setUiState(GAME_STATES.ZONE_TRANSITION);
        }
      } else if (game.state === GAME_STATES.ZONE_TRANSITION) {
        const done = updateTransition(game, deltaTime);
        renderGame(ctx, game, canvas.width, canvas.height);

        if (done) {
          advanceToNextZone(game, audioRef.current);
          setUiState(GAME_STATES.PLAYING);
          syncUI();
        }
      } else if (game.state === GAME_STATES.PAUSED) {
        // Still render the frozen frame
        renderGame(ctx, game, canvas.width, canvas.height);
      }
    }

    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [syncUI]);

  // Keyboard and touch controls
  useEffect(() => {
    let lastTapTime = 0;

    function handleKeyDown(e) {
      const game = gameRef.current;

      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (game.state === GAME_STATES.PLAYING) {
          handleJump(game);
        } else if (game.state === GAME_STATES.START) {
          if (startGameRef.current) startGameRef.current();
        }
      }
      if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault();
        if (game.state === GAME_STATES.PLAYING) {
          game.state = GAME_STATES.PAUSED;
          setUiState(GAME_STATES.PAUSED);
          audioRef.current?.stopAll();
        } else if (game.state === GAME_STATES.PAUSED) {
          resumeGame();
        }
      }
    }

    function handleTouchStart(e) {
      const game = gameRef.current;
      if (game.state !== GAME_STATES.PLAYING) return;

      // Debounce
      const now = Date.now();
      if (now - lastTapTime < 150) return;
      lastTapTime = now;

      e.preventDefault();
      handleJump(game);
    }

    function handleClick(e) {
      const game = gameRef.current;
      if (game.state !== GAME_STATES.PLAYING) return;

      // Don't trigger if clicking on UI buttons
      if (e.target.tagName === 'BUTTON' || e.target.closest('.hud-buttons')) return;

      handleJump(game);
    }

    document.addEventListener('keydown', handleKeyDown);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('click', handleClick);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('click', handleClick);
      }
    };
  }, []);

  // ===== Game Actions =====

  const startGameRef = useRef(null);

  const startGame = useCallback(async () => {
    try {
      const audio = audioRef.current;
      if (audio) await audio.unlock();

      const game = gameRef.current;
      const canvas = canvasRef.current;

      restartGame(game, canvas.width, canvas.height);
      setUiState(GAME_STATES.PLAYING);

      if (audio) audio.play(zones[0].id);
      syncUI();
    } catch (e) {
      console.error('Failed to start game:', e);
      const game = gameRef.current;
      const canvas = canvasRef.current;
      restartGame(game, canvas.width, canvas.height);
      setUiState(GAME_STATES.PLAYING);
      syncUI();
    }
  }, [syncUI]);

  // Keep a ref to latest startGame for use in event handlers
  startGameRef.current = startGame;

  const resumeSavedGame = useCallback(async () => {
    try {
      const saved = JSON.parse(localStorage.getItem('sol-game-progress'));
      if (!saved) return startGame();

      const audio = audioRef.current;
      await audio.unlock();

      const game = gameRef.current;
      const canvas = canvasRef.current;

      restartGame(game, canvas.width, canvas.height);
      game.currentZoneIndex = saved.currentZone || 0;
      game.score = saved.score || 0;
      game.lives = saved.lives || 3;

      setUiState(GAME_STATES.PLAYING);
      audio.play(getCurrentZone(game).id);
      syncUI();
    } catch (e) {
      startGame();
    }
  }, [startGame, syncUI]);

  const resumeGame = useCallback(() => {
    const game = gameRef.current;
    game.state = GAME_STATES.PLAYING;
    setUiState(GAME_STATES.PLAYING);

    const zone = getCurrentZone(game);
    audioRef.current?.play(zone.id);
  }, []);

  const restartCurrentZone = useCallback(() => {
    const game = gameRef.current;
    const canvas = canvasRef.current;
    restartFromZone(game, game.currentZoneIndex, canvas.width, canvas.height);
    setUiState(GAME_STATES.PLAYING);

    const zone = getCurrentZone(game);
    audioRef.current?.stopAll();
    audioRef.current?.play(zone.id);
    syncUI();
  }, [syncUI]);

  const retryAfterGameOver = useCallback(() => {
    const game = gameRef.current;
    const canvas = canvasRef.current;
    restartFromZone(game, game.currentZoneIndex, canvas.width, canvas.height);
    setUiState(GAME_STATES.PLAYING);

    const zone = getCurrentZone(game);
    audioRef.current?.stopAll();
    audioRef.current?.play(zone.id);
    syncUI();
  }, [syncUI]);

  const goToMainMenu = useCallback(() => {
    const game = gameRef.current;
    game.state = GAME_STATES.START;
    audioRef.current?.stopAll();
    setUiState(GAME_STATES.START);
  }, []);

  const playAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  const selectZone = useCallback(async (zoneIndex) => {
    const audio = audioRef.current;
    await audio.unlock();
    audio.stopAll();

    const game = gameRef.current;
    const canvas = canvasRef.current;
    restartFromZone(game, zoneIndex, canvas.width, canvas.height);
    setUiState(GAME_STATES.PLAYING);

    const zone = getCurrentZone(game);
    audio.play(zone.id);
    syncUI();
  }, [syncUI]);

  const toggleMute = useCallback(() => {
    const isMuted = audioRef.current?.toggleMute();
    setMuted(isMuted);
  }, []);

  const changeVolume = useCallback((val) => {
    setVolume(val);
    audioRef.current?.setVolume(val / 100);
  }, []);

  // ===== Render =====
  return (
    <div className="game-wrapper">
      <canvas ref={canvasRef} className="game-canvas" />

      {/* Orientation prompt for mobile portrait */}
      {showOrientation && (
        <OrientationPrompt onContinue={() => setShowOrientation(false)} />
      )}

      {/* Loading screen */}
      {uiState === GAME_STATES.LOADING && (
        <LoadingScreen progress={loadProgress.loaded} total={loadProgress.total} />
      )}

      {/* Start screen */}
      {uiState === GAME_STATES.START && (
        <StartScreen
          onStart={startGame}
          onResume={resumeSavedGame}
          hasSavedGame={hasSavedGame}
        />
      )}

      {/* HUD (shown during gameplay and transitions) */}
      {(uiState === GAME_STATES.PLAYING || uiState === GAME_STATES.ZONE_TRANSITION || uiState === GAME_STATES.PAUSED) && (
        <HUD
          zone={currentZone}
          score={score}
          lives={lives}
          muted={muted}
          onPause={() => {
            const game = gameRef.current;
            game.state = GAME_STATES.PAUSED;
            setUiState(GAME_STATES.PAUSED);
            audioRef.current?.stopAll();
          }}
          onToggleMute={toggleMute}
          zoneProgress={zoneProgress}
        />
      )}

      {/* Pause menu */}
      {uiState === GAME_STATES.PAUSED && (
        <PauseMenu
          onResume={resumeGame}
          onRestart={restartCurrentZone}
          onMainMenu={goToMainMenu}
          volume={volume}
          onVolumeChange={changeVolume}
        />
      )}

      {/* Game Over */}
      {uiState === GAME_STATES.GAME_OVER && (
        <GameOverScreen
          score={score}
          zoneReached={gameRef.current.currentZoneIndex + 1}
          onRetry={retryAfterGameOver}
          onMainMenu={goToMainMenu}
        />
      )}

      {/* Finale */}
      {uiState === GAME_STATES.FINALE && (
        <FinalMessage
          score={score}
          onPlayAgain={playAgain}
          onSelectZone={selectZone}
        />
      )}
    </div>
  );
}
