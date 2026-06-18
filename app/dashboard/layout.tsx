'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Ruler, Truck, Layers } from 'lucide-react';

export default function DashboardUniversalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Force-mount the client layout the split second the phone screen boots up
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const navigationLinks = [
    { name: 'HQ Ops', href: '/dashboard/admin', icon: ShieldAlert },
    { name: 'Survey Suite', href: '/dashboard/surveyor', icon: Ruler },
    { name: 'Fitter Desk', href: '/dashboard/fitter', icon: Truck },
  ];

  // Render a clean structural placeholder frame while the phone syncs up
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center font-mono text-xs tracking-widest uppercase">
        Initializing PWA Matrix...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-sky-500/30">
      <head>
        <link rel="canonical" href={`https://your-project-name.vercel.app${pathname}`} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      {/* Upper Brand Control Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/60 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-linear-to-tr from-sky-500 to-indigo-500 p-2 rounded-xl shadow-lg shadow-sky-500/10">
            <Layers className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight uppercase bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
              Carpet Flow
            </span>
            <span className="text-[10px] block font-mono text-sky-400/80 tracking-widest uppercase -mt-0.5">PRO SYSTEM</span>
          </div>
        </div>

        {/* Status Network Pill */}
        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-full shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Sync Active</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto pb-24 md:pb-0">
        
        {/* Desktop Sidebar Navigation Panels */}
        <aside className="hidden md:flex flex-col w-64 p-6 border-r border-slate-900/40 space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Workspace Hubs</p>
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/15 scale-[1.02]'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'text-slate-400'} />
                {link.name}
              </Link>
            );
          })}
        </aside>

        {/* Dynamic Inner Content Matrix */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Sticky Core Footer Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2.5 shadow-2xl flex justify-around items-center rounded-t-2xl">
        {navigationLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
                isActive ? 'text-sky-400 scale-105 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : ''} />
              <span className="text-[10px] tracking-tight">{link.name}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}