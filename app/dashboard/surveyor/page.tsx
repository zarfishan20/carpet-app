'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus } from 'lucide-react';
import { ReactSketchCanvas } from 'react-sketch-canvas';



export default function SurveyorPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([{ name: '', length: '', width: '' }]);
  const [surveyData, setSurveyData] = useState({ name: '', address: '', postcode: '', phone: '', email: '' });

  const addRoom = () => setRooms([...rooms, { name: '', length: '', width: '' }]);
  
  const handleRoomChange = (index: number, field: string, value: string) => {
    const updated = [...rooms];
    updated[index][field as keyof typeof updated[0]] = value;
    setRooms(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // 1. Save main job record
    const { data: job, error: jobError } = await supabase.from('jobs').insert({
      customer_name: surveyData.name,
      address: surveyData.address,
      postcode: surveyData.postcode,
      phone: surveyData.phone,
      email: surveyData.email,
      status: 'new' // Admin will see this status
    }).select().single();

    if (jobError) { console.error(jobError); return; }

    // 2. Save all rooms associated with the job
    await supabase.from('job_rooms').insert(
      rooms.map(room => ({
        job_id: job.id,
        room_name: room.name,
        length: parseFloat(room.length),
        width: parseFloat(room.width)
      }))
    );

    alert('Survey submitted to Admin!');
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-slate-950 min-h-screen text-white">
      <h1 className="text-2xl font-black mb-6 uppercase">New Survey</h1>
      
      {/* Customer Info */}
      <div className="space-y-4 mb-8">
        <input placeholder="Customer Name" className="w-full bg-slate-900 p-3 rounded" onChange={e => setSurveyData({...surveyData, name: e.target.value})} />
        <input placeholder="Address" className="w-full bg-slate-900 p-3 rounded" onChange={e => setSurveyData({...surveyData, address: e.target.value})} />
        {/* ... add other fields like postcode, phone, email ... */}
      </div>

      {/* Room Loop */}
      {rooms.map((room, index) => (
        <div key={index} className="bg-slate-900 p-4 rounded-xl mb-4 border border-slate-800">
          <input placeholder="Room Type (e.g. Lounge)" className="bg-transparent w-full mb-2" onChange={e => handleRoomChange(index, 'name', e.target.value)} />
          <div className="flex gap-2">
            <input placeholder="Length" className="bg-slate-950 p-2 rounded w-1/2" onChange={e => handleRoomChange(index, 'length', e.target.value)} />
            <input placeholder="Width" className="bg-slate-950 p-2 rounded w-1/2" onChange={e => handleRoomChange(index, 'width', e.target.value)} />
          </div>
          <div className="h-40 border border-slate-700 rounded-lg mt-4 overflow-hidden">
      <ReactSketchCanvas 
        strokeWidth={4} 
        strokeColor="white" 
        canvasColor="transparent"
      />
    </div>
        </div>
      ))}

      <button onClick={addRoom} className="flex items-center gap-2 text-sky-400 mb-6"><Plus size={16}/> Add another room</button>
      
      <button 
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-sky-500 py-4 rounded-xl font-bold uppercase"
      >
        {loading ? 'Submitting...' : 'Submit to Admin'}
      </button>
    </div>
  );
}