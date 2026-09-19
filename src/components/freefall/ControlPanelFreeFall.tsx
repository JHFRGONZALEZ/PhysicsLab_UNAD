import React from 'react';
import { useLabStoreFreeFall } from '../../store/freefallStore';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export const ControlPanelFreeFall: React.FC = () => {
  const {
    gravity, setGravity,
    initialHeight, setInitialHeight,
    isRunning, toggleRunning, reset, stepForward,
    showVelocityVector, setShowVelocityVector,
    showTrail, setShowTrail,
    experimentalError, setExperimentalError,
    hasLanded,
  } = useLabStoreFreeFall();

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🎛️</span> Panel de Control
      </h3>

      {/* Gravity Slider */}
      <div className="mb-4">
        <label className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
          <span>Gravedad (g)</span>
          <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-mono">
            {gravity.toFixed(2)} m/s²
          </span>
        </label>
        <input
          type="range"
          min="1"
          max="25"
          step="0.1"
          value={gravity}
          onChange={(e) => setGravity(parseFloat(e.target.value))}
          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
          aria-label="Control de gravedad"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 (Luna)</span>
          <span>9.81 (Tierra)</span>
          <span>25 (Júpiter)</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          <button
            onClick={() => setGravity(1.62)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            🌙 Luna (1.62)
          </button>
          <button
            onClick={() => setGravity(9.81)}
            className="text-xs px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded"
          >
            🌍 Tierra (9.81)
          </button>
          <button
            onClick={() => setGravity(24.79)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            🪐 Júpiter (24.79)
          </button>
        </div>
      </div>

      {/* Initial Height Slider */}
      <div className="mb-4">
        <label className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
          <span>Altura inicial (y₀)</span>
          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-mono">
            {initialHeight.toFixed(0)} m
          </span>
        </label>
        <input
          type="range"
          min="10"
          max="200"
          step="5"
          value={initialHeight}
          onChange={(e) => setInitialHeight(parseFloat(e.target.value))}
          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          aria-label="Control de altura inicial"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>10 m</span>
          <span>100 m</span>
          <span>200 m</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={toggleRunning}
          disabled={hasLanded}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white transition-all ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
              : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
          } shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isRunning ? 'Pausar simulación' : 'Iniciar simulación'}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          {isRunning ? 'Pausar' : hasLanded ? 'Reiniciar' : 'Soltar'}
        </button>
        <button
          onClick={() => stepForward(0.1)}
          disabled={isRunning || hasLanded}
          className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all disabled:opacity-50"
          aria-label="Avanzar 0.1 segundos"
          title="Avanzar 0.1s"
        >
          <SkipForward size={18} />
          <span className="text-sm">+0.1s</span>
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
            checked={showTrail}
            onChange={(e) => setShowTrail(e.target.checked)}
            className="w-4 h-4 text-orange-600 rounded"
          />
          <span>Dejar rastro de posiciones</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={experimentalError}
            onChange={(e) => setExperimentalError(e.target.checked)}
            className="w-4 h-4 text-yellow-600 rounded"
          />
          <span className="flex items-center gap-1">
            🎲 Modo error experimental
            <span className="text-xs text-gray-400">(±2%)</span>
          </span>
        </label>
      </div>

      {/* Info box */}
      <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
        <p className="text-xs text-orange-800">
          <strong>Ecuaciones de caída libre:</strong>
        </p>
        <p className="text-xs text-orange-700 mt-1 font-mono">
          y(t) = y₀ - ½·g·t²<br/>
          v(t) = -g·t<br/>
          v² = 2·g·y₀
        </p>
      </div>
    </div>
  );
};
