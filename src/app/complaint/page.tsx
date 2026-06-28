'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clipboard } from 'lucide-react';
import { Restaurant, ComplaintCategory } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input, Textarea, Select, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

const complaintSchema = z.object({
  restaurantId: z.string().min(1, 'Please select a restaurant'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email address'),
  incidentDate: z.string().min(1, 'Please select the date of the incident'),
  category: z.enum(['Hygiene', 'Spoiled Food', 'Pest Infestation', 'Staff Behavior', 'Other'], {
    message: 'Please select a category',
  }),
  description: z.string().min(10, 'Please describe the incident in at least 10 characters'),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

function ComplaintFormContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialRestaurantId = searchParams.get('restaurantId') || '';

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      restaurantId: initialRestaurantId,
      customerName: '',
      customerEmail: '',
      incidentDate: '',
      category: 'Hygiene',
      description: '',
    },
  });

  useEffect(() => {
    // Fetch from API so we get real Supabase UUIDs, not mock localStorage IDs
    fetch('/api/restaurants')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRestaurants(data);
      })
      .catch(() => {
        // silently fall back to empty list – user will see the placeholder option
      });
  }, []);

  // Sync query params if it updates
  useEffect(() => {
    if (initialRestaurantId) {
      setValue('restaurantId', initialRestaurantId);
    }
  }, [initialRestaurantId, setValue]);

  const onSubmit = async (data: ComplaintFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      toast('Complaint submitted successfully. Our safety inspectors have been notified.', 'success');
      reset();
      router.push('/restaurants');
    } catch (error) {
      toast('Failed to submit complaint. Please check fields and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { label: string; value: ComplaintCategory }[] = [
    { label: 'General Hygiene & Cleanliness Issue', value: 'Hygiene' },
    { label: 'Stale, Expired or Spoiled Food', value: 'Spoiled Food' },
    { label: 'Pests or Rodents Sighted', value: 'Pest Infestation' },
    { label: 'Unsanitary Staff Handling', value: 'Staff Behavior' },
    { label: 'Other Safety/Health Violation', value: 'Other' },
  ];

  return (
    <Card className="max-w-xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clipboard className="h-5 w-5 text-emerald-500" />
          Safety & Hygiene Complaint Form
        </CardTitle>
        <CardDescription>
          Submit a digital report. Your identity is protected, and our inspection teams will investigate within 48 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Restaurant Selection */}
          <div className="space-y-1">
            <Label htmlFor="restaurantId">Establishment Name</Label>
            <Select
              id="restaurantId"
              error={errors.restaurantId?.message}
              options={[
                { label: 'Select a Restaurant...', value: '' },
                ...restaurants.map((r) => ({ label: r.name, value: r.id })),
              ]}
              {...register('restaurantId')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div className="space-y-1">
              <Label htmlFor="customerName">Your Name</Label>
              <Input
                id="customerName"
                type="text"
                placeholder="John Doe"
                error={errors.customerName?.message}
                {...register('customerName')}
              />
            </div>

            {/* Customer Email */}
            <div className="space-y-1">
              <Label htmlFor="customerEmail">Your Email</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="john@example.com"
                error={errors.customerEmail?.message}
                {...register('customerEmail')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1">
              <Label htmlFor="category">Complaint Category</Label>
              <Select
                id="category"
                error={errors.category?.message}
                options={categories}
                {...register('category')}
              />
            </div>

            {/* Incident Date */}
            <div className="space-y-1">
              <Label htmlFor="incidentDate">Incident Date</Label>
              <Input
                id="incidentDate"
                type="date"
                error={errors.incidentDate?.message}
                {...register('incidentDate')}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Details of Violation</Label>
            <Textarea
              id="description"
              placeholder="Describe what you observed (e.g., pests in eating area, raw food kept on counters, staff not washing hands)..."
              error={errors.description?.message}
              {...register('description')}
            />
          </div>

          <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
            Submit Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ComplaintPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Report a Health Violation</h1>
        <p className="text-sm text-slate-500 mt-2">
          Help us maintain high cleanliness standards. Share safety issues and help protect other community members.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="max-w-xl mx-auto p-12 text-center animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mx-auto mb-4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mx-auto mb-8" />
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          </div>
        }
      >
        <ComplaintFormContainer />
      </Suspense>
    </div>
  );
}
