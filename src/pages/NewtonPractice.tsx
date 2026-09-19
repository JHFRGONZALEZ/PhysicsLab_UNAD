import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { VisualizationCanvasNewton } from '../components/newton/VisualizationCanvasNewton';
import { useLabStoreNewton } from '../store/newtonStore';
import { analyzeNewtonData } from '../utils/newtonCalculations';
import { ArrowLeft, Home, Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';

export const NewtonPractice: React.FC = () => {
  const { force, setForce, mass, setMass, friction, setFriction, isRunning, toggleRunning, reset, showForceVector, setShowForceVector, showAccelerationVector, setShowAccelerationVector, showFriction, setShowFriction, dataPoints, addDataPoint, removeDataPoint, clearDataPoints } = useLabStoreNewton();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

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
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-red-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">⚖️</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Práctica 6: Leyes de Newton</h1>
                <p className="text-xs text-gray-500">Fuerza, masa y aceleración</p>
              </div>
            </div>
            <Link to="/" className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"><Home size={16} />Inicio</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <VisualizationCanvasNewton />
            
            {/* Controls */}
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

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-800">📋 Tabla de Datos (F vs a)</h3>
                <div className="flex gap-2">
                  <button onClick={() => addDataPoint()} className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm"><Plus size={16} />Medir</button>
                  <button onClick={clearDataPoints} disabled={dataPoints.length === 0} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm disabled:opacity-50"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-2 text-left">#</th>
                      <th className="px-2 py-2 text-left">Fuerza (N)</th>
                      <th className="px-2 py-2 text-left">Masa (kg)</th>
                      <th className="px-2 py-2 text-left">Aceleración (m/s²)</th>
                      <th className="px-2 py-2 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPoints.length === 0 ? (
                      <tr><td colSpan={5} className="px-2 py-6 text-center text-gray-400 italic">Cambia la fuerza y presiona "Medir"</td></tr>
                    ) : (
                      dataPoints.map((point, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="px-2 py-2">{index + 1}</td>
                          <td className="px-2 py-2 font-mono">{point.force.toFixed(1)}</td>
                          <td className="px-2 py-2 font-mono">{point.mass.toFixed(1)}</td>
                          <td className="px-2 py-2 font-mono">{point.acceleration.toFixed(3)}</td>
                          <td className="px-2 py-2 text-center">
                            <button onClick={() => removeDataPoint(index)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Theory */}
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

            {/* Analysis */}
            {analysis && (
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">🔬 Análisis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Masa teórica:</span>
                    <span className="text-sm font-mono font-bold">{analysis.theoreticalMass.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Masa experimental:</span>
                    <span className="text-sm font-mono font-bold text-red-700">{analysis.experimentalMass.toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Error:</span>
                    <span className={`text-sm font-mono font-bold ${analysis.percentError < 5 ? 'text-green-600' : analysis.percentError < 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {analysis.percentError.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">R²:</span>
                    <span className="text-sm font-mono">{analysis.rSquared.toFixed(4)}</span>
                  </div>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">{analysis.equation}</div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h3 className="text-sm font-bold text-amber-800 mb-2">📝 Experimento</h3>
              <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                <li>Mantén la masa constante (ej: 2kg)</li>
                <li>Varía la fuerza (5, 10, 15, 20, 25N)</li>
                <li>Mide la aceleración para cada fuerza</li>
                <li>Grafica F vs a</li>
                <li>La pendiente = masa</li>
                <li>Verifica: ¿F = m·a?</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewtonPractice;
