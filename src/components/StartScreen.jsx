import React from 'react';

export default function StartScreen({ onStart, onResume, hasSavedGame }) {
  return (
    <div className="start-screen">
      <div className="start-content">
        <div className="start-dog">🐕</div>
        <h1 className="start-title">ההרפתקה המוזיקלית של סול</h1>
        <p className="start-subtitle">Sol's Musical Adventure</p>
        <p className="start-subtitle" style={{ fontSize: 16, opacity: 0.7 }}>
          10 עולמות, 10 שירים, הרפתקה אחת!
        </p>

        <div className="start-buttons">
          <button className="btn btn-play" onClick={onStart}>
            🎮 התחילו לשחק!
          </button>
          {hasSavedGame && (
            <button className="btn btn-ghost" style={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.5)' }} onClick={onResume}>
              ▶ המשיכו מאיפה שעצרתם
            </button>
          )}
        </div>

        <p className="start-hint">
          לחצו רווח או הקישו על המסך כדי לקפוץ
        </p>
      </div>
    </div>
  );
}
