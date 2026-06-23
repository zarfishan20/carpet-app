
'use client';

import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";



export default function SecuritySection() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    async function getActiveUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setEmail(user.email);
    }
    getActiveUser();
  }, [supabase]);

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatePayload: { email?: string; password?: string } = {};

    // Validate email updates
    if (email.trim()) updatePayload.email = email;

    // Validate password updates
    if (password) {
      if (password !== confirmPassword) {
        alert("Verification match mismatch! Your chosen passwords do not align.");
        setLoading(false);
        return;
      }
      updatePayload.password = password;
    }

    const { error } = await supabase.auth.updateUser(updatePayload);
    setLoading(false);

    if (error) {
      alert(`Security update rejected: ${error.message}`);
    } else {
      alert('Security configurations triggered! Check your inbox for confirmation links if updating your email address.');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <form onSubmit={handleUpdateSecurity} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="text-base font-bold text-white">Login Credentials & Security Keys</h3>
        <p className="text-xs text-slate-400 mt-0.5">Modify authentication structures securely routing session tokens.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sign-in Email Address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Account Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="••••••••" minLength={6} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="••••••••" minLength={6} />
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold px-4 py-2 rounded-xl transition">
        {loading ? 'Processing Updates...' : 'Apply Security Changes'}
      </button>
    </form>
  );
}