import { useRef, useEffect, useCallback } from 'react';
import { useLabStoreMRUV } from '../store/mruvStore';

export const useSimulationMRUV = () => {
  const { isRunning, updatePosition } = useLabStoreMRUV();
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const elapsed = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    if (elapsed > 0 && elapsed < 0.1) {
      updatePosition(elapsed);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [updatePosition]);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, animate]);

  return null;
};
