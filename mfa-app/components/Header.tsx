'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Settings } from 'lucide-react';

interface HeaderProps {
  onMenuTrigger?: () => void;
}

export default function Header({ onMenuTrigger }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="flex items-center justify-between md:justify-end px-6 py-4 border-b border-palette-rule bg-palette-linen shrink-0 select-none">
      
      {/* Mobile Menu Spacer Trigger */}
      <div className="md:hidden flex items-center">
        {onMenuTrigger && (
          <button
            onClick={onMenuTrigger}
            className="p-1.5 text-palette-ink border border-palette-rule bg-palette-card rounded-md shadow-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        )}
      </div>

      {/* Right Side Stack: Icons followed directly by the styled Mockup Time stamp */}
      <div className="flex items-center gap-4">
        
        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setUnreadNotifications(0)}
            className="relative p-2 rounded-lg text-palette-ink-muted/80 hover:text-palette-ink hover:bg-palette-linen-deep/40 transition-all cursor-pointer"
          >
            <Bell size={18} className="stroke-[1.85]" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-palette-terracotta text-[9px] font-bold font-mono text-palette-card ring-2 ring-palette-linen">
                {unreadNotifications}
              </span>
            )}
          </button>

          <button className="p-2 rounded-lg text-palette-ink-muted/80 hover:text-palette-ink hover:bg-palette-linen-deep/40 transition-all cursor-pointer">
            <Settings size={18} className="stroke-[1.85]" />
          </button>
        </div>

        {/* Separator Pipe Line */}
        <div className="h-4 w-[1px] bg-palette-rule" />
        
        {/* Real-Time Stamp precisely on the absolute right end matching mockup alignment */}
        <div className="text-xs font-semibold font-serif text-palette-ink-muted tracking-wide whitespace-nowrap">
          {currentTime || 'Loading date...'}
        </div>

      </div>
    </header>
  );
}