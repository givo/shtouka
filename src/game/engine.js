// Main game engine - handles the game loop, state, obstacles, and zone progression

import { zones, ZONE_MAX_DURATION, ZONE_FADE_START } from '../zones/zoneConfig.js';
import {
  createSolState, updateSolPhysics, jump as solJump,
  checkCollision, GROUND_Y_RATIO, SOL_SIZE, SOL_X_RATIO
} from './physics.js';
import { drawSol, drawObstacle, drawBackground, drawGround } from './renderer.js';

export const GAME_STATES = {
  LOADING: 'loading',
  START: 'start',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  ZONE_TRANSITION: 'zoneTransition',
  FINALE: 'finale',
};

export function createGameState() {
  return {
    state: GAME_STATES.START,
    score: 0,
    lives: 3,
    currentZoneIndex: 0,
    zoneTimer: 0,
    scrollX: 0,
    obstacles: [],
    lastObstacleTime: 0,
    sol: createSolState(),
    time: 0,
    transitionTimer: 0,
    transitionAlpha: 0,
    collectibles: [],
    particles: [],
    zoneProgress: 0, // 0 to 1
    finaleTimer: 0,
    isPaused: false,
  };
}

export function initSolPosition(game, canvasW, canvasH) {
  const groundY = canvasH * GROUND_Y_RATIO;
  game.sol.x = canvasW * SOL_X_RATIO;
  game.sol.y = groundY - SOL_SIZE;
}

export function getCurrentZone(game) {
  return zones[game.currentZoneIndex] || zones[0];
}

export function handleJump(game) {
  if (game.state !== GAME_STATES.PLAYING) return false;
  const jumped = solJump(game.sol);
  if (jumped && navigator.vibrate) {
    navigator.vibrate(10);
  }
  return jumped;
}

export function spawnObstacle(game, canvasW, canvasH) {
  const zone = getCurrentZone(game);
  const groundY = canvasH * GROUND_Y_RATIO;

  const obstacleTemplate = zone.obstacles[Math.floor(Math.random() * zone.obstacles.length)];
  const isSafe = zone.isSafeZone;

  let w = 35 + Math.random() * 15;
  let h = 40 + Math.random() * 20;
  let y;

  if (obstacleTemplate.height === 'medium' || obstacleTemplate.height === 'any') {
    y = groundY - h - 20 - Math.random() * 40;
  } else {
    y = groundY - h;
  }

  // For collectible zones, float some items randomly
  if (isSafe && obstacleTemplate.height === 'any') {
    y = groundY - h - Math.random() * (canvasH * 0.3);
  }

  const obstacle = {
    x: canvasW + 20,
    y,
    width: w,
    height: h,
    type: obstacleTemplate.type,
    isCollectible: isSafe || !!obstacleTemplate.collectible,
    givesLife: !!obstacleTemplate.givesLife,
    points: obstacleTemplate.points || 0,
    collected: false,
    spawnTime: game.time,
  };

  game.obstacles.push(obstacle);
}

export function updateGame(game, canvasW, canvasH, deltaTime, audioManager) {
  if (game.state !== GAME_STATES.PLAYING) return;

  game.time += deltaTime;
  game.zoneTimer += deltaTime;

  const zone = getCurrentZone(game);
  const groundY = canvasH * GROUND_Y_RATIO;
  const scrollSpeed = (canvasW * 1.5) / ZONE_MAX_DURATION * zone.speed * 1.6;

  // Update scroll
  game.scrollX += scrollSpeed * deltaTime;

  // Update Sol physics
  updateSolPhysics(game.sol, groundY, deltaTime);

  // Zone progress
  game.zoneProgress = Math.min(game.zoneTimer / ZONE_MAX_DURATION, 1);

  // Spawn obstacles
  if (game.time - game.lastObstacleTime > zone.obstacleInterval) {
    spawnObstacle(game, canvasW, canvasH);
    game.lastObstacleTime = game.time;
  }

  // Update obstacles
  for (let i = game.obstacles.length - 1; i >= 0; i--) {
    const obs = game.obstacles[i];
    obs.x -= scrollSpeed * deltaTime;

    // Check collision
    if (!obs.collected && checkCollision(game.sol.x, game.sol.y, obs)) {
      if (obs.isCollectible) {
        // Collect it
        obs.collected = true;
        game.score += obs.points || 10;
        // Give a life if it's a heart-type collectible
        if (obs.givesLife && game.lives < 3) {
          game.lives++;
          game.particles.push({
            x: obs.x + obs.width / 2,
            y: obs.y - 15,
            text: '❤️+1',
            life: 1.2,
            vy: -2.5,
          });
        }
        // Spawn collection particle
        game.particles.push({
          x: obs.x + obs.width / 2,
          y: obs.y,
          text: `+${obs.points || 10}`,
          life: 1,
          vy: -2,
        });
      } else {
        // Hit! Lose a life
        game.lives--;
        game.sol.hitFlash = 1;
        if (navigator.vibrate) navigator.vibrate(50);

        if (game.lives <= 0) {
          game.state = GAME_STATES.GAME_OVER;
          if (audioManager) audioManager.stopAll();
          return;
        } else {
          // Brief invincibility - remove this obstacle
          game.obstacles.splice(i, 1);
          continue;
        }
      }
    }

    // Remove off-screen obstacles
    if (obs.x + obs.width < -50) {
      if (!obs.isCollectible && !obs.collected) {
        game.score += 10; // Points for passing an obstacle
      }
      game.obstacles.splice(i, 1);
    }
  }

  // Update particles
  for (let i = game.particles.length - 1; i >= 0; i--) {
    const p = game.particles[i];
    p.y += p.vy;
    p.life -= deltaTime * 2;
    if (p.life <= 0) game.particles.splice(i, 1);
  }

  // Song fade at ZONE_FADE_START
  if (game.zoneTimer >= ZONE_FADE_START && game.zoneTimer < ZONE_FADE_START + 0.1) {
    if (audioManager) {
      audioManager.fadeOut(zone.id, 3);
    }
  }

  // Zone completion
  if (game.zoneTimer >= ZONE_MAX_DURATION) {
    completeZone(game, audioManager);
  }
}

function completeZone(game, audioManager) {
  const wasLastZone = game.currentZoneIndex >= zones.length - 1;

  // Award life (max 3) for completing zone
  if (game.lives < 3) game.lives++;

  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

  if (wasLastZone) {
    game.state = GAME_STATES.FINALE;
    if (audioManager) audioManager.stopAll();
    return;
  }

  // Transition to next zone
  game.state = GAME_STATES.ZONE_TRANSITION;
  game.transitionTimer = 0;
  game.transitionAlpha = 0;

  // Save progress
  try {
    localStorage.setItem('sol-game-progress', JSON.stringify({
      currentZone: game.currentZoneIndex + 1,
      score: game.score,
      lives: game.lives,
      timestamp: Date.now(),
    }));
  } catch (e) { /* ignore */ }
}

export function advanceToNextZone(game, audioManager) {
  game.currentZoneIndex++;
  game.zoneTimer = 0;
  game.obstacles = [];
  game.particles = [];
  game.lastObstacleTime = 0;
  game.state = GAME_STATES.PLAYING;

  const nextZone = getCurrentZone(game);
  if (audioManager) {
    audioManager.play(nextZone.id);
  }
}

export function updateTransition(game, deltaTime) {
  if (game.state !== GAME_STATES.ZONE_TRANSITION) return;
  game.transitionTimer += deltaTime;

  if (game.transitionTimer < 0.5) {
    game.transitionAlpha = game.transitionTimer / 0.5;
  } else if (game.transitionTimer >= 1.5) {
    game.transitionAlpha = 0;
    return true; // Transition complete
  } else if (game.transitionTimer >= 1.0) {
    game.transitionAlpha = 1 - (game.transitionTimer - 1.0) / 0.5;
  }
  return false;
}

export function renderGame(ctx, game, canvasW, canvasH) {
  ctx.clearRect(0, 0, canvasW, canvasH);

  const zone = getCurrentZone(game);

  // Draw background
  drawBackground(ctx, zone, canvasW, canvasH, game.scrollX, game.time);

  // Draw ground
  drawGround(ctx, zone, canvasW, canvasH, game.scrollX);

  // Draw obstacles
  for (const obs of game.obstacles) {
    if (!obs.collected) {
      // Add glow for collectibles
      if (obs.isCollectible) {
        ctx.save();
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 8 + Math.sin(game.time * 3) * 4;
        drawObstacle(ctx, obs, game.time);
        ctx.restore();
      } else {
        drawObstacle(ctx, obs, game.time);
      }
    }
  }

  // Draw Sol
  drawSol(ctx, game.sol, game.time);

  // Draw score particles
  for (const p of game.particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 18px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
  }

  // Transition overlay
  if (game.state === GAME_STATES.ZONE_TRANSITION && game.transitionAlpha > 0) {
    ctx.fillStyle = `rgba(0,0,0,${game.transitionAlpha * 0.8})`;
    ctx.fillRect(0, 0, canvasW, canvasH);

    if (game.transitionTimer >= 0.5 && game.transitionTimer < 1.0) {
      const nextZone = zones[game.currentZoneIndex + 1];
      if (nextZone) {
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${canvasW * 0.035}px Heebo, sans-serif`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1;
        ctx.fillText(
          `${nextZone.emoji} ${nextZone.nameHe}`,
          canvasW / 2,
          canvasH / 2 - 10
        );
        ctx.font = `${canvasW * 0.02}px Nunito, sans-serif`;
        ctx.fillText(nextZone.name, canvasW / 2, canvasH / 2 + 25);
      }
    }
  }
}

export function restartFromZone(game, zoneIndex, canvasW, canvasH) {
  game.state = GAME_STATES.PLAYING;
  game.currentZoneIndex = zoneIndex;
  game.zoneTimer = 0;
  game.obstacles = [];
  game.particles = [];
  game.lastObstacleTime = 0;
  game.lives = 3;
  game.sol = createSolState();
  initSolPosition(game, canvasW, canvasH);
}

export function restartGame(game, canvasW, canvasH) {
  Object.assign(game, createGameState());
  game.state = GAME_STATES.PLAYING;
  initSolPosition(game, canvasW, canvasH);
}
