'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Ruler } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setError('Login failed');
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error(profileError);
      setError('Profile not found');
      setLoading(false);
      return;
    }

    const role = profile.role;
    setLoading(false);

    if (role === 'admin') {
      router.replace('/dashboard/admin');
    } else if (role === 'surveyor') {
      router.replace('/dashboard/surveyor');
    } else if (role === 'fitter') {
      router.replace('/dashboard/fitter');
    } else {
      router.replace('/login');
    }
  };

  return (
    <div className="login-container fs-app">
      <div className="login-card">
        <div className="ruler-strip" />

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-brand">
            <Ruler size={22} style={{ color: "var(--amber-dark)" }} />
            <h1 className="login-title">CUTSHEET LOGIN</h1>
          </div>

          {error && <p className="error-message">{error}</p>}

          <label className="form-label">EMAIL ADDRESS</label>
          <input
            className="login-input"
            placeholder="name@company.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <label className="form-label">PASSWORD</label>
          <input
            className="login-input"
            placeholder="••••••••"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'LOGGING IN...' : 'ACCESS SYSTEM'}
          </button>
        </form>
      </div>
    </div>
  );
}