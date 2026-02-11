"use client";

import { useEffect, useRef, useState } from "react";

interface UseMountedReturn {
  isMounted: boolean;
}

/**
 * Hook that returns true after the component has mounted.
 * Useful for avoiding hydration mismatches with client-only content.
 */
export function useMounted(): UseMountedReturn {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return { isMounted };
}

/**
 * Hook that tracks the previous value of a variable.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Hook that debounces a value by a given delay.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
