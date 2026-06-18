'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Layers, KeyRound, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function RootMainPage() {
  const supabase = createClient();
  const router = useRouter();

  // Authentication Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Interface Processing States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  // Clear server/client matching checks safely for Next.js PWA environments
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 font-mono text-xs tracking-widest animate-pulse">AUTHENTICATING TERMINAL...</p>
      </div>
    );
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // 🔐 Execute Supabase Auth challenge
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (data?.user) {
        // Fetch profile details to check what role this specific database user has
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          await supabase.auth.signOut();
          throw new Error('Access denied: User profile records not found.');
        }

        // 🔀 Strict dynamic routing based on validated database role parameters
        if (profile.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          // Fitters and surveyors bypass the main landing screen completely anyway. 
          // If they land here accidentally, logging in will reject non-admins from the HQ base link.
          await supabase.auth.signOut();
          throw new Error('Access denied: Secure Executive Control Portal only.');
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Authentication sequence failed.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 antialiased selection:bg-sky-500/30">
      
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl space-y-6 relative z-10">
        
        {/* Core Brand Banner */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-linear-to-tr from-sky-500 to-indigo-500 p-3 rounded-2xl shadow-xl shadow-sky-500/10">
            <Layers className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="pt-2">
            <h1 className="text-xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
              Carpet Flow
            </h1>
            <p className="text-[10px] font-mono text-sky-400/80 tracking-widest uppercase mt-0.5">Admin Security Portal</p>
          </div>
        </div>

        {/* Error Notification Block */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3.5 flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Credentials Form Layout */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Admin Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail size={16} />
              </span>
              <input 
                type="email" 
                required 
                disabled={loading}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@carpetflow.pro" 
                className="w-full bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Security Key</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <KeyRound size={16} />
              </span>
              <input 
                type="password" 
                required 
                disabled={loading}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-linear-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-sky-500/5 active:scale-[0.98] transition-all mt-6 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Authorizing Base Link...
              </>
            ) : (
              'Enter Admin Workspace'
            )}
          </button>
        </form>

        <p className="text-center text-[10px] font-mono text-slate-500 tracking-wide uppercase pt-2">
          Secure Administrative Vault Access Only
        </p>

      </div>
    </div>
  );
}