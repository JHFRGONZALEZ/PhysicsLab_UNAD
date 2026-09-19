import React, { useMemo } from 'react';
import { useLabStore } from '../../store/labStore';
import { analyzeData } from '../../utils/physicsCalculations';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export const DataAnalysisPanel: React.FC = () => {
  const { dataPoints, velocity } = useLabStore();

  const analysis = useMemo(() => {
    if (dataPoints.length < 2) return null;
    return analyzeData(dataPoints, velocity);
  }, [dataPoints, velocity]);

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-2xl">🔬</span> Análisis de Resultados
        </h3>
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">📐</p>
          <p className="text-sm">Necesitas al menos 2 mediciones para el análisis</p>
        </div>
      </div>
    );
  }

  const errorLevel = analysis.percentError < 5 ? 'low' : analysis.percentError < 10 ? 'medium' : 'high';

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🔬</span> Análisis de Resultados
      </h3>

      <div className="space-y-3">
        {/* Velocity comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600 font-medium">Vel. Teórica</p>
            <p className="text-xl font-bold text-blue-800 font-mono">{analysis.theoreticalVelocity.toFixed(2)}</p>
            <p className="text-xs text-blue-600">m/s</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-green-600 font-medium">Vel. Experimental</p>
            <p className="text-xl font-bold text-green-800 font-mono">{analysis.experimentalVelocity.toFixed(2)}</p>
            <p className="text-xs text-green-600">m/s</p>
          </div>
        </div>

        {/* Error percentage */}
        <div className={`rounded-lg p-3 flex items-center gap-3 ${
          errorLevel === 'low' ? 'bg-green-50 border border-green-200' :
          errorLevel === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-red-50 border border-red-200'
        }`}>
          {errorLevel === 'low' ? <CheckCircle className="text-green-600" size={20} /> :
           errorLevel === 'medium' ? <TrendingUp className="text-yellow-600" size={20} /> :
           <AlertTriangle className="text-red-600" size={20} />}
          <div>
            <p className="text-sm font-medium text-gray-700">Error porcentual</p>
            <p className={`text-lg font-bold font-mono ${
              errorLevel === 'low' ? 'text-green-700' :
              errorLevel === 'medium' ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {analysis.percentError.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Equation */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Ecuación de ajuste lineal:</p>
          <p className="text-sm font-mono font-bold text-gray-800">{analysis.equation}</p>
        </div>

        {/* R-squared */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Coeficiente de determinación:</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-mono font-bold text-gray-800">R² = {analysis.rSquared.toFixed(4)}</p>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(analysis.rSquared * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Interpretation */}
        {errorLevel === 'high' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-700">
              ⚠️ Tu error es alto ({analysis.percentError.toFixed(1)}%). ¿Revisaste las mediciones? 
              Verifica que los valores de tiempo y posición sean consistentes.
            </p>
          </div>
        )}

        {analysis.rSquared > 0.99 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-700">
              ✅ Excelente ajuste lineal (R² {'>'} 0.99). Esto confirma que el movimiento es uniforme.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
