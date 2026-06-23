'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { JobStatus } from '@/lib/types';

export default function EditJob({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  // Safe unwrapping mechanism for async layout routing contexts
  const resolvedParams = params instanceof Promise ? use(params) : params;

  const [status, setStatus] = useState<JobStatus | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('status')
        .eq('id', resolvedParams.id)
        .single();

      if (error || !data) {
        console.error(error);
        return;
      }

      setStatus(data.status as JobStatus);
    };

    fetchJob();
  }, [resolvedParams.id]);

  const update = async () => {
    if (!status) return;

    setLoading(true);

    const { error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', resolvedParams.id);

    setLoading(false);

    if (error) {
      console.error(error);
      return;
    }

    router.push('/dashboard/admin/jobs');
  };

  return (
    <div className="fs-app">
      {/* HEADER SECTION */}
      <div className="view-header">
        <h1 className="view-title">Edit Job</h1>
      </div>

      {/* RE-STYLED CARD FOR DESIGN CONSISTENCY */}
      <div className="editor-container">
        <div className="ruler-strip" />
        
        <div className="editor-form">
          <div className="form-group">
            <label className="form-label">JOB WORKFLOW STATUS</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatus)}
              className="form-select"
              disabled={loading}
            >
              <option value="SURVEY_REQUESTED">SURVEY REQUESTED</option>
              <option value="SURVEY_BOOKED">SURVEY BOOKED</option>
              <option value="SURVEY_DONE">SURVEY DONE</option>
              <option value="QUOTE_SENT">QUOTE SENT</option>
              <option value="APPROVED">APPROVED</option>
              <option value="INSTALL_SCHEDULED">INSTALL SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              onClick={update}
              disabled={loading}
              className="primary-action-btn"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>

            <Link href="/dashboard/admin/jobs" className="secondary-action-btn">
              CANCEL
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}