import React from 'react';

export default function PauseMenu({ onResume, onRestart, onMainMenu, volume, onVolumeChange }) {
  return (
    <div className="overlay pause-menu">
      <div className="overlay-bg" onClick={onResume} />
      <div className="overlay-card">
        <h2>⏸ המשחק מושהה</h2>
        <p>Game Paused</p>

        <div style={{ margin: '16px 0' }}>
          <label style={{ fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            🔊
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              style={{ width: 120 }}
            />
            {volume}%
          </label>
        </div>

        <div className="btn-group">
          <button className="btn btn-primary" onClick={onResume}>
            ▶ המשך
          </button>
          <button className="btn btn-ghost btn-small" onClick={onRestart}>
            🔁 התחל מחדש את השלב
          </button>
          <button className="btn btn-ghost btn-small" onClick={onMainMenu}>
            🏠 תפריט ראשי
          </button>
        </div>
      </div>
    </div>
  );
}
