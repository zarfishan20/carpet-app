'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        router.replace('/login');
        return;
      }

      const routes: Record<string, string> = {
        admin: '/dashboard/admin',
        surveyor: '/dashboard/surveyor',
        fitter: '/dashboard/fitter',
      };

      router.replace(routes[profile.role] || '/login');
    };

    run();
  }, [router]);

  return (
    <div className="redirect-container fs-app">
      <div className="redirect-panel">
        <div className="redirect-text">Redirecting...</div>
        <div className="redirect-subtext">Please wait while we take you to your dashboard</div>
      </div>
    </div>
  );
}