'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Square,  Trash2, Save } from 'lucide-react';

interface SurveyorCanvasProps {
  jobId: string;
  onSave: (roomData: {
    roomName: string;
    length: number;
    width: number;
    sketchBlob: Blob | null;
  }) => void;
}

export default function SurveyorCanvas({ jobId, onSave }: SurveyorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  
  // Initialize Canvas Context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set line styles for blueprint drawing
    ctx.strokeStyle = '#38bdf8'; // Tailwind sky-400
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  // Drawing Logic Handlers (Supports touch and mouse)
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    
    // Get correct coordinates regardless of mouse vs touch input
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = () => {
    if (!roomName || !length || !width) {
      alert('Please fill out the room name and dimensions first.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Export the drawing to a PNG blob to upload straight to Supabase
    canvas.toBlob((blob) => {
      onSave({
        roomName,
        length: parseFloat(length),
        width: parseFloat(width),
        sketchBlob: blob
      });
    }, 'image/png');
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl max-w-xl mx-auto shadow-xl border border-slate-800">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Square className="text-sky-400" /> New Room Measurement
      </h3>

      {/* Meta Input Fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Room Name</label>
          <input 
            type="text" 
            placeholder="e.g. Master Bedroom, Living Room L-Shape" 
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Length (meters)</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="4.50" 
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Width (meters)</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="3.85" 
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Digital Drawing Canvas Box */}
      <div className="mb-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Draw Layout Shape (Finger / Stylus)</label>
        <div className="relative border border-slate-700 rounded-xl overflow-hidden bg-slate-950">
          <canvas 
            ref={canvasRef}
            width={400}
            height={300}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-[300px] touch-none cursor-crosshair"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-between items-center gap-4">
        <button 
          onClick={clearCanvas}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2.5 rounded-xl transition-all"
        >
          <Trash2 size={18} /> Clear Sketch
        </button>
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-sky-500/20 transition-all ml-auto"
        >
          <Save size={18} /> Save Room Data
        </button>
      </div>
    </div>
  );
}