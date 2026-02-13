// Physics constants and helpers

export const GRAVITY = 0.38;
export const JUMP_FORCE = -16;
export const GROUND_Y_RATIO = 0.78; // Ground is at 78% of canvas height
export const SOL_SIZE = 60;
export const SOL_X_RATIO = 0.18; // Sol is at 18% from left

export function createSolState() {
  return {
    x: 0, // Will be set based on canvas width
    y: 0, // Will be set based on ground
    vy: 0, // Vertical velocity
    isJumping: false,
    isOnGround: true,
    animFrame: 0,
    animTimer: 0,
    hitFlash: 0, // For hit animation
    squish: 0, // For landing squish
    rotation: 0, // For jump rotation
  };
}

export function updateSolPhysics(sol, groundY, deltaTime) {
  const dt = deltaTime * 60; // Normalize to 60fps

  if (!sol.isOnGround) {
    sol.vy += GRAVITY * dt;
    sol.y += sol.vy * dt;

    // Rotation during jump
    sol.rotation = sol.vy * 0.02;

    // Landing
    if (sol.y >= groundY - SOL_SIZE) {
      sol.y = groundY - SOL_SIZE;
      sol.vy = 0;
      sol.isOnGround = true;
      sol.isJumping = false;
      sol.rotation = 0;
      sol.squish = 1; // Trigger squish
    }
  }

  // Update squish animation
  if (sol.squish > 0) {
    sol.squish -= deltaTime * 8;
    if (sol.squish < 0) sol.squish = 0;
  }

  // Update hit flash
  if (sol.hitFlash > 0) {
    sol.hitFlash -= deltaTime * 5;
    if (sol.hitFlash < 0) sol.hitFlash = 0;
  }

  // Running animation
  sol.animTimer += deltaTime;
  if (sol.animTimer > 0.1) {
    sol.animTimer = 0;
    sol.animFrame = (sol.animFrame + 1) % 4;
  }
}

export function jump(sol) {
  if (sol.isOnGround) {
    sol.vy = JUMP_FORCE;
    sol.isOnGround = false;
    sol.isJumping = true;
    return true;
  }
  return false;
}

export function checkCollision(solX, solY, obstacle) {
  // Generous hitbox shrink so near-misses feel fair
  const padding = 18;
  const sx = solX + padding;
  const sy = solY + padding;
  const sw = SOL_SIZE - padding * 2;
  const sh = SOL_SIZE - padding * 2;

  const ox = obstacle.x + 8;
  const oy = obstacle.y + 8;
  const ow = obstacle.width - 16;
  const oh = obstacle.height - 16;

  return sx < ox + ow && sx + sw > ox && sy < oy + oh && sy + sh > oy;
}
