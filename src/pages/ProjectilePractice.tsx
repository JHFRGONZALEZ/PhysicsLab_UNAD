import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { VisualizationCanvasProjectile } from '../components/projectile/VisualizationCanvasProjectile';
import { useLabStoreProjectile } from '../store/projectileStore';
import { ArrowLeft, Home, Play, Pause, RotateCcw, FlaskConical, BookOpen, Beaker, BarChart3, FileText, Menu, X } from 'lucide-react';

export const ProjectilePractice: React.FC = () => {
  const { initialVelocity, setInitialVelocity, angle, setAngle, gravity, setGravity, isRunning, toggleRunning, reset, hasLanded, showVelocityVector, setShowVelocityVector, showTrail, setShowTrail } = useLabStoreProjectile();
  const [phase, setPhase] = useState<'exploration' | 'hypothesis' | 'experimentation' | 'analysis' | 'conclusion'>('exploration');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phases = [
    { key: 'exploration', label: 'Exploración', icon: <FlaskConical size={16} /> },
    { key: 'hypothesis', label: 'Hipótesis', icon: <BookOpen size={16} /> },
    { key: 'experimentation', label: 'Experimentación', icon: <Beaker size={16} /> },
    { key: 'analysis', label: 'Análisis', icon: <BarChart3 size={16} /> },
    { key: 'conclusion', label: 'Conclusiones', icon: <FileText size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🎯</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Práctica 4: Tiro Parabólico</h1>
                <p className="text-xs text-gray-500">Movimiento de proyectiles</p>
              </div>
            </div>
            <Link to="/" className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"><Home size={16} />Inicio</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
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
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 Objetivos</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>Comprender el movimiento de proyectiles</li>
                <li className="flex items-start gap-2"><span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>Relacionar ángulo con alcance y altura</li>
                <li className="flex items-start gap-2"><span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>Encontrar el ángulo óptimo</li>
                <li className="flex items-start gap-2"><span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>Verificar las ecuaciones cinemáticas</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectilePractice;
