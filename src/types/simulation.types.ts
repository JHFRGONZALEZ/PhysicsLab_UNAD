// Types for the MRU Virtual Laboratory

export interface DataPoint {
  time: number;
  position: number;
  velocity: number;
}

export interface SimulationState {
  position: number;
  velocity: number;
  initialPosition: number;
  time: number;
  isRunning: boolean;
  dataPoints: DataPoint[];
  showVelocityVector: boolean;
  showTrail: boolean;
  experimentalError: boolean;
  trailPoints: { x: number; t: number }[];
}

export interface ExperimentConfig {
  id: number;
  title: string;
  description: string;
  velocity: number;
  initialPosition: number;
  measurements: number[];
}

export interface AnalysisResult {
  theoreticalVelocity: number;
  experimentalVelocity: number;
  percentError: number;
  equation: string;
  rSquared: number;
  intercept: number;
  slope: number;
}

export interface Hypothesis {
  text: string;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export type PedagogicalPhase = 'exploration' | 'hypothesis' | 'experimentation' | 'analysis' | 'conclusion';

export interface Question {
  id: number;
  level: 'observation' | 'analysis' | 'synthesis' | 'application';
  text: string;
  hint: string;
  answered: boolean;
  answer?: string;
}
