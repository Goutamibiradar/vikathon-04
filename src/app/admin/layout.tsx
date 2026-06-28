import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/40 p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
