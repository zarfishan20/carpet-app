'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Square, Trash2, Save } from 'lucide-react';

interface SurveyorCanvasProps {
  jobId: string;
  onSave: (roomData: {
    roomName: string;
    length: number;
    width: number;
    sketchBlob: Blob | null;
  }) => void;
}

type Job = {
  id: string;
  name: string;
  status?: string;
};

export default function SurveyorCanvas({
  jobId,
  onSave,
}: SurveyorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [job, setJob] = useState<Job | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [roomName, setRoomName] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');

  // -----------------------------
  // Load Job
  // -----------------------------
  useEffect(() => {
    if (!jobId) return;

    const loadJob = async (id: string) => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error('Failed to load job:', err);
      }
    };

    loadJob(jobId);
  }, [jobId]);

  // -----------------------------
  // Setup Canvas
  // -----------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scale = window.devicePixelRatio || 1;

    canvas.width = 400 * scale;
    canvas.height = 300 * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(scale, scale);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  // -----------------------------
  // Helpers (coords safe for touch + mouse)
  // -----------------------------
  const getCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();

    const clientX =
      'touches' in e
        ? e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX
        : e.clientX;

    const clientY =
      'touches' in e
        ? e.touches[0]?.clientY ?? e.changedTouches[0]?.clientY
        : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // -----------------------------
  // Drawing Handlers
  // -----------------------------
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);

    const { x, y } = getCoords(e, canvas);

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoords(e, canvas);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // -----------------------------
  // Clear Canvas
  // -----------------------------
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // -----------------------------
  // Save
  // -----------------------------
  const handleSubmit = () => {
    if (!roomName || !length || !width) {
      alert('Please fill out all fields.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      onSave({
        roomName,
        length: parseFloat(length),
        width: parseFloat(width),
        sketchBlob: blob,
      });
    }, 'image/png');
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl max-w-xl mx-auto shadow-xl border border-slate-800">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Square className="text-sky-400" /> New Room Measurement
      </h3>

      {/* Inputs */}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            step="0.01"
            placeholder="Length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700"
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="mb-4 border border-slate-700 rounded-xl overflow-hidden bg-slate-950">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-between">
        <button
          onClick={clearCanvas}
          className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700"
        >
          <Trash2 size={18} /> Clear
        </button>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-sky-500 px-6 py-2 rounded-lg font-bold text-black hover:bg-sky-600"
        >
          <Save size={18} /> Save
        </button>
      </div>
    </div>
  );
}