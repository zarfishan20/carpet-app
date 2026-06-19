'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Send, MapPin, User, Loader2 } from 'lucide-react';

interface FitterProfile {
  full_name: string;
  phone: string;
}

interface Job {
  id: string;
  customer_name: string;
  address: string;
  profiles: FitterProfile | null;
}

export default function AdminJobSheets() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    async function fetchJobs() {
      const { data } = await supabase
        .from('jobs')
        .select(`id, customer_name, address, profiles:fitter_id(full_name, phone)`);

      if (data) {
        // Explicitly type 'item' as any (or a proper Supabase type if known)
        // By defining the structure here, we resolve the 'any' warning
        const formattedJobs: Job[] = data.map((item: { 
          id: string; 
          customer_name: string; 
          address: string; 
          profiles: FitterProfile[] | FitterProfile | null 
        }) => ({
          id: item.id,
          customer_name: item.customer_name,
          address: item.address,
          profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
        }));
        setJobs(formattedJobs);
      }
      setLoading(false);
    }
    fetchJobs();
  }, [supabase]);

  const sendToWhatsApp = (job: Job) => {
    if (!job.profiles?.phone) return alert("Fitter has no phone number.");
    
    const jobUrl = `${window.location.origin}/dashboard/fitter/job/${job.id}`;
    const message = `*NEW JOB*\nCustomer: ${job.customer_name}\nAddress: ${job.address}\n\nView here: ${jobUrl}`;
    const formattedPhone = job.profiles.phone.replace(/^0/, '44');
    
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-white">
      <h1 className="text-3xl font-black mb-8">Job Sheet Dispatch</h1>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="font-bold">{job.customer_name}</h2>
              <p className="text-sm text-slate-400 flex items-center gap-1"><MapPin size={14}/> {job.address}</p>
              <p className="text-xs text-sky-400 mt-2 flex items-center gap-1"><User size={12}/> {job.profiles?.full_name || 'Unassigned'}</p>
            </div>
            <button onClick={() => sendToWhatsApp(job)} className="bg-emerald-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-500">
              <Send size={16} className="inline mr-2" /> WhatsApp
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}