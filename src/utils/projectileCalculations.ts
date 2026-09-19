import { DataPointProjectile, AnalysisResultProjectile } from '../types/projectile.types';

/**
 * Calculate position at time t for projectile motion
 * x(t) = v₀·cos(θ)·t
 * y(t) = v₀·sin(θ)·t - ½·g·t²
 */
export function calculatePositionProjectile(
  initialVelocity: number,
  angle: number, // in degrees
  gravity: number,
  time: number
): { x: number; y: number } {
  const angleRad = (angle * Math.PI) / 180;
  const vx = initialVelocity * Math.cos(angleRad);
  const vy = initialVelocity * Math.sin(angleRad);
  
  const x = vx * time;
  const y = vy * time - 0.5 * gravity * time * time;
  
  return { x, y };
}

/**
 * Calculate velocity at time t
 * vx(t) = v₀·cos(θ)
 * vy(t) = v₀·sin(θ) - g·t
 */
export function calculateVelocityProjectile(
  initialVelocity: number,
  angle: number,
  gravity: number,
  time: number
): { vx: number; vy: number } {
  const angleRad = (angle * Math.PI) / 180;
  const vx = initialVelocity * Math.cos(angleRad);
  const vy = initialVelocity * Math.sin(angleRad) - gravity * time;
  
  return { vx, vy };
}

/**
 * Calculate maximum height
 * h_max = (v₀·sin(θ))² / (2·g)
 */
export function calculateMaxHeight(
  initialVelocity: number,
  angle: number,
  gravity: number
): number {
  const angleRad = (angle * Math.PI) / 180;
  const vy = initialVelocity * Math.sin(angleRad);
  return (vy * vy) / (2 * gravity);
}

/**
 * Calculate range (horizontal distance)
 * R = v₀²·sin(2θ) / g
 */
export function calculateRange(
  initialVelocity: number,
  angle: number,
  gravity: number
): number {
  const angleRad = (angle * Math.PI) / 180;
  return (initialVelocity * initialVelocity * Math.sin(2 * angleRad)) / gravity;
}

/**
 * Calculate flight time
 * t_flight = 2·v₀·sin(θ) / g
 */
export function calculateFlightTime(
  initialVelocity: number,
  angle: number,
  gravity: number
): number {
  const angleRad = (angle * Math.PI) / 180;
  return (2 * initialVelocity * Math.sin(angleRad)) / gravity;
}

/**
 * Calculate optimal angle for maximum range (45°)
 */
export function calculateOptimalAngle(): number {
  return 45;
}

/**
 * Calculate percent error
 */
export function calculatePercentError(theoretical: number, experimental: number): number {
  if (theoretical === 0) return 0;
  return Math.abs((experimental - theoretical) / theoretical) * 100;
}

/**
 * Full analysis of projectile motion
 */
export function analyzeProjectileMotion(
  initialVelocity: number,
  angle: number,
  gravity: number,
  dataPoints: DataPointProjectile[]
): AnalysisResultProjectile {
  const theoreticalRange = calculateRange(initialVelocity, angle, gravity);
  const theoreticalHeight = calculateMaxHeight(initialVelocity, angle, gravity);
  const flightTime = calculateFlightTime(initialVelocity, angle, gravity);
  
  // Experimental values from data
  let maxRange = 0;
  let maxHeight = 0;
  
  for (const point of dataPoints) {
    if (point.x > maxRange) maxRange = point.x;
    if (point.y > maxHeight) maxHeight = point.y;
  }
  
  const percentErrorRange = calculatePercentError(theoreticalRange, maxRange);
  const percentErrorHeight = calculatePercentError(theoreticalHeight, maxHeight);
  
  return {
    maxRange,
    maxHeight,
    flightTime,
    theoreticalRange,
    theoreticalHeight,
    percentErrorRange,
    percentErrorHeight,
  };
}
