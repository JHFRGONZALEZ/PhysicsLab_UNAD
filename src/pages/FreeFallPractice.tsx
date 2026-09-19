import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { VisualizationCanvasFreeFall } from '../components/freefall/VisualizationCanvasFreeFall';
import { ControlPanelFreeFall } from '../components/freefall/ControlPanelFreeFall';
import { useLabStoreFreeFall } from '../store/freefallStore';
import { analyzeDataFreeFall } from '../utils/freefallCalculations';
import { PedagogicalPhaseFreeFall } from '../types/freefall.types';
import { ArrowLeft, Home, FlaskConical, BookOpen, Beaker, BarChart3, FileText, Menu, X, Plus, Trash2 } from 'lucide-react';

export const FreeFallPractice: React.FC = () => {
  const { 
    phase, setPhase,
    gravity, initialHeight,
    isRunning, toggleRunning, reset, hasLanded,
    dataPoints, addDataPoint, removeDataPoint, clearDataPoints,
    time, height, velocity
  } = useLabStoreFreeFall();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hypothesis, setHypothesis] = useState('');
  const [conclusions, setConclusions] = useState('');
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const phases: { key: PedagogicalPhaseFreeFall; label: string; icon: React.ReactNode; description: string }[] = [
    { key: 'exploration', label: 'Exploración', icon: <FlaskConical size={16} />, description: 'Experimenta con la gravedad y la altura' },
    { key: 'hypothesis', label: 'Hipótesis', icon: <BookOpen size={16} />, description: 'Predice el tiempo de caída' },
    { key: 'experimentation', label: 'Experimentación', icon: <Beaker size={16} />, description: 'Mide tiempos y velocidades' },
    { key: 'analysis', label: 'Análisis', icon: <BarChart3 size={16} />, description: 'Calcula la gravedad experimental' },
    { key: 'conclusion', label: 'Conclusiones', icon: <FileText size={16} />, description: 'Compara con el valor teórico' },
  ];

  const currentPhaseIndex = phases.findIndex(p => p.key === phase);
  const analysis = dataPoints.length >= 2 ? analyzeDataFreeFall(dataPoints, gravity, initialHeight) : null;

  // Animación
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      if (dt > 0 && dt < 0.1) {
        useLabStoreFreeFall.getState().updatePosition(dt);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🍎</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 leading-tight">
                  Práctica 3: Caída Libre
                </h1>
                <p className="text-xs text-gray-500">
                  Movimiento bajo la influencia de la gravedad
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
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                    : i <= currentPhaseIndex
                    ? 'text-orange-700 hover:bg-orange-50'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {i < phases.length - 1 && (
                  <span className={`ml-2 text-xs ${phase === p.key ? 'text-orange-200' : 'text-gray-300'}`}>→</span>
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
                      ? 'bg-orange-600 text-white'
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
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-orange-600">{phases[currentPhaseIndex].icon}</span>
            <p className="text-sm text-orange-800 flex-1">
              <strong>Fase {currentPhaseIndex + 1}/{phases.length} - {phases[currentPhaseIndex].label}:</strong>{' '}
              {phases[currentPhaseIndex].description}
            </p>
          </div>
          <div className="w-full bg-orange-100 rounded-full h-1.5">
            <div
              className="bg-orange-600 h-1.5 rounded-full transition-all duration-500"
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
              <VisualizationCanvasFreeFall />
              <ControlPanelFreeFall />
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📖</span> ¿Qué es la Caída Libre?
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  La <strong>caída libre</strong> es el movimiento de un objeto bajo la influencia exclusiva de la <strong>gravedad</strong>, 
                  sin resistencia del aire. Esto significa:
                </p>
                <ul className="space-y-1 text-sm text-gray-700 mb-3">
                  <li>• La aceleración es constante (g ≈ 9.81 m/s²)</li>
                  <li>• La velocidad aumenta uniformemente</li>
                  <li>• Todos los objetos caen igual (sin aire)</li>
                  <li>• La gráfica y vs t es una parábola invertida</li>
                </ul>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-xs text-orange-800 font-medium mb-1">Ecuaciones fundamentales:</p>
                  <p className="text-sm font-mono text-orange-700">
                    y(t) = y₀ - ½·g·t²<br/>
                    v(t) = -g·t<br/>
                    t<sub>caída</sub> = √(2·y₀/g)
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
                <h3 className="text-lg font-bold text-orange-800 mb-3">🪐 Gravedad en el Sistema Solar</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>🌙 Luna</span>
                    <span className="font-mono">1.62 m/s²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🔴 Marte</span>
                    <span className="font-mono">3.72 m/s²</span>
                  </div>
                  <div className="flex justify-between font-bold text-orange-800">
                    <span>🌍 Tierra</span>
                    <span className="font-mono">9.81 m/s²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🪐 Júpiter</span>
                    <span className="font-mono">24.79 m/s²</span>
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
                placeholder="Escribe tu hipótesis aquí... (ej: Si aumento la altura, el tiempo de caída será mayor...)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                rows={6}
              />
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">💡 <strong>Pista:</strong> Piensa en cómo la altura y la gravedad afectan el tiempo de caída. ¿La masa del objeto influye?</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 Objetivos de Aprendizaje</h3>
              <ul className="space-y-2">
                {[
                  'Comprender el concepto de gravedad',
                  'Medir el tiempo de caída',
                  'Calcular g experimentalmente',
                  'Verificar que todos los objetos caen igual',
                  'Comparar gravedad en diferentes planetas',
                ].map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
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
              <VisualizationCanvasFreeFall />
              <ControlPanelFreeFall />
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">🧪 Experimentos Guiados</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">1. Altura de 50 m</p>
                    <p className="text-xs text-gray-500">Mide el tiempo de caída desde 50 m</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">2. Altura de 100 m</p>
                    <p className="text-xs text-gray-500">Mide el tiempo de caída desde 100 m</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">3. Gravedad de la Luna</p>
                    <p className="text-xs text-gray-500">Cambia g a 1.62 m/s² y compara</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800">📋 Datos</h3>
                  <div className="flex gap-2">
                    <button onClick={() => addDataPoint()} className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white rounded-lg text-sm"><Plus size={16} />Medir</button>
                    <button onClick={clearDataPoints} disabled={dataPoints.length === 0} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm disabled:opacity-50"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-2 py-2 text-left">#</th>
                        <th className="px-2 py-2 text-left">t (s)</th>
                        <th className="px-2 py-2 text-left">y (m)</th>
                        <th className="px-2 py-2 text-left">v (m/s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataPoints.length === 0 ? (
                        <tr><td colSpan={4} className="px-2 py-6 text-center text-gray-400 italic">Presiona "Medir"</td></tr>
                      ) : (
                        dataPoints.map((point, index) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="px-2 py-2">{index + 1}</td>
                            <td className="px-2 py-2 font-mono">{point.time.toFixed(2)}</td>
                            <td className="px-2 py-2 font-mono">{point.height.toFixed(2)}</td>
                            <td className="px-2 py-2 font-mono">{point.velocity.toFixed(2)}</td>
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
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-orange-600 font-medium">g Teórico</p>
                      <p className="text-xl font-bold text-orange-800 font-mono">{analysis.theoreticalGravity.toFixed(2)}</p>
                      <p className="text-xs text-orange-600">m/s²</p>
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-green-600 font-medium">Tiempo de caída</p>
                      <p className="text-xl font-bold text-green-800 font-mono">{analysis.fallTime.toFixed(2)}</p>
                      <p className="text-xs text-green-600">segundos</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-purple-600 font-medium">Velocidad final</p>
                      <p className="text-xl font-bold text-purple-800 font-mono">{analysis.maxVelocity.toFixed(2)}</p>
                      <p className="text-xs text-purple-600">m/s</p>
                    </div>
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
                  <p className="text-sm font-medium text-gray-800">1. ¿Cómo cambia el tiempo de caída con la altura?</p>
                  <p className="text-xs text-gray-500 mt-1">¿Es proporcional a √h o a h?</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">2. ¿Qué valor de g obtuviste experimentalmente?</p>
                  <p className="text-xs text-gray-500 mt-1">Compara con el valor teórico (9.81 m/s²)</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">3. ¿La masa del objeto afecta el tiempo de caída?</p>
                  <p className="text-xs text-gray-500 mt-1">¿Por qué todos los objetos caen igual?</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                rows={8}
              />
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-800">💡 <strong>Reflexiona:</strong> ¿Se cumplió tu hipótesis? ¿Qué aprendiste sobre la caída libre?</p>
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
                    <p>Tiempo de caída: <strong>{analysis.fallTime.toFixed(2)} s</strong></p>
                    <p>Velocidad final: <strong>{analysis.maxVelocity.toFixed(2)} m/s</strong></p>
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
          <p>Laboratorio Virtual de Física General • Práctica 3: Caída Libre</p>
          <p className="mt-1">Diseñado para aprendizaje activo • y(t) = y₀ - ½·g·t²</p>
        </div>
      </footer>
    </div>
  );
};

export default FreeFallPractice;
