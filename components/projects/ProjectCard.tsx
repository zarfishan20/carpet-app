'use client';

import { Calendar, MapPin, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from './StatusBadge';

interface ProjectCardProps {
  id: string;
  customerName: string;
  address: string;      // Maps to your table's address column
  fitter: string;       // Maps to your table's fitter column
  date: string;         // Maps to your table's date column
  status: string;       // Maps to your table's status column
}

export default function ProjectCard({ 
  id, 
  customerName, 
  address, 
  fitter, 
  date, 
  status 
}: ProjectCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between h-full group">
      <div>
        {/* Header: Customer Name & Status Badge */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Project Record</span>
            <h3 className="text-base font-bold text-white mt-0.5 group-hover:text-indigo-400 transition-colors">
              {customerName || 'Unnamed Customer'}
            </h3>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Project Meta Details aligned with your DB schema */}
        <div className="space-y-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <User size={14} className="text-slate-500 shrink-0" />
            <span className="truncate">
              <strong className="text-slate-500 font-normal">Fitter:</strong> {fitter || 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-500 shrink-0" />
            <span>
              <strong className="text-slate-500 font-normal">Date:</strong> {date || 'No date set'}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-slate-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              {address || 'No address provided'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Link */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-end">
        <Link 
          href={`/dashboard/admin/projects/${id}`}
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}