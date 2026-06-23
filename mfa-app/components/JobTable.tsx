'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Job = {
  id: string;
  status: string;
  created_at: string;
};

export default function JobTable() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, status, created_at');

      if (error) {
        console.error(error);
        return;
      }

      setJobs(data || []);
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <table className="w-full mt-4 border border-slate-800">
        <thead>
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Created</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-t border-slate-800">
              <td className="p-2">{job.id}</td>
              <td className="p-2">{job.status}</td>
              <td className="p-2">{job.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}