import React, { useRef, useEffect, useCallback } from 'react';
import { useLabStorePendulum } from '../../store/pendulumStore';

export const VisualizationCanvasPendulum: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { angle, length, time, showAngle, showTrail, trailPoints, isRunning, oscillationCount } = useLabStorePendulum();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#e0e7ff');
    bgGrad.addColorStop(1, '#c7d2fe');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Pivot point
    const pivotX = width / 2;
    const pivotY = 50;

    // Scale length to pixels
    const lengthPixels = length * 300; // 1m = 300px

    // Bob position
    const bobX = pivotX + lengthPixels * Math.sin(angle);
    const bobY = pivotY + lengthPixels * Math.cos(angle);

    // Trail
    if (showTrail && trailPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < trailPoints.length; i++) {
        const tAngle = trailPoints[i].angle;
        const tx = pivotX + lengthPixels * Math.sin(tAngle);
        const ty = pivotY + lengthPixels * Math.cos(tAngle);
        if (i === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();
    }

    // String
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bob
    const bobGrad = ctx.createRadialGradient(bobX - 5, bobY - 5, 2, bobX, bobY, 20);
    bobGrad.addColorStop(0, '#a5b4fc');
    bobGrad.addColorStop(1, '#4f46e5');
    ctx.beginPath();
    ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
    ctx.fillStyle = bobGrad;
    ctx.fill();
    ctx.strokeStyle = '#312e81';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Highlight
    ctx.beginPath();
    ctx.arc(bobX - 6, bobY - 6, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();

    // Pivot
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#374151';
    ctx.fill();

    // Angle arc
    if (showAngle && Math.abs(angle) > 0.01) {
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 40, Math.PI / 2 - Math.abs(angle), Math.PI / 2, angle > 0);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Angle label
      const angleDeg = (angle * 180 / Math.PI).toFixed(1);
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#dc2626';
      ctx.textAlign = 'center';
      ctx.fillText(`θ = ${angleDeg}°`, pivotX + 60, pivotY + 30);
    }

    // Length label
    ctx.font = '12px monospace';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'left';
    ctx.fillText(`L = ${(length * 100).toFixed(0)} cm`, pivotX + 30, pivotY + lengthPixels / 2);

    // HUD
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(10, 10, 180, 70);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 180, 70);

    ctx.fillStyle = '#c7d2fe';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('⏱ TIEMPO', 20, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`${time.toFixed(2)} s`, 20, 48);
    ctx.fillStyle = '#c7d2fe';
    ctx.font = '11px monospace';
    ctx.fillText(`🔄 Oscilaciones: ${oscillationCount}`, 20, 68);

    // Equation
    ctx.font = '12px monospace';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.fillText(`T = 2π·√(L/g) = 2π·√(${length.toFixed(2)}/9.81)`, width / 2, height - 10);
  }, [angle, length, time, showAngle, showTrail, trailPoints, isRunning, oscillationCount]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <canvas ref={canvasRef} width={800} height={500} className="w-full rounded-xl shadow-lg border border-indigo-200 bg-white" style={{ maxWidth: '800px' }} />
  );
};
