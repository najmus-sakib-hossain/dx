import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook that tracks the size of an element using ResizeObserver.
 * Returns a ref to attach to the element and its current dimensions.
 */
export function useResizeObserver<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
        const entry = entries[0];
        if (entry) {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        }
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new ResizeObserver(handleResize);
        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [handleResize]);

    return { ref, ...size };
}
