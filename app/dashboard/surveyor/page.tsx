'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Ruler, MapPin, Phone, Layers, PlusCircle} from 'lucide-react';

interface Job {
  id: string;
  client_name: string;
  client_address: string;
  client_phone?: string;
  status: string;
}

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function SurveyorSuite() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJobId, setActiveJobId] = useState<string>('');
  
  // Room Metric Inputs
  const [roomName, setRoomName] = useState('');
  const [lengthMeters, setLengthMeters] = useState('');
  const [widthMeters, setWidthMeters] = useState('');
  const [sketchUrl, setSketchUrl] = useState(''); // Simulated storage link for simplicity

  const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!isClient) return;
    async function fetchSurveyableJobs() {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .in('status', ['pending_survey', 'jobsheet_created']);
      if (data) setJobs(data);
    }
    fetchSurveyableJobs();
  }, [supabase, isClient]);

  if (!isClient) return <div className="text-center p-8 font-mono text-xs text-slate-500 animate-pulse">BOOTING SURVEY SUITE...</div>;

  const activeJobDetails = jobs.find(j => j.id === activeJobId);

  const handleSaveRoomData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJobId || !roomName || !lengthMeters || !widthMeters) return;

    // 1. Log the room matrix dimensions
    const { error: roomError } = await supabase.from('job_rooms').insert({
      job_id: activeJobId,
      room_name: roomName,
      length_meters: parseFloat(lengthMeters),
      width_meters: parseFloat(widthMeters),
      sketch_image_url: sketchUrl || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=300&q=80"
    });

    if (!roomError) {
      // 2. Advance the job status forward automatically
      await supabase.from('jobs').update({ status: 'survey_completed' }).eq('id', activeJobId);
      
      alert('Room dimensions submitted successfully.');
      setRoomName('');
      setLengthMeters('');
      setWidthMeters('');
      setSketchUrl('');
      setActiveJobId('');
      
      // Refresh list
      const { data } = await supabase.from('jobs').select('*').in('status', ['pending_survey', 'jobsheet_created']);
      if (data) setJobs(data);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Ruler className="text-sky-400 stroke-[2.5]" /> Field Survey Hub
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Capture real-time flooring parameters on-site.</p>
      </div>

      {/* Touch Job Picker Element */}
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-3">
        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">Select Target Property</label>
        <select 
          value={activeJobId} 
          onChange={e => setActiveJobId(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-semibold text-white focus:outline-none"
        >
          <option value="">Choose Site Allocation...</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.client_name} - {j.client_address.slice(0, 15)}...</option>)}
        </select>

        {activeJobDetails && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2 mt-2">
            <p className="flex items-start gap-1.5 text-slate-300"><MapPin size={14} className="text-slate-500 shrink-0 mt-0.5" /> {activeJobDetails.client_address}</p>
            {activeJobDetails.client_phone && <p className="flex items-center gap-1.5 text-slate-300"><Phone size={14} className="text-slate-500" /> {activeJobDetails.client_phone}</p>}
          </div>
        )}
      </div>

      {/* Touch Metric Entry Block */}
      {activeJobId && (
        <form onSubmit={handleSaveRoomData} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-1.5"><Layers size={16} className="text-sky-400" /> Room Dimensions</h2>
          
          <div>
            <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Room Label</label>
            <input type="text" required value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="e.g. Master Bedroom" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Length (meters)</label>
              <input type="number" step="0.01" required value={lengthMeters} onChange={e => setLengthMeters(e.target.value)} placeholder="5.40" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Width (meters)</label>
              <input type="number" step="0.01" required value={widthMeters} onChange={e => setWidthMeters(e.target.value)} placeholder="4.25" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Mock Blueprint Image URL</label>
            <input type="text" value={sketchUrl} onChange={e => setSketchUrl(e.target.value)} placeholder="Optional storage CDN pointer..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none font-mono" />
          </div>

          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2 transition-all">
            <PlusCircle size={16} /> Save Dimension Mapping
          </button>
        </form>
      )}
    </div>
  );
}