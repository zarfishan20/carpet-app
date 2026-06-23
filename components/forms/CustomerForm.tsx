'use client';

import { useState } from 'react';

// Explicit type definition for customer form submit payload
export interface CustomerFormData {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
}

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void; // Fixed: replaced 'any'
  onCancel: () => void;
  initialData?: CustomerFormData;
}


export default function CustomerForm({ onSubmit, onCancel, initialData }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    customer_name: initialData?.customer_name || '',
    customer_phone: initialData?.customer_phone || '',
    customer_address: initialData?.customer_address || '',
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
        <h3 className="text-lg font-black">
          {initialData ? 'Edit Customer Details' : 'Add New Customer Info'}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          This updates customer details across operational job assignments.
        </p>
      </div>

      <div className="space-y-4">
        {/* Customer Name Field */}
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

        {/* Customer Phone Field */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <input 
            type="tel" 
            required
            value={formData.customer_phone}
            onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition text-white"
            placeholder="+44 7123 456789"
          />
        </div>

        {/* Customer Address Field */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Installation Address
          </label>
          <textarea 
            rows={3} 
            required
            value={formData.customer_address}
            onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition resize-none text-white"
            placeholder="123 Carpet Lane, London"
          />
        </div>
      </div>

      {/* Form Action Controls */}
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
          Save Customer Info
        </button>
      </div>
    </form>
  );
}