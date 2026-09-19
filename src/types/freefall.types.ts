// Types for Free Fall Virtual Laboratory

export interface DataPointFreeFall {
  time: number;
  height: number;
  velocity: number;
}

export interface SimulationStateFreeFall {
  height: number;
  velocity: number;
  gravity: number;
  initialHeight: number;
  time: number;
  isRunning: boolean;
  hasLanded: boolean;
  dataPoints: DataPointFreeFall[];
  showVelocityVector: boolean;
  showTrail: boolean;
  experimentalError: boolean;
  trailPoints: { y: number; v: number; t: number }[];
}

export interface AnalysisResultFreeFall {
  theoreticalGravity: number;
  experimentalGravity: number;
  percentError: number;
  equation: string;
  rSquared: number;
  fallTime: number;
  maxVelocity: number;
}

export type PedagogicalPhaseFreeFall = 'exploration' | 'hypothesis' | 'experimentation' | 'analysis' | 'conclusion';
