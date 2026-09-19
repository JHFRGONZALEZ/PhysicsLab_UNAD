import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { VisualizationCanvasPendulum } from '../components/pendulum/VisualizationCanvasPendulum';
import { useLabStorePendulum } from '../store/pendulumStore';
import { calculateTheoreticalPeriod, analyzePendulumData } from '../utils/pendulumCalculations';
import { PedagogicalPhasePendulum } from '../types/pendulum.types';
import { ArrowLeft, Home, Play, Pause, RotateCcw, FlaskConical, BookOpen, Beaker, BarChart3, FileText, Menu, X, Plus, Trash2 } from 'lucide-react';

export const PendulumPractice: React.FC = () => {
  const { length, setLength, gravity, setGravity, isRunning, toggleRunning, reset, showAngle, setShowAngle, showTrail, setShowTrail, dataPoints, addDataPoint, removeDataPoint, clearDataPoints, phase, setPhase } = useLabStorePendulum();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hypothesis, setHypothesis] = useState('');
  const [conclusions, setConclusions] = useState('');
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const phases: { key: PedagogicalPhasePendulum; label: string; icon: React.ReactNode; description: string }[] = [
    { key: 'exploration', label: 'Exploración', icon: <FlaskConical size={16} />, description: 'Experimenta con el péndulo' },
    { key: 'hypothesis', label: 'Hipótesis', icon: <BookOpen size={16} />, description: 'Predice cómo cambia el período' },
    { key: 'experimentation', label: 'Experimentación', icon: <Beaker size={16} />, description: 'Mide el período para diferentes longitudes' },
    { key: 'analysis', label: 'Análisis', icon: <BarChart3 size={16} />, description: 'Calcula g experimentalmente' },
    { key: 'conclusion', label: 'Conclusiones', icon: <FileText size={16} />, description: 'Compara con el valor teórico' },
  ];

  const currentPhaseIndex = phases.findIndex(p => p.key === phase);
  const theoreticalPeriod = calculateTheoreticalPeriod(length, gravity);
  const analysis = dataPoints.length >= 2 ? analyzePendulumData(dataPoints, gravity) : null;

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      if (dt > 0 && dt < 0.1) {
        useLabStorePendulum.getState().updateAngle(dt);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">⏰</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 leading-tight">
                  Práctica 5: Péndulo Simple
                </h1>
                <p className="text-xs text-gray-500">
                  Cálculo Experimental de g
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
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : i <= currentPhaseIndex
                    ? 'text-indigo-700 hover:bg-indigo-50'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {i < phases.length - 1 && (
                  <span className={`ml-2 text-xs ${phase === p.key ? 'text-indigo-200' : 'text-gray-300'}`}>→</span>
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
                      ? 'bg-indigo-600 text-white'
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
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-indigo-600">{phases[currentPhaseIndex].icon}</span>
            <p className="text-sm text-indigo-800 flex-1">
              <strong>Fase {currentPhaseIndex + 1}/{phases.length} - {phases[currentPhaseIndex].label}:</strong>{' '}
              {phases[currentPhaseIndex].description}
            </p>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-1.5">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
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
              <VisualizationCanvasPendulum />
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🎛️ Panel de Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Longitud: {(length * 100).toFixed(0)} cm</label>
                    <input type="range" min="0.1" max="1.0" step="0.05" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                    <div className="flex gap-1 mt-2">
                      <button onClick={() => setLength(0.2)} className="text-xs px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded">20cm</button>
                      <button onClick={() => setLength(0.4)} className="text-xs px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded">40cm</button>
                      <button onClick={() => setLength(0.6)} className="text-xs px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded">60cm</button>
                      <button onClick={() => setLength(0.8)} className="text-xs px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded">80cm</button>
                      <button onClick={() => setLength(1.0)} className="text-xs px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded">100cm</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gravedad: {gravity.toFixed(2)} m/s²</label>
                    <input type="range" min="1" max="25" step="0.1" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={toggleRunning} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                    {isRunning ? <><Pause size={18} />Pausar</> : <><Play size={18} />Iniciar</>}
                  </button>
                  <button onClick={reset} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg"><RotateCcw size={18} /></button>
                </div>
                <div className="flex gap-4 mt-3">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showAngle} onChange={(e) => setShowAngle(e.target.checked)} />Mostrar ángulo</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showTrail} onChange={(e) => setShowTrail(e.target.checked)} />Rastro</label>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">📖 Teoría del Péndulo</h3>
                <p className="text-sm text-gray-700 mb-3">El <strong>péndulo simple</strong> oscila con un período que depende de su longitud y la gravedad:</p>
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 mb-3">
                  <p className="text-sm font-mono text-indigo-800 text-center">
                    T = 2π·√(L/g)<br/>
                    T² = (4π²/g)·L<br/>
                    g = 4π²·L/T²
                  </p>
                </div>
                <p className="text-sm text-gray-700">🎯 <strong>Objetivo:</strong> Medir el período para diferentes longitudes y calcular g experimentalmente.</p>
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
                placeholder="Escribe tu hipótesis aquí... (ej: Si aumento la longitud, el período aumentará...)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                rows={6}
              />
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">💡 <strong>Pista:</strong> Piensa en cómo la longitud afecta el período. ¿La masa influye?</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 Objetivos de Aprendizaje</h3>
              <ul className="space-y-2">
                {[
                  'Comprender el movimiento del péndulo simple',
                  'Relacionar longitud con período de oscilación',
                  'Calcular g experimentalmente',
                  'Verificar la ecuación T = 2π·√(L/g)',
                  'Analizar datos con regresión lineal',
                ].map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
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
              <VisualizationCanvasPendulum />
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🎛️ Panel de Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Longitud: {(length * 100).toFixed(0)} cm</label>
                    <input type="range" min="0.1" max="1.0" step="0.05" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                    <div className="flex gap-1 mt-2">
                      <button onClick={() => setLength(0.2)} className="text-xs px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded">20cm</button>
                      <button onClick={() => setLength(0.4)} className="text-xs px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded">40cm</button>
                      <button onClick={() => setLength(0.6)} className="text-xs px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded">60cm</button>
                      <button onClick={() => setLength(0.8)} className="text-xs px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded">80cm</button>
                      <button onClick={() => setLength(1.0)} className="text-xs px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded">100cm</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gravedad: {gravity.toFixed(2)} m/s²</label>
                    <input type="range" min="1" max="25" step="0.1" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={toggleRunning} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                    {isRunning ? <><Pause size={18} />Pausar</> : <><Play size={18} />Iniciar</>}
                  </button>
                  <button onClick={reset} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg"><RotateCcw size={18} /></button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">🧪 Experimentos Guiados</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">1. Longitud de 20 cm</p>
                    <p className="text-xs text-gray-500">Mide el período para L = 0.2 m</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">2. Longitud de 40 cm</p>
                    <p className="text-xs text-gray-500">Mide el período para L = 0.4 m</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">3. Longitud de 60 cm</p>
                    <p className="text-xs text-gray-500">Mide el período para L = 0.6 m</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800">📋 Datos</h3>
                  <div className="flex gap-2">
                    <button onClick={() => addDataPoint()} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm"><Plus size={16} />Medir</button>
                    <button onClick={clearDataPoints} disabled={dataPoints.length === 0} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm disabled:opacity-50"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-2 py-2 text-left">#</th>
                        <th className="px-2 py-2 text-left">L (m)</th>
                        <th className="px-2 py-2 text-left">T (s)</th>
                        <th className="px-2 py-2 text-left">T² (s²)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataPoints.length === 0 ? (
                        <tr><td colSpan={4} className="px-2 py-6 text-center text-gray-400 italic">Presiona "Medir"</td></tr>
                      ) : (
                        dataPoints.map((point, index) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="px-2 py-2">{index + 1}</td>
                            <td className="px-2 py-2 font-mono">{point.length.toFixed(2)}</td>
                            <td className="px-2 py-2 font-mono">{point.period.toFixed(3)}</td>
                            <td className="px-2 py-2 font-mono">{point.periodSquared.toFixed(3)}</td>
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
                    <div className="bg-indigo-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-indigo-600 font-medium">g Teórico</p>
                      <p className="text-xl font-bold text-indigo-800 font-mono">{analysis.theoreticalGravity.toFixed(2)}</p>
                      <p className="text-xs text-indigo-600">m/s²</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-blue-600 font-medium">g Experimental</p>
                      <p className="text-xl font-bold text-blue-800 font-mono">{analysis.experimentalGravity.toFixed(2)}</p>
                      <p className="text-xs text-blue-600">m/s²</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700">Error porcentual: <span className="font-bold text-yellow-700">{analysis.percentError.toFixed(2)}%</span></p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Ecuación de ajuste:</p>
                    <p className="text-sm font-mono font-bold text-gray-800">{analysis.equation}</p>
                    <p className="text-xs text-gray-600 mt-2">R² = {analysis.rSquared.toFixed(4)}</p>
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
                  <p className="text-sm font-medium text-gray-800">1. ¿Cómo cambia el período con la longitud?</p>
                  <p className="text-xs text-gray-500 mt-1">¿Es proporcional a L o a √L?</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">2. ¿Qué valor de g obtuviste experimentalmente?</p>
                  <p className="text-xs text-gray-500 mt-1">Compara con el valor teórico (9.81 m/s²)</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">3. ¿La gráfica T² vs L es una línea recta?</p>
                  <p className="text-xs text-gray-500 mt-1">¿Qué representa la pendiente?</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                rows={8}
              />
              <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-xs text-indigo-800">💡 <strong>Reflexiona:</strong> ¿Se cumplió tu hipótesis? ¿Qué aprendiste sobre el péndulo simple?</p>
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
                    <p>Gravedad teórica: <strong>9.81 m/s²</strong></p>
                    <p>Gravedad experimental: <strong>{analysis.experimentalGravity.toFixed(2)} m/s²</strong></p>
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
          <p>Laboratorio Virtual de Física General • Práctica 5: Péndulo Simple</p>
          <p className="mt-1">Diseñado para aprendizaje activo</p>
        </div>
      </footer>
    </div>
  );
};

export default PendulumPractice;
