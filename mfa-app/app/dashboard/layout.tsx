'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-palette-linen">
      {/* Sidebar Component Panel */}
      <Sidebar />

      {/* Primary Workspace Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Real-Time Notification Header */}
        <Header />

        {/* Active Page View Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}