import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLabStore } from '../store/labStore';
import { PedagogicalPhase } from '../types/simulation.types';
import { MRUSimulator } from '../components/simulation/MRUSimulator';
import { PositionTimeGraph } from '../components/analysis/PositionTimeGraph';
import { VelocityTimeGraph } from '../components/analysis/VelocityTimeGraph';
import { DataAnalysisPanel } from '../components/analysis/DataAnalysisPanel';
import { GuidedQuestions } from '../components/pedagogy/GuidedQuestions';
import { HypothesisBuilder } from '../components/pedagogy/HypothesisBuilder';
import { ConclusionBuilder } from '../components/pedagogy/ConclusionBuilder';
import { AchievementPanel } from '../components/pedagogy/AchievementPanel';
import { ComparisonView } from '../components/analysis/ComparisonView';
import { ToastProvider } from '../components/ui/Toast';
import { ArrowLeft, Home, FlaskConical, BookOpen, Beaker, BarChart3, FileText, Menu, X } from 'lucide-react';

const phases: { key: PedagogicalPhase; label: string; icon: React.ReactNode; description: string }[] = [
  { key: 'exploration', label: 'Exploración', icon: <FlaskConical size={16} />, description: 'Experimenta libremente con los controles' },
  { key: 'hypothesis', label: 'Hipótesis', icon: <BookOpen size={16} />, description: 'Formula predicciones antes de medir' },
  { key: 'experimentation', label: 'Experimentación', icon: <Beaker size={16} />, description: 'Realiza mediciones sistemáticas' },
  { key: 'analysis', label: 'Análisis', icon: <BarChart3 size={16} />, description: 'Interpreta gráficas y calcula pendientes' },
  { key: 'conclusion', label: 'Conclusiones', icon: <FileText size={16} />, description: 'Reflexiona y genera tu reporte' },
];

const MRUPractice: React.FC = () => {
  const { phase, setPhase } = useLabStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPhaseIndex = phases.findIndex(p => p.key === phase);

  return (
    <ToastProvider>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">⚛️</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 leading-tight">
                  Práctica 1: MRU
                </h1>
                <p className="text-xs text-gray-500">
                  Movimiento Rectilíneo Uniforme
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                <Home size={16} />
                Inicio
              </Link>
              <AchievementPanel />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Phase Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center gap-1 py-2 overflow-x-auto">
            {phases.map((p, i) => (
              <button
                key={p.key}
                onClick={() => setPhase(p.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  phase === p.key
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : i <= currentPhaseIndex
                    ? 'text-blue-700 hover:bg-blue-50'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {i < phases.length - 1 && (
                  <span className={`ml-2 text-xs ${phase === p.key ? 'text-blue-200' : 'text-gray-300'}`}>→</span>
                )}
              </button>
            ))}
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-2 space-y-1">
              {phases.map((p, i) => (
                <button
                  key={p.key}
                  onClick={() => { setPhase(p.key); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    phase === p.key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p.icon}
                  <div className="text-left">
                    <span className="block">{p.label}</span>
                    <span className="block text-xs opacity-70">{p.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Phase description banner with progress */}
      <div className="container mx-auto px-4 py-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-600">{phases[currentPhaseIndex].icon}</span>
            <p className="text-sm text-blue-800 flex-1">
              <strong>Fase {currentPhaseIndex + 1}/{phases.length} - {phases[currentPhaseIndex].label}:</strong>{' '}
              {phases[currentPhaseIndex].description}
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-blue-100 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${((currentPhaseIndex + 1) / phases.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 pb-12">
        {/* Phase: Exploration - Full simulator */}
        {phase === 'exploration' && (
          <div className="space-y-6">
            <MRUSimulator />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PositionTimeGraph />
              <VelocityTimeGraph />
            </div>
          </div>
        )}

        {/* Phase: Hypothesis */}
        {phase === 'hypothesis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <HypothesisBuilder />
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Objetivos de Aprendizaje
                </h3>
                <ul className="space-y-2">
                  {[
                    'Comprender que en MRU la velocidad es constante',
                    'Relacionar posición, velocidad y tiempo mediante ecuaciones',
                    'Interpretar gráficas posición-tiempo y velocidad-tiempo',
                    'Recolectar datos experimentales y analizarlos críticamente',
                    'Calcular velocidades a partir de pendientes de gráficas',
                    'Identificar fuentes de error experimental',
                  ].map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-3">📖 ¿Qué es el MRU?</h3>
                <p className="text-sm text-blue-700 mb-3">
                  El <strong>Movimiento Rectilíneo Uniforme (MRU)</strong> es aquel en el que un objeto 
                  se desplaza en línea recta con <strong>velocidad constante</strong>. Esto significa:
                </p>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• La velocidad no cambia (aceleración = 0)</li>
                  <li>• La posición cambia linealmente con el tiempo</li>
                  <li>• La gráfica x vs t es una línea recta</li>
                  <li>• La gráfica v vs t es una línea horizontal</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm font-mono text-center text-blue-800">
                    <strong>Ecuación fundamental:</strong><br/>
                    x(t) = x₀ + v · t
                  </p>
                </div>
              </div>
              <MRUSimulator />
            </div>
          </div>
        )}

        {/* Phase: Experimentation */}
        {phase === 'experimentation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MRUSimulator />
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🧪</span> Experimentos Guiados
                  </h3>
                  <div className="space-y-3">
                    <ExperimentCard
                      number={1}
                      title="Velocidad constante"
                      description="Configura v = 2 m/s y toma 5 mediciones. Verifica que la posición aumenta linealmente."
                      velocity={2}
                    />
                    <ExperimentCard
                      number={2}
                      title="Comparar velocidades"
                      description="Compara v₁ = 2 m/s con v₂ = 4 m/s. ¿Cómo cambia la pendiente?"
                      velocity={4}
                    />
                    <ExperimentCard
                      number={3}
                      title="Velocidad desconocida"
                      description="Toma mediciones y usa la gráfica para determinar la velocidad."
                      velocity={3.5}
                    />
                  </div>
                </div>
                <AchievementPanel />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PositionTimeGraph />
              <VelocityTimeGraph />
            </div>
          </div>
        )}

        {/* Phase: Analysis */}
        {phase === 'analysis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PositionTimeGraph />
                  <VelocityTimeGraph />
                </div>
                <DataAnalysisPanel />
                <ComparisonView />
              </div>
              <div className="space-y-6">
                <GuidedQuestions />
                <AchievementPanel />
              </div>
            </div>
          </div>
        )}

        {/* Phase: Conclusion */}
        {phase === 'conclusion' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ConclusionBuilder />
              <DataAnalysisPanel />
            </div>
            <div className="space-y-6">
              <GuidedQuestions />
              <div className="grid grid-cols-1 gap-6">
                <PositionTimeGraph />
                <VelocityTimeGraph />
              </div>
              <AchievementPanel />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/60 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-xs text-gray-500">
          <p>Laboratorio Virtual de Física General • Práctica 1: MRU</p>
          <p className="mt-1">Diseñado para aprendizaje activo • x(t) = x₀ + v·t</p>
        </div>
      </footer>
    </div>
    </ToastProvider>
  );
};

// Experiment Card Component
const ExperimentCard: React.FC<{ number: number; title: string; description: string; velocity: number }> = ({
  number, title, description, velocity
}) => {
  const { setVelocity, reset, setInitialPosition } = useLabStore();
  
  const handleSetup = () => {
    setVelocity(velocity);
    setInitialPosition(0);
    reset();
  };

  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start gap-2">
        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
          {number}
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          <button
            onClick={handleSetup}
            className="mt-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Configurar (v = {velocity} m/s)
          </button>
        </div>
      </div>
    </div>
  );
};

export default MRUPractice;
