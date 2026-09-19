import React from 'react';
import { useLabStore } from '../../store/labStore';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export const ControlPanel: React.FC = () => {
  const {
    velocity, setVelocity,
    initialPosition, setInitialPosition,
    isRunning, toggleRunning, reset, stepForward,
    showVelocityVector, setShowVelocityVector,
    showTrail, setShowTrail,
    experimentalError, setExperimentalError,
  } = useLabStore();

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🎛️</span> Panel de Control
      </h3>

      {/* Velocity Slider */}
      <div className="mb-4">
        <label className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
          <span>Velocidad (v)</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
            {velocity.toFixed(1)} m/s
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={velocity}
          onChange={(e) => setVelocity(parseFloat(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          aria-label="Control de velocidad"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0 m/s</span>
          <span>5 m/s</span>
          <span>10 m/s</span>
        </div>
      </div>

      {/* Initial Position Slider */}
      <div className="mb-4">
        <label className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
          <span>Posición inicial (x₀)</span>
          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-mono">
            {initialPosition.toFixed(0)} m
          </span>
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          step="1"
          value={initialPosition}
          onChange={(e) => setInitialPosition(parseFloat(e.target.value))}
          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          aria-label="Control de posición inicial"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>-50 m</span>
          <span>0 m</span>
          <span>50 m</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={toggleRunning}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white transition-all ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
          } shadow-md`}
          aria-label={isRunning ? 'Pausar simulación' : 'Iniciar simulación'}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          onClick={() => stepForward(1)}
          disabled={isRunning}
          className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all disabled:opacity-50"
          aria-label="Avanzar 1 segundo"
          title="Avanzar 1 segundo"
        >
          <SkipForward size={18} />
          <span className="text-sm">+1s</span>
        </button>
        <button
          onClick={reset}
          className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg font-medium bg-red-50 hover:bg-red-100 text-red-700 transition-all"
          aria-label="Reiniciar simulación"
          title="Reiniciar"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2 border-t pt-3">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={showVelocityVector}
            onChange={(e) => setShowVelocityVector(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span>Mostrar vector velocidad</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={showTrail}
            onChange={(e) => setShowTrail(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span>Dejar rastro de posiciones</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={experimentalError}
            onChange={(e) => setExperimentalError(e.target.checked)}
            className="w-4 h-4 text-orange-600 rounded"
          />
          <span className="flex items-center gap-1">
            🎲 Modo error experimental
            <span className="text-xs text-gray-400">(±3%)</span>
          </span>
        </label>
      </div>

      {/* Info box */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-800">
          <strong>Ecuación:</strong> x(t) = x₀ + v·t
        </p>
        <p className="text-xs text-blue-700 mt-1">
          <strong>Actual:</strong> x(t) = {initialPosition} + {velocity}·t
        </p>
      </div>
    </div>
  );
};
