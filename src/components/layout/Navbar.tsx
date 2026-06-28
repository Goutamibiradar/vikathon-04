'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, UserCheck, ShieldAlert, Sparkles, ScanLine, Leaf, Package } from 'lucide-react'; // trigger HMR

export const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-md shadow-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-emerald-600 dark:from-white dark:to-emerald-400 bg-clip-text text-transparent">
            SafeBite
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className={`transition-colors ${isActive('/')}`}>
            Home
          </Link>
          <Link href="/restaurants" className={`transition-colors ${isActive('/restaurants')}`}>
            Search
          </Link>
          <Link href="/inventory" className={`flex items-center gap-1.5 transition-colors ${isActive('/inventory')}`}>
            <Package className="h-4 w-4" />
            Inventory
          </Link>
          <Link href="/freshness" className={`flex items-center gap-1.5 transition-colors ${isActive('/freshness')}`}>
            <ScanLine className="h-4 w-4" />
            Scanner
          </Link>
          <Link href="/sustainability" className={`flex items-center gap-1.5 transition-colors ${isActive('/sustainability')}`}>
            <Leaf className="h-4 w-4" />
            Eco
          </Link>
          <Link href="/assistant" className={`flex items-center gap-1.5 transition-colors ${isActive('/assistant')}`}>
            <Sparkles className="h-4 w-4" />
            AI
          </Link>
        </nav>

        {/* Demo Mode / Shortcuts */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-[11px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800">
            <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
            <span>DEMO PORTALS:</span>
          </div>

          <Link
            href="/inspector"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40 transition-all duration-200"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Inspector</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 transition-all duration-200"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Admin Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
