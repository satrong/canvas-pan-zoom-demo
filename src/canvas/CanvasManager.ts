import { Transform } from '../types/transform';
import { DragState } from '../types/dragState';
import { drawScene } from '../utils/drawUtils';
import { TouchState } from '../types/touchState';

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scaleIndicator: HTMLDivElement;
  private transform: Transform = { translateX: 0, translateY: 0, scale: 1 };
  private dragState: DragState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    lastTranslateX: 0,
    lastTranslateY: 0
  };
  private touchState: TouchState = {
    initialDistance: 0,
    initialScale: 1,
    center: { x: 0, y: 0 }
  };

  constructor(canvas: HTMLCanvasElement, scaleIndicator: HTMLDivElement) {
    this.canvas = canvas;
    this.scaleIndicator = scaleIndicator;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');
    this.ctx = context;

    this.setupEventListeners();
    this.render();
  }

  private setupEventListeners(): void {
    // Mouse events
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    
    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    this.updateCursor();
  }

  private handleWheel(e: WheelEvent): void {
    e.preventDefault();
    
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(10, this.transform.scale * scaleFactor));

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.transform = {
      scale: newScale,
      translateX: x - (x - this.transform.translateX) * (newScale / this.transform.scale),
      translateY: y - (y - this.transform.translateY) * (newScale / this.transform.scale)
    };

    this.render();
  }

  private handleMouseDown(e: MouseEvent): void {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    
    this.dragState = {
      isDragging: true,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      lastTranslateX: this.transform.translateX,
      lastTranslateY: this.transform.translateY
    };
    
    this.updateCursor();
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.dragState.isDragging) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.transform = {
      ...this.transform,
      translateX: this.dragState.lastTranslateX + (x - this.dragState.startX),
      translateY: this.dragState.lastTranslateY + (y - this.dragState.startY)
    };

    this.render();
  }

  private handleMouseUp(): void {
    this.dragState.isDragging = false;
    this.updateCursor();
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();

    if (e.touches.length === 1) {
      // Single touch - handle as drag
      const touch = e.touches[0];
      this.dragState = {
        isDragging: true,
        startX: touch.clientX - rect.left,
        startY: touch.clientY - rect.top,
        lastTranslateX: this.transform.translateX,
        lastTranslateY: this.transform.translateY
      };
    } else if (e.touches.length === 2) {
      // Double touch - prepare for pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Calculate initial distance and center point
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
      const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

      this.touchState = {
        initialDistance: distance,
        initialScale: this.transform.scale,
        center: { x: centerX, y: centerY }
      };
    }
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();

    if (e.touches.length === 1 && this.dragState.isDragging) {
      // Handle single touch drag
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      this.transform = {
        ...this.transform,
        translateX: this.dragState.lastTranslateX + (x - this.dragState.startX),
        translateY: this.dragState.lastTranslateY + (y - this.dragState.startY)
      };
    } else if (e.touches.length === 2) {
      // Handle pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const scale = Math.max(0.1, Math.min(10, 
        this.touchState.initialScale * (distance / this.touchState.initialDistance)
      ));

      // Calculate new transform maintaining the center point
      const { center } = this.touchState;
      this.transform = {
        scale,
        translateX: center.x - (center.x - this.transform.translateX) * (scale / this.transform.scale),
        translateY: center.y - (center.y - this.transform.translateY) * (scale / this.transform.scale)
      };
    }

    this.render();
  }

  private handleTouchEnd(e: TouchEvent): void {
    e.preventDefault();
    this.dragState.isDragging = false;
    
    // Reset touch state if no touches remain
    if (e.touches.length === 0) {
      this.touchState = {
        initialDistance: 0,
        initialScale: 1,
        center: { x: 0, y: 0 }
      };
    }
  }

  private updateCursor(): void {
    this.canvas.style.cursor = this.dragState.isDragging ? 'grabbing' : 'grab';
  }

  private render(): void {
    const { width, height } = this.canvas;
    
    // Clear the entire canvas with transform reset
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, width, height);

    // Apply current transform
    this.ctx.setTransform(
      this.transform.scale,
      0,
      0,
      this.transform.scale,
      this.transform.translateX,
      this.transform.translateY
    );

    // Draw scene
    drawScene(this.ctx, this.dragState.isDragging);

    // Update scale indicator
    this.scaleIndicator.textContent = `Scale: ${this.transform.scale.toFixed(2)}x`;
  }
}