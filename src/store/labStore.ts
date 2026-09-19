import { create } from 'zustand';
import { SimulationState, DataPoint, PedagogicalPhase, Hypothesis, Achievement, Question } from '../types/simulation.types';
import { calculatePosition, addExperimentalNoise } from '../utils/physicsCalculations';

interface LabStore extends SimulationState {
  // Pedagogical state
  phase: PedagogicalPhase;
  currentExperiment: number;
  hypothesis: Hypothesis | null;
  conclusions: string;
  studentName: string;
  achievements: Achievement[];
  questions: Question[];
  
  // Actions - Simulation
  setVelocity: (v: number) => void;
  setInitialPosition: (p: number) => void;
  setIsRunning: (running: boolean) => void;
  toggleRunning: () => void;
  reset: () => void;
  stepForward: (dt?: number) => void;
  updatePosition: (dt: number) => void;
  setShowVelocityVector: (show: boolean) => void;
  setShowTrail: (show: boolean) => void;
  setExperimentalError: (enabled: boolean) => void;
  
  // Actions - Data Collection
  addDataPoint: (point?: DataPoint) => void;
  removeDataPoint: (index: number) => void;
  clearDataPoints: () => void;
  updateDataPoint: (index: number, point: Partial<DataPoint>) => void;
  
  // Actions - Pedagogy
  setPhase: (phase: PedagogicalPhase) => void;
  setCurrentExperiment: (exp: number) => void;
  setHypothesis: (text: string) => void;
  setConclusions: (text: string) => void;
  setStudentName: (name: string) => void;
  answerQuestion: (id: number, answer: string) => void;
  unlockAchievement: (id: string) => void;
}

const defaultQuestions: Question[] = [
  { id: 1, level: 'observation', text: '¿Cómo cambia la posición del carro con el tiempo?', hint: 'Observa si los incrementos de posición son iguales en intervalos iguales de tiempo.', answered: false },
  { id: 2, level: 'observation', text: '¿La velocidad cambia durante el movimiento? ¿Por qué?', hint: 'Recuerda la definición de MRU: movimiento con velocidad constante.', answered: false },
  { id: 3, level: 'analysis', text: 'Calcula la pendiente de la gráfica x vs t. ¿Qué representa físicamente?', hint: 'La pendiente = Δx/Δt. ¿Qué magnitud física tiene unidades de m/s?', answered: false },
  { id: 4, level: 'analysis', text: 'Compara la velocidad medida con la velocidad configurada. ¿Coinciden?', hint: 'Calcula el porcentaje de error entre ambos valores.', answered: false },
  { id: 5, level: 'synthesis', text: 'Si la gráfica x vs t fuera una curva, ¿qué tipo de movimiento sería?', hint: 'Piensa en qué pasa cuando la velocidad cambia con el tiempo.', answered: false },
  { id: 6, level: 'synthesis', text: '¿Qué fuentes de error podrían afectar tus mediciones en un experimento real?', hint: 'Piensa en instrumentos de medición, reacción humana, fricción...', answered: false },
  { id: 7, level: 'application', text: 'Un auto viaja a 60 km/h en línea recta. ¿Cuánto avanzará en 2.5 horas?', hint: 'Usa x = v·t. Primero identifica los datos: v = 60 km/h, t = 2.5 h', answered: false },
  { id: 8, level: 'application', text: 'Diseña un experimento para verificar que la velocidad es constante.', hint: '¿Qué necesitarías medir? ¿Cómo confirmarías que no hay aceleración?', answered: false },
];

const defaultAchievements: Achievement[] = [
  { id: 'first_experiment', title: 'Primer Experimento', description: 'Completaste tu primera medición', unlocked: false, icon: '🧪' },
  { id: 'analyst', title: 'Analista', description: 'Calculaste la pendiente correctamente', unlocked: false, icon: '📊' },
  { id: 'scientist', title: 'Científico', description: 'Generaste un reporte completo', unlocked: false, icon: '🔬' },
  { id: 'explorer', title: 'Explorador', description: 'Completaste la fase de exploración', unlocked: false, icon: '🧭' },
  { id: 'hypothesizer', title: 'Hipótesis', description: 'Formulaste una hipótesis', unlocked: false, icon: '💡' },
  { id: 'ten_measurements', title: 'Medidor Experto', description: 'Realizaste 10 mediciones', unlocked: false, icon: '📏' },
];

export const useLabStore = create<LabStore>((set, get) => ({
  // Initial simulation state
  position: 0,
  velocity: 2,
  initialPosition: 0,
  time: 0,
  isRunning: false,
  dataPoints: [],
  showVelocityVector: true,
  showTrail: true,
  experimentalError: false,
  trailPoints: [],
  
  // Initial pedagogical state
  phase: 'exploration',
  currentExperiment: 1,
  hypothesis: null,
  conclusions: '',
  studentName: '',
  achievements: defaultAchievements,
  questions: defaultQuestions,
  
  // Simulation actions
  setVelocity: (v) => set({ velocity: v }),
  setInitialPosition: (p) => set({ initialPosition: p }),
  setIsRunning: (running) => set({ isRunning: running }),
  toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),
  
  reset: () => set((state) => ({
    position: state.initialPosition,
    time: 0,
    isRunning: false,
    trailPoints: [],
  })),
  
  stepForward: (dt = 1) => set((state) => {
    const newTime = state.time + dt;
    const newPosition = calculatePosition(state.initialPosition, state.velocity, newTime);
    return {
      time: newTime,
      position: newPosition,
      trailPoints: [...state.trailPoints, { x: newPosition, t: newTime }],
    };
  }),
  
  updatePosition: (dt) => set((state) => {
    if (!state.isRunning) return state;
    const newTime = state.time + dt;
    const newPosition = calculatePosition(state.initialPosition, state.velocity, newTime);
    return {
      time: newTime,
      position: newPosition,
      trailPoints: [...state.trailPoints, { x: newPosition, t: newTime }],
    };
  }),
  
  setShowVelocityVector: (show) => set({ showVelocityVector: show }),
  setShowTrail: (show) => set({ showTrail: show }),
  setExperimentalError: (enabled) => set({ experimentalError: enabled }),
  
  // Data collection actions
  addDataPoint: (point) => set((state) => {
    let newPoint: DataPoint;
    if (point) {
      newPoint = point;
    } else {
      const pos = state.experimentalError
        ? addExperimentalNoise(state.position, 3)
        : state.position;
      newPoint = {
        time: state.time,
        position: pos,
        velocity: state.velocity,
      };
    }
    const newPoints = [...state.dataPoints, newPoint];
    
    // Check achievements
    const achievements = [...state.achievements];
    if (newPoints.length === 1) {
      const idx = achievements.findIndex(a => a.id === 'first_experiment');
      if (idx >= 0) achievements[idx] = { ...achievements[idx], unlocked: true };
    }
    if (newPoints.length >= 10) {
      const idx = achievements.findIndex(a => a.id === 'ten_measurements');
      if (idx >= 0) achievements[idx] = { ...achievements[idx], unlocked: true };
    }
    
    return { dataPoints: newPoints, achievements };
  }),
  
  removeDataPoint: (index) => set((state) => ({
    dataPoints: state.dataPoints.filter((_, i) => i !== index),
  })),
  
  clearDataPoints: () => set({ dataPoints: [] }),
  
  updateDataPoint: (index, updates) => set((state) => ({
    dataPoints: state.dataPoints.map((p, i) => i === index ? { ...p, ...updates } : p),
  })),
  
  // Pedagogy actions
  setPhase: (phase) => {
    set({ phase });
    if (phase === 'exploration') {
      const achievements = [...get().achievements];
      const idx = achievements.findIndex(a => a.id === 'explorer');
      if (idx >= 0) achievements[idx] = { ...achievements[idx], unlocked: true };
      set({ achievements });
    }
  },
  setCurrentExperiment: (exp) => set({ currentExperiment: exp }),
  setHypothesis: (text) => {
    set({ hypothesis: { text, timestamp: new Date() } });
    const achievements = [...get().achievements];
    const idx = achievements.findIndex(a => a.id === 'hypothesizer');
    if (idx >= 0) achievements[idx] = { ...achievements[idx], unlocked: true };
    set({ achievements });
  },
  setConclusions: (text) => set({ conclusions: text }),
  setStudentName: (name) => set({ studentName: name }),
  
  answerQuestion: (id, answer) => set((state) => ({
    questions: state.questions.map(q => q.id === id ? { ...q, answered: true, answer } : q),
  })),
  
  unlockAchievement: (id) => set((state) => ({
    achievements: state.achievements.map(a => a.id === id ? { ...a, unlocked: true } : a),
  })),
}));
