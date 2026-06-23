'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function NewJobPage() {
  const router = useRouter();

  const [status, setStatus] = useState('SURVEY_REQUESTED');
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);

  const createJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId.trim()) return;

    setLoading(true);

    const { error } = await supabase.from('jobs').insert({
      customer_id: customerId.trim(),
      status,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert('Failed to generate job tracking instance.');
      return;
    }

    router.push('/dashboard/admin/jobs');
  };

  return (
    <div className="fs-app">
      {/* HEADER SECTION */}
      <div className="view-header">
        <h1 className="view-title">Create Job</h1>
      </div>

      {/* DESIGN SPEC CARD BOUNDARY */}
      <div className="editor-container">
        <div className="ruler-strip" />

        <form onSubmit={createJob} className="editor-form">
          
          <div className="form-group">
            <label className="form-label">CUSTOMER ASSIGNMENT ID</label>
            <input
              type="text"
              required
              placeholder="e.g. 40728cbe-..."
              className="form-input"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">INITIAL INITIALIZATION STATUS</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
              type="submit"
              disabled={loading || !customerId.trim()}
              className="primary-action-btn"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              {loading ? 'CREATING...' : 'CREATE JOB'}
            </button>

            <Link href="/dashboard/admin/jobs" className="secondary-action-btn">
              CANCEL
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}