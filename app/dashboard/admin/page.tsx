'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { ClipboardList, PlusCircle, User, MapPin, Ruler } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'surveyor' | 'fitter';
  phone?: string;
}

interface JobRoom {
  id: string;
  room_name: string;
  length_meters: number;
  width_meters: number;
  sketch_image_url?: string;
}

interface JobCompletion {
  id: string;
  customer_name_printed: string;
  signature_image_url: string;
  notes?: string;
}

interface Job {
  id: string;
  created_at: string;
  client_name: string;
  client_address: string;
  client_phone?: string;
  status: 'pending_survey' | 'survey_completed' | 'jobsheet_created' | 'allocated_to_fitter' | 'completed' | 'invoiced';
  surveyor_id?: string;
  fitter_id?: string;
  job_rooms?: JobRoom[];
  job_completions?: JobCompletion[];
}

export default function AdminDashboard() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [surveyors, setSurveyors] = useState<Profile[]>([]);
  const [fitters, setFitters] = useState<Profile[]>([]);

  // Form States
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedSurveyor, setSelectedSurveyor] = useState('');

  // Fixed cascading render warnings by encapsulating fetch execution safely within the effect block
  useEffect(() => {
    async function initDashboardData() {
      const { data: jobsData } = await supabase
        .from('jobs')
        .select(`*, job_rooms(*), job_completions(*)`)
        .order('created_at', { ascending: false });
      
      const { data: profilesData } = await supabase.from('profiles').select('*');
      
      if (jobsData) setJobs(jobsData as unknown as Job[]);
      if (profilesData) {
        const typedProfiles = profilesData as Profile[];
        setSurveyors(typedProfiles.filter(p => p.role === 'surveyor'));
        setFitters(typedProfiles.filter(p => p.role === 'fitter'));
      }
    }
    
    initDashboardData();
  }, [supabase]);

  // Secondary refetch function called exclusively on form submissions
  const triggerManualRefetch = async () => {
    const { data: jobsData } = await supabase
      .from('jobs')
      .select(`*, job_rooms(*), job_completions(*)`)
      .order('created_at', { ascending: false });
    if (jobsData) setJobs(jobsData as unknown as Job[]);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientAddress) return;

    const { error } = await supabase.from('jobs').insert({
      client_name: clientName,
      client_address: clientAddress,
      client_phone: clientPhone,
      surveyor_id: selectedSurveyor || null,
      status: selectedSurveyor ? 'pending_survey' : 'jobsheet_created'
    });

    if (!error) {
      alert('New job deployment order added successfully.');
      setClientName('');
      setClientAddress('');
      setClientPhone('');
      triggerManualRefetch();
    }
  };

  const assignFitterToJob = async (jobId: string, fitterId: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({ 
        fitter_id: fitterId,
        status: 'allocated_to_fitter'
      })
      .eq('id', jobId);

    if (!error) {
      alert('Fitter dispatched onto project profile matrix maps.');
      triggerManualRefetch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <ClipboardList className="text-sky-400 w-8 h-8" />
          <div>
            <h1 className="text-3xl font-black tracking-tight">HQ Operations Engine</h1>
            <p className="text-slate-400 text-sm">Quote → Measure → Dispatch Control Central</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-4 shadow-xl">
            <h2 className="text-lg font-bold flex items-center gap-2 text-sky-400">
              <PlusCircle size={20} /> Create New Job Lead
            </h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-slate-400 font-semibold mb-1">Customer Name</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required placeholder="Jane Doe" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs uppercase text-slate-400 font-semibold mb-1">Site Address</label>
                <input type="text" value={clientAddress} onChange={e => setClientAddress(e.target.value)} required placeholder="12 London Rd, Barking" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs uppercase text-slate-400 font-semibold mb-1">Phone Number</label>
                <input type="text" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="07123 456789" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs uppercase text-slate-400 font-semibold mb-1">Assign Estimator/Surveyor</label>
                <select value={selectedSurveyor} onChange={e => setSelectedSurveyor(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="">Select Surveyor...</option>
                  {surveyors.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold p-3 rounded-lg shadow-lg shadow-sky-500/10 transition-all">
                Deploy Project Pipeline
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-200">Active Field Deployments</h2>
            
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition-all space-y-4">
                  
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {job.client_name}
                      </h3>
                      <p className="text-slate-400 text-sm flex items-center gap-1 mt-0.5">
                        <MapPin size={14} className="text-slate-500" /> {job.client_address}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      job.status === 'allocated_to_fitter' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {job.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {job.job_rooms && job.job_rooms.length > 0 && (
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                        <Ruler size={12} /> Live Site Survey Readings:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {job.job_rooms.map((room) => (
                          <div key={room.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex gap-3 items-center">
                            {room.sketch_image_url && (
                              <div className="relative w-12 h-12 shrink-0">
                                <Image 
                                  src={room.sketch_image_url} 
                                  alt="Blueprint Layout Preview" 
                                  fill
                                  unoptimized
                                  className="rounded object-cover border border-slate-700 bg-slate-950" 
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-sm text-slate-200">{room.room_name}</p>
                              <p className="text-xs text-slate-400">{room.length_meters}m × {room.width_meters}m</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
                    <div>
                      {job.status === 'completed' && job.job_completions?.[0] && (
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-24 bg-white rounded border border-slate-700">
                            <Image 
                              src={job.job_completions[0].signature_image_url} 
                              alt="Customer Sign-off Verification" 
                              fill
                              unoptimized
                              className="px-2 py-1 object-contain" 
                            />
                          </div>
                          <p className="text-xs text-slate-400">Signed off by: <span className="text-slate-200 font-medium">{job.job_completions[0].customer_name_printed}</span></p>
                        </div>
                      )}
                    </div>

                    {(job.status === 'survey_completed' || job.status === 'pending_survey') && (
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-indigo-400" />
                        <select 
                          onChange={(e) => assignFitterToJob(job.id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs font-medium text-white focus:outline-none"
                          defaultValue=""
                        >
                          <option value="" disabled>Dispatch Fitter onto Site...</option>
                          {fitters.map(f => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}