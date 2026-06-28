import { HygieneGrade } from '@/types';

// Utility functions that don't depend on mock data

export function calculateGrade(score: number): HygieneGrade {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 60) return 'C';
  return 'F';
}
