import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { VisualizationCanvasPendulum } from '../components/pendulum/VisualizationCanvasPendulum';
import { useLabStorePendulum } from '../store/pendulumStore';
import { calculateTheoreticalPeriod, analyzePendulumData } from '../utils/pendulumCalculations';
import { ArrowLeft, Home, Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';

export const PendulumPractice: React.FC = () => {
  const { length, setLength, gravity, setGravity, isRunning, toggleRunning, reset, showAngle, setShowAngle, showTrail, setShowTrail, dataPoints, addDataPoint, removeDataPoint, clearDataPoints } = useLabStorePendulum();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

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
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">⏰</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Práctica 5: Péndulo Simple</h1>
                <p className="text-xs text-gray-500">Cálculo experimental de g</p>
              </div>
            </div>
            <Link to="/" className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"><Home size={16} />Inicio</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <VisualizationCanvasPendulum />
            
            {/* Controls */}
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

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-800">📋 Tabla de Datos</h3>
                <div className="flex gap-2">
                  <button onClick={() => addDataPoint()} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm"><Plus size={16} />Medir</button>
                  <button onClick={clearDataPoints} disabled={dataPoints.length === 0} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm disabled:opacity-50"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-2 text-left">#</th>
                      <th className="px-2 py-2 text-left">Longitud (m)</th>
                      <th className="px-2 py-2 text-left">Período (s)</th>
                      <th className="px-2 py-2 text-left">T² (s²)</th>
                      <th className="px-2 py-2 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPoints.length === 0 ? (
                      <tr><td colSpan={5} className="px-2 py-6 text-center text-gray-400 italic">Cambia la longitud y presiona "Medir"</td></tr>
                    ) : (
                      dataPoints.map((point, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="px-2 py-2">{index + 1}</td>
                          <td className="px-2 py-2 font-mono">{point.length.toFixed(2)}</td>
                          <td className="px-2 py-2 font-mono">{point.period.toFixed(3)}</td>
                          <td className="px-2 py-2 font-mono">{point.periodSquared.toFixed(3)}</td>
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

            {/* Current measurement */}
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <p className="text-xs text-indigo-600 font-medium">Medición actual:</p>
              <p className="text-sm text-indigo-800">L = {(length * 100).toFixed(0)} cm</p>
              <p className="text-sm text-indigo-800">T teórico = {theoreticalPeriod.toFixed(3)} s</p>
            </div>

            {/* Analysis */}
            {analysis && (
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">🔬 Análisis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">g teórico:</span>
                    <span className="text-sm font-mono font-bold">{analysis.theoreticalGravity.toFixed(2)} m/s²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">g experimental:</span>
                    <span className="text-sm font-mono font-bold text-indigo-700">{analysis.experimentalGravity.toFixed(2)} m/s²</span>
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
              <h3 className="text-sm font-bold text-amber-800 mb-2">📝 Instrucciones</h3>
              <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                <li>Inicia el péndulo con una longitud (ej: 20cm)</li>
                <li>Espera varias oscilaciones</li>
                <li>Presiona "Medir" para registrar</li>
                <li>Cambia la longitud (40, 60, 80, 100cm)</li>
                <li>Repite las mediciones</li>
                <li>Observa el análisis de g</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PendulumPractice;
