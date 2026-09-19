import React, { useState } from 'react';
import { useLabStore } from '../../store/labStore';
import { Save, Lightbulb } from 'lucide-react';

export const HypothesisBuilder: React.FC = () => {
  const { hypothesis, setHypothesis } = useLabStore();
  const [text, setText] = useState(hypothesis?.text || '');

  const handleSave = () => {
    if (text.trim().length > 10) {
      setHypothesis(text.trim());
    }
  };

  const suggestions = [
    'Si aumento la velocidad al doble, entonces...',
    'Predigo que la gráfica posición-tiempo será...',
    'Espero que la pendiente de la gráfica sea igual a...',
    'Creo que al cambiar la posición inicial...',
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-2xl">💡</span> Planteamiento de Hipótesis
      </h3>

      <p className="text-sm text-gray-600 mb-3">
        Antes de experimentar, escribe tu predicción. ¿Qué crees que pasará?
      </p>

      {/* Suggestions */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
          <Lightbulb size={12} /> Ideas para empezar:
        </p>
        <div className="flex flex-wrap gap-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setText(s)}
              className="text-xs px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full text-yellow-800 hover:bg-yellow-100 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tu hipótesis aquí... (mínimo 10 caracteres)"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
        rows={4}
      />

      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">
          {text.length} caracteres {text.length < 10 && '(mínimo 10)'}
        </span>
        <button
          onClick={handleSave}
          disabled={text.trim().length < 10}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save size={16} /> Guardar hipótesis
        </button>
      </div>

      {/* Saved hypothesis */}
      {hypothesis && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-600 font-medium mb-1">
            ✅ Hipótesis guardada ({new Date(hypothesis.timestamp).toLocaleString()}):
          </p>
          <p className="text-sm text-blue-800">{hypothesis.text}</p>
        </div>
      )}
    </div>
  );
};
