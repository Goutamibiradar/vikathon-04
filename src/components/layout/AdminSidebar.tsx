'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, FileSpreadsheet, AlertOctagon, Home, ShieldCheck, UserCog } from 'lucide-react';

export const AdminSidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/restaurants', label: 'Manage Restaurants', icon: Store },
    { href: '/admin/inspections', label: 'Inspection Reports', icon: FileSpreadsheet },
    { href: '/admin/complaints', label: 'Complaints Log', icon: AlertOctagon },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      {/* Title / Context */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-purple-500" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Admin Console</span>
        </div>
        <div className="bg-purple-100 dark:bg-purple-950/50 text-[10px] text-purple-700 dark:text-purple-400 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
          System
        </div>
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive(link.href)
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive(link.href) ? 'text-white' : 'text-slate-400'}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Return Home */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-900">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors"
        >
          <Home className="h-4 w-4" />
          Return to Public Site
        </Link>
      </div>
    </aside>
  );
};
