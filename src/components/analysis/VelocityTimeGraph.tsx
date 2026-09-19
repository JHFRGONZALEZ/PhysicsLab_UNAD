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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const VelocityTimeGraph: React.FC = () => {
  const { dataPoints, velocity } = useLabStore();

  const data = useMemo(() => {
    const sortedPoints = [...dataPoints].sort((a, b) => a.time - b.time);
    const maxT = sortedPoints.length > 0 ? Math.max(...sortedPoints.map(p => p.time), 10) : 10;

    const datasets = [
      {
        label: 'Velocidad (constante)',
        data: sortedPoints.map(p => ({ x: p.time, y: p.velocity })),
        borderColor: '#7c3aed',
        backgroundColor: '#7c3aed',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
        pointStyle: 'circle' as const,
      },
      {
        label: `v = ${velocity.toFixed(1)} m/s (teórico)`,
        data: [
          { x: 0, y: velocity },
          { x: maxT + 2, y: velocity },
        ],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        pointRadius: 0,
        borderWidth: 2,
        fill: true,
      } as any,
    ];

    return { datasets };
  }, [dataPoints, velocity]);

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
          text: 'Velocidad (m/s)',
          font: { size: 13, weight: 'bold' as const },
        },
        min: 0,
        max: Math.max(velocity + 2, 12),
        grid: { color: '#f3f4f6' },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Gráfica Velocidad vs Tiempo',
        font: { size: 14, weight: 'bold' as const },
      },
      legend: {
        position: 'bottom' as const,
        labels: { font: { size: 11 }, usePointStyle: true },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `t=${ctx.parsed.x.toFixed(2)}s, v=${ctx.parsed.y.toFixed(2)} m/s`,
        },
      },
    },
  };

  // Calculate area under curve (displacement)
  const displacement = useMemo(() => {
    if (dataPoints.length < 2) return 0;
    const sorted = [...dataPoints].sort((a, b) => a.time - b.time);
    const totalTime = sorted[sorted.length - 1].time - sorted[0].time;
    return velocity * totalTime;
  }, [dataPoints, velocity]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      <div className="h-64">
        {dataPoints.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-4xl mb-2">📊</p>
              <p className="text-sm">Realiza mediciones para ver la gráfica</p>
            </div>
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
      {dataPoints.length >= 2 && (
        <div className="mt-2 p-2 bg-purple-50 rounded-lg text-xs">
          <p className="text-purple-800">
            <strong>Área bajo la curva (desplazamiento):</strong> {displacement.toFixed(2)} m
          </p>
          <p className="text-purple-700">
            <strong>Nota:</strong> La línea horizontal confirma que v = constante (MRU)
          </p>
        </div>
      )}
    </div>
  );
};
