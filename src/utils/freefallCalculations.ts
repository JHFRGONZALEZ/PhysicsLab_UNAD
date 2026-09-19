import { DataPointFreeFall, AnalysisResultFreeFall } from '../types/freefall.types';

/**
 * Calculate height at time t for free fall
 * y(t) = y₀ - ½·g·t²
 */
export function calculateHeight(
  initialHeight: number,
  gravity: number,
  time: number
): number {
  return initialHeight - 0.5 * gravity * time * time;
}

/**
 * Calculate velocity at time t for free fall
 * v(t) = -g·t (downward)
 */
export function calculateVelocity(
  gravity: number,
  time: number
): number {
  return -gravity * time;
}

/**
 * Calculate time to reach ground
 * t = √(2·y₀/g)
 */
export function calculateFallTime(
  initialHeight: number,
  gravity: number
): number {
  return Math.sqrt((2 * initialHeight) / gravity);
}

/**
 * Calculate impact velocity
 * v = √(2·g·y₀)
 */
export function calculateImpactVelocity(
  initialHeight: number,
  gravity: number
): number {
  return Math.sqrt(2 * gravity * initialHeight);
}

/**
 * Linear regression for v² vs y to find g
 * v² = 2·g·(y₀ - y)
 */
export function calculateGravityFromData(dataPoints: DataPointFreeFall[]): {
  gravity: number;
  rSquared: number;
} {
  const n = dataPoints.length;
  if (n < 2) return { gravity: 0, rSquared: 0 };

  // Using v² = 2·g·h where h is distance fallen
  // Linear regression: v² = m·h
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (const point of dataPoints) {
    const h = point.height; // height remaining
    const v2 = point.velocity * point.velocity;
    sumX += h;
    sumY += v2;
    sumXY += h * v2;
    sumX2 += h * h;
    sumY2 += v2 * v2;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return { gravity: 0, rSquared: 0 };

  // slope = -2g (negative because velocity increases as height decreases)
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const gravity = Math.abs(slope) / 2;

  // Calculate R²
  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;

  for (const point of dataPoints) {
    const h = point.height;
    const predicted = Math.abs(slope * h);
    const actual = point.velocity * point.velocity;
    ssRes += (actual - predicted) ** 2;
    ssTot += (actual - meanY) ** 2;
  }

  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { gravity, rSquared };
}

/**
 * Calculate percent error
 */
export function calculatePercentError(theoretical: number, experimental: number): number {
  if (theoretical === 0) return 0;
  return Math.abs((experimental - theoretical) / theoretical) * 100;
}

/**
 * Full analysis of experimental data for free fall
 */
export function analyzeDataFreeFall(
  dataPoints: DataPointFreeFall[],
  theoreticalGravity: number,
  initialHeight: number
): AnalysisResultFreeFall {
  const { gravity: experimentalGravity, rSquared } = calculateGravityFromData(dataPoints);
  const percentError = calculatePercentError(theoreticalGravity, experimentalGravity);
  
  const fallTime = calculateFallTime(initialHeight, theoreticalGravity);
  const maxVelocity = calculateImpactVelocity(initialHeight, theoreticalGravity);

  return {
    theoreticalGravity,
    experimentalGravity,
    percentError,
    equation: `y(t) = ${initialHeight.toFixed(2)} - ½(${experimentalGravity.toFixed(2)})t²`,
    rSquared,
    fallTime,
    maxVelocity,
  };
}

/**
 * Add experimental noise to a measurement
 */
export function addExperimentalNoise(value: number, noisePercent: number = 5): number {
  const noise = (Math.random() * 2 - 1) * (noisePercent / 100) * Math.abs(value);
  return value + noise;
}
