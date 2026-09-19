import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { VisualizationCanvasProjectile } from '../components/projectile/VisualizationCanvasProjectile';
import { useLabStoreProjectile } from '../store/projectileStore';
import { analyzeProjectileMotion } from '../utils/projectileCalculations';
import { PedagogicalPhaseProjectile } from '../types/projectile.types';
import { ArrowLeft, Home, Play, Pause, RotateCcw, FlaskConical, BookOpen, Beaker, BarChart3, FileText, Menu, X, Plus, Trash2 } from 'lucide-react';

export const ProjectilePractice: React.FC = () => {
  const { initialVelocity, setInitialVelocity, angle, setAngle, gravity, setGravity, isRunning, toggleRunning, reset, hasLanded, showVelocityVector, setShowVelocityVector, showTrail, setShowTrail, dataPoints, addDataPoint, removeDataPoint, clearDataPoints, phase, setPhase } = useLabStoreProjectile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hypothesis, setHypothesis] = useState('');
  const [conclusions, setConclusions] = useState('');
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const phases: { key: PedagogicalPhaseProjectile; label: string; icon: React.ReactNode; description: string }[] = [
    { key: 'exploration', label: 'Exploración', icon: <FlaskConical size={16} />, description: 'Experimenta libremente con los controles' },
    { key: 'hypothesis', label: 'Hipótesis', icon: <BookOpen size={16} />, description: 'Formula predicciones sobre el movimiento' },
    { key: 'experimentation', label: 'Experimentación', icon: <Beaker size={16} />, description: 'Realiza mediciones sistemáticas' },
    { key: 'analysis', label: 'Análisis', icon: <BarChart3 size={16} />, description: 'Interpreta los resultados' },
    { key: 'conclusion', label: 'Conclusiones', icon: <FileText size={16} />, description: 'Reflexiona y genera tu reporte' },
  ];

  const currentPhaseIndex = phases.findIndex(p => p.key === phase);
  const analysis = dataPoints.length >= 2 ? analyzeProjectileMotion(initialVelocity, angle, gravity, dataPoints) : null;

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      if (dt > 0 && dt < 0.1) {
        useLabStoreProjectile.getState().updatePosition(dt);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🎯</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 leading-tight">
                  Práctica 4: Tiro Parabólico
                </h1>
                <p className="text-xs text-gray-500">
                  Movimiento de Proyectiles
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
                    ? 'bg-green-600 text-white shadow-md shadow-green-200'
                    : i <= currentPhaseIndex
                    ? 'text-green-700 hover:bg-green-50'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {i < phases.length - 1 && (
                  <span className={`ml-2 text-xs ${phase === p.key ? 'text-green-200' : 'text-gray-300'}`}>→</span>
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
                      ? 'bg-green-600 text-white'
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
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-600">{phases[currentPhaseIndex].icon}</span>
            <p className="text-sm text-green-800 flex-1">
              <strong>Fase {currentPhaseIndex + 1}/{phases.length} - {phases[currentPhaseIndex].label}:</strong>{' '}
              {phases[currentPhaseIndex].description}
            </p>
          </div>
          <div className="w-full bg-green-100 rounded-full h-1.5">
            <div
              className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
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
              <VisualizationCanvasProjectile />
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🎛️ Panel de Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Velocidad inicial: {initialVelocity} m/s</label>
                    <input type="range" min="5" max="50" step="1" value={initialVelocity} onChange={(e) => setInitialVelocity(parseFloat(e.target.value))} className="w-full accent-green-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Ángulo: {angle}°</label>
                    <input type="range" min="0" max="90" step="1" value={angle} onChange={(e) => setAngle(parseFloat(e.target.value))} className="w-full accent-green-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gravedad: {gravity} m/s²</label>
                    <input type="range" min="1" max="25" step="0.1" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} className="w-full accent-green-600" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={toggleRunning} disabled={hasLanded} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
                    {isRunning ? <><Pause size={18} />Pausar</> : <><Play size={18} />Lanzar</>}
                  </button>
                  <button onClick={reset} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg"><RotateCcw size={18} /></button>
                </div>
                <div className="flex gap-4 mt-3">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showVelocityVector} onChange={(e) => setShowVelocityVector(e.target.checked)} />Vector velocidad</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showTrail} onChange={(e) => setShowTrail(e.target.checked)} />Rastro</label>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">📖 ¿Qué es el Tiro Parabólico?</h3>
                <p className="text-sm text-gray-700 mb-3">El <strong>tiro parabólico</strong> es el movimiento de un objeto lanzado con una velocidad inicial en un ángulo, bajo la influencia de la gravedad.</p>
                <ul className="space-y-1 text-sm text-gray-700 mb-3">
                  <li>• Componente horizontal: MRU (velocidad constante)</li>
                  <li>• Componente vertical: Caída libre</li>
                  <li>• Trayectoria: Parábola</li>
                  <li>• Ángulo óptimo: 45° (máximo alcance)</li>
                </ul>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-800 font-medium mb-1">Ecuaciones:</p>
                  <p className="text-sm font-mono text-green-700">
                    x(t) = v₀·cos(θ)·t<br/>
                    y(t) = v₀·sin(θ)·t - ½·g·t²<br/>
                    R = v₀²·sin(2θ)/g
                  </p>
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
                placeholder="Escribe tu hipótesis aquí... (ej: Si aumento el ángulo a 45°, el alcance será máximo...)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                rows={6}
              />
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">💡 <strong>Pista:</strong> Piensa en cómo el ángulo afecta el alcance y la altura máxima. ¿Qué ángulo dará el máximo alcance?</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 Objetivos de Aprendizaje</h3>
              <ul className="space-y-2">
                {[
                  'Comprender el movimiento de proyectiles',
                  'Relacionar ángulo con alcance y altura',
                  'Encontrar el ángulo óptimo para máximo alcance',
                  'Verificar las ecuaciones cinemáticas',
                  'Analizar componentes horizontal y vertical',
                ].map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
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
              <VisualizationCanvasProjectile />
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🎛️ Panel de Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Velocidad: {initialVelocity} m/s</label>
                    <input type="range" min="5" max="50" step="1" value={initialVelocity} onChange={(e) => setInitialVelocity(parseFloat(e.target.value))} className="w-full accent-green-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Ángulo: {angle}°</label>
                    <input type="range" min="0" max="90" step="1" value={angle} onChange={(e) => setAngle(parseFloat(e.target.value))} className="w-full accent-green-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gravedad: {gravity} m/s²</label>
                    <input type="range" min="1" max="25" step="0.1" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} className="w-full accent-green-600" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={toggleRunning} disabled={hasLanded} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
                    {isRunning ? <><Pause size={18} />Pausar</> : <><Play size={18} />Lanzar</>}
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
                    <p className="text-sm font-medium text-gray-800">1. Ángulo de 30°</p>
                    <p className="text-xs text-gray-500">Lanza con ángulo 30° y mide el alcance</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">2. Ángulo de 45°</p>
                    <p className="text-xs text-gray-500">Lanza con ángulo 45° y compara</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">3. Ángulo de 60°</p>
                    <p className="text-xs text-gray-500">Lanza con ángulo 60° y analiza</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800">📋 Datos</h3>
                  <div className="flex gap-2">
                    <button onClick={() => addDataPoint()} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm"><Plus size={16} />Medir</button>
                    <button onClick={clearDataPoints} disabled={dataPoints.length === 0} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm disabled:opacity-50"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-2 py-2 text-left">#</th>
                        <th className="px-2 py-2 text-left">θ</th>
                        <th className="px-2 py-2 text-left">Alcance</th>
                        <th className="px-2 py-2 text-left">Altura</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataPoints.length === 0 ? (
                        <tr><td colSpan={4} className="px-2 py-6 text-center text-gray-400 italic">Presiona "Medir"</td></tr>
                      ) : (
                        dataPoints.map((point, index) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="px-2 py-2">{index + 1}</td>
                            <td className="px-2 py-2 font-mono">{angle}°</td>
                            <td className="px-2 py-2 font-mono">{point.x.toFixed(1)}m</td>
                            <td className="px-2 py-2 font-mono">{point.y.toFixed(1)}m</td>
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
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-green-600 font-medium">Alcance Teórico</p>
                      <p className="text-xl font-bold text-green-800 font-mono">{analysis.theoreticalRange.toFixed(2)}</p>
                      <p className="text-xs text-green-600">metros</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-blue-600 font-medium">Alcance Experimental</p>
                      <p className="text-xl font-bold text-blue-800 font-mono">{analysis.maxRange.toFixed(2)}</p>
                      <p className="text-xs text-blue-600">metros</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700">Error en alcance: <span className="font-bold text-yellow-700">{analysis.percentErrorRange.toFixed(2)}%</span></p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-purple-600 font-medium">Altura Teórica</p>
                      <p className="text-xl font-bold text-purple-800 font-mono">{analysis.theoreticalHeight.toFixed(2)}</p>
                      <p className="text-xs text-purple-600">metros</p>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-pink-600 font-medium">Altura Experimental</p>
                      <p className="text-xl font-bold text-pink-800 font-mono">{analysis.maxHeight.toFixed(2)}</p>
                      <p className="text-xs text-pink-600">metros</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700">Error en altura: <span className="font-bold text-yellow-700">{analysis.percentErrorHeight.toFixed(2)}%</span></p>
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
                  <p className="text-sm font-medium text-gray-800">1. ¿Qué ángulo dio el máximo alcance?</p>
                  <p className="text-xs text-gray-500 mt-1">Compara tus resultados con la teoría (45°)</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">2. ¿Cómo cambia la altura máxima con el ángulo?</p>
                  <p className="text-xs text-gray-500 mt-1">Observa la relación entre ángulo y altura</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">3. ¿Qué pasa con ángulos complementarios (30° y 60°)?</p>
                  <p className="text-xs text-gray-500 mt-1">¿Tienen el mismo alcance?</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                rows={8}
              />
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-800">💡 <strong>Reflexiona:</strong> ¿Se cumplió tu hipótesis? ¿Qué aprendiste sobre el tiro parabólico?</p>
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
                    <p>Ángulo óptimo teórico: <strong>45°</strong></p>
                    <p>Alcance máximo teórico: <strong>{analysis.theoreticalRange.toFixed(2)} m</strong></p>
                    <p>Altura máxima teórica: <strong>{analysis.theoreticalHeight.toFixed(2)} m</strong></p>
                    <p>Tiempo de vuelo: <strong>{analysis.flightTime.toFixed(2)} s</strong></p>
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
          <p>Laboratorio Virtual de Física General • Práctica 4: Tiro Parabólico</p>
          <p className="mt-1">Diseñado para aprendizaje activo</p>
        </div>
      </footer>
    </div>
  );
};

export default ProjectilePractice;
