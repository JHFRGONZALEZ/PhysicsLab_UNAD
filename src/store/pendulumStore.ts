import { create } from 'zustand';
import { SimulationStatePendulum, DataPointPendulum, PedagogicalPhasePendulum } from '../types/pendulum.types';
import { calculateTheoreticalPeriod, addExperimentalNoise } from '../utils/pendulumCalculations';

interface LabStorePendulum extends SimulationStatePendulum {
  phase: PedagogicalPhasePendulum;
  setLength: (l: number) => void;
  setGravity: (g: number) => void;
  setIsRunning: (running: boolean) => void;
  toggleRunning: () => void;
  reset: () => void;
  updateAngle: (dt: number) => void;
  setShowAngle: (show: boolean) => void;
  setShowTrail: (show: boolean) => void;
  addDataPoint: (point?: DataPointPendulum) => void;
  removeDataPoint: (index: number) => void;
  clearDataPoints: () => void;
  setPhase: (phase: PedagogicalPhasePendulum) => void;
  measurePeriod: () => void;
}

export const useLabStorePendulum = create<LabStorePendulum>((set, get) => ({
  angle: Math.PI / 6, // 30 degrees initial
  angularVelocity: 0,
  length: 0.4, // 40 cm
  gravity: 9.81,
  time: 0,
  isRunning: false,
  dataPoints: [],
  showAngle: true,
  showTrail: true,
  trailPoints: [],
  oscillationCount: 0,
  lastAngle: Math.PI / 6,
  periodStartTime: null,
  phase: 'exploration',
  
  setLength: (l) => set({ length: l }),
  setGravity: (g) => set({ gravity: g }),
  setIsRunning: (running) => set({ isRunning: running }),
  toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),
  
  reset: () => set({
    angle: Math.PI / 6,
    angularVelocity: 0,
    time: 0,
    isRunning: false,
    trailPoints: [],
    oscillationCount: 0,
    lastAngle: Math.PI / 6,
    periodStartTime: null,
  }),
  
  updateAngle: (dt) => set((state) => {
    if (!state.isRunning) return state;
    
    // Simple pendulum physics: θ'' = -(g/L)·sin(θ)
    // Using small angle approximation for simplicity: θ'' ≈ -(g/L)·θ
    const angularAcceleration = -(state.gravity / state.length) * Math.sin(state.angle);
    const newAngularVelocity = state.angularVelocity + angularAcceleration * dt;
    const newAngle = state.angle + newAngularVelocity * dt;
    const newTime = state.time + dt;
    
    // Detect zero crossing (half period)
    let newOscillationCount = state.oscillationCount;
    let newPeriodStartTime = state.periodStartTime;
    
    if (state.lastAngle > 0 && newAngle <= 0) {
      // Crossed zero going negative
      if (newPeriodStartTime === null) {
        newPeriodStartTime = newTime;
      } else {
        // Completed one full oscillation
        newOscillationCount++;
        newPeriodStartTime = newTime;
      }
    }
    
    return {
      angle: newAngle,
      angularVelocity: newAngularVelocity,
      time: newTime,
      lastAngle: state.angle,
      oscillationCount: newOscillationCount,
      periodStartTime: newPeriodStartTime,
      trailPoints: [...state.trailPoints, { angle: newAngle, t: newTime }],
    };
  }),
  
  setShowAngle: (show) => set({ showAngle: show }),
  setShowTrail: (show) => set({ showTrail: show }),
  
  addDataPoint: (point) => set((state) => {
    let newPoint: DataPointPendulum;
    if (point) {
      newPoint = point;
    } else {
      const theoreticalPeriod = calculateTheoreticalPeriod(state.length, state.gravity);
      const measuredPeriod = addExperimentalNoise(theoreticalPeriod, 2);
      newPoint = {
        length: state.length,
        period: measuredPeriod,
        periodSquared: measuredPeriod * measuredPeriod,
      };
    }
    return { dataPoints: [...state.dataPoints, newPoint] };
  }),
  
  removeDataPoint: (index) => set((state) => ({
    dataPoints: state.dataPoints.filter((_, i) => i !== index),
  })),
  
  clearDataPoints: () => set({ dataPoints: [] }),
  setPhase: (phase) => set({ phase }),
  
  measurePeriod: () => {
    const state = get();
    const theoreticalPeriod = calculateTheoreticalPeriod(state.length, state.gravity);
    const measuredPeriod = addExperimentalNoise(theoreticalPeriod, 2);
    
    set({
      dataPoints: [...state.dataPoints, {
        length: state.length,
        period: measuredPeriod,
        periodSquared: measuredPeriod * measuredPeriod,
      }],
    });
  },
}));
