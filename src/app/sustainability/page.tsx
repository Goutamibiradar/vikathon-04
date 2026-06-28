'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Droplet, Recycle, Wind, TrendingDown, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

// Mock historical data for the chart
const historicalData = [
  { month: 'Jan', foodWaste: 120, waterUsage: 4500, plasticUsage: 45, carbonFootprint: 320 },
  { month: 'Feb', foodWaste: 115, waterUsage: 4300, plasticUsage: 42, carbonFootprint: 310 },
  { month: 'Mar', foodWaste: 98, waterUsage: 4100, plasticUsage: 35, carbonFootprint: 290 },
  { month: 'Apr', foodWaste: 105, waterUsage: 4200, plasticUsage: 38, carbonFootprint: 300 },
  { month: 'May', foodWaste: 90, waterUsage: 3800, plasticUsage: 30, carbonFootprint: 270 },
  { month: 'Jun', foodWaste: 85, waterUsage: 3600, plasticUsage: 25, carbonFootprint: 250 },
];

const MetricCard = ({ title, value, unit, icon: Icon, colorClass, trend }: any) => (
  <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
            <span className="text-sm font-semibold text-slate-500">{unit}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full w-fit">
            <TrendingDown className="h-3 w-3" />
            {trend}% from last month
          </div>
        </div>
        <div className={`p-3 rounded-2xl ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function SustainabilityDashboard() {
  const [currentMetrics, setCurrentMetrics] = useState({
    foodWaste: 85,
    waterUsage: 3600,
    plasticUsage: 25,
    carbonFootprint: 250
  });

  const [insights, setInsights] = useState<string[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const fetchInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const res = await fetch('/api/sustainability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMetrics),
      });
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-4"
            >
              <Leaf className="h-4 w-4" />
              Environmental Impact
            </motion.div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              Sustainability Module
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              Track and reduce your restaurant's environmental footprint. Monitor waste, water, plastics, and emissions in real-time.
            </p>
          </div>
          <Button onClick={fetchInsights} disabled={isLoadingInsights} variant="outline" className="bg-white dark:bg-slate-900">
            <Sparkles className="h-4 w-4 mr-2 text-emerald-500" />
            Refresh AI Insights
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Food Waste" 
            value={currentMetrics.foodWaste} 
            unit="kg" 
            icon={Leaf} 
            colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            trend={5.5}
          />
          <MetricCard 
            title="Water Usage" 
            value={currentMetrics.waterUsage} 
            unit="Liters" 
            icon={Droplet} 
            colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            trend={12.4}
          />
          <MetricCard 
            title="Plastic Usage" 
            value={currentMetrics.plasticUsage} 
            unit="kg" 
            icon={Recycle} 
            colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            trend={16.6}
          />
          <MetricCard 
            title="Carbon Footprint" 
            value={currentMetrics.carbonFootprint} 
            unit="kg CO2" 
            icon={Wind} 
            colorClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            trend={7.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Charts Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 h-full">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800 dark:text-slate-200">6-Month Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="foodWaste" name="Food Waste (kg)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWaste)" />
                      <Area type="monotone" dataKey="carbonFootprint" name="Carbon (kg CO2)" stroke="#64748b" strokeWidth={3} fillOpacity={1} fill="url(#colorCarbon)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-100 dark:border-emerald-900/50 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  AI Insights
                </CardTitle>
                <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                  Targeted recommendations based on your current metrics.
                </p>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {isLoadingInsights ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 space-y-4"
                    >
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                      <span className="text-sm text-emerald-700 dark:text-emerald-500 font-medium animate-pulse">
                        Analyzing metrics...
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="content"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {insights.map((insight, idx) => (
                        <div key={idx} className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-4 shadow-sm border border-emerald-100/50 dark:border-emerald-900/30 flex gap-3 items-start">
                          <div className="shrink-0 h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {insight}
                          </p>
                        </div>
                      ))}
                      
                      {insights.length === 0 && (
                        <div className="text-center py-8 text-emerald-700/50 text-sm">
                          Click refresh to generate insights.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
