import React, { useRef, useEffect, useCallback, useState } from 'react';

interface ComparisonState {
  mruPosition: number;
  mruvPosition: number;
  time: number;
  isRunning: boolean;
  mruVelocity: number;
  mruvAcceleration: number;
}

export const ComparisonView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<ComparisonState>({
    mruPosition: 0,
    mruvPosition: 0,
    time: 0,
    isRunning: false,
    mruVelocity: 3,
    mruvAcceleration: 1,
  });
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    if (dt > 0 && dt < 0.1) {
      setState(prev => {
        if (!prev.isRunning) return prev;
        const newTime = prev.time + dt;
        return {
          ...prev,
          time: newTime,
          mruPosition: prev.mruVelocity * newTime,
          mruvPosition: 0.5 * prev.mruvAcceleration * newTime * newTime,
        };
      });
    }
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (state.isRunning) {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [state.isRunning, animate]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.fillText('Comparación: MRU vs MRUV', w / 2, 25);

    // MRU Track
    const track1Y = 80;
    const track2Y = 180;
    const trackH = 30;
    const trackLeft = 60;
    const trackRight = w - 40;
    const trackWidth = trackRight - trackLeft;

    // Labels
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#2563eb';
    ctx.fillText('MRU', trackLeft - 10, track1Y + trackH / 2 + 4);
    ctx.fillStyle = '#dc2626';
    ctx.fillText('MRUV', trackLeft - 10, track2Y + trackH / 2 + 4);

    // Draw tracks
    [track1Y, track2Y].forEach((ty, i) => {
      ctx.fillStyle = i === 0 ? '#dbeafe' : '#fee2e2';
      ctx.fillRect(trackLeft, ty, trackWidth, trackH);
      ctx.strokeStyle = i === 0 ? '#93c5fd' : '#fca5a5';
      ctx.lineWidth = 1;
      ctx.strokeRect(trackLeft, ty, trackWidth, trackH);
    });

    // Scale
    const maxPos = 100;
    const toX = (pos: number) => trackLeft + (pos / maxPos) * trackWidth;

    // Position markers
    ctx.font = '9px monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    for (let p = 0; p <= maxPos; p += 20) {
      const x = toX(p);
      ctx.fillText(`${p}m`, x, track1Y + trackH + 12);
    }

    // MRU car
    const mruX = toX(Math.min(state.mruPosition, maxPos));
    ctx.beginPath();
    ctx.arc(mruX, track1Y + trackH / 2, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#2563eb';
    ctx.fill();
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // MRUV car
    const mruvX = toX(Math.min(state.mruvPosition, maxPos));
    ctx.beginPath();
    ctx.arc(mruvX, track2Y + trackH / 2, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#dc2626';
    ctx.fill();
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Info
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#2563eb';
    ctx.fillText(`x = ${state.mruPosition.toFixed(1)}m (v=${state.mruVelocity} m/s)`, trackLeft, track1Y - 8);
    ctx.fillStyle = '#dc2626';
    ctx.fillText(`x = ${state.mruvPosition.toFixed(1)}m (a=${state.mruvAcceleration} m/s²)`, trackLeft, track2Y - 8);

    // Time
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.fillText(`t = ${state.time.toFixed(1)}s`, w / 2, h - 15);

    // Equations
    ctx.font = '10px monospace';
    ctx.fillStyle = '#2563eb';
    ctx.textAlign = 'left';
    ctx.fillText(`MRU: x = v·t = ${state.mruVelocity}·t`, trackLeft, h - 40);
    ctx.fillStyle = '#dc2626';
    ctx.fillText(`MRUV: x = ½·a·t² = ½·${state.mruvAcceleration}·t²`, trackLeft, h - 25);
  }, [state]);

  useEffect(() => { draw(); }, [draw]);

  const toggleRunning = () => setState(s => ({ ...s, isRunning: !s.isRunning }));
  const resetSim = () => setState(s => ({ ...s, time: 0, mruPosition: 0, mruvPosition: 0, isRunning: false }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-2xl">⚖️</span> Comparación MRU vs MRUV
      </h3>
      
      <canvas
        ref={canvasRef}
        width={600}
        height={260}
        className="w-full rounded-lg border border-gray-200"
      />

      <div className="flex gap-2 mt-3">
        <button
          onClick={toggleRunning}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white ${
            state.isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {state.isRunning ? '⏸ Pausar' : '▶ Iniciar'}
        </button>
        <button
          onClick={resetSim}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          🔄 Reiniciar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="p-2 bg-blue-50 rounded-lg text-xs">
          <p className="font-bold text-blue-800">MRU (azul)</p>
          <p className="text-blue-700">Velocidad constante</p>
          <p className="text-blue-700">Aceleración = 0</p>
          <p className="font-mono">x = v·t</p>
        </div>
        <div className="p-2 bg-red-50 rounded-lg text-xs">
          <p className="font-bold text-red-800">MRUV (rojo)</p>
          <p className="text-red-700">Velocidad cambia</p>
          <p className="text-red-700">Aceleración = {state.mruvAcceleration} m/s²</p>
          <p className="font-mono">x = ½·a·t²</p>
        </div>
      </div>

      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">
          💡 <strong>Observa:</strong> El carro MRU avanza distancias iguales en tiempos iguales. 
          El carro MRUV recorre cada vez más distancia porque su velocidad aumenta.
        </p>
      </div>
    </div>
  );
};
