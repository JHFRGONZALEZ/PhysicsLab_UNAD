import React, { useRef, useEffect, useCallback } from 'react';
import { useLabStoreNewton } from '../../store/newtonStore';

export const VisualizationCanvasNewton: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { position, velocity, acceleration, force, mass, friction, time, showForceVector, showAccelerationVector, showFriction, trailPoints, isRunning } = useLabStoreNewton();

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
    bgGrad.addColorStop(0, '#fef3c7');
    bgGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Ground
    const groundY = height - 80;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, groundY, width, 80);

    // Surface
    const surfaceGrad = ctx.createLinearGradient(0, groundY - 10, 0, groundY);
    surfaceGrad.addColorStop(0, '#d1d5db');
    surfaceGrad.addColorStop(1, '#9ca3af');
    ctx.fillStyle = surfaceGrad;
    ctx.fillRect(0, groundY - 10, width, 10);

    // Scale
    const scale = 5;
    const toCanvasX = (px: number) => 100 + px * scale;

    // Trail
    if (trailPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 3;
      for (let i = 0; i < trailPoints.length; i++) {
        const tx = toCanvasX(trailPoints[i].x);
        if (i === 0) ctx.moveTo(tx, groundY - 30);
        else ctx.lineTo(tx, groundY - 30);
      }
      ctx.stroke();
    }

    // Box
    const boxX = toCanvasX(position);
    const boxY = groundY - 60;
    const boxSize = 60;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(boxX + 3, boxY + 3, boxSize, boxSize);

    // Box body
    const boxGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxSize);
    boxGrad.addColorStop(0, '#fca5a5');
    boxGrad.addColorStop(1, '#dc2626');
    ctx.fillStyle = boxGrad;
    ctx.fillRect(boxX, boxY, boxSize, boxSize);
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxSize, boxSize);

    // Mass label
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass}kg`, boxX + boxSize / 2, boxY + boxSize / 2 + 5);

    // Force vector
    if (showForceVector && force > 0) {
      const arrowLength = force * 5;
      const arrowStartX = boxX + boxSize + 5;
      const arrowEndX = arrowStartX + arrowLength;
      const arrowY = boxY + boxSize / 2;

      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowY);
      ctx.lineTo(arrowEndX, arrowY);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(arrowEndX, arrowY);
      ctx.lineTo(arrowEndX - 10, arrowY - 8);
      ctx.lineTo(arrowEndX - 10, arrowY + 8);
      ctx.closePath();
      ctx.fillStyle = '#dc2626';
      ctx.fill();

      // Label
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#dc2626';
      ctx.textAlign = 'center';
      ctx.fillText(`F = ${force}N`, (arrowStartX + arrowEndX) / 2, arrowY - 15);
    }

    // Friction vector
    if (showFriction && friction > 0) {
      const frictionForce = friction * mass * 9.81;
      const arrowLength = frictionForce * 5;
      const arrowStartX = boxX - 5;
      const arrowEndX = arrowStartX - arrowLength;
      const arrowY = boxY + boxSize / 2;

      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowY);
      ctx.lineTo(arrowEndX, arrowY);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(arrowEndX, arrowY);
      ctx.lineTo(arrowEndX + 10, arrowY - 8);
      ctx.lineTo(arrowEndX + 10, arrowY + 8);
      ctx.closePath();
      ctx.fillStyle = '#f59e0b';
      ctx.fill();

      // Label
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.textAlign = 'center';
      ctx.fillText(`f = ${frictionForce.toFixed(1)}N`, (arrowStartX + arrowEndX) / 2, arrowY - 15);
    }

    // Acceleration vector
    if (showAccelerationVector && acceleration !== 0) {
      const arrowLength = acceleration * 10;
      const arrowStartX = boxX + boxSize / 2;
      const arrowEndX = arrowStartX + arrowLength;
      const arrowY = boxY - 20;

      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowY);
      ctx.lineTo(arrowEndX, arrowY);
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Arrow head
      const direction = acceleration > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(arrowEndX, arrowY);
      ctx.lineTo(arrowEndX - 8 * direction, arrowY - 6);
      ctx.lineTo(arrowEndX - 8 * direction, arrowY + 6);
      ctx.closePath();
      ctx.fillStyle = '#16a34a';
      ctx.fill();

      // Label
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#16a34a';
      ctx.textAlign = 'center';
      ctx.fillText(`a = ${acceleration.toFixed(2)} m/s²`, (arrowStartX + arrowEndX) / 2, arrowY - 10);
    }

    // HUD
    ctx.fillStyle = '#b45309';
    ctx.fillRect(10, 10, 200, 85);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 85);

    ctx.fillStyle = '#fde68a';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('⏱ TIEMPO', 20, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`${time.toFixed(2)} s`, 20, 48);
    ctx.fillStyle = '#fde68a';
    ctx.font = '11px monospace';
    ctx.fillText(`📍 x = ${position.toFixed(1)}m`, 20, 68);
    ctx.fillText(`🏃 v = ${velocity.toFixed(2)} m/s`, 20, 85);

    // Equation
    ctx.font = '13px monospace';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.fillText(`F = m·a → ${force}N = ${mass}kg × ${acceleration.toFixed(2)}m/s²`, width / 2, height - 10);
  }, [position, velocity, acceleration, force, mass, friction, time, showForceVector, showAccelerationVector, showFriction, trailPoints, isRunning]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <canvas ref={canvasRef} width={800} height={350} className="w-full rounded-xl shadow-lg border border-red-200 bg-white" style={{ maxWidth: '800px' }} />
  );
};
