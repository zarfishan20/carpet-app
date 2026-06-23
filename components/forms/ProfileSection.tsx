
'use client';

import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";






export default function ProfileSection() {
  const supabase = createClient();
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({ phone: '', address: '' });

  useEffect(() => {
    async function loadUserProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_profiles')
        .select('phone_number, mailing_address')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          phone: data.phone_number || '',
          address: data.mailing_address || ''
        });
      }
    }
    loadUserProfile();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from('user_profiles').upsert({
        id: user.id,
        phone_number: profile.phone,
        mailing_address: profile.address,
        updated_at: new Date().toISOString()
      });

      if (error) alert(`Error saving information profile: ${error.message}`);
      else alert('Contact information records synchronized!');
    }
    setUpdating(false);
  };

  return (
    <form onSubmit={handleUpdateProfile} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="text-base font-bold">Personal Contact Metadata</h3>
        <p className="text-xs text-slate-400 mt-0.5">Manage your personal direct lines and physical mailing addresses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Direct Mobile Line</label>
          <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="+44 7123 456789" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Personal Address</label>
          <input type="text" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="123 Admin Lane, London" />
        </div>
      </div>

      <button type="submit" disabled={updating} className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold px-4 py-2 rounded-xl transition">
        {updating ? 'Saving Changes...' : 'Update Contact Info'}
      </button>
    </form>
  );
}