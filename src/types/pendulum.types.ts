// Types for Simple Pendulum Virtual Laboratory

export interface DataPointPendulum {
  length: number; // meters
  period: number; // seconds
  periodSquared: number;
}

export interface SimulationStatePendulum {
  angle: number; // current angle in radians
  angularVelocity: number;
  length: number; // meters
  gravity: number;
  time: number;
  isRunning: boolean;
  dataPoints: DataPointPendulum[];
  showAngle: boolean;
  showTrail: boolean;
  trailPoints: { angle: number; t: number }[];
  oscillationCount: number;
  lastAngle: number;
  periodStartTime: number | null;
}

export interface AnalysisResultPendulum {
  experimentalGravity: number;
  theoreticalGravity: number;
  percentError: number;
  equation: string;
  rSquared: number;
  slope: number;
}

export type PedagogicalPhasePendulum = 'exploration' | 'hypothesis' | 'experimentation' | 'analysis' | 'conclusion';
