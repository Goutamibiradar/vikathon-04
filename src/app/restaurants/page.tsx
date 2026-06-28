'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, AlertCircle, Calendar } from 'lucide-react';
import { Restaurant } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const restaurantStickers = [
  { emoji: '🍔', top: '15%', left: '8%' },
  { emoji: '🍽️', top: '75%', left: '85%' },
  { emoji: '🧼', top: '40%', left: '92%' },
  { emoji: '🥗', top: '85%', left: '12%' },
  { emoji: '🍕', top: '25%', left: '80%' },
  { emoji: '✨', top: '65%', left: '5%' },
  { emoji: '🏢', top: '10%', left: '50%' },
  { emoji: '🍷', top: '90%', left: '50%' },
  { emoji: '🧹', top: '50%', left: '15%' },
  { emoji: '🧊', top: '20%', left: '25%' },
  { emoji: '🍴', top: '80%', left: '70%' },
  { emoji: '🍩', top: '35%', left: '75%' },
  { emoji: '🥩', top: '55%', left: '25%' },
  { emoji: '☕', top: '12%', left: '60%' },
  { emoji: '🍾', top: '92%', left: '30%' },
  { emoji: '🧁', top: '68%', left: '60%' },
  { emoji: '🌮', top: '45%', left: '8%' },
  { emoji: '📝', top: '8%', left: '35%' },
  { emoji: '✅', top: '78%', left: '40%' },
  { emoji: '🥡', top: '28%', left: '95%' },
];

export default function RestaurantsSearchPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  const cuisines = ['All', ...Array.from(new Set(restaurants.map((r) => r.cuisine)))];
  const grades = ['All', 'A', 'B', 'C', 'F'];

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = cuisineFilter === 'All' || r.cuisine === cuisineFilter;
    const matchesGrade = gradeFilter === 'All' || r.grade === gradeFilter;
    return matchesSearch && matchesCuisine && matchesGrade;
  });

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
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Floating Emojis Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {restaurantStickers.map((sticker, i) => (
          <motion.div
            key={`sticker-${i}`}
            className="absolute text-5xl md:text-6xl drop-shadow-xl opacity-80 dark:opacity-60 z-0"
            style={{ top: sticker.top, left: sticker.left }}
            animate={{ 
              y: [0, -25, 0], 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 9 + (i % 4), 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.8 
            }}
          >
            {sticker.emoji}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Restaurant Hygiene Registry
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real-time access to health scores, sanitation audits, and safety records.
            </p>
          </div>
          <Link href="/complaint">
            <Button variant="outline" className="border-rose-200 text-rose-600 dark:border-rose-950 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20">
              Report Hygiene Violation
            </Button>
          </Link>
        </div>

      {/* Filters bar */}
      <Card className="mb-8">
        <CardContent className="p-5 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by restaurant name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-48">
              <Select
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
                options={cuisines.map((c) => ({ label: c, value: c }))}
              />
            </div>
            <div className="flex-1 md:w-36">
              <Select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                options={grades.map((g) => ({ label: g === 'All' ? 'All Grades' : `Grade ${g}`, value: g }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white dark:bg-slate-900 h-48 border border-slate-200/50 dark:border-slate-800" />
          ))}
        </div>
      ) : filteredRestaurants.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((r) => (
            <Link key={r.id} href={`/restaurants/${r.id}`}>
              <Card className="h-full hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:shadow-md border-t-4 border-t-slate-200 dark:border-t-slate-800 hover:border-t-emerald-500">
                <CardContent className="p-6 flex flex-col h-full justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-slate-950 dark:text-white line-clamp-1">
                        {r.name}
                      </h3>
                      <Badge variant={getGradeVariant(r.grade)} className="text-[10px] font-extrabold uppercase py-0.5 px-2">
                        Grade {r.grade}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="line-clamp-1">{r.address}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-md inline-block">
                      {r.cuisine}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Inspected: {r.lastInspectionDate}
                    </span>
                    <span className="font-bold text-slate-600 dark:text-slate-300">
                      Score: {r.hygieneScore}/100
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 py-16 text-center">
          <CardContent className="flex flex-col items-center justify-center gap-3">
            <AlertCircle className="h-10 w-10 text-slate-300 dark:text-slate-700" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">No restaurants match filters</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Try adjusting your query or filters. Ensure spelling is correct.
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
