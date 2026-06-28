'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ClipboardCheck, ArrowLeft, Camera, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
// mockData removed
import { Restaurant, HygieneGrade } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

const criteriaSchema = z.object({
  cleanliness: z.number().min(0).max(10),
  foodHandling: z.number().min(0).max(10),
  pestControl: z.number().min(0).max(10),
  staffHygiene: z.number().min(0).max(10),
  temperatureControl: z.number().min(0).max(10),
});

const inspectionSchema = z.object({
  restaurantId: z.string().min(1),
  inspectorName: z.string().min(2, 'Inspector Name is required'),
  remarks: z.string().min(10, 'Remarks must describe findings in at least 10 characters'),
  criteria: criteriaSchema,
  imageUrl: z.string().optional(),
});

type InspectionFormValues = z.infer<typeof inspectionSchema>;

export default function NewInspectionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const restaurantId = resolvedParams.id;

  const router = useRouter();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      restaurantId: restaurantId,
      inspectorName: 'Officer Alice Smith',
      remarks: '',
      criteria: {
        cleanliness: 8,
        foodHandling: 8,
        pestControl: 8,
        staffHygiene: 8,
        temperatureControl: 8,
      },
      imageUrl: '',
    },
  });

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then(res => res.json())
      .then(data => {
        if (data.restaurant) {
          setRestaurant(data.restaurant);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [restaurantId]);

  // Watch criteria values for live calculation preview
  const cleanlinessVal = watch('criteria.cleanliness');
  const foodHandlingVal = watch('criteria.foodHandling');
  const pestControlVal = watch('criteria.pestControl');
  const staffHygieneVal = watch('criteria.staffHygiene');
  const tempControlVal = watch('criteria.temperatureControl');

  const calculatedScore =
    (Number(cleanlinessVal || 0) +
      Number(foodHandlingVal || 0) +
      Number(pestControlVal || 0) +
      Number(staffHygieneVal || 0) +
      Number(tempControlVal || 0)) *
    2;

  const getPreviewGrade = (score: number): HygieneGrade => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 60) return 'C';
    return 'F';
  };

  const previewGrade = getPreviewGrade(calculatedScore);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      // Mock generate standard image url
      const mockUrl = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80';
      setUploadedImage(mockUrl);
      setValue('imageUrl', mockUrl);
      setIsUploading(false);
      toast('Kitchen image uploaded successfully (simulation completed).', 'success');
    }, 1000);
  };

  const onSubmit = async (data: InspectionFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      toast('Sanitation report signed off and synced successfully.', 'success');
      router.push('/inspector');
    } catch (error) {
      toast('Failed to record inspection report. Try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
        <p className="mt-4 text-slate-500">Retrieving restaurant credentials...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold mt-4 font-sans">Restaurant Record Missing</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/inspector')}>
          Return to assignments
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 flex-1">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.push('/inspector')} className="gap-1.5 p-0">
          <ArrowLeft className="h-4 w-4" />
          Back to Assignments Route
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Main form */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-sky-500" />
                Sanitation Inspection Form
              </CardTitle>
              <CardDescription>
                Performing checklist review for <strong>{restaurant.name}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Inspector Identity */}
                <div className="space-y-1">
                  <Label htmlFor="inspectorName">Signing Inspector</Label>
                  <Input
                    id="inspectorName"
                    type="text"
                    error={errors.inspectorName?.message}
                    {...register('inspectorName')}
                  />
                </div>

                {/* Score sheets sliders */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Section 1: Score Sheet Checklist</h3>
                  
                  {[
                    { key: 'cleanliness', label: 'Cleanliness & General Sanitation (0-10)', desc: 'Floors, food contact surfaces, dishwashers.' },
                    { key: 'foodHandling', label: 'Food Storage & Handling (0-10)', desc: 'Cross contamination mitigation, labeling.' },
                    { key: 'pestControl', label: 'Pest Vector Control (0-10)', desc: 'Absence of flies, rodents or signs of activity.' },
                    { key: 'staffHygiene', label: 'Staff Personal Hygiene (0-10)', desc: 'Hair restraints, clean uniforms, hand washing.' },
                    { key: 'temperatureControl', label: 'Cold / Hot Temperature logs (0-10)', desc: 'Freezers below -18°C, lines above 60°C.' },
                  ].map((field) => (
                    <div key={field.key} className="space-y-1 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <Label htmlFor={`criteria-${field.key}`} className="mb-0">{field.label}</Label>
                        <span className="font-extrabold text-sky-600 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded">
                          {watch(`criteria.${field.key as keyof typeof criteriaSchema.shape}`)} / 10
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{field.desc}</p>
                      <input
                        id={`criteria-${field.key}`}
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 mt-2"
                        {...register(`criteria.${field.key as keyof typeof criteriaSchema.shape}`, { valueAsNumber: true })}
                      />
                    </div>
                  ))}
                </div>

                {/* Section 2: Remarks & photo */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Section 2: Remarks & Logs</h3>
                  
                  <div className="space-y-1">
                    <Label htmlFor="remarks">Inspection Remarks</Label>
                    <Textarea
                      id="remarks"
                      placeholder="Input detailed observations (e.g. hygiene logs, areas of concern, corrective action timelines)..."
                      error={errors.remarks?.message}
                      {...register('remarks')}
                    />
                  </div>

                  {/* Image Upload Simulator */}
                  <div className="space-y-2">
                    <Label>Evidence Photograph</Label>
                    <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-3">
                      {uploadedImage ? (
                        <div className="relative rounded-lg overflow-hidden border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={uploadedImage} alt="Kitchen evidence mock" className="max-h-48 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedImage(null);
                              setValue('imageUrl', '');
                            }}
                            className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-full text-xs hover:bg-rose-500"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <Camera className="h-8 w-8 text-slate-400" />
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Upload kitchen area evidence image</div>
                            <div className="text-[10px] text-slate-400 mt-1">Accepts PNG, JPG (simulation mode)</div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleSimulateUpload}
                            isLoading={isUploading}
                          >
                            Simulate Upload
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-4 bg-sky-600 hover:bg-sky-500 shadow-sm shadow-sky-500/10" isLoading={isSubmitting}>
                  Submit Audit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Score Preview */}
        <div className="space-y-6">
          <Card className="sticky top-20 border-sky-200/50 dark:border-sky-950/50 bg-sky-50/5 dark:bg-sky-950/5">
            <CardHeader>
              <CardTitle className="text-sky-700 dark:text-sky-400 text-base">Audit Rating Preview</CardTitle>
              <CardDescription className="text-xs">
                Real-time grade calculation based on current slide scores.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="mx-auto h-24 w-24 rounded-full border-4 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center bg-white dark:bg-slate-900 shadow-sm">
                <div className="text-4xl font-black text-slate-800 dark:text-white leading-none">
                  {previewGrade}
                </div>
                <div className="text-[9px] text-slate-400 font-extrabold uppercase mt-1">
                  Grade
                </div>
              </div>

              <div>
                <div className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  {calculatedScore} / 100
                </div>
                <div className="text-xs text-slate-400 font-medium">Compliance Index</div>
              </div>

              <div className="text-xs text-slate-500 text-left pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 leading-relaxed">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Updates registry instantly</span>
                </div>
                <div className="flex items-start gap-1">
                  <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>Scores below 60% automatically suspend the restaurant's active status.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
