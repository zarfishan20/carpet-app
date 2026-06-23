'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CalendarDays, 
  Receipt, 
  BarChart3, 
  ClipboardCheck, // Added for Surveys
  Wrench,         // Added for Fitters
  User,
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Added your new operational categories right alongside your traditional pipeline
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin' },
    { label: 'Leads', icon: Users, href: '/dashboard/admin/leads' },
    { label: 'Quotes', icon: FileText, href: '/dashboard/admin/quotes' },
    { label: 'Surveys', icon: ClipboardCheck, href: '/dashboard/admin/surveys' },
    { label: 'Jobs', icon: CalendarDays, href: '/dashboard/admin/jobs' },
    { label: 'Fitters', icon: Wrench, href: '/dashboard/admin/fitters' },
    { label: 'Invoices', icon: Receipt, href: '/dashboard/admin/invoices' },
    { label: 'Reports', icon: BarChart3, href: '/dashboard/admin/reports' },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    if (confirm('Are you sure you want to sign out?')) {
      router.push('/login');
    }
  };

  // Render function returning clean Tailwind v4 semantic utility markup
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-palette-walnut p-4 text-palette-linen-deep justify-between select-none">
      
      {/* Top Section: Branding Identity & Menu Items */}
      <div className="space-y-7">
        
        {/* Tricolor stack identity element */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex flex-col gap-0.5">
            <div className="flex w-6 h-3.5 rounded-sm overflow-hidden mb-1">
              <span className="flex-1 bg-palette-terracotta" />
              <span className="flex-1 bg-palette-amber" />
              <span className="flex-1 bg-palette-moss" />
            </div>
            <h1 className="text-sm font-bold tracking-[0.08em] font-serif uppercase text-palette-card leading-none">
              Heartwood
            </h1>
            <span className="text-[9px] tracking-[0.28em] font-mono text-palette-linen-deep opacity-40 uppercase mt-0.5">
              Flooring Co.
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/admin' && pathname === '/admin/dashboard-view');

            return (
              <button
                key={item.label}
                onClick={() => {
                  router.push(item.href);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 select-none cursor-pointer ${
                  isActive
                    /* Exact match from mockup: Terracotta background with 12% alpha blend, brighter terracotta text */
                    ? 'bg-palette-terracotta/12 text-palette-terracotta-light font-semibold'
                    /* Unselected item design */
                    : 'text-palette-linen-deep/65 hover:text-palette-linen-deep hover:bg-palette-linen-deep/4'
                }`}
              >
                <Icon 
                  size={18} 
                  className={`stroke-[2] transition-colors ${
                    isActive 
                      ? 'text-palette-terracotta-light' 
                      : 'text-palette-linen-deep/50'
                  }`} 
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: User Identity Block & Logout Action */}
      <div className="pt-4 border-t border-palette-linen-deep/10 space-y-2">
        <div className="flex items-center gap-3 px-2.5 py-1.5">
          <div className="w-8 h-8 rounded-full bg-palette-linen-deep/15 text-palette-card flex items-center justify-center font-bold text-xs shadow-inner">
            <User size={15} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-palette-card truncate">Admin User</span>
            <span className="text-[10px] text-palette-linen-deep/40 truncate">shop@heartwood.com</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium tracking-wide text-palette-linen-deep/50 hover:text-palette-brick hover:opacity-100 transition-colors duration-150 cursor-pointer"
        >
          <LogOut size={13} className="stroke-[2]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Panel Viewport Frame */}
      <aside className="hidden md:block w-[240px] shrink-0 h-full border-r border-palette-rule">
        {renderSidebarContent()}
      </aside>

      {/* 2. Mobile Floating Menu Trigger Button */}
      <div className="absolute top-3 left-4 z-40 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 text-palette-ink border border-palette-rule bg-palette-card rounded-md shadow-sm transition-colors active:bg-palette-linen-deep cursor-pointer"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* 3. Mobile Navigation Drawer Slide Over Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-palette-walnut/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="relative flex flex-col w-64 max-w-xs h-full z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            <button 
              className="absolute top-3.5 right-3.5 p-1 text-palette-card opacity-60 hover:opacity-100 z-50 cursor-pointer" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
            {renderSidebarContent()}
          </div>
        </div>
      )}
    </>
  );
}