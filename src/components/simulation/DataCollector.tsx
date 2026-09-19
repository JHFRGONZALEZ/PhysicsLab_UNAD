import React, { useState } from 'react';
import { useLabStore } from '../../store/labStore';
import { downloadCSV } from '../../utils/exportReport';
import { Trash2, Download, Plus, Edit3, Check, X } from 'lucide-react';

export const DataCollector: React.FC = () => {
  const { dataPoints, addDataPoint, removeDataPoint, clearDataPoints, updateDataPoint, time, position, velocity, experimentalError } = useLabStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ time: '', position: '', velocity: '' });
  const [targetTime, setTargetTime] = useState('');

  const handleMeasure = () => {
    addDataPoint();
  };

  const handleMeasureAtTime = () => {
    const t = parseFloat(targetTime);
    if (isNaN(t) || t < 0) return;
    const { initialPosition, velocity: v } = useLabStore.getState();
    const pos = initialPosition + v * t;
    addDataPoint({ time: t, position: pos, velocity: v });
    setTargetTime('');
  };

  const handleStartEdit = (index: number) => {
    const point = dataPoints[index];
    setEditingIndex(index);
    setEditValues({
      time: point.time.toFixed(2),
      position: point.position.toFixed(2),
      velocity: point.velocity.toFixed(2),
    });
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    updateDataPoint(editingIndex, {
      time: parseFloat(editValues.time) || 0,
      position: parseFloat(editValues.position) || 0,
      velocity: parseFloat(editValues.velocity) || 0,
    });
    setEditingIndex(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-2xl">📋</span> Tabla de Datos
      </h3>

      {/* Measure buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={handleMeasure}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Medir ahora (t={time.toFixed(1)}s)
        </button>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
            placeholder="t = ?"
            className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm"
            min="0"
            step="0.5"
          />
          <button
            onClick={handleMeasureAtTime}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Medir en t
          </button>
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-2 text-left text-gray-600 font-medium">#</th>
              <th className="px-2 py-2 text-left text-gray-600 font-medium">Tiempo (s)</th>
              <th className="px-2 py-2 text-left text-gray-600 font-medium">Posición (m)</th>
              <th className="px-2 py-2 text-left text-gray-600 font-medium">Velocidad (m/s)</th>
              <th className="px-2 py-2 text-center text-gray-600 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {dataPoints.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-2 py-6 text-center text-gray-400 italic">
                  Presiona "Medir ahora" para capturar datos
                </td>
              </tr>
            ) : (
              dataPoints.map((point, index) => (
                <tr key={index} className="border-t border-gray-100 hover:bg-blue-50/50">
                  <td className="px-2 py-2 text-gray-500">{index + 1}</td>
                  {editingIndex === index ? (
                    <>
                      <td className="px-2 py-1">
                        <input
                          type="number"
                          value={editValues.time}
                          onChange={(e) => setEditValues({ ...editValues, time: e.target.value })}
                          className="w-16 px-1 py-0.5 border rounded text-sm"
                          step="0.1"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="number"
                          value={editValues.position}
                          onChange={(e) => setEditValues({ ...editValues, position: e.target.value })}
                          className="w-16 px-1 py-0.5 border rounded text-sm"
                          step="0.1"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="number"
                          value={editValues.velocity}
                          onChange={(e) => setEditValues({ ...editValues, velocity: e.target.value })}
                          className="w-16 px-1 py-0.5 border rounded text-sm"
                          step="0.1"
                        />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <div className="flex justify-center gap-1">
                          <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-100 rounded">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditingIndex(null)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-2 py-2 font-mono">{point.time.toFixed(2)}</td>
                      <td className="px-2 py-2 font-mono">{point.position.toFixed(2)}</td>
                      <td className="px-2 py-2 font-mono">{point.velocity.toFixed(2)}</td>
                      <td className="px-2 py-2">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleStartEdit(index)}
                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => removeDataPoint(index)}
                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t">
        <span className="text-xs text-gray-500">
          {dataPoints.length}/10 mediciones
          {experimentalError && <span className="text-orange-600 ml-2">🎲 Error exp. activo</span>}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => downloadCSV(dataPoints)}
            disabled={dataPoints.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 transition-colors"
          >
            <Download size={14} /> CSV
          </button>
          <button
            onClick={clearDataPoints}
            disabled={dataPoints.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded-lg disabled:opacity-50 transition-colors"
          >
            <Trash2 size={14} /> Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};
