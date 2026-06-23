'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Job = {
  id: string;
  customer_id: string | null;
  surveyor_id: string | null;
  assigned_fitter_id: string | null;
  status: string;
  scheduled_date: string | null;
  notes: string | null;
  subtotal: number | null;
  labour_cost: number | null;
  total_price: number | null;
  created_at: string;
};

export default function JobDetail({
  params,
}: {
  params: { id: string };
}) {
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setJob(data);
    };

    fetchJob();
  }, [params.id]);

  if (!job) {
    return <div className="p-4">Loading job...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Job Details</h1>

      <div className="bg-slate-900 p-4 rounded space-y-2">
        <p><b>ID:</b> {job.id}</p>
        <p><b>Status:</b> {job.status}</p>
        <p><b>Customer:</b> {job.customer_id}</p>
        <p><b>Surveyor:</b> {job.surveyor_id}</p>
        <p><b>Fitter:</b> {job.assigned_fitter_id}</p>
        <p><b>Total:</b> £{job.total_price ?? 0}</p>
      </div>
    </div>
  );
}