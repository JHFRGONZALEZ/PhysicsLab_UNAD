// Types for Newton's Laws Virtual Laboratory

export interface DataPointNewton {
  force: number; // Newtons
  mass: number; // kg
  acceleration: number; // m/s²
}

export interface SimulationStateNewton {
  position: number;
  velocity: number;
  acceleration: number;
  force: number;
  mass: number;
  friction: number;
  time: number;
  isRunning: boolean;
  dataPoints: DataPointNewton[];
  showForceVector: boolean;
  showAccelerationVector: boolean;
  showFriction: boolean;
  trailPoints: { x: number; t: number }[];
}

export interface AnalysisResultNewton {
  experimentalMass: number;
  theoreticalMass: number;
  percentError: number;
  equation: string;
  rSquared: number;
  slope: number;
}

export type PedagogicalPhaseNewton = 'exploration' | 'hypothesis' | 'experimentation' | 'analysis' | 'conclusion';
