# 🔬 Laboratorio Virtual de Física

> Plataforma educativa interactiva con múltiples prácticas de Física General

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![Practices](https://img.shields.io/badge/Prácticas-6-green)

## 🎯 Descripción

Plataforma web educativa que permite a los estudiantes experimentar con diferentes conceptos de física mediante simulaciones interactivas. Cada práctica incluye simulación en tiempo real, gráficas, recolección de datos, análisis estadístico y generación de reportes.

## 📚 Prácticas Disponibles

### ✅ Práctica 1: MRU (Movimiento Rectilíneo Uniforme)
- 🚗 Simulación de movimiento a velocidad constante
- 📊 Gráficas posición-tiempo y velocidad-tiempo
- 📋 Recolección de datos con tabla interactiva
- 🔬 Análisis con regresión lineal
- 📝 5 fases pedagógicas completas
- 🏆 Sistema de logros

### ✅ Práctica 2: MRUV (Movimiento Rectilíneo Uniformemente Variado)
- 🚀 Simulación de movimiento con aceleración constante
- 📊 Gráficas posición-tiempo (parabólica) y velocidad-tiempo (lineal)
- 🎛️ Controles de aceleración, velocidad inicial y posición inicial
- 🔬 Análisis con regresión cuadrática
- 📝 Sistema pedagógico completo

### ✅ Práctica 3: Caída Libre
- 🍎 Simulación de caída bajo gravedad
- 🪐 Gravedad ajustable (Luna, Tierra, Júpiter)
- 📊 Medición de tiempo de caída y velocidad final
- 🔬 Cálculo experimental de g
- 📝 Comparación con valor teórico (9.81 m/s²)
- 🎯 Objetivos pedagógicos completos

### ✅ Práctica 4: Tiro Parabólico
- 🎯 Simulación de movimiento de proyectiles
- 📊 Trayectoria parabólica en tiempo real
- 🎛️ Controles de velocidad, ángulo y gravedad
- 🔬 Cálculo de alcance máximo y altura
- 🎯 Encontrar el ángulo óptimo (45°)

### ✅ Práctica 5: Péndulo Simple
- ⏰ Simulación de oscilación del péndulo
- 📏 Variación de longitud (20, 40, 60, 80, 100 cm)
- 🔬 Cálculo experimental de g
- 📊 Gráfica T² vs L con regresión lineal
- 🌍 Comparación con g teórico (9.81 m/s²)

### ✅ Práctica 6: Leyes de Newton
- ⚖️ Simulación de fuerza, masa y aceleración
- 📋 Verificación experimental de F = m·a
- 🎛️ Controles de fuerza, masa y fricción
- 📊 Gráfica F vs a para determinar masa
- 🔬 Análisis de error experimental

## ✨ Características Generales

- 🎨 **Página de inicio** con dashboard de todas las prácticas
- 🚀 **Navegación fluida** entre prácticas
- 📱 **Diseño responsive** (desktop, tablet, móvil)
- 🎯 **Sistema pedagógico** de 5 fases por práctica
- 📊 **Gráficas en tiempo real** con Chart.js
- 📋 **Recolección de datos** interactiva
- 🔬 **Análisis estadístico** automático
- 📄 **Generación de reportes** PDF
- 🏆 **Sistema de logros** gamificado
- 🎲 **Modo error experimental** para simular imprecisiones

## 🚀 Despliegue en GitHub Pages

### Paso 1: Subir el código

```bash
git init
git add .
git commit -m "Laboratorio Virtual de Física - Múltiples prácticas"
git remote add origin https://github.com/JHFRGONZALEZ/Laboratorio_virtual_fisica_general.git
git branch -M main
git push -u origin main
```

### Paso 2: Configurar GitHub Pages

1. Ve a **Settings → Pages**
2. En **Source** selecciona:
   - **Branch**: `main`
   - **Folder**: `/docs`
3. Haz clic en **Save**

### Paso 3: Acceder al sitio

Tu laboratorio estará disponible en:
```
https://jhfrgonzalez.github.io/Laboratorio_virtual_fisica_general/
```

## 🛠️ Tecnologías

| Tecnología | Uso |
|-----------|-----|
| React 18 + TypeScript | UI |
| Vite | Build tool |
| Tailwind CSS | Estilos |
| Zustand | Estado global |
| Chart.js | Gráficas |
| HTML5 Canvas | Simulaciones |
| Framer Motion | Animaciones |
| React Router | Navegación |
| jsPDF | Reportes |

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Home.tsx                    # Página de inicio (Dashboard)
│   ├── simulation/                 # Componentes MRU
│   ├── analysis/                   # Gráficas y análisis MRU
│   ├── pedagogy/                   # Preguntas y logros MRU
│   ├── mruv/                       # Componentes MRUV
│   ├── freefall/                   # Componentes Caída Libre
│   └── ui/                         # Componentes reutilizables
├── pages/
│   ├── MRUPractice.tsx            # Página completa MRU
│   ├── MRUVPractice.tsx           # Página completa MRUV
│   └── FreeFallPractice.tsx       # Página completa Caída Libre
├── store/
│   ├── labStore.ts                # Estado global MRU
│   ├── mruvStore.ts               # Estado global MRUV
│   └── freefallStore.ts           # Estado global Caída Libre
├── types/
│   ├── simulation.types.ts        # Tipos MRU
│   ├── mruv.types.ts              # Tipos MRUV
│   └── freefall.types.ts          # Tipos Caída Libre
├── hooks/
│   ├── useSimulation.ts           # Hook simulación MRU
│   └── useSimulationMRUV.ts       # Hook simulación MRUV
└── utils/
    ├── physicsCalculations.ts     # Cálculos MRU
    ├── mruvCalculations.ts        # Cálculos MRUV
    ├── freefallCalculations.ts    # Cálculos Caída Libre
    └── exportReport.ts            # Exportación PDF
```

## 🎓 Cómo Agregar una Nueva Práctica

### Paso 1: Crear los tipos
```typescript
// src/types/nuevaPractica.types.ts
export interface DataPointNueva { ... }
export interface SimulationStateNueva { ... }
```

### Paso 2: Crear el store
```typescript
// src/store/nuevaPracticaStore.ts
import { create } from 'zustand';
export const useLabStoreNueva = create<...>((set) => ({ ... }));
```

### Paso 3: Crear las utilidades de física
```typescript
// src/utils/nuevaPracticaCalculations.ts
export function calculatePosition(...) { ... }
```

### Paso 4: Crear los componentes
```typescript
// src/components/nuevaPractica/VisualizationCanvas.tsx
// src/components/nuevaPractica/ControlPanel.tsx
```

### Paso 5: Crear la página
```typescript
// src/pages/NuevaPracticaPractice.tsx
```

### Paso 6: Agregar la ruta
```typescript
// src/App.tsx
<Route path="/practica/nueva" element={<NuevaPracticaPractice />} />
```

### Paso 7: Agregar al Home
```typescript
// src/components/Home.tsx
{
  id: 'nueva',
  title: 'Práctica X',
  subtitle: 'Nombre de la práctica',
  ...
}
```

## 📄 Licencia

MIT License - Libre para uso educativo.

## 👨‍🏫 Autor

Desarrollado como herramienta educativa para la enseñanza de Física General.

---

**¿Te gustó?** ¡Dale ⭐ al repositorio!
