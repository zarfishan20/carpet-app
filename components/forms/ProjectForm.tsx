'use client';

import { useState } from 'react';

// Explicit type definition for the form payload to satisfy TypeScript rules
export interface ProjectFormData {
  customer_name: string;
  address: string;
  project_type: string;
  date: string;
  fitter: string;
  notes: string;
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
}

export default function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    customer_name: '',
    address: '',
    project_type: 'Carpet Fitting', // Fallback default option
    date: '',
    fitter: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-xl space-y-5 text-white shadow-2xl"
    >
      <div>
        <h3 className="text-lg font-black">Create Project Record</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Initialize a new row tracking pipeline logs.
        </p>
      </div>

      <div className="space-y-4">
        {/* Row 1: Customer Name & Assigned Fitter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Customer Name
            </label>
            <input 
              type="text" 
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition text-white"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Assigned Fitter
            </label>
            <input 
              type="text"
              value={formData.fitter}
              onChange={(e) => setFormData({ ...formData, fitter: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition text-white"
              placeholder="Fitter Name"
            />
          </div>
        </div>

        {/* Row 2: Project Type & Target Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Project Type
            </label>
            <select
              value={formData.project_type}
              onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white transition cursor-pointer"
            >
              <option value="Carpet Fitting">Carpet Fitting</option>
              <option value="Vinyl Layout">Vinyl Layout</option>
              <option value="Laminate Fitting">Laminate Fitting</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Target Date
            </label>
            <input 
              type="date" 
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-white transition uppercase text-xs" 
            />
          </div>
        </div>

        {/* Row 3: Installation Address */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Installation Address
          </label>
          <input 
            type="text" 
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition text-white"
            placeholder="123 Street Name, Town"
          />
        </div>

        {/* Row 4: Scope Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Notes
          </label>
          <textarea 
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition resize-none text-white"
            placeholder="Additional requirements..."
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition"
        >
          Dispatch Project
        </button>
      </div>
    </form>
  );
}