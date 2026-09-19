import React from 'react';
import { useLabStoreMRUV } from '../../store/mruvStore';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export const ControlPanelMRUV: React.FC = () => {
  const {
    acceleration, setAcceleration,
    initialVelocity, setInitialVelocity,
    initialPosition, setInitialPosition,
    isRunning, toggleRunning, reset, stepForward,
    showVelocityVector, setShowVelocityVector,
    showAccelerationVector, setShowAccelerationVector,
    showTrail, setShowTrail,
    experimentalError, setExperimentalError,
  } = useLabStoreMRUV();

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🎛️</span> Panel de Control
      </h3>

      {/* Acceleration Slider */}
      <div className="mb-4">
        <label className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
          <span>Aceleración (a)</span>
          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono">
            {acceleration.toFixed(1)} m/s²
          </span>
        </label>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.5"
          value={acceleration}
          onChange={(e) => setAcceleration(parseFloat(e.target.value))}
          className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          aria-label="Control de aceleración"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>-5 m/s²</span>
          <span>0</span>
          <span>5 m/s²</span>
        </div>
      </div>

      {/* Initial Velocity Slider */}
      <div className="mb-4">
        <label className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
          <span>Velocidad inicial (v₀)</span>
          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-mono">
            {initialVelocity.toFixed(1)} m/s
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={initialVelocity}
          onChange={(e) => setInitialVelocity(parseFloat(e.target.value))}
          className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          aria-label="Control de velocidad inicial"
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
              : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
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
            className="w-4 h-4 text-red-600 rounded"
          />
          <span>Mostrar vector velocidad (rojo)</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={showAccelerationVector}
            onChange={(e) => setShowAccelerationVector(e.target.checked)}
            className="w-4 h-4 text-green-600 rounded"
          />
          <span>Mostrar vector aceleración (verde)</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={showTrail}
            onChange={(e) => setShowTrail(e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded"
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
      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-xs text-purple-800">
          <strong>Ecuaciones del MRUV:</strong>
        </p>
        <p className="text-xs text-purple-700 mt-1 font-mono">
          x(t) = x₀ + v₀·t + ½·a·t²<br/>
          v(t) = v₀ + a·t
        </p>
      </div>
    </div>
  );
};
