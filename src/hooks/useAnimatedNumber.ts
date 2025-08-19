import { useEffect, useRef, useState } from "react";

export function useAnimatedNumber(targetValue: number, durationMs: number = 500, disabled: boolean = false) {
  const [displayValue, setDisplayValue] = useState<number>(targetValue);
  const rafRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(targetValue);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (disabled) {
      setDisplayValue(targetValue);
      return;
    }

    startValueRef.current = displayValue;
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / durationMs);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const next = startValueRef.current + (targetValue - startValueRef.current) * eased;
      setDisplayValue(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetValue, durationMs, disabled]);

  return Math.round(displayValue);
}


