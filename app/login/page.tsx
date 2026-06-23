'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  Layers,
  KeyRound,
  Mail,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function RootMainPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (!data.user) throw new Error('Login failed');

      // Get role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      if (profile.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/fitter');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">

      {/* Glow background */}
      <div className="absolute w-96 h-96 bg-sky-500/10 blur-[140px] rounded-full top-1/4 left-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl relative z-10">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-sky-500/10 rounded-xl">
              <Layers className="text-sky-400" />
            </div>
          </div>

          <h1 className="text-xl font-bold">Carpet Flow</h1>
          <p className="text-xs text-slate-400">
            Sign in to your workspace
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-xs mb-4">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-xs text-slate-400">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 py-3 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-slate-400">Password</label>
            <div className="relative mt-1">
              <KeyRound className="absolute left-3 top-3 text-slate-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 py-3 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-800 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-500 mt-6">
          Secure admin access portal
        </p>
      </div>
    </div>
  );
}