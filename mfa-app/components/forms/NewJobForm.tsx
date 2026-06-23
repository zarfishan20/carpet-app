'use client';

import React, { useState } from 'react';
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NewJobFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewJobForm({ onClose, onSuccess }: NewJobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer Table Fields (Required by Schema)
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');

  // Job Table Fields
  const [scheduledDate, setScheduledDate] = useState('2026-06-23');
  const [totalPrice, setTotalPrice] = useState('2500');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // 1. Insert Customer matching strict constraints
    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .insert([
        { 
          name: customerName,
          phone: phone,
          email: email || null,
          address_line1: addressLine1,
          address_line2: addressLine2 || null,
          city: city,
          postcode: postcode,
          address: `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${city}, ${postcode}`
        }
      ])
      .select()
      .single();

    if (customerError) {
      console.error("CUSTOMER INSERT ERROR:", customerError);
      throw new Error(`Customer Save Failed: ${customerError.message}`);
    }

    // 2. Insert Job linked via customer_id
    // NOTE: If 'SURVEY_SUBMITTED' causes an enum error, try changing it to 'pending' or whatever your database enum expects.
    const { error: jobError } = await supabase
      .from("jobs")
      .insert([
        {
          customer_id: customerData.id,
          scheduled_date: scheduledDate || null,
          total_price: parseFloat(totalPrice) || 0,
          notes: notes || null,
          status: 'SURVEY_SUBMITTED' 
        }
      ]);

    if (jobError) {
      console.error("JOB INSERT ERROR:", jobError);
      throw new Error(`Job Save Failed: ${jobError.message}`);
    }

    onSuccess();
  } catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : String(err);
  console.error("🚨 FULL SUBMISSION ERROR DETAIL:", err);
  alert(`Database Error: ${errorMessage}`);
} finally {
  setIsSubmitting(false);
}
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-[#F9F6F0] w-full max-w-xl rounded-2xl shadow-2xl border border-[#2A1E17]/10 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 border-b border-[#2A1E17]/5 flex justify-between items-center bg-[#F0EAE1]">
          <h3 className="text-xl font-serif font-medium text-[#2A1E17]">Create Job Record</h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-[#2A1E17]/40 hover:text-[#2A1E17] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-left">
          
          <h4 className="text-xs font-bold tracking-wider text-[#BD5338] uppercase border-b border-[#2A1E17]/5 pb-1">Customer Information</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Customer Name *</label>
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Marquez Residence" className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Phone Number *</label>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(415) 555-0182" className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Address Line 1 *</label>
              <input type="text" required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="248 Linden Ave" className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Address Line 2</label>
              <input type="text" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Suite / Apt" className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">City *</label>
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Oakland" className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Postcode *</label>
              <input type="text" required value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="CA 94608" className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" />
            </div>
          </div>

          <h4 className="text-xs font-bold tracking-wider text-[#BD5338] uppercase border-b border-[#2A1E17]/5 pt-2 pb-1">Job Details</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Scheduled Date</label>
              <input type="date" required value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-mono font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Total Price ($)</label>
              <input type="number" required value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} placeholder="2500" className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2A1E17]/60">Job Notes & Scope</label>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add specific technical room sizes or installation details..." className="w-full bg-white border border-[#2A1E17]/15 rounded-xl px-4 py-2.5 font-medium text-[#2A1E17] focus:outline-none focus:border-[#BD5338] resize-none" />
          </div>

          {/* Controls Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2A1E17]/5 bg-[#F0EAE1] -mx-6 -mb-6 p-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold uppercase text-[#2A1E17]/60 hover:bg-[#2A1E17]/5 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-[#BD5338] hover:bg-[#A3432B] disabled:opacity-50 text-white font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer">
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              <span>{isSubmitting ? "Saving..." : "Add job"}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}