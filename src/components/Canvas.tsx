import React, { useRef, useEffect } from 'react';
import { useCanvasTransform } from '../hooks/useCanvasTransform';
import { drawScene } from '../utils/canvasUtils';

interface CanvasProps {
  width?: number;
  height?: number;
}

export function Canvas({ width = 800, height = 600 }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    transform,
    isDragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useCanvasTransform();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the entire canvas with transform reset
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Apply current transform
    ctx.setTransform(
      transform.scale,
      0,
      0,
      transform.scale,
      transform.translateX,
      transform.translateY
    );

    // Draw scene with shadow if dragging
    drawScene(ctx, isDragging);
  }, [transform, width, height, isDragging]);

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="touch-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-md text-sm">
        Scale: {transform.scale.toFixed(2)}x
      </div>
    </div>
  );
}