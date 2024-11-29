import React from 'react';
import { Canvas } from './components/Canvas';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Interactive Canvas</h1>
        <p className="mb-4 text-gray-600">
          Use mouse wheel to zoom, drag to pan the canvas.
        </p>
        <Canvas />
      </div>
    </div>
  );
}

export default App;