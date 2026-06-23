'use client';

import React, { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import NewJobForm from "@/components/forms/NewJobForm";

interface Customer {
  id: string;
  name: string | null;
  created_at: string | null;
}

interface Job {
  id: string;
  created_at: string | null;
  total_price: number | null;
  status: string | null;
  scheduled_date: string | null;
  job_name?: string | null;
  material_type?: string | null;
  crew_name?: string | null;
  customers: Customer | null;
}

const localQueryClient = new QueryClient();

function JobsContent() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, customers(*)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return (data as unknown) as Job[];
    }
  });

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-[#2A1E17]/50">OPERATIONS</span>
          <h2 className="text-4xl font-serif text-[#2A1E17] mt-0.5">Installations & Jobs</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#BD5338] hover:bg-[#A3432B] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={14} /> New Job
        </button>
      </div>

      {/* Table Ledger View */}
      <div className="bg-white rounded-2xl border border-[#2A1E17]/5 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F0EAE1]/40 border-b border-[#2A1E17]/5 text-[10px] font-bold uppercase tracking-widest text-[#2A1E17]/50">
              <th className="py-4 px-6">Job Description</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Value</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-[#2A1E17]/5">
            {jobs.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-[#2A1E17]/40 font-medium">No live jobs tracked yet.</td></tr>
            ) : (
              jobs.map((job: Job) => (
                <tr key={job.id} className="hover:bg-[#F9F6F0]/60 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-[#2A1E17]">{job.job_name || "Flooring Installation"}</p>
                    <span className="text-[11px] text-[#2A1E17]/50 block mt-0.5">{job.material_type} • {job.crew_name}</span>
                  </td>
                  <td className="py-4 px-6 font-medium text-[#2A1E17]/80">{job.customers?.name}</td>
                  <td className="py-4 px-6 font-mono text-[#2A1E17]/60">{job.scheduled_date || "TBD"}</td>
                  <td className="py-4 px-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EADCC9] text-[#2A1E17]">{job.status}</span>
                  </td>
                  <td className="py-4 px-6 text-right font-serif font-bold text-base text-[#2A1E17]">${(job.total_price || 0).toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-3 text-[#2A1E17]/30">
                      <Edit2 size={13} className="cursor-pointer hover:text-[#2A1E17]" />
                      <Trash2 size={13} className="cursor-pointer hover:text-[#BD5338]" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Render Component Modal when button active */}
      {isModalOpen && (
        <NewJobForm 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleFormSuccess} 
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <QueryClientProvider client={localQueryClient}>
      <JobsContent />
    </QueryClientProvider>
  );
}