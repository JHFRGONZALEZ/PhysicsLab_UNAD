import { DataPointPendulum, AnalysisResultPendulum } from '../types/pendulum.types';

/**
 * Calculate theoretical period of a simple pendulum
 * T = 2π·√(L/g)
 */
export function calculateTheoreticalPeriod(length: number, gravity: number): number {
  return 2 * Math.PI * Math.sqrt(length / gravity);
}

/**
 * Calculate gravity from period and length
 * g = 4π²·L/T²
 */
export function calculateGravityFromPeriod(length: number, period: number): number {
  return (4 * Math.PI * Math.PI * length) / (period * period);
}

/**
 * Linear regression for T² vs L
 * T² = (4π²/g)·L
 * Slope = 4π²/g
 */
export function linearRegressionPendulum(dataPoints: DataPointPendulum[]): {
  slope: number;
  intercept: number;
  rSquared: number;
} {
  const n = dataPoints.length;
  if (n < 2) return { slope: 0, intercept: 0, rSquared: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (const point of dataPoints) {
    sumX += point.length;
    sumY += point.periodSquared;
    sumXY += point.length * point.periodSquared;
    sumX2 += point.length * point.length;
    sumY2 += point.periodSquared * point.periodSquared;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return { slope: 0, intercept: sumY / n, rSquared: 0 };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R²
  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;

  for (const point of dataPoints) {
    const predicted = slope * point.length + intercept;
    ssRes += (point.periodSquared - predicted) ** 2;
    ssTot += (point.periodSquared - meanY) ** 2;
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
 * Full analysis of pendulum data
 */
export function analyzePendulumData(
  dataPoints: DataPointPendulum[],
  theoreticalGravity: number
): AnalysisResultPendulum {
  const regression = linearRegressionPendulum(dataPoints);
  
  // From slope = 4π²/g, we get g = 4π²/slope
  const experimentalGravity = regression.slope > 0 ? (4 * Math.PI * Math.PI) / regression.slope : 0;
  
  const percentError = calculatePercentError(theoreticalGravity, experimentalGravity);

  return {
    experimentalGravity,
    theoreticalGravity,
    percentError,
    equation: `T² = ${regression.slope.toFixed(3)}·L + ${regression.intercept.toFixed(3)}`,
    rSquared: regression.rSquared,
    slope: regression.slope,
  };
}

/**
 * Add experimental noise to a measurement
 */
export function addExperimentalNoise(value: number, noisePercent: number = 2): number {
  const noise = (Math.random() * 2 - 1) * (noisePercent / 100) * value;
  return value + noise;
}
