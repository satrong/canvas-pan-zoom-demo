import { CanvasManager } from './canvas/CanvasManager';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <h1>Interactive Canvas</h1>
      <p class="description">Use mouse wheel to zoom, drag to pan the canvas.</p>
      <div class="canvas-container">
        <canvas id="mainCanvas" width="800" height="600"></canvas>
        <div class="scale-indicator"></div>
      </div>
    </div>
  `;

  const canvas = document.querySelector<HTMLCanvasElement>('#mainCanvas');
  const scaleIndicator = document.querySelector<HTMLDivElement>('.scale-indicator');
  
  if (canvas && scaleIndicator) {
    new CanvasManager(canvas, scaleIndicator);
  }
});