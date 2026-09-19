import { create } from 'zustand';
import { SimulationStateMRUV, DataPointMRUV, PedagogicalPhaseMRUV } from '../types/mruv.types';
import { calculatePositionMRUV, calculateVelocityMRUV, addExperimentalNoise } from '../utils/mruvCalculations';

interface LabStoreMRUV extends SimulationStateMRUV {
  // Pedagogical state
  phase: PedagogicalPhaseMRUV;
  currentExperiment: number;
  hypothesis: string;
  conclusions: string;
  studentName: string;
  
  // Actions - Simulation
  setAcceleration: (a: number) => void;
  setInitialVelocity: (v: number) => void;
  setInitialPosition: (p: number) => void;
  setIsRunning: (running: boolean) => void;
  toggleRunning: () => void;
  reset: () => void;
  stepForward: (dt?: number) => void;
  updatePosition: (dt: number) => void;
  setShowVelocityVector: (show: boolean) => void;
  setShowAccelerationVector: (show: boolean) => void;
  setShowTrail: (show: boolean) => void;
  setExperimentalError: (enabled: boolean) => void;
  
  // Actions - Data Collection
  addDataPoint: (point?: DataPointMRUV) => void;
  removeDataPoint: (index: number) => void;
  clearDataPoints: () => void;
  updateDataPoint: (index: number, point: Partial<DataPointMRUV>) => void;
  
  // Actions - Pedagogy
  setPhase: (phase: PedagogicalPhaseMRUV) => void;
  setCurrentExperiment: (exp: number) => void;
  setHypothesis: (text: string) => void;
  setConclusions: (text: string) => void;
  setStudentName: (name: string) => void;
}

export const useLabStoreMRUV = create<LabStoreMRUV>((set, get) => ({
  // Initial simulation state
  position: 0,
  velocity: 0,
  acceleration: 2,
  initialPosition: 0,
  initialVelocity: 0,
  time: 0,
  isRunning: false,
  dataPoints: [],
  showVelocityVector: true,
  showAccelerationVector: true,
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
  setAcceleration: (a) => set({ acceleration: a }),
  setInitialVelocity: (v) => set({ initialVelocity: v }),
  setInitialPosition: (p) => set({ initialPosition: p }),
  setIsRunning: (running) => set({ isRunning: running }),
  toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),
  
  reset: () => set((state) => ({
    position: state.initialPosition,
    velocity: state.initialVelocity,
    time: 0,
    isRunning: false,
    trailPoints: [],
  })),
  
  stepForward: (dt = 1) => set((state) => {
    const newTime = state.time + dt;
    const newPosition = calculatePositionMRUV(state.initialPosition, state.initialVelocity, state.acceleration, newTime);
    const newVelocity = calculateVelocityMRUV(state.initialVelocity, state.acceleration, newTime);
    return {
      time: newTime,
      position: newPosition,
      velocity: newVelocity,
      trailPoints: [...state.trailPoints, { x: newPosition, v: newVelocity, t: newTime }],
    };
  }),
  
  updatePosition: (dt) => set((state) => {
    if (!state.isRunning) return state;
    const newTime = state.time + dt;
    const newPosition = calculatePositionMRUV(state.initialPosition, state.initialVelocity, state.acceleration, newTime);
    const newVelocity = calculateVelocityMRUV(state.initialVelocity, state.acceleration, newTime);
    return {
      time: newTime,
      position: newPosition,
      velocity: newVelocity,
      trailPoints: [...state.trailPoints, { x: newPosition, v: newVelocity, t: newTime }],
    };
  }),
  
  setShowVelocityVector: (show) => set({ showVelocityVector: show }),
  setShowAccelerationVector: (show) => set({ showAccelerationVector: show }),
  setShowTrail: (show) => set({ showTrail: show }),
  setExperimentalError: (enabled) => set({ experimentalError: enabled }),
  
  // Data collection actions
  addDataPoint: (point) => set((state) => {
    let newPoint: DataPointMRUV;
    if (point) {
      newPoint = point;
    } else {
      const pos = state.experimentalError
        ? addExperimentalNoise(state.position, 3)
        : state.position;
      const vel = state.experimentalError
        ? addExperimentalNoise(state.velocity, 3)
        : state.velocity;
      newPoint = {
        time: state.time,
        position: pos,
        velocity: vel,
        acceleration: state.acceleration,
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
