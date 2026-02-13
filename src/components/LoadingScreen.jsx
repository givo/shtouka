import React from 'react';

export default function LoadingScreen({ progress, total }) {
  const percent = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <div className="loading-screen">
      <div className="loading-dog">🐕</div>
      <div className="loading-text">שטוקה טוקה מתכונן...</div>
      <div className="loading-bar-container">
        <div
          className="loading-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="loading-percent">{percent}%</div>
      <div className="loading-sub">Loading music and graphics</div>
    </div>
  );
}
