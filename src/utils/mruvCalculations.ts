import { DataPointMRUV, AnalysisResultMRUV } from '../types/mruv.types';

/**
 * Calculate position at time t for MRUV
 * x(t) = x₀ + v₀·t + ½·a·t²
 */
export function calculatePositionMRUV(
  initialPosition: number,
  initialVelocity: number,
  acceleration: number,
  time: number
): number {
  return initialPosition + initialVelocity * time + 0.5 * acceleration * time * time;
}

/**
 * Calculate velocity at time t for MRUV
 * v(t) = v₀ + a·t
 */
export function calculateVelocityMRUV(
  initialVelocity: number,
  acceleration: number,
  time: number
): number {
  return initialVelocity + acceleration * time;
}

/**
 * Calculate displacement between two points
 */
export function calculateDisplacement(x1: number, x2: number): number {
  return x2 - x1;
}

/**
 * Calculate average velocity between two points
 */
export function calculateAverageVelocity(p1: DataPointMRUV, p2: DataPointMRUV): number {
  if (p2.time === p1.time) return 0;
  return (p2.position - p1.position) / (p2.time - p1.time);
}

/**
 * Calculate acceleration from velocity data
 * Using linear regression on v vs t
 */
export function calculateAccelerationFromVelocity(dataPoints: DataPointMRUV[]): {
  acceleration: number;
  initialVelocity: number;
  rSquared: number;
} {
  const n = dataPoints.length;
  if (n < 2) return { acceleration: 0, initialVelocity: 0, rSquared: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (const point of dataPoints) {
    sumX += point.time;
    sumY += point.velocity;
    sumXY += point.time * point.velocity;
    sumX2 += point.time * point.time;
    sumY2 += point.velocity * point.velocity;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return { acceleration: 0, initialVelocity: sumY / n, rSquared: 0 };

  const acceleration = (n * sumXY - sumX * sumY) / denominator;
  const initialVelocity = (sumY - acceleration * sumX) / n;

  // Calculate R²
  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;

  for (const point of dataPoints) {
    const predicted = initialVelocity + acceleration * point.time;
    ssRes += (point.velocity - predicted) ** 2;
    ssTot += (point.velocity - meanY) ** 2;
  }

  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { acceleration, initialVelocity, rSquared };
}

/**
 * Calculate position equation from data
 * Using quadratic regression: x = x₀ + v₀·t + ½·a·t²
 */
export function calculatePositionEquation(dataPoints: DataPointMRUV[]): {
  initialPosition: number;
  initialVelocity: number;
  acceleration: number;
  rSquared: number;
} {
  const n = dataPoints.length;
  if (n < 3) return { initialPosition: 0, initialVelocity: 0, acceleration: 0, rSquared: 0 };

  // Simplified: use the fact that we know it's quadratic
  // We'll use the velocity data to get acceleration, then fit position
  
  const { acceleration } = calculateAccelerationFromVelocity(dataPoints);
  
  // Now fit x - ½·a·t² = x₀ + v₀·t (linear regression)
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  for (const point of dataPoints) {
    const adjustedY = point.position - 0.5 * acceleration * point.time * point.time;
    sumX += point.time;
    sumY += adjustedY;
    sumXY += point.time * adjustedY;
    sumX2 += point.time * point.time;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return { initialPosition: sumY / n, initialVelocity: 0, acceleration, rSquared: 0 };

  const initialVelocity = (n * sumXY - sumX * sumY) / denominator;
  const initialPosition = (sumY - initialVelocity * sumX) / n;

  // Calculate R² for position
  const meanY = dataPoints.reduce((sum, p) => sum + p.position, 0) / n;
  let ssRes = 0, ssTot = 0;

  for (const point of dataPoints) {
    const predicted = initialPosition + initialVelocity * point.time + 0.5 * acceleration * point.time * point.time;
    ssRes += (point.position - predicted) ** 2;
    ssTot += (point.position - meanY) ** 2;
  }

  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { initialPosition, initialVelocity, acceleration, rSquared };
}

/**
 * Calculate percent error
 */
export function calculatePercentError(theoretical: number, experimental: number): number {
  if (theoretical === 0) return 0;
  return Math.abs((experimental - theoretical) / theoretical) * 100;
}

/**
 * Full analysis of experimental data for MRUV
 */
export function analyzeDataMRUV(dataPoints: DataPointMRUV[], theoreticalAcceleration: number): AnalysisResultMRUV {
  const { acceleration: experimentalAcceleration, initialVelocity, initialPosition, rSquared } = 
    calculatePositionEquation(dataPoints);
  
  const percentError = calculatePercentError(theoreticalAcceleration, experimentalAcceleration);

  return {
    theoreticalAcceleration,
    experimentalAcceleration,
    percentError,
    equation: `x = ${initialPosition.toFixed(2)} + ${initialVelocity.toFixed(2)}t + ½(${experimentalAcceleration.toFixed(2)})t²`,
    rSquared,
    initialVelocity,
    initialPosition,
  };
}

/**
 * Add experimental noise to a measurement
 */
export function addExperimentalNoise(value: number, noisePercent: number = 5): number {
  const noise = (Math.random() * 2 - 1) * (noisePercent / 100) * Math.abs(value);
  return value + noise;
}
