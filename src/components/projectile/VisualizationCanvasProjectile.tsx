import React, { useRef, useEffect, useCallback } from 'react';
import { useLabStoreProjectile } from '../../store/projectileStore';

export const VisualizationCanvasProjectile: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { x, y, vx, vy, initialVelocity, angle, time, showVelocityVector, showTrail, trailPoints, isRunning, hasLanded } = useLabStoreProjectile();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Sky gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#dbeafe');
    bgGrad.addColorStop(1, '#bfdbfe');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Ground
    const groundY = height - 60;
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, groundY, width, 60);

    // Scale
    const scale = 3;
    const toCanvasX = (px: number) => 60 + px * scale;
    const toCanvasY = (py: number) => groundY - py * scale;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 100; i += 10) {
      const gx = toCanvasX(i);
      if (gx < width) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, groundY);
        ctx.stroke();
        ctx.fillStyle = '#374151';
        ctx.font = '10px monospace';
        ctx.fillText(`${i}m`, gx - 10, groundY + 15);
      }
    }

    // Trail
    if (showTrail && trailPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      for (let i = 0; i < trailPoints.length; i++) {
        const tx = toCanvasX(trailPoints[i].x);
        const ty = toCanvasY(trailPoints[i].y);
        if (i === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Projectile
    const projX = toCanvasX(x);
    const projY = toCanvasY(y);

    // Shadow
    ctx.beginPath();
    ctx.ellipse(projX, groundY - 2, 10, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();

    // Ball
    const ballGrad = ctx.createRadialGradient(projX - 3, projY - 3, 2, projX, projY, 12);
    ballGrad.addColorStop(0, '#fca5a5');
    ballGrad.addColorStop(1, '#dc2626');
    ctx.beginPath();
    ctx.arc(projX, projY, 12, 0, Math.PI * 2);
    ctx.fillStyle = ballGrad;
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Velocity vector
    if (showVelocityVector && (vx !== 0 || vy !== 0)) {
      const vScale = 2;
      const vEndX = projX + vx * vScale;
      const vEndY = projY - vy * vScale;

      ctx.beginPath();
      ctx.moveTo(projX, projY);
      ctx.lineTo(vEndX, vEndY);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Arrow head
      const headSize = 8;
      const vAngle = Math.atan2(-(vy * vScale), vx * vScale);
      ctx.beginPath();
      ctx.moveTo(vEndX, vEndY);
      ctx.lineTo(vEndX - headSize * Math.cos(vAngle - Math.PI / 6), vEndY - headSize * Math.sin(vAngle - Math.PI / 6));
      ctx.lineTo(vEndX - headSize * Math.cos(vAngle + Math.PI / 6), vEndY - headSize * Math.sin(vAngle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = '#dc2626';
      ctx.fill();
    }

    // HUD
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(10, 10, 180, 70);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 180, 70);

    ctx.fillStyle = '#93c5fd';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('⏱ TIEMPO', 20, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`${time.toFixed(2)} s`, 20, 48);
    ctx.fillStyle = '#93c5fd';
    ctx.font = '11px monospace';
    ctx.fillText(`📍 x=${x.toFixed(1)}m  y=${y.toFixed(1)}m`, 20, 68);

    // Landed
    if (hasLanded) {
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.textAlign = 'center';
      ctx.fillText('💥 ¡IMPACTO!', width / 2, height / 2);
    }

    // Equation
    ctx.font = '12px monospace';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.fillText(`θ=${angle}°  v₀=${initialVelocity}m/s`, width / 2, height - 10);
  }, [x, y, vx, vy, initialVelocity, angle, time, showVelocityVector, showTrail, trailPoints, isRunning, hasLanded]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <canvas ref={canvasRef} width={800} height={400} className="w-full rounded-xl shadow-lg border border-green-200 bg-white" style={{ maxWidth: '800px' }} />
  );
};
