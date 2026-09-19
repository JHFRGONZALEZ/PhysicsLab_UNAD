import { create } from 'zustand';
import { SimulationStateProjectile, DataPointProjectile, PedagogicalPhaseProjectile } from '../types/projectile.types';
import { calculatePositionProjectile, calculateVelocityProjectile } from '../utils/projectileCalculations';

interface LabStoreProjectile extends SimulationStateProjectile {
  phase: PedagogicalPhaseProjectile;
  setInitialVelocity: (v: number) => void;
  setAngle: (a: number) => void;
  setGravity: (g: number) => void;
  setIsRunning: (running: boolean) => void;
  toggleRunning: () => void;
  reset: () => void;
  stepForward: (dt?: number) => void;
  updatePosition: (dt: number) => void;
  setShowVelocityVector: (show: boolean) => void;
  setShowTrail: (show: boolean) => void;
  addDataPoint: (point?: DataPointProjectile) => void;
  removeDataPoint: (index: number) => void;
  clearDataPoints: () => void;
  setPhase: (phase: PedagogicalPhaseProjectile) => void;
}

export const useLabStoreProjectile = create<LabStoreProjectile>((set, get) => ({
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  initialVelocity: 20,
  angle: 45,
  gravity: 9.81,
  time: 0,
  isRunning: false,
  hasLanded: false,
  dataPoints: [],
  showVelocityVector: true,
  showTrail: true,
  trailPoints: [],
  phase: 'exploration',
  
  setInitialVelocity: (v) => set({ initialVelocity: v }),
  setAngle: (a) => set({ angle: a }),
  setGravity: (g) => set({ gravity: g }),
  setIsRunning: (running) => set({ isRunning: running }),
  toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),
  
  reset: () => set({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    time: 0,
    isRunning: false,
    hasLanded: false,
    trailPoints: [],
  }),
  
  stepForward: (dt = 0.1) => set((state) => {
    if (state.hasLanded) return state;
    
    const newTime = state.time + dt;
    const pos = calculatePositionProjectile(state.initialVelocity, state.angle, state.gravity, newTime);
    const vel = calculateVelocityProjectile(state.initialVelocity, state.angle, state.gravity, newTime);
    
    const hasLanded = pos.y <= 0 && newTime > 0.1;
    
    return {
      time: newTime,
      x: pos.x,
      y: hasLanded ? 0 : pos.y,
      vx: vel.vx,
      vy: vel.vy,
      hasLanded,
      trailPoints: [...state.trailPoints, { x: pos.x, y: hasLanded ? 0 : pos.y, t: newTime }],
    };
  }),
  
  updatePosition: (dt) => set((state) => {
    if (!state.isRunning || state.hasLanded) return state;
    
    const newTime = state.time + dt;
    const pos = calculatePositionProjectile(state.initialVelocity, state.angle, state.gravity, newTime);
    const vel = calculateVelocityProjectile(state.initialVelocity, state.angle, state.gravity, newTime);
    
    const hasLanded = pos.y <= 0 && newTime > 0.1;
    
    return {
      time: newTime,
      x: pos.x,
      y: hasLanded ? 0 : pos.y,
      vx: vel.vx,
      vy: vel.vy,
      hasLanded,
      trailPoints: [...state.trailPoints, { x: pos.x, y: hasLanded ? 0 : pos.y, t: newTime }],
    };
  }),
  
  setShowVelocityVector: (show) => set({ showVelocityVector: show }),
  setShowTrail: (show) => set({ showTrail: show }),
  
  addDataPoint: (point) => set((state) => {
    let newPoint: DataPointProjectile;
    if (point) {
      newPoint = point;
    } else {
      newPoint = {
        time: state.time,
        x: state.x,
        y: state.y,
        vx: state.vx,
        vy: state.vy,
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
