'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, MapPin, Calendar, ClipboardCheck, AlertTriangle, ShieldCheck, Mail, User } from 'lucide-react';
// mockData removed
import { Restaurant, InspectionReport } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RestaurantDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const restaurantId = resolvedParams.id;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [history, setHistory] = useState<InspectionReport[]>([]);
  const [latestReport, setLatestReport] = useState<InspectionReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then(res => res.json())
      .then(data => {
        if (data.restaurant) {
          setRestaurant(data.restaurant);
          setHistory(data.inspections || []);
          if (data.inspections && data.inspections.length > 0) {
            setLatestReport(data.inspections[0]);
          }
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [restaurantId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
        <p className="mt-4 text-slate-500">Loading registry record...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold mt-4">Restaurant Not Found</h2>
        <p className="text-slate-500 mt-2">The record you are requesting could not be located in the safety registry.</p>
        <Link href="/restaurants" className="mt-6 inline-block">
          <Button variant="outline">Back to Search</Button>
        </Link>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-500';
      case 'B': return 'bg-sky-500';
      case 'C': return 'bg-amber-500';
      case 'F': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge variant="success">Active / Compliant</Badge>;
      case 'Pending Inspection': return <Badge variant="warning">Inspection Scheduled</Badge>;
      case 'Suspended': return <Badge variant="danger">License Suspended</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
      {/* Back button */}
      <div>
        <Link href="/restaurants" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </div>

      {/* Hero card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {getStatusBadge(restaurant.status)}
            <Badge variant="neutral" className="text-xs uppercase tracking-wider">{restaurant.cuisine}</Badge>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{restaurant.name}</h1>
            <p className="flex items-center gap-1 text-slate-500 mt-2 text-sm">
              <MapPin className="h-4 w-4 text-slate-400" />
              {restaurant.address}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Owner: {restaurant.ownerName}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              {restaurant.ownerEmail}
            </span>
          </div>
        </div>

        {/* Score Ring / Grade display */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 w-full md:w-auto">
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold ${getGradeColor(restaurant.grade)}`}>
            {restaurant.grade}
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{restaurant.hygieneScore}%</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Sanitation Score</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Last Checked: {restaurant.lastInspectionDate}</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Latest Inspection Breakdown */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Latest Sanitation Report Details
              </CardTitle>
              <CardDescription>
                Criteria ratings from the safety review performed on {restaurant.lastInspectionDate}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {latestReport ? (
                <>
                  {/* Criteria Progress bars */}
                  <div className="space-y-4">
                    {[
                      { label: 'Cleanliness & Sanitation', value: latestReport.criteria.cleanliness },
                      { label: 'Food Handling & Prep', value: latestReport.criteria.foodHandling },
                      { label: 'Pest Control', value: latestReport.criteria.pestControl },
                      { label: 'Staff Personal Hygiene', value: latestReport.criteria.staffHygiene },
                      { label: 'Temperature Control', value: latestReport.criteria.temperatureControl },
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>{item.label}</span>
                          <span>{item.value} / 10</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.value >= 8
                                ? 'bg-emerald-500'
                                : item.value >= 6
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${item.value * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Remarks */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Inspector Remarks</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      "{latestReport.remarks}"
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No inspection details available. Restaurant is pending initial review.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historical Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-slate-500" />
                Sanitation Audit History
              </CardTitle>
              <CardDescription>
                Past inspection occurrences and score history records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {history.map((h) => (
                    <div key={h.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {h.remarks.slice(0, 75)}...
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {h.date}
                          </span>
                          <span>Inspector: {h.inspectorName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{h.score}%</div>
                        <div className="text-[10px] text-slate-400">Grade {h.grade}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No inspection history found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right side info panel */}
        <div className="space-y-6">
          <Card className="border-rose-200/50 dark:border-rose-950/50 bg-rose-50/5 dark:bg-rose-950/5">
            <CardHeader>
              <CardTitle className="text-rose-700 dark:text-rose-400 text-base">Hygiene Concerns?</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                If you have witnessed unsafe kitchen habits, stale food, or pest concerns at this location, file a public complaint.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/complaint?restaurantId=${restaurant.id}`} className="w-full">
                <Button variant="danger" className="w-full text-xs">
                  Report Violation
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">About SafeBite Grades</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-500 dark:text-slate-400 space-y-3 leading-relaxed">
              <p>
                <strong>Grade A (90-100%):</strong> Clean and well-run facility. Correct food safety processes in place.
              </p>
              <p>
                <strong>Grade B (80-89%):</strong> Minor issues identified and logged. Does not pose active safety threat.
              </p>
              <p>
                <strong>Grade C (60-79%):</strong> Moderate issues. Targeted for rapid checkup within 30 days.
              </p>
              <p>
                <strong>Grade F (Below 60%):</strong> Critical sanitation failures. Operation suspended pending hazard mitigation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
