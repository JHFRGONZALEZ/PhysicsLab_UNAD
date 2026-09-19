import React, { useRef, useEffect, useCallback } from 'react';
import { useLabStore } from '../../store/labStore';
import { useSimulation } from '../../hooks/useSimulation';

export const VisualizationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { position, velocity, time, initialPosition, showVelocityVector, showTrail, trailPoints, isRunning } = useLabStore();
  useSimulation();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background - track
    const trackY = height * 0.6;
    const trackHeight = 40;
    
    // Draw gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#e0f2fe');
    bgGrad.addColorStop(1, '#f0f9ff');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw ground
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(0, trackY + trackHeight, width, height - trackY - trackHeight);

    // Draw track
    const trackGrad = ctx.createLinearGradient(0, trackY, 0, trackY + trackHeight);
    trackGrad.addColorStop(0, '#6b7280');
    trackGrad.addColorStop(0.5, '#9ca3af');
    trackGrad.addColorStop(1, '#6b7280');
    ctx.fillStyle = trackGrad;
    ctx.fillRect(20, trackY, width - 40, trackHeight);

    // Draw track markings
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(20, trackY + trackHeight / 2);
    ctx.lineTo(width - 20, trackY + trackHeight / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Scale: map position range to canvas width
    const minPos = -60;
    const maxPos = 120;
    const scale = (width - 80) / (maxPos - minPos);
    const toCanvasX = (pos: number) => 40 + (pos - minPos) * scale;

    // Draw position markers every 10m
    ctx.font = '11px monospace';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    for (let p = -50; p <= 100; p += 10) {
      const x = toCanvasX(p);
      if (x >= 20 && x <= width - 20) {
        ctx.beginPath();
        ctx.moveTo(x, trackY);
        ctx.lineTo(x, trackY + trackHeight);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillText(`${p}m`, x, trackY + trackHeight + 15);
      }
    }

    // Draw origin marker
    const originX = toCanvasX(0);
    ctx.beginPath();
    ctx.moveTo(originX, trackY - 5);
    ctx.lineTo(originX, trackY + trackHeight + 5);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillText('0', originX, trackY - 10);

    // Draw trail
    if (showTrail && trailPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 3;
      for (let i = 0; i < trailPoints.length; i++) {
        const tx = toCanvasX(trailPoints[i].x);
        const ty = trackY + trackHeight / 2;
        if (i === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();

      // Draw trail dots
      for (let i = 0; i < trailPoints.length; i += 3) {
        const tx = toCanvasX(trailPoints[i].x);
        const ty = trackY + trackHeight / 2;
        ctx.beginPath();
        ctx.arc(tx, ty, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.fill();
      }
    }

    // Draw car
    const carX = toCanvasX(position);
    const carY = trackY + trackHeight / 2;
    const carRadius = 18;

    // Car shadow
    ctx.beginPath();
    ctx.ellipse(carX + 2, carY + carRadius + 5, carRadius * 0.8, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();

    // Car body
    const carGrad = ctx.createRadialGradient(carX - 5, carY - 5, 2, carX, carY, carRadius);
    carGrad.addColorStop(0, '#60a5fa');
    carGrad.addColorStop(1, '#1d4ed8');
    ctx.beginPath();
    ctx.arc(carX, carY, carRadius, 0, Math.PI * 2);
    ctx.fillStyle = carGrad;
    ctx.fill();
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Car highlight
    ctx.beginPath();
    ctx.arc(carX - 5, carY - 5, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();

    // Velocity vector
    if (showVelocityVector && velocity !== 0) {
      const arrowLength = velocity * 15;
      const arrowStartX = carX + (velocity > 0 ? carRadius + 5 : -carRadius - 5);
      const arrowEndX = arrowStartX + arrowLength;
      const arrowY = carY - carRadius - 15;

      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowY);
      ctx.lineTo(arrowEndX, arrowY);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Arrow head
      const headSize = 8;
      const direction = velocity > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(arrowEndX, arrowY);
      ctx.lineTo(arrowEndX - headSize * direction, arrowY - headSize / 2);
      ctx.lineTo(arrowEndX - headSize * direction, arrowY + headSize / 2);
      ctx.closePath();
      ctx.fillStyle = '#dc2626';
      ctx.fill();

      // Velocity label
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#dc2626';
      ctx.textAlign = 'center';
      ctx.fillText(`v = ${velocity.toFixed(1)} m/s`, (arrowStartX + arrowEndX) / 2, arrowY - 10);
    }

    // HUD - Time and Position
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'left';
    
    // Time display
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(10, 10, 160, 55);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 160, 55);
    
    ctx.fillStyle = '#93c5fd';
    ctx.font = '11px monospace';
    ctx.fillText('⏱ TIEMPO', 20, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`${time.toFixed(2)} s`, 20, 52);

    // Position display
    ctx.fillStyle = '#065f46';
    ctx.fillRect(width - 170, 10, 160, 55);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(width - 170, 10, 160, 55);
    
    ctx.fillStyle = '#6ee7b7';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('📍 POSICIÓN', width - 20, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`${position.toFixed(2)} m`, width - 20, 52);

    // Equation display
    ctx.font = '13px monospace';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.fillText(`x(t) = ${initialPosition.toFixed(1)} + ${velocity.toFixed(1)}·t`, width / 2, height - 15);

    // Running indicator
    if (isRunning) {
      ctx.beginPath();
      ctx.arc(width - 25, height - 25, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e';
      ctx.fill();
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'right';
      ctx.fillText('EN EJECUCIÓN', width - 38, height - 21);
    }
  }, [position, velocity, time, initialPosition, showVelocityVector, showTrail, trailPoints, isRunning]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={300}
      className="w-full rounded-xl shadow-lg border border-blue-200 bg-white"
      style={{ maxWidth: '800px' }}
    />
  );
};
