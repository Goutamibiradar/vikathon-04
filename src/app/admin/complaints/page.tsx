'use client';

import React, { useState, useEffect } from 'react';
// removed mockData import
import { Complaint, ComplaintStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle, Search, Mail, Calendar, Sparkles } from 'lucide-react';
import { Input, Select } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

export default function AdminComplaintsPanel() {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComplaints(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleStatusChange = async (id: string, newStatus: ComplaintStatus) => {
    // Optimistic UI update
    const updated = complaints.map((c) => {
      if (c.id === id) {
        return { ...c, status: newStatus };
      }
      return c;
    });
    setComplaints(updated);

    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast(`Complaint status set to ${newStatus}`, 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to update complaint status', 'error');
      // Revert if needed (simplified here)
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Complaints Resolution Console</h1>
        <p className="text-sm text-slate-500 mt-1">Review public notifications of sanitation failures and log inspector updates.</p>
      </div>

      <Card>
        <CardHeader className="p-6 pb-0 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by restaurant name, submitter, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'All Statuses', value: 'All' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Investigating', value: 'Investigating' },
                { label: 'Resolved', value: 'Resolved' },
              ]}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((c) => (
              <Card key={c.id} className="border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30">
                <CardContent className="p-5 flex flex-col lg:flex-row justify-between gap-6">
                  {/* Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{c.restaurantName}</span>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {c.category}
                      </span>
                      <span className={`text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full border ${
                        c.status === 'Pending'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50'
                          : c.status === 'Investigating'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-900 font-medium">
                      "{c.description}"
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Incident Date: {c.incidentDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        Reporter: {c.customerName} ({c.customerEmail})
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col justify-end items-end gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/80 pt-4 lg:pt-0 lg:pl-6 flex-wrap lg:flex-nowrap">
                    <span className="text-[10px] text-slate-400 font-semibold mb-1 w-full text-right hidden lg:block">Cycle Status</span>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {c.status !== 'Pending' && (
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(c.id, 'Pending')} className="text-xs">
                          Pending
                        </Button>
                      )}
                      {c.status !== 'Investigating' && (
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(c.id, 'Investigating')} className="text-xs text-amber-500 hover:text-amber-600 border-amber-100 dark:border-amber-950">
                          Investigate
                        </Button>
                      )}
                      {c.status !== 'Resolved' && (
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(c.id, 'Resolved')} className="text-xs text-emerald-500 hover:text-emerald-600 border-emerald-100 dark:border-emerald-950">
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              No matching complaints log found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
