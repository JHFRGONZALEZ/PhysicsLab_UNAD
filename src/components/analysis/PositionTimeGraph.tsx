import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useLabStore } from '../../store/labStore';
import { linearRegression } from '../../utils/physicsCalculations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const PositionTimeGraph: React.FC = () => {
  const { dataPoints, velocity, initialPosition } = useLabStore();

  const regression = useMemo(() => {
    if (dataPoints.length < 2) return null;
    return linearRegression(dataPoints);
  }, [dataPoints]);

  const data = useMemo(() => {
    const sortedPoints = [...dataPoints].sort((a, b) => a.time - b.time);
    
    const datasets = [
      {
        label: 'Datos medidos',
        data: sortedPoints.map(p => ({ x: p.time, y: p.position })),
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
        pointStyle: 'circle' as const,
      },
    ];

    // Add theoretical line
    if (sortedPoints.length > 0) {
      const maxT = Math.max(...sortedPoints.map(p => p.time), 10);
      datasets.push({
        label: 'Teórico: x = x₀ + vt',
        data: [
          { x: 0, y: initialPosition },
          { x: maxT + 2, y: initialPosition + velocity * (maxT + 2) },
        ],
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0,
        borderWidth: 2,
      } as any);
    }

    // Add regression line
    if (regression && sortedPoints.length >= 2) {
      const maxT = Math.max(...sortedPoints.map(p => p.time), 10);
      datasets.push({
        label: `Ajuste: x = ${regression.intercept.toFixed(2)} + ${regression.slope.toFixed(2)}t`,
        data: [
          { x: 0, y: regression.intercept },
          { x: maxT + 2, y: regression.slope * (maxT + 2) + regression.intercept },
        ],
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderDash: [10, 5],
        pointRadius: 0,
        borderWidth: 2,
      } as any);
    }

    return { datasets };
  }, [dataPoints, regression, velocity, initialPosition]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Tiempo (s)',
          font: { size: 13, weight: 'bold' as const },
        },
        min: 0,
        grid: { color: '#f3f4f6' },
      },
      y: {
        title: {
          display: true,
          text: 'Posición (m)',
          font: { size: 13, weight: 'bold' as const },
        },
        grid: { color: '#f3f4f6' },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Gráfica Posición vs Tiempo',
        font: { size: 14, weight: 'bold' as const },
      },
      legend: {
        position: 'bottom' as const,
        labels: { font: { size: 11 }, usePointStyle: true },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `t=${ctx.parsed.x.toFixed(2)}s, x=${ctx.parsed.y.toFixed(2)}m`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      <div className="h-64">
        {dataPoints.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-4xl mb-2">📈</p>
              <p className="text-sm">Realiza mediciones para ver la gráfica</p>
            </div>
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
      {regression && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs">
          <p className="text-blue-800">
            <strong>Pendiente (velocidad):</strong> {regression.slope.toFixed(3)} m/s
          </p>
          <p className="text-blue-700">
            <strong>R² =</strong> {regression.rSquared.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};
