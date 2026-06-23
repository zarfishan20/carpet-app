'use client';

// Explicitly mapping potential values from your database tables
type StatusType = 'pending' | 'in-progress' | 'completed' | 'cancelled' | string;

interface StatusBadgeProps {
  status: StatusType;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Normalize the text string to handle any capitalization variance from SQL entries safely
  const normalized = (status || '').toLowerCase().trim();

  // Tailored modern transparent colored pill treatments optimized for dark mode (slate-950 layouts)
  const styles: Record<string, string> = {
    'pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'in-progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'cancelled': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  // Graceful visual fallback configuration if a row doesn't have an explicitly defined match group
  const currentStyle = styles[normalized] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${currentStyle} select-none shrink-0`}>
      {status || 'unknown'}
    </span>
  );
}