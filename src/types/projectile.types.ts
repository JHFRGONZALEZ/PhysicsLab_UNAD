// Types for Projectile Motion Virtual Laboratory

export interface DataPointProjectile {
  time: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface SimulationStateProjectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  initialVelocity: number;
  angle: number;
  gravity: number;
  time: number;
  isRunning: boolean;
  hasLanded: boolean;
  dataPoints: DataPointProjectile[];
  showVelocityVector: boolean;
  showTrail: boolean;
  trailPoints: { x: number; y: number; t: number }[];
}

export interface AnalysisResultProjectile {
  maxRange: number;
  maxHeight: number;
  flightTime: number;
  theoreticalRange: number;
  theoreticalHeight: number;
  percentErrorRange: number;
  percentErrorHeight: number;
}

export type PedagogicalPhaseProjectile = 'exploration' | 'hypothesis' | 'experimentation' | 'analysis' | 'conclusion';
