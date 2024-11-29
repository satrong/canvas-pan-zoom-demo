export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  lastTranslateX: number;
  lastTranslateY: number;
}

export interface TouchState {
  initialDistance: number;
  initialScale: number;
  center: {
    x: number;
    y: number;
  };
}

export interface Transform {
  translateX: number;
  translateY: number;
  scale: number;
}
