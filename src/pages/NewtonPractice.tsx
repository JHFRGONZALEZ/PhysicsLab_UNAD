import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { VisualizationCanvasNewton } from '../components/newton/VisualizationCanvasNewton';
import { useLabStoreNewton } from '../store/newtonStore';
import { analyzeNewtonData } from '../utils/newtonCalculations';
import { PedagogicalPhaseNewton } from '../types/newton.types';
import { ArrowLeft, Home, Play, Pause, RotateCcw, FlaskConical, BookOpen, Beaker, BarChart3, FileText, Menu, X, Plus, Trash2 } from 'lucide-react';

export const NewtonPractice: React.FC = () => {
  const { force, setForce, mass, setMass, friction, setFriction, isRunning, toggleRunning, reset, showForceVector, setShowForceVector, showAccelerationVector, setShowAccelerationVector, showFriction, setShowFriction, dataPoints, addDataPoint, removeDataPoint, clearDataPoints, phase, setPhase } = useLabStoreNewton();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hypothesis, setHypothesis] = useState('');
  const [conclusions, setConclusions] = useState('');
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const phases: { key: PedagogicalPhaseNewton; label: string; icon: React.ReactNode; description: string }[] = [
    { key: 'exploration', label: 'Exploración', icon: <FlaskConical size={16} />, description: 'Experimenta con fuerzas y movimiento' },
    { key: 'hypothesis', label: 'Hipótesis', icon: <BookOpen size={16} />, description: 'Predice la relación F = m·a' },
    { key: 'experimentation', label: 'Experimentación', icon: <Beaker size={16} />, description: 'Mide la aceleración para diferentes fuerzas' },
    { key: 'analysis', label: 'Análisis', icon: <BarChart3 size={16} />, description: 'Verifica la segunda ley de Newton' },
    { key: 'conclusion', label: 'Conclusiones', icon: <FileText size={16} />, description: 'Reflexiona sobre las leyes de Newton' },
  ];

  const currentPhaseIndex = phases.findIndex(p => p.key === phase);
  const analysis = dataPoints.length >= 2 ? analyzeNewtonData(dataPoints, mass) : null;

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      if (dt > 0 && dt < 0.1) {
        useLabStoreNewton.getState().updateMotion(dt);
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    if (isRunning) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isRunning]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-red-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">⚖️</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 leading-tight">
                  Práctica 6: Leyes de Newton
                </h1>
                <p className="text-xs text-gray-500">
                  Fuerza, Masa y Aceleración
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
                    ? 'bg-red-600 text-white shadow-md shadow-red-200'
                    : i <= currentPhaseIndex
                    ? 'text-red-700 hover:bg-red-50'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {i < phases.length - 1 && (
                  <span className={`ml-2 text-xs ${phase === p.key ? 'text-red-200' : 'text-gray-300'}`}>→</span>
                )}
              </button>
            ))}
          </div>
          
          {mobileMenuOpen && (
            <div className="md:hidden py-2 space-y-1">
              {phases.map((p) => (
                <button
                  key={p.key}
                  onClick={() => { setPhase(p.key); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    phase === p.key
                      ? 'bg-red-600 text-white'
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
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-600">{phases[currentPhaseIndex].icon}</span>
            <p className="text-sm text-red-800 flex-1">
              <strong>Fase {currentPhaseIndex + 1}/{phases.length} - {phases[currentPhaseIndex].label}:</strong>{' '}
              {phases[currentPhaseIndex].description}
            </p>
          </div>
          <div className="w-full bg-red-100 rounded-full h-1.5">
            <div
              className="bg-red-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${((currentPhaseIndex + 1) / phases.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 pb-12">
        {/* Phase: Exploration */}
        {phase === 'exploration' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <VisualizationCanvasNewton />
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🎛️ Panel de Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fuerza: {force} N</label>
                    <input type="range" min="0" max="50" step="1" value={force} onChange={(e) => setForce(parseFloat(e.target.value))} className="w-full accent-red-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Masa: {mass} kg</label>
                    <input type="range" min="0.5" max="10" step="0.5" value={mass} onChange={(e) => setMass(parseFloat(e.target.value))} className="w-full accent-red-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fricción (μ): {friction.toFixed(2)}</label>
                    <input type="range" min="0" max="0.5" step="0.05" value={friction} onChange={(e) => setFriction(parseFloat(e.target.value))} className="w-full accent-red-600" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={toggleRunning} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
                    {isRunning ? <><Pause size={18} />Pausar</> : <><Play size={18} />Aplicar Fuerza</>}
                  </button>
                  <button onClick={reset} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"><RotateCcw size={18} /></button>
                </div>
                <div className="flex gap-4 mt-3">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showForceVector} onChange={(e) => setShowForceVector(e.target.checked)} />Fuerza</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showAccelerationVector} onChange={(e) => setShowAccelerationVector(e.target.checked)} />Aceleración</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showFriction} onChange={(e) => setShowFriction(e.target.checked)} />Fricción</label>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">📖 Las 3 Leyes de Newton</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="font-bold text-red-800">1ª Ley (Inercia)</p>
                    <p className="text-red-700">Un objeto permanece en reposo o MRU a menos que actúe una fuerza neta.</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="font-bold text-red-800">2ª Ley (F = m·a)</p>
                    <p className="text-red-700">La aceleración es proporcional a la fuerza neta e inversamente proporcional a la masa.</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="font-bold text-red-800">3ª Ley (Acción-Reacción)</p>
                    <p className="text-red-700">Toda fuerza tiene una fuerza de reacción igual y opuesta.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase: Hypothesis */}
        {phase === 'hypothesis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Planteamiento de Hipótesis</h3>
              <p className="text-sm text-gray-600 mb-3">Antes de experimentar, escribe tu predicción. ¿Qué crees que pasará?</p>
              <textarea
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                placeholder="Escribe tu hipótesis aquí... (ej: Si duplico la fuerza, la aceleración se duplica...)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                rows={6}
              />
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">💡 <strong>Pista:</strong> Piensa en cómo la fuerza y la masa afectan la aceleración. ¿Son proporcionales o inversamente proporcionales?</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 Objetivos de Aprendizaje</h3>
              <ul className="space-y-2">
                {[
                  'Comprender la relación F = m·a',
                  'Verificar experimentalmente la segunda ley',
                  'Analizar el efecto de la fricción',
                  'Graficar F vs a para encontrar la masa',
                  'Interpretar diagramas de cuerpo libre',
                ].map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Phase: Experimentation */}
        {phase === 'experimentation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <VisualizationCanvasNewton />
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🎛️ Panel de Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fuerza: {force} N</label>
                    <input type="range" min="0" max="50" step="1" value={force} onChange={(e) => setForce(parseFloat(e.target.value))} className="w-full accent-red-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Masa: {mass} kg</label>
                    <input type="range" min="0.5" max="10" step="0.5" value={mass} onChange={(e) => setMass(parseFloat(e.target.value))} className="w-full accent-red-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fricción (μ): {friction.toFixed(2)}</label>
                    <input type="range" min="0" max="0.5" step="0.05" value={friction} onChange={(e) => setFriction(parseFloat(e.target.value))} className="w-full accent-red-600" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={toggleRunning} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
                    {isRunning ? <><Pause size={18} />Pausar</> : <><Play size={18} />Aplicar Fuerza</>}
                  </button>
                  <button onClick={reset} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"><RotateCcw size={18} /></button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">🧪 Experimentos Guiados</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">1. Fuerza de 10 N</p>
                    <p className="text-xs text-gray-500">Mide la aceleración con F = 10 N</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">2. Fuerza de 20 N</p>
                    <p className="text-xs text-gray-500">Mide la aceleración con F = 20 N</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">3. Fuerza de 30 N</p>
                    <p className="text-xs text-gray-500">Mide la aceleración con F = 30 N</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800">📋 Datos</h3>
                  <div className="flex gap-2">
                    <button onClick={() => addDataPoint()} className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm"><Plus size={16} />Medir</button>
                    <button onClick={clearDataPoints} disabled={dataPoints.length === 0} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm disabled:opacity-50"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-2 py-2 text-left">#</th>
                        <th className="px-2 py-2 text-left">F (N)</th>
                        <th className="px-2 py-2 text-left">m (kg)</th>
                        <th className="px-2 py-2 text-left">a (m/s²)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataPoints.length === 0 ? (
                        <tr><td colSpan={4} className="px-2 py-6 text-center text-gray-400 italic">Presiona "Medir"</td></tr>
                      ) : (
                        dataPoints.map((point, index) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="px-2 py-2">{index + 1}</td>
                            <td className="px-2 py-2 font-mono">{point.force.toFixed(1)}</td>
                            <td className="px-2 py-2 font-mono">{point.mass.toFixed(1)}</td>
                            <td className="px-2 py-2 font-mono">{point.acceleration.toFixed(3)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase: Analysis */}
        {phase === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🔬 Análisis de Resultados</h3>
              {analysis ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-red-600 font-medium">Masa Teórica</p>
                      <p className="text-xl font-bold text-red-800 font-mono">{analysis.theoreticalMass.toFixed(1)}</p>
                      <p className="text-xs text-red-600">kg</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-blue-600 font-medium">Masa Experimental</p>
                      <p className="text-xl font-bold text-blue-800 font-mono">{analysis.experimentalMass.toFixed(2)}</p>
                      <p className="text-xs text-blue-600">kg</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700">Error porcentual: <span className="font-bold text-yellow-700">{analysis.percentError.toFixed(2)}%</span></p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Ecuación de ajuste (F vs a):</p>
                    <p className="text-sm font-mono font-bold text-gray-800">{analysis.equation}</p>
                    <p className="text-xs text-gray-600 mt-2">R² = {analysis.rSquared.toFixed(4)}</p>
                    <p className="text-xs text-gray-600 mt-1">Pendiente = masa experimental</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Necesitas al menos 2 mediciones para el análisis</p>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">❓ Preguntas Guía</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">1. ¿La gráfica F vs a es una línea recta?</p>
                  <p className="text-xs text-gray-500 mt-1">¿Qué representa la pendiente?</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">2. ¿Se cumple F = m·a?</p>
                  <p className="text-xs text-gray-500 mt-1">Compara tus resultados con la teoría</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">3. ¿Cómo afecta la fricción al movimiento?</p>
                  <p className="text-xs text-gray-500 mt-1">¿Qué pasa si la fuerza es menor que la fricción?</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase: Conclusion */}
        {phase === 'conclusion' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📝 Conclusiones</h3>
              <textarea
                value={conclusions}
                onChange={(e) => setConclusions(e.target.value)}
                placeholder="Escribe tus conclusiones aquí..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                rows={8}
              />
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-800">💡 <strong>Reflexiona:</strong> ¿Se cumplió tu hipótesis? ¿Qué aprendiste sobre las leyes de Newton?</p>
              </div>
            </div>
            <div className="space-y-4">
              {hypothesis && (
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">💭 Tu Hipótesis Inicial</h3>
                  <p className="text-sm text-gray-700">{hypothesis}</p>
                </div>
              )}
              {analysis && (
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Resumen de Resultados</h3>
                  <div className="space-y-2 text-sm">
                    <p>Masa configurada: <strong>{analysis.theoreticalMass.toFixed(1)} kg</strong></p>
                    <p>Masa experimental: <strong>{analysis.experimentalMass.toFixed(2)} kg</strong></p>
                    <p>Error porcentual: <strong>{analysis.percentError.toFixed(2)}%</strong></p>
                    <p>Coeficiente R²: <strong>{analysis.rSquared.toFixed(4)}</strong></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/60 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-xs text-gray-500">
          <p>Laboratorio Virtual de Física General • Práctica 6: Leyes de Newton</p>
          <p className="mt-1">Diseñado para aprendizaje activo</p>
        </div>
      </footer>
    </div>
  );
};

export default NewtonPractice;
