'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';

interface Job {
  customer_name: string;
  address: string;
}

export default function JobSheetDetail() {
  const [job, setJob] = useState<Job | null>(null);
  const { id } = useParams();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    async function loadJob() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return (window.location.href = '/dashboard/fitter/login');

      const { data } = await supabase.from('jobs').select('*').eq('id', id).single();
      if (isMounted && data) setJob(data);
    }

    loadJob();
    return () => { isMounted = false; };
  }, [supabase, id]);

  if (!job) return <div className="text-white p-6">Loading Job Sheet...</div>;

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-white">
      <h1 className="text-2xl font-black mb-2">{job.customer_name}</h1>
      <p className="text-slate-400 mb-8">{job.address}</p>
      
      <a 
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-green-600 text-center py-4 rounded-xl font-bold hover:bg-green-500 transition"
      >
        Open Navigation
      </a>
    </div>
  );
}