import React, { useRef, useEffect } from 'react';
import { zones } from '../zones/zoneConfig.js';

const CONFETTI_COLORS = [
  '#FF1493', '#FFD700', '#87CEEB', '#00FF00', '#FF0000',
  '#9B59B6', '#FF8C00', '#FFFF00', '#40E0D0', '#FF69B4',
];

function createConfettiParticles(count) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      size: Math.random() * 10 + 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      speedY: Math.random() * 2.5 + 1.5,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
      shape: Math.floor(Math.random() * 3), // 0=circle, 1=square, 2=star
    });
  }
  return particles;
}

export default function FinalMessage({ score, onPlayAgain, onSelectZone }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef(createConfettiParticles(120));
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 1) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          drawMiniStar(ctx, 0, 0, 5, p.size / 2, p.size / 4);
          ctx.fill();
        }
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="finale-screen" style={{ background: 'linear-gradient(180deg, #FFF5F5 0%, #FFE0EC 40%, #FFD1E8 100%)' }}>
      <canvas ref={canvasRef} className="finale-confetti-canvas" />

      <div className="finale-content">
        <div className="finale-message-card">
          <h2>🎉 כל הכבוד! 🎉</h2>

          <div className="message-text">
            {"סול עבר את כל ההרפתקה!\nהמסר שלך יופיע כאן..."}
          </div>

          <div className="finale-hearts">❤️ 🐕 ❤️</div>

          <div className="finale-score">
            Final Score: {String(score).padStart(5, '0')}
          </div>

          <div className="btn-group" style={{ alignItems: 'center' }}>
            <button className="btn btn-play" onClick={onPlayAgain}>
              🔁 שחקו שוב
            </button>
          </div>

          {/* Zone Selector */}
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>בחרו שלב להשמעה מחדש:</p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 6,
              direction: 'ltr',
            }}>
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => onSelectZone(zone.id - 1)}
                  style={{
                    background: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    padding: '6px 2px',
                    cursor: 'pointer',
                    fontSize: 11,
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #FFD700, #FF69B4)';
                    e.target.style.color = '#FFF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #f0f0f0, #e0e0e0)';
                    e.target.style.color = '#333';
                  }}
                >
                  <div>{zone.emoji}</div>
                  <div style={{ fontSize: 10 }}>{zone.id}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function drawMiniStar(ctx, cx, cy, spikes, outerR, innerR) {
  let rot = Math.PI / 2 * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerR;
    let y = cy + Math.sin(rot) * outerR;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerR;
    y = cy + Math.sin(rot) * innerR;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
}
