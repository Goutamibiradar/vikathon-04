'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Building2, AlertTriangle, TrendingUp, Activity, FileText, Bell, LogOut, BarChart3, CheckCircle2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Restaurant } from '@/types';

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/restaurants')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRestaurants(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // Dynamic stats
  const activeCount = restaurants.filter(r => r.status === 'Active').length;
  const compliantCount = restaurants.filter(r => r.grade === 'A' || r.grade === 'B').length;
  const complianceRate = restaurants.length > 0 ? ((compliantCount / restaurants.length) * 100).toFixed(1) : '0.0';

  const stats = [
    { label: 'Total Restaurants', value: restaurants.length.toString(), change: '+2', icon: Building2, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Active Inspections', value: '156', change: '+8%', icon: FileText, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { label: 'Active Directory', value: activeCount.toString(), change: 'Live', icon: Activity, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { label: 'Compliance Rate', value: `${complianceRate}%`, change: '+3.1%', icon: CheckCircle2, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  ];
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">SafeBite Admin</h1>
              <p className="text-xs text-slate-500">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin</p>
                <p className="text-xs text-slate-500">admin@safebite.com</p>
              </div>
            </div>
            <Link
              href="/admin/login"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Good evening, Admin 👋
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here&apos;s what&apos;s happening across your food safety network today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                      <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-3 w-3" />
                        {stat.change} this month
                      </div>
                    </div>
                    <div className={`p-3 rounded-2xl ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Building2 className="h-5 w-5" /> Restaurant Directory
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {isLoading ? (
                    <div className="p-6 text-center text-slate-500">Loading restaurants...</div>
                  ) : restaurants.length > 0 ? (
                    restaurants.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                            item.grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                            item.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                            item.grade === 'C' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {item.grade}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{item.address}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge variant={item.status === 'Active' ? 'success' : item.status === 'Suspended' ? 'danger' : 'warning'}>
                            {item.status}
                          </Badge>
                          <Link href={`/restaurants/${item.id}`}>
                            <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500">No restaurants found in database.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg text-slate-800 dark:text-slate-200">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {[
                  { label: 'View All Restaurants', href: '/restaurants', icon: Building2 },
                  { label: 'AI Food Assistant', href: '/assistant', icon: Users },
                  { label: 'Freshness Scanner', href: '/freshness', icon: BarChart3 },
                  { label: 'Voice Inventory', href: '/inventory', icon: Activity },
                ].map((action, idx) => (
                  <Link
                    key={idx}
                    href={action.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-100 dark:border-slate-700/50 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group"
                  >
                    <action.icon className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{action.label}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
