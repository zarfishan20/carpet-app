'use client';

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FileCheck, RotateCcw, CheckCircle } from 'lucide-react';

interface FitterSignatureProps {
  jobId: string;
  onCompleteJob: (signData: {
    customerName: string;
    notes: string;
    signatureBlob: Blob | null;
  }) => void;
}

export default function CustomerSignature({ jobId, onCompleteJob }: FitterSignatureProps) {
  const sigPadRef = useRef<SignatureCanvas | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  const clearSignature = () => {
    sigPadRef.current?.clear();
  };

  const handleSubmit = () => {
    if (!customerName) {
      alert('Please print the customer name before submitting.');
      return;
    }

    if (sigPadRef.current?.isEmpty()) {
      alert('Please capture a customer signature for sign-off verification.');
      return;
    }

    // Convert signature vector coordinates into a PNG blob asset
    const canvas = sigPadRef.current?.getTrimmedCanvas();
    if (!canvas) return;

    canvas.toBlob((blob) => {
      onCompleteJob({
        customerName,
        notes,
        signatureBlob: blob,
      });
    }, 'image/png');
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl max-w-xl mx-auto shadow-xl border border-slate-800">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FileCheck className="text-emerald-400" /> Job Completion Sign-Off
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Customer Printed Name
          </label>
          <input
            type="text"
            placeholder="e.g. John Smith"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Fitter Handover Notes (Optional)
          </label>
          <textarea
            placeholder="e.g. Gripper rods replaced on door bar transition..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>
      </div>

      {/* Signature Area */}
      <div className="mb-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Customer Digital Signature
        </label>
        <div className="border border-slate-700 rounded-xl overflow-hidden bg-white">
          <SignatureCanvas
            ref={sigPadRef}
            penColor="#0f172a" // Dark slate pen color
            canvasProps={{
              className: 'w-full h-40 cursor-pencil bg-white touch-none',
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center gap-4">
        <button
          onClick={clearSignature}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2.5 rounded-xl transition-all"
        >
          <RotateCcw size={18} /> Clear Pad
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all ml-auto"
        >
          <CheckCircle size={18} /> Complete & Close Job
        </button>
      </div>
    </div>
  );
}