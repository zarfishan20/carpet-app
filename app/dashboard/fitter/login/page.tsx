'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function FitterLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push('/dashboard/fitter');
    else alert('Login failed');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Fitter Login</h1>
        <input type="email" placeholder="Email" className="w-full bg-slate-900 p-3 rounded" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full bg-slate-900 p-3 rounded" onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-indigo-600 p-3 rounded font-bold">Sign In</button>
      </form>
    </div>
  );
}