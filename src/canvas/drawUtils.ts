export function drawScene(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  
  // Draw main square
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(-50, -50, 100, 100);
  
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