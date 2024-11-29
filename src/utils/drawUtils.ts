import { applyShadow, clearShadow } from './shadowUtils';

export function drawScene(ctx: CanvasRenderingContext2D, isDragging: boolean = false): void {
  ctx.save();
  
  if (isDragging) {
    applyShadow(ctx, {
      color: 'rgba(0, 0, 0, 0.3)',
      blur: 10,
      offsetX: 5,
      offsetY: 5
    });
  } else {
    clearShadow(ctx);
  }

  // Draw main square
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(-50, -50, 100, 100);
  
  // Clear shadow for the circle stroke
  clearShadow(ctx);
  
  // Draw circle
  ctx.beginPath();
  ctx.arc(0, 0, 75, 0, Math.PI * 2);
  ctx.strokeStyle = '#2196F3';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw coordinate system
  ctx.beginPath();
  ctx.moveTo(-1000, 0);
  ctx.lineTo(1000, 0);
  ctx.moveTo(0, -1000);
  ctx.lineTo(0, 1000);
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.restore();
}