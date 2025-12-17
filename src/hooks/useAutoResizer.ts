import { useEffect, useRef } from 'react';
import OBR from '@owlbear-rodeo/sdk';

export function useAutoResizer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!OBR.isReady) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (!OBR.isReady) return;
      if (entries.length <= 0) return;
      const entry = entries[0];
      const { height } = entry.contentRect;
      
      if (height <= 0) {
        return;
      }
      OBR.action.setHeight(Math.round(height));
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef.current]);

  return containerRef;
}
