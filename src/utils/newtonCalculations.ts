import { DataPointNewton, AnalysisResultNewton } from '../types/newton.types';

/**
 * Calculate acceleration from force and mass (Newton's Second Law)
 * F = m·a → a = F/m
 */
export function calculateAcceleration(force: number, mass: number, friction: number = 0): number {
  const netForce = force - friction;
  if (mass === 0) return 0;
  return netForce / mass;
}

/**
 * Calculate velocity at time t
 * v(t) = v₀ + a·t
 */
export function calculateVelocity(
  initialVelocity: number,
  acceleration: number,
  time: number
): number {
  return initialVelocity + acceleration * time;
}

/**
 * Calculate position at time t
 * x(t) = x₀ + v₀·t + ½·a·t²
 */
export function calculatePosition(
  initialPosition: number,
  initialVelocity: number,
  acceleration: number,
  time: number
): number {
  return initialPosition + initialVelocity * time + 0.5 * acceleration * time * time;
}

/**
 * Calculate friction force
 * f = μ·N = μ·m·g
 */
export function calculateFriction(mass: number, frictionCoefficient: number, gravity: number = 9.81): number {
  return frictionCoefficient * mass * gravity;
}

/**
 * Linear regression for F vs a
 * F = m·a (slope = mass)
 */
export function linearRegressionNewton(dataPoints: DataPointNewton[]): {
  slope: number;
  intercept: number;
  rSquared: number;
} {
  const n = dataPoints.length;
  if (n < 2) return { slope: 0, intercept: 0, rSquared: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (const point of dataPoints) {
    sumX += point.acceleration;
    sumY += point.force;
    sumXY += point.acceleration * point.force;
    sumX2 += point.acceleration * point.acceleration;
    sumY2 += point.force * point.force;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return { slope: 0, intercept: sumY / n, rSquared: 0 };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R²
  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;

  for (const point of dataPoints) {
    const predicted = slope * point.acceleration + intercept;
    ssRes += (point.force - predicted) ** 2;
    ssTot += (point.force - meanY) ** 2;
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
 * Full analysis of Newton's second law data
 */
export function analyzeNewtonData(
  dataPoints: DataPointNewton[],
  theoreticalMass: number
): AnalysisResultNewton {
  const regression = linearRegressionNewton(dataPoints);
  
  // From F = m·a, slope = mass
  const experimentalMass = regression.slope;
  const percentError = calculatePercentError(theoreticalMass, experimentalMass);

  return {
    experimentalMass,
    theoreticalMass,
    percentError,
    equation: `F = ${regression.slope.toFixed(2)}·a + ${regression.intercept.toFixed(2)}`,
    rSquared: regression.rSquared,
    slope: regression.slope,
  };
}

/**
 * Add experimental noise to a measurement
 */
export function addExperimentalNoise(value: number, noisePercent: number = 3): number {
  const noise = (Math.random() * 2 - 1) * (noisePercent / 100) * value;
  return value + noise;
}
