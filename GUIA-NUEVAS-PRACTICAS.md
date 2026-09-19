# 📘 Guía Rápida: Cómo Agregar Nuevas Prácticas

## 🎯 Estructura Modular

El laboratorio está diseñado con una arquitectura modular que facilita agregar nuevas prácticas. Cada práctica es independiente pero comparte componentes base.

## 📋 Checklist para Nueva Práctica

### 1️⃣ Definir los Tipos (`src/types/`)

```typescript
// src/types/mrua.types.ts (ejemplo: MRUA)
export interface DataPointMRUA {
  time: number;
  position: number;
  velocity: number;
  acceleration: number;
  jerk: number; // nueva variable
}

export interface SimulationStateMRUA {
  // Estado de la simulación
  position: number;
  velocity: number;
  acceleration: number;
  jerk: number;
  // ... más campos
}
```

### 2️⃣ Crear el Store (`src/store/`)

```typescript
// src/store/mruaStore.ts
import { create } from 'zustand';
import { SimulationStateMRUA } from '../types/mrua.types';

interface LabStoreMRUA extends SimulationStateMRUA {
  // Actions
  setJerk: (j: number) => void;
  reset: () => void;
  // ... más actions
}

export const useLabStoreMRUA = create<LabStoreMRUA>((set) => ({
  // Estado inicial
  position: 0,
  velocity: 0,
  acceleration: 0,
  jerk: 1,
  
  // Actions
  setJerk: (jerk) => set({ jerk }),
  reset: () => set({ position: 0, velocity: 0, time: 0 }),
}));
```

### 3️⃣ Crear Utilidades de Física (`src/utils/`)

```typescript
// src/utils/mruaCalculations.ts
export function calculatePositionMRUA(
  x0: number, v0: number, a0: number, j: number, t: number
): number {
  return x0 + v0*t + 0.5*a0*t*t + (1/6)*j*t*t*t;
}

export function analyzeDataMRUA(dataPoints: DataPointMRUA[]) {
  // Análisis específico de esta práctica
}
```

### 4️⃣ Crear Componentes de Simulación (`src/components/mrua/`)

```typescript
// src/components/mrua/VisualizationCanvasMRUA.tsx
import { useLabStoreMRUA } from '../../store/mruaStore';

export const VisualizationCanvasMRUA: React.FC = () => {
  const { position, velocity, acceleration, jerk } = useLabStoreMRUA();
  
  // Canvas con animación específica
  return <canvas ref={canvasRef} width={800} height={300} />;
};
```

```typescript
// src/components/mrua/ControlPanelMRUA.tsx
export const ControlPanelMRUA: React.FC = () => {
  const { jerk, setJerk } = useLabStoreMRUA();
  
  return (
    <div>
      <input 
        type="range" 
        value={jerk} 
        onChange={(e) => setJerk(parseFloat(e.target.value))}
      />
    </div>
  );
};
```

### 5️⃣ Crear la Página Completa (`src/pages/`)

```typescript
// src/pages/MRUAPractice.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { VisualizationCanvasMRUA } from '../components/mrua/VisualizationCanvasMRUA';
import { ControlPanelMRUA } from '../components/mrua/ControlPanelMRUA';

export const MRUAPractice: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      <header>
        {/* Header con botón de regreso */}
        <Link to="/">← Volver al Inicio</Link>
        <h1>Práctica X: MRUA</h1>
      </header>
      
      <main>
        <VisualizationCanvasMRUA />
        <ControlPanelMRUA />
        {/* Más componentes */}
      </main>
    </div>
  );
};
```

### 6️⃣ Agregar la Ruta (`src/App.tsx`)

```typescript
// src/App.tsx
import MRUAPractice from './pages/MRUAPractice';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practica/mru" element={<MRUPractice />} />
        <Route path="/practica/mruv" element={<MRUVPractice />} />
        <Route path="/practica/mrua" element={<MRUAPractice />} /> {/* NUEVA */}
      </Routes>
    </HashRouter>
  );
}
```

### 7️⃣ Agregar al Home (`src/components/Home.tsx`)

```typescript
// src/components/Home.tsx
const practices: Practice[] = [
  {
    id: 'mru',
    title: 'Práctica 1',
    subtitle: 'Movimiento Rectilíneo Uniforme (MRU)',
    // ...
  },
  {
    id: 'mruv',
    title: 'Práctica 2',
    subtitle: 'Movimiento Rectilíneo Uniformemente Variado (MRUV)',
    // ...
  },
  {
    id: 'mrua', // NUEVA PRÁCTICA
    title: 'Práctica 3',
    subtitle: 'Movimiento Rectilíneo Uniformemente Acelerado (MRUA)',
    description: 'Explora el movimiento con jerk constante...',
    icon: '🎢',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    topics: ['Jerk constante', 'Aceleración variable', 'Ecuaciones cúbicas'],
    status: 'available'
  },
];
```

## 🎨 Convenciones de Diseño

### Colores por Práctica
- **MRU**: Azul (`blue-500` a `cyan-500`)
- **MRUV**: Púrpura (`purple-500` a `pink-500`)
- **Caída Libre**: Naranja (`orange-500` a `red-500`)
- **Tiro Parabólico**: Verde (`green-500` a `emerald-500`)
- **Péndulo**: Índigo (`indigo-500` a `blue-500`)
- **Fuerzas**: Rojo (`red-500` a `rose-500`)

### Estructura de Fases Pedagógicas
Todas las prácticas siguen el mismo flujo de 5 fases:
1. **Exploración** - Experimentación libre
2. **Hipótesis** - Formulación de predicciones
3. **Experimentación** - Mediciones guiadas
4. **Análisis** - Interpretación de datos
5. **Conclusiones** - Reflexión y reporte

## 📦 Componentes Reutilizables

Estos componentes pueden compartirse entre prácticas:

- `DataCollector` - Tabla de datos interactiva
- `GuidedQuestions` - Sistema de preguntas guía
- `HypothesisBuilder` - Constructor de hipótesis
- `ConclusionBuilder` - Constructor de conclusiones
- `AchievementPanel` - Panel de logros
- `Toast` - Notificaciones

## 🚀 Flujo de Trabajo Recomendado

1. **Planear**: Definir objetivos de aprendizaje y ecuaciones
2. **Tipos**: Crear interfaces TypeScript
3. **Store**: Implementar estado con Zustand
4. **Física**: Escribir funciones de cálculo
5. **Canvas**: Crear visualización animada
6. **Controles**: Implementar panel de control
7. **Gráficas**: Agregar Chart.js
8. **Pedagogía**: Adaptar preguntas y fases
9. **Página**: Integrar todo en una página
10. **Ruta**: Agregar al router y Home

## 💡 Tips

- ✅ Mantén cada práctica independiente
- ✅ Usa nombres descriptivos y consistentes
- ✅ Documenta las ecuaciones físicas
- ✅ Prueba la simulación a 60 FPS
- ✅ Asegura responsive design
- ✅ Incluye modo error experimental
- ✅ Agrega al menos 3 experimentos guiados

## 🎯 Ejemplo Completo: Caída Libre

```typescript
// Ecuaciones clave
y(t) = y₀ + v₀·t - ½·g·t²
v(t) = v₀ - g·t
g ≈ 9.81 m/s²

// Variables a controlar
- Altura inicial (y₀)
- Velocidad inicial (v₀)
- Gravedad (g) - permite cambiar para simular otros planetas

// Mediciones importantes
- Tiempo de caída
- Velocidad final
- Altura máxima (si v₀ > 0)

// Gráficas
- y vs t (parábola invertida)
- v vs t (línea recta con pendiente negativa)
```

---

¡Con esta guía puedes agregar todas las prácticas que quieras! 🚀
