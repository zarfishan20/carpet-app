'use client';

import React, { useState } from 'react';
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client"
interface NewCustomerFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewCustomerForm({ onClose, onSuccess }: NewCustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Schema-mapped Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Combines lines into the standalone 'address' field for simple directory lookup
      const fullAddress = [addressLine1, addressLine2, city, postcode]
        .filter(Boolean)
        .join(', ');

      const { error } = await supabase
        .from("customers")
        .insert([
          {
            name,
            phone,
            email: email || null,
            address_line1: addressLine1,
            address_line2: addressLine2 || null,
            city,
            postcode,
            notes: notes || null,
            address: fullAddress
          }
        ]);

      if (error) throw error;
      
      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("❌ CLIENT INSERTION ERROR:", err);
      alert(`Failed to save customer profile: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-[#F9F6F0] w-full max-w-md rounded-2xl shadow-2xl border border-[#2A1E17]/10 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#2A1E17]/5 flex justify-between items-center bg-[#F0EAE1]">
          <div>
            <span className="text-[9px] uppercase tracking-widest font-bold font-mono text-[#2A1E17]/50">CRM Ledger Entry</span>
            <h3 className="text-xl font-serif font-medium text-[#2A1E17] mt-0.5">Create Customer Account</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-[#2A1E17]/40 hover:text-[#2A1E17] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-left overflow-y-auto flex-1">
          
          {/* Core Info Row */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Customer Name *</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. John Smith" 
              className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" 
            />
          </div>

          {/* Contact Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Phone Number *</label>
              <input 
                type="tel" 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="e.g. 07123 456789" 
                className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com" 
                className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" 
              />
            </div>
          </div>

          <hr className="border-[#2A1E17]/5 my-2" />

          {/* Address Line 1 */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Address Line 1 *</label>
            <input 
              type="text" 
              required 
              value={addressLine1} 
              onChange={(e) => setAddressLine1(e.target.value)} 
              placeholder="e.g. 42 High Street" 
              className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" 
            />
          </div>

          {/* Address Line 2 */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Address Line 2 (Optional)</label>
            <input 
              type="text" 
              value={addressLine2} 
              onChange={(e) => setAddressLine2(e.target.value)} 
              placeholder="e.g. Flat 3B / Suite Room" 
              className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" 
            />
          </div>

          {/* City & Postcode Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">City *</label>
              <input 
                type="text" 
                required 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                placeholder="London" 
                className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Postcode *</label>
              <input 
                type="text" 
                required 
                value={postcode} 
                onChange={(e) => setPostcode(e.target.value)} 
                placeholder="E1 6AN" 
                className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" 
              />
            </div>
          </div>

          {/* General Notes Field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Account Notes / Directives</label>
            <textarea 
              rows={3} 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Add gate codes, customer preferences, structural details..." 
              className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338] resize-none" 
            />
          </div>

          {/* Controls Form Footer Layout */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2A1E17]/5 bg-[#F0EAE1] -mx-6 -mb-6 p-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 rounded-xl font-bold uppercase text-[#2A1E17]/60 hover:bg-[#2A1E17]/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-[#BD5338] hover:bg-[#A3432B] disabled:opacity-50 text-white font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              <span>{isSubmitting ? "Creating..." : "Save Profile"}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}