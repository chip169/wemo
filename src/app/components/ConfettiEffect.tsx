import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiEffectProps {
  trigger?: boolean;
  colors?: string[];
}

export function ConfettiEffect({ trigger = false, colors = ['#FFD4D4', '#E8B4A8', '#D4AF78', '#FAF8F5'] }: ConfettiEffectProps) {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true;
      
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          hasTriggered.current = false;
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [trigger, colors]);

  return null;
}
