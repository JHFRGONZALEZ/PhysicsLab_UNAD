// Types for MRUV Virtual Laboratory

export interface DataPointMRUV {
  time: number;
  position: number;
  velocity: number;
  acceleration: number;
}

export interface SimulationStateMRUV {
  position: number;
  velocity: number;
  acceleration: number;
  initialPosition: number;
  initialVelocity: number;
  time: number;
  isRunning: boolean;
  dataPoints: DataPointMRUV[];
  showVelocityVector: boolean;
  showAccelerationVector: boolean;
  showTrail: boolean;
  experimentalError: boolean;
  trailPoints: { x: number; v: number; t: number }[];
}

export interface AnalysisResultMRUV {
  theoreticalAcceleration: number;
  experimentalAcceleration: number;
  percentError: number;
  equation: string;
  rSquared: number;
  initialVelocity: number;
  initialPosition: number;
}

export type PedagogicalPhaseMRUV = 'exploration' | 'hypothesis' | 'experimentation' | 'analysis' | 'conclusion';
