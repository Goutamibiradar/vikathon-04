'use client';

import React, { useState, useEffect } from 'react';
// mockData removed
import { InspectionReport } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Search, Calendar, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminInspectionsLog() {
  const [inspections, setInspections] = useState<InspectionReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/inspections')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setInspections(data);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredInspections = inspections.filter((i) =>
    i.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.inspectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Inspection Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Official repository of completed sanitation reports and health scores.</p>
      </div>

      <Card>
        <CardHeader className="p-6 pb-0 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by restaurant name, inspector, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {filteredInspections.length > 0 ? (
            filteredInspections.map((report) => (
              <Card key={report.id} className="border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30">
                <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-6">
                  {/* Left: Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {report.restaurantName}
                      </h3>
                      <Badge variant={getGradeVariant(report.grade)} className="text-[10px] font-extrabold uppercase py-0.5 px-2">
                        Grade {report.grade}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-900 font-medium">
                      "{report.remarks}"
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {report.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserCheck className="h-3.5 w-3.5" />
                        {report.inspectorName}
                      </span>
                    </div>
                  </div>

                  {/* Right: Scores */}
                  <div className="flex md:flex-col justify-between items-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/80 pt-4 md:pt-0 md:pl-6 flex-wrap md:flex-nowrap">
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900 dark:text-white">{report.score}%</div>
                      <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Hygiene Score</div>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 text-center mt-2">
                      {[
                        { label: 'CLN', val: report.criteria.cleanliness },
                        { label: 'FOD', val: report.criteria.foodHandling },
                        { label: 'PST', val: report.criteria.pestControl },
                        { label: 'HYG', val: report.criteria.staffHygiene },
                        { label: 'TMP', val: report.criteria.temperatureControl },
                      ].map((item, index) => (
                        <div key={index} className="px-1.5 py-1 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                          <div className="text-[7px] text-slate-400 font-extrabold">{item.label}</div>
                          <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{item.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              No inspection records match query.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
