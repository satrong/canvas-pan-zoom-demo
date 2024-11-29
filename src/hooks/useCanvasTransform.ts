import { useState, useCallback } from 'react';

interface Transform {
  translateX: number;
  translateY: number;
  scale: number;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  lastTranslateX: number;
  lastTranslateY: number;
}

export function useCanvasTransform(initialScale = 1) {
  const [transform, setTransform] = useState<Transform>({
    translateX: 0,
    translateY: 0,
    scale: initialScale,
  });

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    lastTranslateX: 0,
    lastTranslateY: 0,
  });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(10, transform.scale * scaleFactor));

    // Calculate zoom center point
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Adjust translation to zoom towards mouse position
    const newTranslateX = x - (x - transform.translateX) * (newScale / transform.scale);
    const newTranslateY = y - (y - transform.translateY) * (newScale / transform.scale);

    setTransform({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY,
    });
  }, [transform]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragState({
      isDragging: true,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      lastTranslateX: transform.translateX,
      lastTranslateY: transform.translateY,
    });
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTransform(prev => ({
      ...prev,
      translateX: dragState.lastTranslateX + (x - dragState.startX),
      translateY: dragState.lastTranslateY + (y - dragState.startY),
    }));
  }, [dragState]);

  const handleMouseUp = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  }, []);

  return {
    transform,
    isDragging: dragState.isDragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}