import { useEffect, useRef, useCallback } from 'react';
import { useLabStore } from '../store/labStore';

export function useSimulation() {
  const { isRunning, updatePosition, time, velocity, initialPosition, position } = useLabStore();
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const elapsed = (timestamp - lastTimeRef.current) / 1000; // Convert to seconds
    lastTimeRef.current = timestamp;

    // Update physics at 60fps equivalent
    if (elapsed > 0 && elapsed < 0.1) { // Skip large jumps
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

  return {
    time,
    velocity,
    initialPosition,
    position,
    isRunning,
  };
}
