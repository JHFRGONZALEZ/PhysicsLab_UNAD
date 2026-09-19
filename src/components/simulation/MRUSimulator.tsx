import React from 'react';
import { VisualizationCanvas } from './VisualizationCanvas';
import { ControlPanel } from './ControlPanel';
import { DataCollector } from './DataCollector';

export const MRUSimulator: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🚗</span> Simulador MRU
        </h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          Movimiento Rectilíneo Uniforme
        </span>
      </div>
      <VisualizationCanvas />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ControlPanel />
        <DataCollector />
      </div>
    </div>
  );
};
