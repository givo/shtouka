import React from 'react';

export default function GameOverScreen({ score, zoneReached, onRetry, onMainMenu }) {
  return (
    <div className="overlay game-over">
      <div className="overlay-bg" />
      <div className="overlay-card">
        <h2>אוי לא! 🥺</h2>
        <p>סול פגע במשהו!</p>

        <div className="game-over-stats">
          <div className="game-over-stat">
            <div className="value">{String(score).padStart(5, '0')}</div>
            <div className="label">ניקוד</div>
          </div>
          <div className="game-over-stat">
            <div className="value">{zoneReached}/10</div>
            <div className="label">שלבים</div>
          </div>
        </div>

        <div className="btn-group">
          <button className="btn btn-primary" onClick={onRetry}>
            🔁 נסו שוב
          </button>
          <button className="btn btn-ghost btn-small" onClick={onMainMenu}>
            🏠 תפריט ראשי
          </button>
        </div>
      </div>
    </div>
  );
}
