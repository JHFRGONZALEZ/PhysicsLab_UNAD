import { DataPoint, AnalysisResult } from '../types/simulation.types';

/**
 * Calculate position at time t for MRU
 * x(t) = x₀ + v·t
 */
export function calculatePosition(initialPosition: number, velocity: number, time: number): number {
  return initialPosition + velocity * time;
}

/**
 * Calculate velocity (constant in MRU)
 */
export function calculateVelocity(velocity: number): number {
  return velocity;
}

/**
 * Calculate displacement between two points
 */
export function calculateDisplacement(x1: number, x2: number): number {
  return x2 - x1;
}

/**
 * Calculate slope between two data points (linear regression for 2 points)
 */
export function calculateSlope(p1: DataPoint, p2: DataPoint): number {
  if (p2.time === p1.time) return 0;
  return (p2.position - p1.position) / (p2.time - p1.time);
}

/**
 * Linear regression: y = mx + b
 * Returns slope (m), intercept (b), and R²
 */
export function linearRegression(dataPoints: DataPoint[]): { slope: number; intercept: number; rSquared: number } {
  const n = dataPoints.length;
  if (n < 2) return { slope: 0, intercept: 0, rSquared: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (const point of dataPoints) {
    sumX += point.time;
    sumY += point.position;
    sumXY += point.time * point.position;
    sumX2 += point.time * point.time;
    sumY2 += point.position * point.position;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return { slope: 0, intercept: sumY / n, rSquared: 0 };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R²
  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;

  for (const point of dataPoints) {
    const predicted = slope * point.time + intercept;
    ssRes += (point.position - predicted) ** 2;
    ssTot += (point.position - meanY) ** 2;
  }

  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared };
}

/**
 * Calculate percent error
 */
export function calculatePercentError(theoretical: number, experimental: number): number {
  if (theoretical === 0) return 0;
  return Math.abs((experimental - theoretical) / theoretical) * 100;
}

/**
 * Full analysis of experimental data
 */
export function analyzeData(dataPoints: DataPoint[], theoreticalVelocity: number): AnalysisResult {
  const regression = linearRegression(dataPoints);
  const percentError = calculatePercentError(theoreticalVelocity, regression.slope);

  return {
    theoreticalVelocity,
    experimentalVelocity: regression.slope,
    percentError,
    equation: `x = ${regression.intercept.toFixed(2)} + ${regression.slope.toFixed(2)}t`,
    rSquared: regression.rSquared,
    intercept: regression.intercept,
    slope: regression.slope,
  };
}

/**
 * Add experimental noise to a measurement
 */
export function addExperimentalNoise(value: number, noisePercent: number = 5): number {
  const noise = (Math.random() * 2 - 1) * (noisePercent / 100) * value;
  return value + noise;
}

/**
 * Convert km/h to m/s
 */
export function kmhToMs(kmh: number): number {
  return kmh / 3.6;
}

/**
 * Convert m/s to km/h
 */
export function msToKmh(ms: number): number {
  return ms * 3.6;
}
