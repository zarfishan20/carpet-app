'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Briefcase, CheckCircle2, Clock } from 'lucide-react';

interface Job {
  id: string;
  customer_name: string;
  date_scheduled: string;
  status: string;
}

export default function AdminDashboard() {
  const supabase = createClient();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [userName, setUserName] = useState<string>('User');

  useEffect(() => {
    async function fetchData() {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();

      const user = userData?.user;

      const name =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email ||
        'User';

      setUserName(name);

      // Fetch jobs
      const { data } = await supabase
        .from('jobs')
        .select('id, customer_name, date_scheduled, status')
        .order('date_scheduled', { ascending: true });

      setJobs(data || []);
    }

    fetchData();
  }, [supabase]);

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-black">
          Hi, {userName}
        </h1>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Projects"
          value={jobs.length}
          icon={<Briefcase size={20} />}
        />
        <StatCard
          title="Pending"
          value={jobs.filter((j) => j.status === 'pending').length}
          icon={<Clock size={20} />}
        />
        <StatCard
          title="Completed"
          value={jobs.filter((j) => j.status === 'completed').length}
          icon={<CheckCircle2 size={20} />}
        />
      </div>

      {/* Scheduled Projects List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 font-bold">
          Upcoming Schedule
        </div>

        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.id}
              className="flex justify-between items-center p-6 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition"
            >
              <div>
                <p className="font-bold">{job.customer_name}</p>
                <p className="text-xs text-slate-400">
                  {job.date_scheduled}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] bg-slate-800 uppercase font-bold text-slate-300">
                {job.status}
              </span>
            </div>
          ))
        ) : (
          <p className="p-6 text-slate-400">
            No scheduled projects found.
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center gap-2 text-slate-400 mb-2">{icon} {title}</div>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}