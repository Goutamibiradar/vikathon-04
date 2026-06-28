'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// mockData removed
import { Restaurant } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, ShieldAlert, Sparkles, MapPin, Search, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function InspectorDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRestaurants(data);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge variant="success">Compliant</Badge>;
      case 'Pending Inspection': return <Badge variant="warning">Inspection Overdue</Badge>;
      case 'Suspended': return <Badge variant="danger">Suspended</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getGradeVariant = (grade: string) => {
    switch (grade) {
      case 'A': return 'success';
      case 'B': return 'info';
      case 'C': return 'warning';
      case 'F': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 text-xs font-bold mb-2 border border-sky-100 dark:border-sky-900/40">
            <Sparkles className="h-3 w-3" />
            <span>Inspector Field Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Active Assignments</h1>
          <p className="text-sm text-slate-500 mt-1">Select an establishment from your route assignment list below to initiate a sanitation audit.</p>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2 text-rose-600 hover:text-rose-700 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/30">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>

      {/* Main card */}
      <Card>
        <CardHeader className="p-6 pb-0">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search assigned route by name or cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((r) => (
              <div key={r.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-all duration-200">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{r.name}</h3>
                    <Badge variant={getGradeVariant(r.grade)}>Grade {r.grade}</Badge>
                    {getStatusBadge(r.status)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {r.address}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Cuisine: {r.cuisine} | Audits: {r.inspectionsCount} | Last checked: {r.lastInspectionDate}
                  </p>
                </div>

                <Link href={`/inspector/restaurants/${r.id}/inspect`} className="w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 focus:ring-sky-500 shadow-sm shadow-sky-500/10">
                    <ClipboardCheck className="h-4 w-4" />
                    New Inspection
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              No assigned restaurants match criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
