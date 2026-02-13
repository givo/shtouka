// Canvas renderer for backgrounds, Sol, and obstacles

import { SOL_SIZE } from './physics.js';

// ===== SOL CHARACTER DRAWING =====
export function drawSol(ctx, sol, time) {
  ctx.save();
  const cx = sol.x + SOL_SIZE / 2;
  const cy = sol.y + SOL_SIZE / 2;
  ctx.translate(cx, cy);

  // Flip horizontally so Sol faces right (direction of movement)
  ctx.scale(-1, 1);

  // Apply rotation during jump
  if (sol.rotation) {
    ctx.rotate(sol.rotation);
  }

  // Apply squish on landing
  let scaleX = 1, scaleY = 1;
  if (sol.squish > 0) {
    scaleX = 1 + sol.squish * 0.2;
    scaleY = 1 - sol.squish * 0.15;
  }
  ctx.scale(scaleX, scaleY);

  // Hit flash effect
  if (sol.hitFlash > 0 && Math.floor(sol.hitFlash * 10) % 2 === 0) {
    ctx.globalAlpha = 0.5;
  }

  const s = SOL_SIZE / 2;

  // Body - black golden retriever
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.ellipse(0, 4, s * 0.55, s * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.ellipse(-s * 0.3, -s * 0.15, s * 0.32, s * 0.28, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Ears (floppy)
  const earBounce = sol.isJumping ? Math.sin(time * 12) * 3 : Math.sin(time * 4) * 1;
  ctx.fillStyle = '#111';
  // Left ear
  ctx.beginPath();
  ctx.ellipse(-s * 0.5, -s * 0.25 + earBounce, s * 0.15, s * 0.22, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // Right ear
  ctx.beginPath();
  ctx.ellipse(-s * 0.15, -s * 0.35 + earBounce * 0.5, s * 0.12, s * 0.18, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Snout
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath();
  ctx.ellipse(-s * 0.52, -s * 0.05, s * 0.14, s * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(-s * 0.6, -s * 0.08, s * 0.06, s * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(-s * 0.38, -s * 0.2, s * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(-s * 0.38, -s * 0.2, s * 0.04, 0, Math.PI * 2);
  ctx.fill();
  // Eye shine
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(-s * 0.36, -s * 0.22, s * 0.015, 0, Math.PI * 2);
  ctx.fill();

  // Legs animation
  ctx.fillStyle = '#1a1a1a';
  const legAnim = sol.isOnGround ? sol.animFrame : 2;
  const legAngles = [
    [0.3, -0.3, 0.2, -0.2],   // frame 0
    [-0.2, 0.3, -0.3, 0.2],   // frame 1
    [0.1, -0.1, 0.1, -0.1],   // frame 2 (jump/idle)
    [-0.3, 0.2, 0.3, -0.3],   // frame 3
  ];
  const angles = legAngles[legAnim];

  // Front legs
  for (let i = 0; i < 2; i++) {
    ctx.save();
    ctx.translate(-s * 0.2, s * 0.25);
    ctx.rotate(angles[i]);
    ctx.fillRect(-3, 0, 6, s * 0.4);
    // Paw
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.ellipse(0, s * 0.4, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.restore();
  }

  // Back legs
  for (let i = 2; i < 4; i++) {
    ctx.save();
    ctx.translate(s * 0.25, s * 0.25);
    ctx.rotate(angles[i]);
    ctx.fillRect(-3, 0, 7, s * 0.38);
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.ellipse(0, s * 0.38, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.restore();
  }

  // Tail
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const tailWag = Math.sin(time * (sol.isOnGround ? 8 : 4)) * 0.4;
  ctx.beginPath();
  ctx.moveTo(s * 0.4, 0);
  ctx.quadraticCurveTo(
    s * 0.6 + Math.sin(tailWag) * 10,
    -s * 0.3 + Math.cos(tailWag) * 5,
    s * 0.55 + Math.sin(tailWag) * 12,
    -s * 0.45
  );
  ctx.stroke();

  // Tongue (when running, sometimes)
  if (sol.isOnGround && Math.sin(time * 3) > 0.3) {
    ctx.fillStyle = '#FF6B8A';
    ctx.beginPath();
    ctx.ellipse(-s * 0.58, s * 0.05, 3, 5 + Math.sin(time * 6) * 2, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ===== OBSTACLE DRAWING =====
export function drawObstacle(ctx, obstacle, time) {
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  const w = obstacle.width;
  const h = obstacle.height;

  switch (obstacle.type) {
    // Zone 1 - Pop
    case 'microphone':
      drawMicrophone(ctx, w, h, time);
      break;
    case 'lollipop':
      drawLollipop(ctx, w, h, time);
      break;
    case 'star':
      drawSpinningStar(ctx, w, h, time);
      break;
    case 'fanPoster':
      drawFanPoster(ctx, w, h);
      break;
    case 'heartBalloon':
      drawHeartBalloon(ctx, w, h, time);
      break;

    // Zone 2 - Cartoon
    case 'bone':
      drawBone(ctx, w, h);
      break;
    case 'ball':
      drawBall(ctx, w, h, time);
      break;
    case 'acmeBox':
      drawAcmeBox(ctx, w, h);
      break;
    case 'trumpet':
      drawTrumpet(ctx, w, h);
      break;
    case 'musicNote':
      drawMusicNote(ctx, w, h, time);
      break;

    // Zone 3 - Israeli Rock
    case 'darbuka':
      drawDarbuka(ctx, w, h);
      break;
    case 'tambourine':
      drawTambourine(ctx, w, h, time);
      break;
    case 'stringLights':
      drawStringLightsObs(ctx, w, h, time);
      break;
    case 'zaatar':
      drawZaatar(ctx, w, h);
      break;
    case 'hookah':
      drawHookah(ctx, w, h, time);
      break;

    // Zone 4 - Heavy Rock
    case 'electricGuitar':
      drawElectricGuitar(ctx, w, h);
      break;
    case 'amplifier':
      drawAmplifier(ctx, w, h);
      break;
    case 'drumSet':
      drawDrumSet(ctx, w, h);
      break;
    case 'micStand':
      drawMicStand(ctx, w, h);
      break;
    case 'pyroBurst':
      drawPyroBurst(ctx, w, h, time);
      break;

    // Zone 5 - Ending Song (collectibles)
    case 'floatingHeart':
      drawFloatingHeart(ctx, w, h, time);
      break;
    case 'rose':
      drawRose(ctx, w, h);
      break;
    case 'loveNote':
      drawLoveNote(ctx, w, h, time);
      break;
    case 'giftBox':
      drawGiftBox(ctx, w, h);
      break;
    case 'cupidArrow':
      drawCupidArrow(ctx, w, h);
      break;

    // Zone 6 - Hawaiian
    case 'pineapple':
      drawPineapple(ctx, w, h);
      break;
    case 'lei':
      drawLei(ctx, w, h);
      break;
    case 'surfboard':
      drawSurfboard(ctx, w, h);
      break;
    case 'coconut':
      drawCoconut(ctx, w, h);
      break;
    case 'tikiTorch':
      drawTikiTorch(ctx, w, h, time);
      break;

    // Zone 7 - Reggae
    case 'bongoDrums':
      drawBongoDrums(ctx, w, h);
      break;
    case 'peaceSign':
      drawPeaceSign(ctx, w, h);
      break;
    case 'beachChair':
      drawBeachChair(ctx, w, h);
      break;
    case 'tropicalDrink':
      drawTropicalDrink(ctx, w, h);
      break;
    case 'rastaHat':
      drawRastaHat(ctx, w, h);
      break;

    // Zone 8 - Hawaiian Acoustic
    case 'ukulele':
      drawUkulele(ctx, w, h);
      break;
    case 'seashell':
      drawSeashell(ctx, w, h);
      break;
    case 'flipFlops':
      drawFlipFlops(ctx, w, h);
      break;
    case 'beachTorch':
      drawBeachTorch(ctx, w, h, time);
      break;
    case 'starfish':
      drawStarfish(ctx, w, h);
      break;

    // Zone 9 - Eastern
    case 'nargila':
      drawNargila(ctx, w, h, time);
      break;
    case 'teaGlass':
      drawTeaGlass(ctx, w, h, time);
      break;
    case 'moroccanLamp':
      drawMoroccanLamp(ctx, w, h, time);
      break;
    case 'cushion':
      drawCushion(ctx, w, h);
      break;
    case 'plate':
      drawPlate(ctx, w, h);
      break;

    // Zone 10 - Finale (collectibles)
    case 'goldenHeart':
      drawGoldenHeart(ctx, w, h, time);
      break;
    case 'bouquet':
      drawBouquet(ctx, w, h);
      break;
    case 'goldenStar':
      drawGoldenStar(ctx, w, h, time);
      break;
    case 'loveLetter':
      drawLoveLetter(ctx, w, h);
      break;
    case 'trophy':
      drawTrophy(ctx, w, h, time);
      break;

    default:
      // Fallback: simple colored rectangle
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, w, h);
  }

  ctx.restore();
}

// ===== OBSTACLE DRAW FUNCTIONS =====

// -- Zone 1: Pop --
function drawMicrophone(ctx, w, h) {
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(w/2 - 3, h * 0.3, 6, h * 0.7);
  ctx.fillStyle = '#888';
  ctx.beginPath();
  ctx.arc(w/2, h * 0.2, w * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#666';
  ctx.beginPath();
  ctx.arc(w/2, h * 0.2, w * 0.22, 0, Math.PI * 2);
  ctx.fill();
}

function drawLollipop(ctx, w, h, time) {
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(w/2 - 2, h * 0.45, 4, h * 0.55);
  const rot = time * 2;
  ctx.save();
  ctx.translate(w/2, h * 0.28);
  ctx.rotate(rot);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#FF69B4' : '#FFF';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, w * 0.35, (i / 6) * Math.PI * 2, ((i + 1) / 6) * Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSpinningStar(ctx, w, h, time) {
  ctx.save();
  ctx.translate(w/2, h/2);
  ctx.rotate(time * 3);
  drawStarShape(ctx, 0, 0, 5, w * 0.45, w * 0.2);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.strokeStyle = '#FFA500';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawFanPoster(ctx, w, h) {
  ctx.fillStyle = '#FFB6C1';
  ctx.fillRect(2, 2, w - 4, h - 4);
  ctx.strokeStyle = '#FF69B4';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, w - 4, h - 4);
  ctx.fillStyle = '#FF1493';
  ctx.font = `bold ${Math.min(w, h) * 0.22}px Nunito, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('WE', w/2, h * 0.3);
  ctx.fillStyle = '#FF0000';
  ctx.fillText('♥', w/2, h * 0.55);
  ctx.fillStyle = '#FF1493';
  ctx.fillText('SOL', w/2, h * 0.8);
}

function drawHeartBalloon(ctx, w, h, time) {
  const bob = Math.sin(time * 3) * 4;
  ctx.strokeStyle = '#FFB6C1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w/2, h * 0.6);
  ctx.lineTo(w/2, h);
  ctx.stroke();
  ctx.save();
  ctx.translate(w/2, h * 0.35 + bob);
  drawHeartShape(ctx, 0, 0, w * 0.4);
  ctx.fillStyle = '#FF1493';
  ctx.fill();
  ctx.restore();
}

// -- Zone 2: Cartoon --
function drawBone(ctx, w, h) {
  ctx.fillStyle = '#FFFFF0';
  ctx.strokeStyle = '#CCC';
  ctx.lineWidth = 1;
  ctx.fillRect(w * 0.2, h * 0.35, w * 0.6, h * 0.3);
  for (let x of [0.12, 0.72]) {
    for (let y of [0.25, 0.55]) {
      ctx.beginPath();
      ctx.arc(w * x + 5, h * y + 5, w * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
  ctx.strokeRect(w * 0.2, h * 0.35, w * 0.6, h * 0.3);
}

function drawBall(ctx, w, h, time) {
  const bounce = Math.abs(Math.sin(time * 4)) * 8;
  ctx.save();
  ctx.translate(0, -bounce);
  const gradient = ctx.createRadialGradient(w/2 - 5, h/2 - 5, 2, w/2, h/2, w * 0.4);
  gradient.addColorStop(0, '#FF4444');
  gradient.addColorStop(1, '#CC0000');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(w/2, h/2, w * 0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.arc(w * 0.38, h * 0.38, w * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawAcmeBox(ctx, w, h) {
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(2, 2, w - 4, h - 4);
  ctx.fillStyle = '#6B5335';
  ctx.fillRect(2, 2, w - 4, 4);
  ctx.strokeStyle = '#5B4325';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, w - 4, h - 4);
  ctx.fillStyle = '#FFF';
  ctx.font = `bold ${w * 0.22}px Nunito, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('ACME', w/2, h * 0.65);
}

function drawTrumpet(ctx, w, h) {
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(w * 0.35, h * 0.1, w * 0.3, h * 0.6);
  ctx.beginPath();
  ctx.moveTo(w * 0.2, h * 0.7);
  ctx.lineTo(w * 0.8, h * 0.7);
  ctx.lineTo(w * 0.65, h * 0.1);
  ctx.lineTo(w * 0.35, h * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#DAA520';
  ctx.fillRect(w * 0.3, h * 0.85, w * 0.4, h * 0.1);
}

function drawMusicNote(ctx, w, h, time) {
  ctx.save();
  ctx.translate(w/2, h/2);
  ctx.rotate(Math.sin(time * 2) * 0.2);
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(-w * 0.1, h * 0.15, w * 0.18, h * 0.12, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(w * 0.05, -h * 0.35, 4, h * 0.5);
  ctx.fillRect(w * 0.05, -h * 0.35, w * 0.15, 4);
  ctx.restore();
}

// -- Zone 3: Israeli Rock --
function drawDarbuka(ctx, w, h) {
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.moveTo(w * 0.2, 0);
  ctx.lineTo(w * 0.8, 0);
  ctx.lineTo(w * 0.65, h * 0.5);
  ctx.lineTo(w * 0.55, h);
  ctx.lineTo(w * 0.45, h);
  ctx.lineTo(w * 0.35, h * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#D2B48C';
  ctx.beginPath();
  ctx.ellipse(w/2, 5, w * 0.3, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1;
  for (let y = 0.2; y < 0.8; y += 0.15) {
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * y);
    ctx.lineTo(w * 0.75, h * y);
    ctx.stroke();
  }
}

function drawTambourine(ctx, w, h, time) {
  ctx.save();
  ctx.translate(w/2, h/2);
  ctx.rotate(Math.sin(time * 4) * 0.3);
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.38, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#DEB887';
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.35, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * w * 0.3, Math.sin(angle) * w * 0.3, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawStringLightsObs(ctx, w, h, time) {
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(w/2, h * 0.4, w, 0);
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const t = (i + 0.5) / 5;
    const x = w * t;
    const y = h * 0.2 * Math.sin(t * Math.PI);
    const colors = ['#FF0000', '#FFD700', '#00FF00', '#FF1493', '#00BFFF'];
    ctx.fillStyle = colors[i];
    ctx.globalAlpha = 0.7 + Math.sin(time * 3 + i) * 0.3;
    ctx.beginPath();
    ctx.arc(x, y + 10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawZaatar(ctx, w, h) {
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.moveTo(w * 0.2, h);
  ctx.lineTo(w * 0.1, h * 0.2);
  ctx.lineTo(w * 0.9, h * 0.2);
  ctx.lineTo(w * 0.8, h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#556B2F';
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.25, w * 0.35, h * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#DEB887';
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.15, w * 0.3, h * 0.05, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawHookah(ctx, w, h, time) {
  ctx.fillStyle = '#4169E1';
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.75, w * 0.35, h * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(w/2 - 3, h * 0.15, 6, h * 0.5);
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(w/2, h * 0.12, w * 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Smoke
  ctx.fillStyle = 'rgba(200,200,200,0.3)';
  for (let i = 0; i < 3; i++) {
    const y = h * 0.05 - i * 10;
    const x = w/2 + Math.sin(time * 2 + i) * 8;
    ctx.beginPath();
    ctx.arc(x, y, 5 + i * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// -- Zone 4: Heavy Rock --
function drawElectricGuitar(ctx, w, h) {
  ctx.fillStyle = '#CC0000';
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.7, w * 0.35, h * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8B0000';
  ctx.fillRect(w/2 - 4, h * 0.05, 8, h * 0.5);
  ctx.fillStyle = '#FFD700';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(w * 0.3, h * 0.55 + i * 5, w * 0.4, 1);
  }
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.05, w * 0.12, h * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawAmplifier(ctx, w, h) {
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(2, 2, w - 4, h - 4);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, w - 4, h - 4);
  ctx.fillStyle = '#444';
  ctx.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.55);
  ctx.fillStyle = '#FFD700';
  ctx.font = `bold ${w * 0.15}px Nunito, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('ROCK', w/2, h * 0.9);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.arc(w * (0.3 + i * 0.2), h * 0.82, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDrumSet(ctx, w, h) {
  ctx.fillStyle = '#8B0000';
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.6, w * 0.4, h * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.6, w * 0.4, h * 0.35, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(w * 0.2, h * 0.2, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(w * 0.2 - 1, h * 0.2, 2, h * 0.35);
}

function drawMicStand(ctx, w, h) {
  ctx.fillStyle = '#666';
  ctx.fillRect(w/2 - 2, h * 0.2, 4, h * 0.8);
  ctx.fillStyle = '#888';
  ctx.beginPath();
  ctx.arc(w/2, h * 0.15, w * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(w/2, h * 0.15, w * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(w * 0.2, h * 0.95, w * 0.6, h * 0.05);
}

function drawPyroBurst(ctx, w, h, time) {
  const flicker = 0.7 + Math.sin(time * 10) * 0.3;
  ctx.globalAlpha = flicker;
  const gradient = ctx.createRadialGradient(w/2, h * 0.3, 0, w/2, h * 0.3, w * 0.4);
  gradient.addColorStop(0, '#FFFF00');
  gradient.addColorStop(0.5, '#FF8C00');
  gradient.addColorStop(1, '#FF0000');
  ctx.fillStyle = gradient;
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + time * 3;
    const len = h * 0.4 + Math.sin(time * 8 + i) * 10;
    ctx.beginPath();
    ctx.moveTo(w/2, h * 0.5);
    ctx.lineTo(w/2 + Math.cos(angle) * w * 0.15, h * 0.5 - len);
    ctx.lineTo(w/2 + Math.cos(angle + 0.3) * w * 0.1, h * 0.5 - len * 0.7);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// -- Zone 5: Ending Song (collectibles) --
function drawFloatingHeart(ctx, w, h, time) {
  const bob = Math.sin(time * 3) * 5;
  const glow = 0.5 + Math.sin(time * 4) * 0.3;
  ctx.save();
  ctx.translate(w/2, h/2 + bob);
  ctx.shadowColor = '#FF69B4';
  ctx.shadowBlur = 10 * glow;
  drawHeartShape(ctx, 0, 0, w * 0.4);
  ctx.fillStyle = '#FF69B4';
  ctx.fill();
  ctx.restore();
}

function drawRose(ctx, w, h) {
  ctx.fillStyle = '#228B22';
  ctx.fillRect(w/2 - 2, h * 0.45, 4, h * 0.55);
  ctx.fillStyle = '#DC143C';
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(
      w/2 + Math.cos(angle) * 8, h * 0.3 + Math.sin(angle) * 8,
      10, 8, angle, 0, Math.PI * 2
    );
    ctx.fill();
  }
  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.arc(w/2, h * 0.3, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawLoveNote(ctx, w, h, time) {
  const bob = Math.sin(time * 2) * 3;
  ctx.save();
  ctx.translate(0, bob);
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.8);
  ctx.strokeStyle = '#DEB887';
  ctx.lineWidth = 1;
  ctx.strokeRect(w * 0.1, h * 0.1, w * 0.8, h * 0.8);
  ctx.fillStyle = '#FF69B4';
  ctx.save();
  ctx.translate(w/2, h/2);
  drawHeartShape(ctx, 0, 0, w * 0.2);
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

function drawGiftBox(ctx, w, h) {
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(w * 0.1, h * 0.3, w * 0.8, h * 0.65);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(w * 0.45, h * 0.3, w * 0.1, h * 0.65);
  ctx.fillRect(w * 0.1, h * 0.5, w * 0.8, h * 0.1);
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(w * 0.05, h * 0.2, w * 0.9, h * 0.15);
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(w/2, h * 0.15, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawCupidArrow(ctx, w, h) {
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h/2);
  ctx.lineTo(w * 0.9, h/2);
  ctx.stroke();
  ctx.fillStyle = '#FF1493';
  ctx.beginPath();
  ctx.moveTo(w * 0.9, h/2);
  ctx.lineTo(w * 0.75, h * 0.3);
  ctx.lineTo(w * 0.75, h * 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#DEB887';
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.3);
  ctx.lineTo(w * 0.2, h/2);
  ctx.lineTo(w * 0.1, h * 0.7);
  ctx.closePath();
  ctx.fill();
}

// -- Zone 6: Hawaiian --
function drawPineapple(ctx, w, h) {
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.6, w * 0.3, h * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#DAA520';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * (0.35 + i * 0.12));
    ctx.lineTo(w * 0.8, h * (0.35 + i * 0.12));
    ctx.stroke();
  }
  ctx.fillStyle = '#228B22';
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI/2 + (i - 2) * 0.4;
    ctx.beginPath();
    ctx.ellipse(w/2 + Math.cos(angle) * 5, h * 0.15, 4, 12, angle, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLei(ctx, w, h) {
  const colors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FF69B4', '#FFF'];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(w/2 + Math.cos(angle) * w * 0.25, h/2 + Math.sin(angle) * h * 0.3, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSurfboard(ctx, w, h) {
  ctx.fillStyle = '#00CED1';
  ctx.beginPath();
  ctx.ellipse(w/2, h/2, w * 0.2, h * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FF6347';
  ctx.fillRect(w/2 - 2, h * 0.15, 4, h * 0.7);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(w * 0.35, h * 0.45, w * 0.3, 3);
}

function drawCoconut(ctx, w, h) {
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.arc(w/2, h/2, w * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6B3410';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(w/2 + (i - 1) * 8, h * 0.4, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTikiTorch(ctx, w, h, time) {
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(w/2 - 5, h * 0.3, 10, h * 0.7);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(w/2 - 8, h * 0.25, 16, 10);
  const flicker = Math.sin(time * 8) * 3;
  const grad = ctx.createRadialGradient(w/2 + flicker, h * 0.15, 0, w/2, h * 0.15, 15);
  grad.addColorStop(0, '#FFD700');
  grad.addColorStop(0.5, '#FF8C00');
  grad.addColorStop(1, 'rgba(255,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(w/2 + flicker, h * 0.15, 15, 0, Math.PI * 2);
  ctx.fill();
}

// -- Zone 7: Reggae --
function drawBongoDrums(ctx, w, h) {
  for (let i = 0; i < 2; i++) {
    const x = w * (0.25 + i * 0.3);
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(x - 12, h * 0.2);
    ctx.lineTo(x + 12, h * 0.2);
    ctx.lineTo(x + 10, h);
    ctx.lineTo(x - 10, h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#DEB887';
    ctx.beginPath();
    ctx.ellipse(x, h * 0.22, 13, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPeaceSign(ctx, w, h) {
  const colors = ['#FF0000', '#FFD700', '#00FF00', '#FF69B4', '#00BFFF'];
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(w/2, h/2, w * 0.35, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(w/2, h/2);
    ctx.arc(w/2, h/2, w * 0.33, (i/6) * Math.PI * 2, ((i+1)/6) * Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w/2, h * 0.15);
  ctx.lineTo(w/2, h * 0.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w/2, h/2);
  ctx.lineTo(w * 0.25, h * 0.75);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w/2, h/2);
  ctx.lineTo(w * 0.75, h * 0.75);
  ctx.stroke();
}

function drawBeachChair(ctx, w, h) {
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h);
  ctx.lineTo(w * 0.3, h * 0.2);
  ctx.lineTo(w * 0.9, h * 0.4);
  ctx.lineTo(w * 0.85, h);
  ctx.stroke();
  const stripeColors = ['#FF0000', '#FFFFFF', '#0000FF'];
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = stripeColors[i % 3];
    ctx.fillRect(w * (0.25 + i * 0.1), h * 0.25, w * 0.1, h * 0.3);
  }
}

function drawTropicalDrink(ctx, w, h) {
  ctx.fillStyle = 'rgba(255,165,0,0.7)';
  ctx.beginPath();
  ctx.moveTo(w * 0.2, h * 0.3);
  ctx.lineTo(w * 0.3, h * 0.95);
  ctx.lineTo(w * 0.7, h * 0.95);
  ctx.lineTo(w * 0.8, h * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.strokeStyle = '#FF69B4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.6, h * 0.3);
  ctx.lineTo(w * 0.8, h * 0.05);
  ctx.stroke();
  ctx.fillStyle = '#FF1493';
  ctx.beginPath();
  ctx.moveTo(w * 0.65, h * 0.15);
  ctx.lineTo(w * 0.9, h * 0.1);
  ctx.lineTo(w * 0.8, h * 0.25);
  ctx.closePath();
  ctx.fill();
}

function drawRastaHat(ctx, w, h) {
  const colors = ['#FF0000', '#FFD700', '#008000'];
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.ellipse(w/2, h * (0.3 + i * 0.12), w * (0.45 - i * 0.05), h * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#1a1a1a';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(w * (0.2 + i * 0.12), h * 0.6, 3, h * 0.35);
  }
}

// -- Zone 8: Hawaiian Acoustic --
function drawUkulele(ctx, w, h) {
  ctx.fillStyle = '#DEB887';
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.65, w * 0.3, h * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(w/2 - 4, h * 0.05, 8, h * 0.45);
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.65, w * 0.1, h * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(w * 0.35, h * 0.02, w * 0.3, h * 0.08);
}

function drawSeashell(ctx, w, h) {
  ctx.fillStyle = '#FFE4C4';
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.8);
  ctx.quadraticCurveTo(w * 0.1, h * 0.2, w/2, h * 0.1);
  ctx.quadraticCurveTo(w * 0.9, h * 0.2, w * 0.9, h * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#DEB887';
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(w/2, h * 0.8, i * w * 0.08, Math.PI, 0);
    ctx.stroke();
  }
}

function drawFlipFlops(ctx, w, h) {
  for (let i = 0; i < 2; i++) {
    const x = w * (0.2 + i * 0.35);
    ctx.fillStyle = i === 0 ? '#FF6347' : '#00CED1';
    ctx.beginPath();
    ctx.ellipse(x, h * 0.55, w * 0.18, h * 0.35, i * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 5, h * 0.3);
    ctx.lineTo(x, h * 0.55);
    ctx.lineTo(x + 5, h * 0.3);
    ctx.stroke();
  }
}

function drawBeachTorch(ctx, w, h, time) {
  ctx.fillStyle = '#90753A';
  ctx.fillRect(w/2 - 4, h * 0.25, 8, h * 0.75);
  ctx.fillStyle = '#6B5328';
  ctx.fillRect(w/2 - 6, h * 0.22, 12, 6);
  const f = Math.sin(time * 7) * 3;
  const grad = ctx.createRadialGradient(w/2 + f, h * 0.12, 0, w/2, h * 0.12, 14);
  grad.addColorStop(0, '#FFFF00');
  grad.addColorStop(0.5, '#FF8C00');
  grad.addColorStop(1, 'rgba(255,69,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(w/2 + f, h * 0.12, 14, 0, Math.PI * 2);
  ctx.fill();
}

function drawStarfish(ctx, w, h) {
  ctx.save();
  ctx.translate(w/2, h/2);
  drawStarShape(ctx, 0, 0, 5, w * 0.4, w * 0.18);
  ctx.fillStyle = '#FF8C69';
  ctx.fill();
  ctx.strokeStyle = '#E07050';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#FFAA88';
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// -- Zone 9: Eastern --
function drawNargila(ctx, w, h, time) {
  ctx.fillStyle = '#4169E1';
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.75, w * 0.3, h * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(w/2 - 3, h * 0.2, 6, h * 0.4);
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(w/2, h * 0.18, w * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w/2, h * 0.3);
  ctx.quadraticCurveTo(w * 0.8, h * 0.35, w * 0.85, h * 0.5);
  ctx.stroke();
  ctx.fillStyle = 'rgba(200,200,200,0.25)';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(w/2 + Math.sin(time * 1.5 + i) * 6, h * 0.08 - i * 8, 4 + i * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTeaGlass(ctx, w, h, time) {
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(w * 0.25, h * 0.7, w * 0.5, h * 0.25);
  ctx.fillStyle = 'rgba(139,69,19,0.6)';
  ctx.beginPath();
  ctx.moveTo(w * 0.3, h * 0.2);
  ctx.lineTo(w * 0.7, h * 0.2);
  ctx.lineTo(w * 0.65, h * 0.7);
  ctx.lineTo(w * 0.35, h * 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  for (let i = 0; i < 2; i++) {
    ctx.beginPath();
    ctx.arc(w/2 + (i - 0.5) * 8, h * 0.1 + Math.sin(time * 2 + i) * 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMoroccanLamp(ctx, w, h, time) {
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w/2, 0);
  ctx.lineTo(w/2, h * 0.15);
  ctx.stroke();
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(w * 0.25, h * 0.15);
  ctx.lineTo(w * 0.75, h * 0.15);
  ctx.lineTo(w * 0.65, h * 0.8);
  ctx.quadraticCurveTo(w/2, h * 0.95, w * 0.35, h * 0.8);
  ctx.closePath();
  ctx.fill();
  const glow = 0.4 + Math.sin(time * 3) * 0.2;
  ctx.fillStyle = `rgba(255,200,50,${glow})`;
  ctx.beginPath();
  ctx.arc(w/2, h * 0.5, w * 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Pattern cutouts
  ctx.fillStyle = `rgba(255,220,100,${glow + 0.1})`;
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(w/2 + Math.cos(angle) * 8, h * 0.5 + Math.sin(angle) * 10, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCushion(ctx, w, h) {
  ctx.fillStyle = '#9B59B6';
  ctx.beginPath();
  ctx.ellipse(w/2, h * 0.6, w * 0.4, h * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFD700';
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(w/2 + Math.cos(angle) * w * 0.25, h * 0.6 + Math.sin(angle) * h * 0.2, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Tassels
  ctx.fillStyle = '#FFD700';
  for (let x of [0.15, 0.85]) {
    ctx.fillRect(w * x, h * 0.7, 3, 12);
  }
}

function drawPlate(ctx, w, h) {
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.ellipse(w/2, h/2, w * 0.4, h * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#4169E1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(w/2, h/2, w * 0.3, h * 0.3, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(w/2, h/2, w * 0.15, h * 0.15, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Small decorations
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.arc(w/2 + Math.cos(angle) * w * 0.22, h/2 + Math.sin(angle) * h * 0.22, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// -- Zone 10: Finale (collectibles) --
function drawGoldenHeart(ctx, w, h, time) {
  ctx.save();
  ctx.translate(w/2, h/2);
  const scale = 1 + Math.sin(time * 4) * 0.1;
  ctx.scale(scale, scale);
  ctx.rotate(Math.sin(time * 2) * 0.1);
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 15;
  drawHeartShape(ctx, 0, 0, w * 0.4);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.restore();
}

function drawBouquet(ctx, w, h) {
  ctx.fillStyle = '#228B22';
  ctx.fillRect(w * 0.4, h * 0.5, w * 0.2, h * 0.5);
  const flowerColors = ['#FF69B4', '#FF1493', '#FFD700', '#FF6347', '#DA70D6'];
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = flowerColors[i];
    const x = w * (0.25 + (i % 3) * 0.2);
    const y = h * (0.15 + Math.floor(i / 3) * 0.2);
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGoldenStar(ctx, w, h, time) {
  ctx.save();
  ctx.translate(w/2, h/2);
  ctx.rotate(time * 2);
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 10;
  drawStarShape(ctx, 0, 0, 5, w * 0.4, w * 0.18);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.restore();
}

function drawLoveLetter(ctx, w, h) {
  ctx.fillStyle = '#FFF5EE';
  ctx.fillRect(w * 0.1, h * 0.15, w * 0.8, h * 0.7);
  ctx.fillStyle = '#DC143C';
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.15);
  ctx.lineTo(w/2, h * 0.5);
  ctx.lineTo(w * 0.9, h * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.55, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawTrophy(ctx, w, h, time) {
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(w * 0.2, h * 0.1);
  ctx.lineTo(w * 0.8, h * 0.1);
  ctx.lineTo(w * 0.7, h * 0.5);
  ctx.quadraticCurveTo(w/2, h * 0.65, w * 0.3, h * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(w * 0.4, h * 0.55, w * 0.2, h * 0.15);
  ctx.fillRect(w * 0.3, h * 0.7, w * 0.4, h * 0.08);
  ctx.fillStyle = '#FFA500';
  ctx.beginPath();
  ctx.arc(w * 0.15, h * 0.25, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w * 0.85, h * 0.25, 8, 0, Math.PI * 2);
  ctx.fill();
  const shine = 0.3 + Math.sin(time * 3) * 0.2;
  ctx.fillStyle = `rgba(255,255,255,${shine})`;
  ctx.beginPath();
  ctx.arc(w * 0.4, h * 0.25, 5, 0, Math.PI * 2);
  ctx.fill();
}

// ===== HELPER SHAPES =====
function drawHeartShape(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
  ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size * 0.75);
  ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
  ctx.closePath();
}

function drawStarShape(ctx, cx, cy, spikes, outerR, innerR) {
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

// ===== BACKGROUND DRAWING =====
export function drawBackground(ctx, zone, canvasW, canvasH, scrollX, time) {
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasH * 0.78);
  gradient.addColorStop(0, zone.colors.skyTop);
  gradient.addColorStop(1, zone.colors.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Zone-specific background elements
  const zoneId = zone.id;

  if (zoneId === 1) drawPopBackground(ctx, canvasW, canvasH, time);
  else if (zoneId === 2) drawCartoonBackground(ctx, canvasW, canvasH, scrollX, time);
  else if (zoneId === 3) drawIsraeliRockBackground(ctx, canvasW, canvasH, time);
  else if (zoneId === 4) drawHeavyRockBackground(ctx, canvasW, canvasH, time);
  else if (zoneId === 5) drawEndingSongBackground(ctx, canvasW, canvasH, time);
  else if (zoneId === 6) drawHawaiianBackground(ctx, canvasW, canvasH, scrollX, time);
  else if (zoneId === 7) drawReggaeBackground(ctx, canvasW, canvasH, scrollX, time);
  else if (zoneId === 8) drawHawaiianAcousticBackground(ctx, canvasW, canvasH, time);
  else if (zoneId === 9) drawEasternBackground(ctx, canvasW, canvasH, time);
  else if (zoneId === 10) drawFinaleBackground(ctx, canvasW, canvasH, time);
}

export function drawGround(ctx, zone, canvasW, canvasH, scrollX) {
  const groundY = canvasH * 0.78;
  const groundH = canvasH - groundY;

  ctx.fillStyle = zone.colors.ground;
  ctx.fillRect(0, groundY, canvasW, groundH);

  // Ground detail stripe
  ctx.fillStyle = zone.colors.groundAccent;
  ctx.fillRect(0, groundY, canvasW, 3);

  // Zone-specific ground details
  if (zone.id === 1) {
    // Candy stripes
    for (let i = 0; i < canvasW / 40 + 1; i++) {
      const x = (i * 40 - (scrollX % 40));
      ctx.fillStyle = i % 2 === 0 ? '#FFB6C1' : '#FFF';
      ctx.fillRect(x, groundY + 3, 40, groundH);
    }
  } else if (zone.id === 2) {
    // Grass tufts
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < canvasW / 30 + 1; i++) {
      const x = (i * 30 - (scrollX * 0.5 % 30));
      ctx.beginPath();
      ctx.moveTo(x, groundY + 5);
      ctx.lineTo(x + 5, groundY - 5);
      ctx.lineTo(x + 10, groundY + 5);
      ctx.fill();
    }
  } else if (zone.id === 3) {
    // Cobblestones
    ctx.strokeStyle = '#6B5B3E';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvasW / 25 + 1; i++) {
      const x = (i * 25 - (scrollX % 25));
      const yOff = (i % 2) * 8;
      ctx.strokeRect(x, groundY + 5 + yOff, 25, 15);
    }
  } else if (zone.id === 7) {
    // Reggae stripes
    const stripeH = groundH / 3;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, groundY + 3, canvasW, stripeH);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, groundY + 3 + stripeH, canvasW, stripeH);
    ctx.fillStyle = '#008000';
    ctx.fillRect(0, groundY + 3 + stripeH * 2, canvasW, stripeH);
  } else if (zone.id === 9) {
    // Mosaic tiles
    const tileSize = 20;
    const mosaicColors = ['#4169E1', '#FFD700', '#FFF', '#4B0082'];
    for (let i = 0; i < canvasW / tileSize + 1; i++) {
      for (let j = 0; j < groundH / tileSize + 1; j++) {
        const x = (i * tileSize - (scrollX % tileSize));
        ctx.fillStyle = mosaicColors[(i + j) % mosaicColors.length];
        ctx.fillRect(x, groundY + 3 + j * tileSize, tileSize - 1, tileSize - 1);
      }
    }
  } else if (zone.id === 10) {
    // Golden sparkle ground
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, groundY, canvasW, groundH);
    for (let i = 0; i < 20; i++) {
      const x = ((i * 73 + scrollX * 0.3) % canvasW);
      const y = groundY + 5 + (i * 17 % (groundH - 10));
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(x + scrollX * 0.01) * 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// === Zone-specific background drawing functions ===

function drawPopBackground(ctx, w, h, time) {
  // Disco ball
  ctx.fillStyle = '#C0C0C0';
  ctx.beginPath();
  ctx.arc(w * 0.7, h * 0.15, 25, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(time * 5 + i) * 0.2})`;
    const angle = (i / 8) * Math.PI * 2 + time;
    ctx.beginPath();
    ctx.arc(w * 0.7 + Math.cos(angle) * 15, h * 0.15 + Math.sin(angle) * 15, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Spotlights
  const spotColors = ['rgba(255,0,255,0.08)', 'rgba(0,255,255,0.08)', 'rgba(255,255,0,0.08)'];
  for (let i = 0; i < 3; i++) {
    const x = w * (0.2 + i * 0.3) + Math.sin(time * 1.5 + i * 2) * 50;
    ctx.fillStyle = spotColors[i];
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - 80, h * 0.78);
    ctx.lineTo(x + 80, h * 0.78);
    ctx.closePath();
    ctx.fill();
  }

  // Bubbles
  for (let i = 0; i < 8; i++) {
    const x = (i * 137 + time * 30) % w;
    const y = h * 0.6 - ((time * 40 + i * 50) % (h * 0.6));
    ctx.strokeStyle = `rgba(255,255,255,${0.2 + Math.sin(time + i) * 0.1})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 5 + i % 3 * 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Crowd silhouettes
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  for (let i = 0; i < 15; i++) {
    const x = i * (w / 15);
    const bounce = Math.abs(Math.sin(time * 4 + i * 0.5)) * 8;
    ctx.beginPath();
    ctx.arc(x + 20, h * 0.72 - bounce, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + 15, h * 0.72 - bounce + 5, 10, 15);
  }
}

function drawCartoonBackground(ctx, w, h, scrollX, time) {
  // Sun
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(w * 0.85, h * 0.12, 30, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + time * 0.5;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.85 + Math.cos(angle) * 35, h * 0.12 + Math.sin(angle) * 35);
    ctx.lineTo(w * 0.85 + Math.cos(angle) * 50, h * 0.12 + Math.sin(angle) * 50);
    ctx.stroke();
  }

  // Clouds
  for (let i = 0; i < 4; i++) {
    const cx = ((i * 300 - scrollX * 0.3) % (w + 200)) - 50;
    const cy = h * (0.15 + i * 0.08) + Math.sin(time + i) * 5;
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.arc(cx + 25, cy - 10, 20, 0, Math.PI * 2);
    ctx.arc(cx + 45, cy, 25, 0, Math.PI * 2);
    ctx.arc(cx + 20, cy + 5, 22, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawIsraeliRockBackground(ctx, w, h, time) {
  // Jerusalem stone wall
  ctx.fillStyle = '#D4AF7A';
  ctx.fillRect(0, 0, w, h * 0.78);
  ctx.strokeStyle = '#C49A5C';
  ctx.lineWidth = 1;
  for (let row = 0; row < 8; row++) {
    const y = row * (h * 0.1);
    for (let col = 0; col < 15; col++) {
      const x = col * (w / 12) + (row % 2) * 30;
      ctx.strokeRect(x, y, w / 12, h * 0.1);
    }
  }

  // String lights
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.2);
  for (let i = 0; i <= 10; i++) {
    const x = i * w / 10;
    const sag = Math.sin(i * 0.3) * 15;
    ctx.lineTo(x, h * 0.2 + sag);
  }
  ctx.stroke();

  for (let i = 0; i < 10; i++) {
    const x = i * w / 10 + 20;
    const y = h * 0.2 + Math.sin(i * 0.3) * 15 + 5;
    const glow = 0.5 + Math.sin(time * 3 + i) * 0.3;
    ctx.fillStyle = `rgba(255,200,50,${glow})`;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHeavyRockBackground(ctx, w, h, time) {
  // Fog/smoke at ground level
  for (let i = 0; i < 10; i++) {
    const x = (i * 120 + time * 20) % (w + 200) - 100;
    ctx.fillStyle = `rgba(100,100,100,${0.05 + Math.sin(time + i) * 0.03})`;
    ctx.beginPath();
    ctx.ellipse(x, h * 0.75, 60, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Lightning
  if (Math.sin(time * 7) > 0.95) {
    ctx.strokeStyle = `rgba(155,89,182,${0.8})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const lx = Math.random() * w;
    ctx.moveTo(lx, 0);
    let ly = 0;
    for (let i = 0; i < 5; i++) {
      ly += h * 0.15;
      ctx.lineTo(lx + (Math.random() - 0.5) * 40, ly);
    }
    ctx.stroke();
    // Flash
    ctx.fillStyle = 'rgba(155,89,182,0.05)';
    ctx.fillRect(0, 0, w, h);
  }

  // Crowd silhouettes headbanging
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  for (let i = 0; i < 12; i++) {
    const x = i * (w / 12) + 20;
    const headBob = Math.sin(time * 6 + i * 0.8) * 10;
    ctx.beginPath();
    ctx.arc(x, h * 0.7 + headBob, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 6, h * 0.7 + headBob + 3, 12, 12);
  }

  // Purple glow at bottom
  const glow = ctx.createLinearGradient(0, h * 0.7, 0, h * 0.78);
  glow.addColorStop(0, 'rgba(155,89,182,0)');
  glow.addColorStop(1, 'rgba(155,89,182,0.4)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, h * 0.7, w, h * 0.08);
}

function drawEndingSongBackground(ctx, w, h, time) {
  // Floating hearts
  for (let i = 0; i < 12; i++) {
    const x = (i * 97 + time * 15) % w;
    const y = h * 0.7 - ((time * 25 + i * 40) % (h * 0.75));
    const size = 6 + (i % 3) * 4;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.3 + Math.sin(time + i) * 0.1;
    drawHeartShapeBg(ctx, 0, 0, size);
    ctx.fillStyle = '#FF69B4';
    ctx.fill();
    ctx.restore();
  }

  // Gold sparkles
  for (let i = 0; i < 15; i++) {
    const x = (i * 113 + time * 20) % w;
    const y = (i * 79 + time * 10) % (h * 0.75);
    const alpha = 0.3 + Math.sin(time * 3 + i * 2) * 0.3;
    ctx.fillStyle = `rgba(255,215,0,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHawaiianBackground(ctx, w, h, scrollX, time) {
  // Ocean waves
  ctx.fillStyle = 'rgba(64,224,208,0.3)';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(0, h * (0.55 + i * 0.06));
    for (let x = 0; x <= w; x += 20) {
      const y = h * (0.55 + i * 0.06) + Math.sin(x * 0.02 + time * (2 - i * 0.3) + i) * 8;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h * 0.78);
    ctx.lineTo(0, h * 0.78);
    ctx.closePath();
    ctx.fill();
  }

  // Palm trees
  for (let i = 0; i < 3; i++) {
    const tx = ((i * 350 - scrollX * 0.2) % (w + 200)) - 50;
    const sway = Math.sin(time * 1.5 + i) * 5;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(tx - 5, h * 0.3, 10, h * 0.48);
    ctx.fillStyle = '#228B22';
    for (let j = 0; j < 5; j++) {
      const angle = (j / 5) * Math.PI - Math.PI / 2 + sway * 0.02;
      ctx.save();
      ctx.translate(tx, h * 0.3);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -30, 8, 35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Sun
  const sunGrad = ctx.createRadialGradient(w * 0.8, h * 0.15, 10, w * 0.8, h * 0.15, 40);
  sunGrad.addColorStop(0, '#FFD700');
  sunGrad.addColorStop(1, 'rgba(255,165,0,0.3)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(w * 0.8, h * 0.15, 35, 0, Math.PI * 2);
  ctx.fill();
}

function drawReggaeBackground(ctx, w, h, scrollX, time) {
  // Sunset sky (already done by gradient)
  // Palm trees silhouettes
  for (let i = 0; i < 4; i++) {
    const tx = ((i * 280 - scrollX * 0.15) % (w + 200)) - 50;
    const sway = Math.sin(time * 1 + i) * 3;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(tx - 4, h * 0.35, 8, h * 0.43);
    for (let j = 0; j < 4; j++) {
      const angle = (j / 4) * Math.PI - Math.PI / 2 + sway * 0.02;
      ctx.save();
      ctx.translate(tx, h * 0.35);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -25, 6, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Peace signs floating
  for (let i = 0; i < 4; i++) {
    const x = (i * 200 + time * 10) % w;
    const y = h * 0.2 + Math.sin(time + i) * 20;
    ctx.strokeStyle = `rgba(255,255,255,${0.1 + Math.sin(time + i * 2) * 0.05})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - 12);
    ctx.lineTo(x, y + 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8, y + 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 8, y + 8);
    ctx.stroke();
  }
}

function drawHawaiianAcousticBackground(ctx, w, h, time) {
  // Sunset gradient already applied
  // Gentle waves (silhouette)
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.7);
  for (let x = 0; x <= w; x += 15) {
    ctx.lineTo(x, h * 0.7 + Math.sin(x * 0.015 + time * 1.5) * 5);
  }
  ctx.lineTo(w, h * 0.78);
  ctx.lineTo(0, h * 0.78);
  ctx.closePath();
  ctx.fill();

  // Fireflies
  for (let i = 0; i < 15; i++) {
    const x = (i * 93 + Math.sin(time * 0.5 + i * 3) * 30) % w;
    const y = h * 0.2 + (i * 47 % (h * 0.5)) + Math.sin(time + i) * 10;
    const alpha = 0.2 + Math.sin(time * 2 + i * 4) * 0.2;
    ctx.fillStyle = `rgba(255,255,200,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEasternBackground(ctx, w, h, time) {
  // Arches
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const x = i * (w / 4) + 40;
    ctx.beginPath();
    ctx.arc(x, h * 0.45, 50, Math.PI, 0);
    ctx.stroke();
    // Pillar
    ctx.fillStyle = '#4B0082';
    ctx.fillRect(x - 53, h * 0.45, 6, h * 0.33);
    ctx.fillRect(x + 47, h * 0.45, 6, h * 0.33);
  }

  // Hanging lanterns
  for (let i = 0; i < 6; i++) {
    const x = w * (0.1 + i * 0.15);
    const swing = Math.sin(time * 1.5 + i) * 3;
    const glow = 0.3 + Math.sin(time * 2 + i) * 0.15;
    ctx.fillStyle = `rgba(255,200,50,${glow})`;
    ctx.beginPath();
    ctx.arc(x + swing, h * 0.2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + swing, h * 0.12);
    ctx.lineTo(x, 0);
    ctx.stroke();
  }

  // Geometric patterns
  ctx.strokeStyle = 'rgba(255,215,0,0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 3; j++) {
      const x = i * (w / 7) + 20;
      const y = h * (0.5 + j * 0.08);
      ctx.strokeRect(x, y, 15, 15);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 15, y + 15);
      ctx.moveTo(x + 15, y);
      ctx.lineTo(x, y + 15);
      ctx.stroke();
    }
  }
}

function drawFinaleBackground(ctx, w, h, time) {
  // Fireworks
  for (let i = 0; i < 3; i++) {
    const fx = w * (0.2 + i * 0.3);
    const fy = h * (0.15 + Math.sin(time * 0.5 + i * 2) * 0.05);
    const burstPhase = (time * 0.8 + i * 1.5) % 3;

    if (burstPhase < 1.5) {
      const colors = ['#FF69B4', '#FFD700', '#00BFFF', '#FF6347', '#9B59B6'];
      const numRays = 12;
      for (let j = 0; j < numRays; j++) {
        const angle = (j / numRays) * Math.PI * 2;
        const dist = burstPhase * 40;
        const alpha = 1 - burstPhase / 1.5;
        ctx.fillStyle = colors[j % colors.length];
        ctx.globalAlpha = alpha * 0.6;
        ctx.beginPath();
        ctx.arc(fx + Math.cos(angle) * dist, fy + Math.sin(angle) * dist, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  // Rainbow arc
  const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'];
  for (let i = 0; i < rainbowColors.length; i++) {
    ctx.strokeStyle = rainbowColors[i];
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.8, w * 0.45 - i * 5, Math.PI, 0);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Hearts floating
  for (let i = 0; i < 8; i++) {
    const x = (i * 131 + time * 20) % w;
    const y = h * 0.7 - ((time * 30 + i * 60) % (h * 0.75));
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.25;
    drawHeartShapeBg(ctx, 0, 0, 8 + (i % 3) * 4);
    ctx.fillStyle = '#FF69B4';
    ctx.fill();
    ctx.restore();
  }
}

function drawHeartShapeBg(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
  ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size * 0.75);
  ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
  ctx.closePath();
}
