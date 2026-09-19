import { create } from 'zustand';
import { SimulationStateNewton, DataPointNewton, PedagogicalPhaseNewton } from '../types/newton.types';
import { calculateAcceleration, calculateFriction, addExperimentalNoise } from '../utils/newtonCalculations';

interface LabStoreNewton extends SimulationStateNewton {
  phase: PedagogicalPhaseNewton;
  setForce: (f: number) => void;
  setMass: (m: number) => void;
  setFriction: (f: number) => void;
  setIsRunning: (running: boolean) => void;
  toggleRunning: () => void;
  reset: () => void;
  updateMotion: (dt: number) => void;
  setShowForceVector: (show: boolean) => void;
  setShowAccelerationVector: (show: boolean) => void;
  setShowFriction: (show: boolean) => void;
  addDataPoint: (point?: DataPointNewton) => void;
  removeDataPoint: (index: number) => void;
  clearDataPoints: () => void;
  setPhase: (phase: PedagogicalPhaseNewton) => void;
}

export const useLabStoreNewton = create<LabStoreNewton>((set, get) => ({
  position: 0,
  velocity: 0,
  acceleration: 0,
  force: 10,
  mass: 2,
  friction: 0,
  time: 0,
  isRunning: false,
  dataPoints: [],
  showForceVector: true,
  showAccelerationVector: true,
  showFriction: false,
  trailPoints: [],
  phase: 'exploration',
  
  setForce: (f) => set({ force: f }),
  setMass: (m) => set({ mass: m }),
  setFriction: (f) => set({ friction: f }),
  setIsRunning: (running) => set({ isRunning: running }),
  toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),
  
  reset: () => set({
    position: 0,
    velocity: 0,
    acceleration: 0,
    time: 0,
    isRunning: false,
    trailPoints: [],
  }),
  
  updateMotion: (dt) => set((state) => {
    if (!state.isRunning) return state;
    
    const frictionForce = state.showFriction ? calculateFriction(state.mass, state.friction) : 0;
    const acceleration = calculateAcceleration(state.force, state.mass, frictionForce);
    const newVelocity = state.velocity + acceleration * dt;
    const newPosition = state.position + state.velocity * dt + 0.5 * acceleration * dt * dt;
    const newTime = state.time + dt;
    
    return {
      velocity: newVelocity,
      position: newPosition,
      acceleration,
      time: newTime,
      trailPoints: [...state.trailPoints, { x: newPosition, t: newTime }],
    };
  }),
  
  setShowForceVector: (show) => set({ showForceVector: show }),
  setShowAccelerationVector: (show) => set({ showAccelerationVector: show }),
  setShowFriction: (show) => set({ showFriction: show }),
  
  addDataPoint: (point) => set((state) => {
    let newPoint: DataPointNewton;
    if (point) {
      newPoint = point;
    } else {
      const frictionForce = state.showFriction ? calculateFriction(state.mass, state.friction) : 0;
      const theoreticalAccel = calculateAcceleration(state.force, state.mass, frictionForce);
      const measuredAccel = addExperimentalNoise(theoreticalAccel, 3);
      
      newPoint = {
        force: state.force,
        mass: state.mass,
        acceleration: measuredAccel,
      };
    }
    return { dataPoints: [...state.dataPoints, newPoint] };
  }),
  
  removeDataPoint: (index) => set((state) => ({
    dataPoints: state.dataPoints.filter((_, i) => i !== index),
  })),
  
  clearDataPoints: () => set({ dataPoints: [] }),
  setPhase: (phase) => set({ phase }),
}));
