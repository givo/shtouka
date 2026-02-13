import React from 'react';

export default function HUD({ zone, score, lives, muted, onPause, onToggleMute, zoneProgress }) {
  return (
    <>
      <div className="hud">
        <div className="hud-left">
          <div className="hud-zone">
            {zone.emoji} {zone.nameHe} ({zone.id}/10)
          </div>
          <div className="hud-score">
            Score: {String(score).padStart(5, '0')}
          </div>
        </div>
        <div className="hud-right">
          <div className="hud-lives">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={i >= lives ? 'lost' : ''}>
                ❤️
              </span>
            ))}
          </div>
          <div className="hud-buttons">
            <button className="hud-btn" onClick={onToggleMute} title={muted ? 'Unmute' : 'Mute'}>
              {muted ? '🔇' : '🔊'}
            </button>
            <button className="hud-btn" onClick={onPause} title="Pause">
              ⏸
            </button>
          </div>
        </div>
      </div>

      <div className="zone-progress">
        <div
          className="zone-progress-fill"
          style={{ width: `${zoneProgress * 100}%` }}
        />
      </div>
    </>
  );
}
