'use client';

import { Bell, User } from 'lucide-react';

export default function Topbar() {

  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900">
      
      {/* Left */}
      <div className="flex items-center gap-4">
       
        <h1 className="font-semibold">Carpet Flow</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Bell size={20} className="text-slate-400" />
        <User size={20} className="text-slate-400" />
      </div>
    </header>
  );
}