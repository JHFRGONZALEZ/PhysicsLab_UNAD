import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { VisualizationCanvasMRUV } from '../components/mruv/VisualizationCanvasMRUV';
import { ControlPanelMRUV } from '../components/mruv/ControlPanelMRUV';
import { useLabStoreMRUV } from '../store/mruvStore';
import { useSimulationMRUV } from '../hooks/useSimulationMRUV';
import { ArrowLeft, Home, FlaskConical, BookOpen, Beaker, BarChart3, FileText, Menu, X } from 'lucide-react';
import { PedagogicalPhaseMRUV } from '../types/mruv.types';

const phases: { key: PedagogicalPhaseMRUV; label: string; icon: React.ReactNode; description: string }[] = [
  { key: 'exploration', label: 'Exploración', icon: <FlaskConical size={16} />, description: 'Experimenta libremente con la aceleración' },
  { key: 'hypothesis', label: 'Hipótesis', icon: <BookOpen size={16} />, description: 'Formula predicciones sobre el movimiento' },
  { key: 'experimentation', label: 'Experimentación', icon: <Beaker size={16} />, description: 'Realiza mediciones sistemáticas' },
  { key: 'analysis', label: 'Análisis', icon: <BarChart3 size={16} />, description: 'Interpreta gráficas y calcula aceleración' },
  { key: 'conclusion', label: 'Conclusiones', icon: <FileText size={16} />, description: 'Reflexiona y genera tu reporte' },
];

export const MRUVPractice: React.FC = () => {
  const { phase, setPhase } = useLabStoreMRUV();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useSimulationMRUV();

  const currentPhaseIndex = phases.findIndex(p => p.key === phase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🚀</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 leading-tight">
                  Práctica 2: MRUV
                </h1>
                <p className="text-xs text-gray-500">
                  Movimiento Rectilíneo Uniformemente Variado
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              <Home size={16} />
              Inicio
            </Link>
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
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : i <= currentPhaseIndex
                    ? 'text-purple-700 hover:bg-purple-50'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {i < phases.length - 1 && (
                  <span className={`ml-2 text-xs ${phase === p.key ? 'text-purple-200' : 'text-gray-300'}`}>→</span>
                )}
              </button>
            ))}
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-2 space-y-1">
              {phases.map((p) => (
                <button
                  key={p.key}
                  onClick={() => { setPhase(p.key); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    phase === p.key
                      ? 'bg-purple-600 text-white'
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

      {/* Phase description banner */}
      <div className="container mx-auto px-4 py-3">
        <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-purple-600">{phases[currentPhaseIndex].icon}</span>
            <p className="text-sm text-purple-800 flex-1">
              <strong>Fase {currentPhaseIndex + 1}/{phases.length} - {phases[currentPhaseIndex].label}:</strong>{' '}
              {phases[currentPhaseIndex].description}
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-purple-100 rounded-full h-1.5">
            <div
              className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${((currentPhaseIndex + 1) / phases.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 pb-12">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🚀</span> Simulador MRUV
                </h2>
                <VisualizationCanvasMRUV />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ControlPanelMRUV />
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📖</span> ¿Qué es el MRUV?
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    El <strong>Movimiento Rectilíneo Uniformemente Variado (MRUV)</strong> es aquel en el que un objeto 
                    se desplaza en línea recta con <strong>aceleración constante</strong>. Esto significa:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-700 mb-3">
                    <li>• La velocidad cambia uniformemente</li>
                    <li>• La aceleración es constante</li>
                    <li>• La gráfica x vs t es una parábola</li>
                    <li>• La gráfica v vs t es una línea recta</li>
                  </ul>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-800 font-medium mb-1">Ecuaciones fundamentales:</p>
                    <p className="text-sm font-mono text-purple-700">
                      x(t) = x₀ + v₀·t + ½·a·t²<br/>
                      v(t) = v₀ + a·t
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Objetivos
                </h3>
                <ul className="space-y-2">
                  {[
                    'Comprender el concepto de aceleración',
                    'Relacionar posición, velocidad y aceleración',
                    'Interpretar gráficas x-t, v-t y a-t',
                    'Calcular aceleración a partir de datos',
                    'Verificar las ecuaciones cinemáticas',
                  ].map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-xs text-gray-500">
          <p>Laboratorio Virtual de Física General • Práctica 2: MRUV</p>
          <p className="mt-1">Diseñado para aprendizaje activo • x(t) = x₀ + v₀·t + ½·a·t²</p>
        </div>
      </footer>
    </div>
  );
};

export default MRUVPractice;
