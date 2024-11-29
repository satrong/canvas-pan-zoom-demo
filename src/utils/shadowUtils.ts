export interface ShadowConfig {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

export function applyShadow(ctx: CanvasRenderingContext2D, config: ShadowConfig): void {
  ctx.shadowColor = config.color;
  ctx.shadowBlur = config.blur;
  ctx.shadowOffsetX = config.offsetX;
  ctx.shadowOffsetY = config.offsetY;
}

export function clearShadow(ctx: CanvasRenderingContext2D): void {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}