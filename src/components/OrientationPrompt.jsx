import React from 'react';

export default function OrientationPrompt({ onContinue }) {
  return (
    <div className="orientation-prompt">
      <div className="orientation-icon">📱</div>
      <h2>סובבו את המכשיר לרוחב</h2>
      <p>Please rotate your device to landscape</p>
      <p style={{ fontSize: 14, opacity: 0.7 }}>לחוויה הטובה ביותר, שחקו במצב רוחב</p>
      <button className="orientation-continue" onClick={onContinue}>
        המשיכו בכל מקרה →
      </button>
    </div>
  );
}
