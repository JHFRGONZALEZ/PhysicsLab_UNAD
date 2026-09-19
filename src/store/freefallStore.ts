import { create } from 'zustand';
import { SimulationStateFreeFall, DataPointFreeFall, PedagogicalPhaseFreeFall } from '../types/freefall.types';
import { calculateHeight, calculateVelocity, addExperimentalNoise } from '../utils/freefallCalculations';

interface LabStoreFreeFall extends SimulationStateFreeFall {
  // Pedagogical state
  phase: PedagogicalPhaseFreeFall;
  currentExperiment: number;
  hypothesis: string;
  conclusions: string;
  studentName: string;
  
  // Actions - Simulation
  setGravity: (g: number) => void;
  setInitialHeight: (h: number) => void;
  setIsRunning: (running: boolean) => void;
  toggleRunning: () => void;
  reset: () => void;
  stepForward: (dt?: number) => void;
  updatePosition: (dt: number) => void;
  setShowVelocityVector: (show: boolean) => void;
  setShowTrail: (show: boolean) => void;
  setExperimentalError: (enabled: boolean) => void;
  
  // Actions - Data Collection
  addDataPoint: (point?: DataPointFreeFall) => void;
  removeDataPoint: (index: number) => void;
  clearDataPoints: () => void;
  updateDataPoint: (index: number, point: Partial<DataPointFreeFall>) => void;
  
  // Actions - Pedagogy
  setPhase: (phase: PedagogicalPhaseFreeFall) => void;
  setCurrentExperiment: (exp: number) => void;
  setHypothesis: (text: string) => void;
  setConclusions: (text: string) => void;
  setStudentName: (name: string) => void;
}

export const useLabStoreFreeFall = create<LabStoreFreeFall>((set, get) => ({
  // Initial simulation state
  height: 100,
  velocity: 0,
  gravity: 9.81,
  initialHeight: 100,
  time: 0,
  isRunning: false,
  hasLanded: false,
  dataPoints: [],
  showVelocityVector: true,
  showTrail: true,
  experimentalError: false,
  trailPoints: [],
  
  // Initial pedagogical state
  phase: 'exploration',
  currentExperiment: 1,
  hypothesis: '',
  conclusions: '',
  studentName: '',
  
  // Simulation actions
  setGravity: (g) => set({ gravity: g }),
  setInitialHeight: (h) => set({ initialHeight: h, height: h }),
  setIsRunning: (running) => set({ isRunning: running }),
  toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),
  
  reset: () => set((state) => ({
    height: state.initialHeight,
    velocity: 0,
    time: 0,
    isRunning: false,
    hasLanded: false,
    trailPoints: [],
  })),
  
  stepForward: (dt = 0.1) => set((state) => {
    if (state.hasLanded) return state;
    
    const newTime = state.time + dt;
    const newHeight = calculateHeight(state.initialHeight, state.gravity, newTime);
    const newVelocity = calculateVelocity(state.gravity, newTime);
    
    const hasLanded = newHeight <= 0;
    
    return {
      time: newTime,
      height: hasLanded ? 0 : newHeight,
      velocity: hasLanded ? calculateVelocity(state.gravity, Math.sqrt(2 * state.initialHeight / state.gravity)) : newVelocity,
      hasLanded,
      trailPoints: [...state.trailPoints, { y: hasLanded ? 0 : newHeight, v: newVelocity, t: newTime }],
    };
  }),
  
  updatePosition: (dt) => set((state) => {
    if (!state.isRunning || state.hasLanded) return state;
    
    const newTime = state.time + dt;
    const newHeight = calculateHeight(state.initialHeight, state.gravity, newTime);
    const newVelocity = calculateVelocity(state.gravity, newTime);
    
    const hasLanded = newHeight <= 0;
    
    return {
      time: newTime,
      height: hasLanded ? 0 : newHeight,
      velocity: hasLanded ? calculateVelocity(state.gravity, Math.sqrt(2 * state.initialHeight / state.gravity)) : newVelocity,
      hasLanded,
      trailPoints: [...state.trailPoints, { y: hasLanded ? 0 : newHeight, v: newVelocity, t: newTime }],
    };
  }),
  
  setShowVelocityVector: (show) => set({ showVelocityVector: show }),
  setShowTrail: (show) => set({ showTrail: show }),
  setExperimentalError: (enabled) => set({ experimentalError: enabled }),
  
  // Data collection actions
  addDataPoint: (point) => set((state) => {
    let newPoint: DataPointFreeFall;
    if (point) {
      newPoint = point;
    } else {
      const h = state.experimentalError
        ? addExperimentalNoise(state.height, 2)
        : state.height;
      const v = state.experimentalError
        ? addExperimentalNoise(state.velocity, 2)
        : state.velocity;
      newPoint = {
        time: state.time,
        height: h,
        velocity: v,
      };
    }
    return { dataPoints: [...state.dataPoints, newPoint] };
  }),
  
  removeDataPoint: (index) => set((state) => ({
    dataPoints: state.dataPoints.filter((_, i) => i !== index),
  })),
  
  clearDataPoints: () => set({ dataPoints: [] }),
  
  updateDataPoint: (index, updates) => set((state) => ({
    dataPoints: state.dataPoints.map((p, i) => i === index ? { ...p, ...updates } : p),
  })),
  
  // Pedagogy actions
  setPhase: (phase) => set({ phase }),
  setCurrentExperiment: (exp) => set({ currentExperiment: exp }),
  setHypothesis: (text) => set({ hypothesis: text }),
  setConclusions: (text) => set({ conclusions: text }),
  setStudentName: (name) => set({ studentName: name }),
}));
