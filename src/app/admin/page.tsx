'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
// mockData removed
import { Restaurant, InspectionReport, Complaint } from '@/types';
import { Building2, FileSpreadsheet, ShieldAlert, CheckCircle, TrendingUp, Users, ArrowUpRight, LogOut } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [inspections, setInspections] = useState<InspectionReport[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, inspRes, compRes] = await Promise.all([
          fetch('/api/restaurants'),
          fetch('/api/inspections'),
          fetch('/api/complaints'),
        ]);
        
        const [restData, inspData, compData] = await Promise.all([
          restRes.json(),
          inspRes.json(),
          compRes.json(),
        ]);

        if (Array.isArray(restData)) setRestaurants(restData);
        if (Array.isArray(inspData)) setInspections(inspData);
        if (Array.isArray(compData)) setComplaints(compData);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      } finally {
        setMounted(true);
      }
    };
    fetchData();
  }, []);

  const totalRestaurants = restaurants.length;
  const totalInspections = inspections.length;
  const pendingComplaints = complaints.filter((c) => c.status === 'Pending').length;
  const activeComplaints = complaints.filter((c) => c.status !== 'Resolved').length;

  // Grade distributions
  const gradeDistribution = [
    { name: 'Grade A', count: restaurants.filter((r) => r.grade === 'A').length, color: '#10b981' },
    { name: 'Grade B', count: restaurants.filter((r) => r.grade === 'B').length, color: '#3b82f6' },
    { name: 'Grade C', count: restaurants.filter((r) => r.grade === 'C').length, color: '#f59e0b' },
    { name: 'Grade F', count: restaurants.filter((r) => r.grade === 'F').length, color: '#ef4444' },
  ];

  // Calculate status distributions for summary cards
  const activeRestaurants = restaurants.filter((r) => r.status === 'Active').length;
  const suspendedRestaurants = restaurants.filter((r) => r.status === 'Suspended').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome to the SafeBite health inspector control panel. Real-time statistics, compliance indexes and alerts.
          </p>
        </div>
        <Link href="/admin/login">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-sm font-medium transition-all duration-200 active:scale-[0.98]">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Restaurants</span>
              <div className="text-3xl font-bold text-slate-950 dark:text-white">{totalRestaurants}</div>
              <p className="text-xs text-slate-500">
                <span className="text-emerald-500 font-semibold">{activeRestaurants}</span> active / <span className="text-rose-500 font-semibold">{suspendedRestaurants}</span> suspended
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inspections Completed</span>
              <div className="text-3xl font-bold text-slate-950 dark:text-white">{totalInspections}</div>
              <p className="text-xs text-slate-500">
                <span className="text-sky-500 font-semibold">100%</span> digitally signed
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Complaints</span>
              <div className="text-3xl font-bold text-slate-950 dark:text-white">{activeComplaints}</div>
              <p className="text-xs text-slate-500">
                <span className="text-amber-500 font-semibold">{pendingComplaints}</span> awaiting response
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compliance Score</span>
              <div className="text-3xl font-bold text-slate-950 dark:text-white">92.5%</div>
              <p className="text-xs text-slate-500">
                <span className="text-emerald-500 font-semibold">+1.2%</span> from last quarter
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts section */}
      {mounted && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Grade Distribution Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Hygiene Grades breakdown</CardTitle>
              <CardDescription>Number of restaurants grouped by health grade</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Restaurant Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Safety Status Share</CardTitle>
              <CardDescription>Ratio of active vs. suspended establishments</CardDescription>
            </CardHeader>
            <CardContent className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={[
                      { name: 'Compliant & Active', value: activeRestaurants, color: '#10b981' },
                      { name: 'Pending Initial Inspection', value: restaurants.filter(r => r.status === 'Pending Inspection').length, color: '#f59e0b' },
                      { name: 'Suspended', value: suspendedRestaurants, color: '#ef4444' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {[
                      <Cell key="c1" fill="#10b981" />,
                      <Cell key="c2" fill="#f59e0b" />,
                      <Cell key="c3" fill="#ef4444" />
                    ]}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lists Summary */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent complaints */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Customer Complaints</CardTitle>
              <CardDescription>Awaiting investigation or inspector dispatch</CardDescription>
            </div>
            <Link href="/admin/complaints" className="text-xs font-bold text-purple-600 hover:underline inline-flex items-center gap-1">
              View Log
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {complaints.length > 0 ? (
              <div className="space-y-4">
                {complaints.slice(0, 3).map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {c.restaurantName} - <span className="text-slate-400 font-medium">{c.category}</span>
                      </div>
                      <p className="text-slate-500 line-clamp-1 mt-1 font-medium">"{c.description}"</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'Pending'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50'
                        : c.status === 'Investigating'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-slate-400 text-xs">No pending complaints submitted.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Inspections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Inspections</CardTitle>
              <CardDescription>Logs and reports filed by sanitarians</CardDescription>
            </div>
            <Link href="/admin/inspections" className="text-xs font-bold text-purple-600 hover:underline inline-flex items-center gap-1">
              View Log
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {inspections.length > 0 ? (
              <div className="space-y-4">
                {inspections.slice(0, 3).map((i) => (
                  <div key={i.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{i.restaurantName}</div>
                      <div className="text-slate-400 mt-0.5">Checked: {i.date} | score: {i.score}%</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                      i.grade === 'A'
                        ? 'bg-emerald-500 text-white'
                        : i.grade === 'B'
                        ? 'bg-sky-500 text-white'
                        : i.grade === 'C'
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}>
                      Grade {i.grade}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-slate-400 text-xs">No reports filed yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
