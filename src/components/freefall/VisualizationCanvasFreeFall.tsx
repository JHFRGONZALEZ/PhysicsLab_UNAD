import React, { useRef, useEffect, useCallback } from 'react';
import { useLabStoreFreeFall } from '../../store/freefallStore';

export const VisualizationCanvasFreeFall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    height,
    velocity,
    gravity,
    initialHeight,
    time,
    showVelocityVector,
    showTrail,
    trailPoints,
    isRunning,
    hasLanded,
  } = useLabStoreFreeFall();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Sky gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#fef3c7');
    bgGrad.addColorStop(0.7, '#fde68a');
    bgGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Ground
    const groundY = height - 50;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, groundY, width, 50);
    
    // Grass
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, groundY, width, 5);

    // Scale: map height range to canvas
    const maxH = Math.max(initialHeight, 50);
    const scale = (groundY - 40) / maxH;
    const toCanvasY = (h: number) => groundY - h * scale;

    // Draw height markers
    ctx.font = '11px monospace';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'right';
    
    const step = maxH > 100 ? 20 : maxH > 50 ? 10 : 5;
    for (let h = 0; h <= maxH; h += step) {
      const y = toCanvasY(h);
      if (y >= 20 && y <= groundY) {
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(width - 20, y);
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#374151';
        ctx.fillText(`${h}m`, 45, y + 4);
      }
    }

    // Draw trail
    if (showTrail && trailPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 3;
      for (let i = 0; i < trailPoints.length; i++) {
        const tx = width / 2;
        const ty = toCanvasY(trailPoints[i].y);
        if (i === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();

      // Draw trail dots
      for (let i = 0; i < trailPoints.length; i += 5) {
        const tx = width / 2;
        const ty = toCanvasY(trailPoints[i].y);
        ctx.beginPath();
        ctx.arc(tx, ty, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.fill();
      }
    }

    // Draw apple (object)
    const appleX = width / 2;
    const appleY = toCanvasY(height);
    const appleRadius = 20;

    // Apple shadow
    if (!hasLanded) {
      const shadowScale = 1 - (height / maxH) * 0.5;
      ctx.beginPath();
      ctx.ellipse(appleX, groundY - 2, appleRadius * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();
    }

    // Apple body
    const appleGrad = ctx.createRadialGradient(appleX - 5, appleY - 5, 2, appleX, appleY, appleRadius);
    appleGrad.addColorStop(0, '#fca5a5');
    appleGrad.addColorStop(0.5, '#ef4444');
    appleGrad.addColorStop(1, '#b91c1c');
    ctx.beginPath();
    ctx.arc(appleX, appleY, appleRadius, 0, Math.PI * 2);
    ctx.fillStyle = appleGrad;
    ctx.fill();
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Apple stem
    ctx.beginPath();
    ctx.moveTo(appleX, appleY - appleRadius);
    ctx.lineTo(appleX + 2, appleY - appleRadius - 8);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Apple leaf
    ctx.beginPath();
    ctx.ellipse(appleX + 8, appleY - appleRadius - 5, 6, 3, Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = '#16a34a';
    ctx.fill();

    // Apple highlight
    ctx.beginPath();
    ctx.arc(appleX - 6, appleY - 6, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();

    // Velocity vector
    if (showVelocityVector && velocity !== 0) {
      const arrowLength = Math.abs(velocity) * 3;
      const arrowStartY = appleY + appleRadius + 5;
      const arrowEndY = arrowStartY + arrowLength;

      ctx.beginPath();
      ctx.moveTo(appleX, arrowStartY);
      ctx.lineTo(appleX, arrowEndY);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Arrow head (pointing down)
      const headSize = 8;
      ctx.beginPath();
      ctx.moveTo(appleX, arrowEndY);
      ctx.lineTo(appleX - headSize / 2, arrowEndY - headSize);
      ctx.lineTo(appleX + headSize / 2, arrowEndY - headSize);
      ctx.closePath();
      ctx.fillStyle = '#dc2626';
      ctx.fill();

      // Velocity label
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#dc2626';
      ctx.textAlign = 'left';
      ctx.fillText(`v = ${Math.abs(velocity).toFixed(1)} m/s`, appleX + 30, (arrowStartY + arrowEndY) / 2);
    }

    // Gravity vector
    const gArrowLength = gravity * 5;
    const gArrowStartY = appleY - appleRadius - 15;
    const gArrowEndY = gArrowStartY + gArrowLength;

    ctx.beginPath();
    ctx.moveTo(appleX, gArrowStartY);
    ctx.lineTo(appleX, gArrowEndY);
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Arrow head (pointing down)
    const gHeadSize = 8;
    ctx.beginPath();
    ctx.moveTo(appleX, gArrowEndY);
    ctx.lineTo(appleX - gHeadSize / 2, gArrowEndY - gHeadSize);
    ctx.lineTo(appleX + gHeadSize / 2, gArrowEndY - gHeadSize);
    ctx.closePath();
    ctx.fillStyle = '#16a34a';
    ctx.fill();

    // Gravity label
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#16a34a';
    ctx.textAlign = 'right';
    ctx.fillText(`g = ${gravity.toFixed(2)} m/s²`, appleX - 30, (gArrowStartY + gArrowEndY) / 2);

    // HUD - Time and Height
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'left';

    // Time display
    ctx.fillStyle = '#b45309';
    ctx.fillRect(10, 10, 160, 55);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 160, 55);

    ctx.fillStyle = '#fde68a';
    ctx.font = '11px monospace';
    ctx.fillText('⏱ TIEMPO', 20, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`${time.toFixed(2)} s`, 20, 52);

    // Height display
    ctx.fillStyle = '#065f46';
    ctx.fillRect(width - 170, 10, 160, 55);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(width - 170, 10, 160, 55);

    ctx.fillStyle = '#6ee7b7';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('📍 ALTURA', width - 20, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`${height.toFixed(2)} m`, width - 20, 52);

    // Velocity display
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(width - 170, 70, 160, 45);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(width - 170, 70, 160, 45);

    ctx.fillStyle = '#fca5a5';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('🏃 VELOCIDAD', width - 20, 88);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`${Math.abs(velocity).toFixed(2)} m/s`, width - 20, 108);

    // Equation display
    ctx.font = '13px monospace';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.fillText(
      `y(t) = ${initialHeight.toFixed(1)} - ½(${gravity.toFixed(2)})t²`,
      width / 2,
      height - 15
    );

    // Landed indicator
    if (hasLanded) {
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.textAlign = 'center';
      ctx.fillText('💥 ¡IMPACTO!', width / 2, height / 2);
    }

    // Running indicator
    if (isRunning && !hasLanded) {
      ctx.beginPath();
      ctx.arc(width - 25, height - 25, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e';
      ctx.fill();
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'right';
      ctx.fillText('CAYENDO', width - 38, height - 21);
    }
  }, [height, velocity, gravity, initialHeight, time, showVelocityVector, showTrail, trailPoints, isRunning, hasLanded]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full rounded-xl shadow-lg border border-orange-200 bg-white"
      style={{ maxWidth: '800px' }}
    />
  );
};
