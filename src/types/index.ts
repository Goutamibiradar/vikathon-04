export type HygieneGrade = 'A' | 'B' | 'C' | 'F';

export type RestaurantStatus = 'Active' | 'Pending Inspection' | 'Suspended';

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  hygieneScore: number; // 0-100
  grade: HygieneGrade;
  lastInspectionDate: string;
  ownerName: string;
  ownerEmail: string;
  status: RestaurantStatus;
  inspectionsCount: number;
}

export interface InspectionCriteria {
  cleanliness: number; // 0-10
  foodHandling: number; // 0-10
  pestControl: number; // 0-10
  staffHygiene: number; // 0-10
  temperatureControl: number; // 0-10
}

export interface InspectionReport {
  id: string;
  restaurantId: string;
  restaurantName: string;
  inspectorName: string;
  date: string;
  score: number; // calculated from criteria sum * 2 (0-100)
  grade: HygieneGrade;
  remarks: string;
  imageUrl?: string;
  criteria: InspectionCriteria;
}

export type ComplaintCategory = 'Hygiene' | 'Spoiled Food' | 'Pest Infestation' | 'Staff Behavior' | 'Other';
export type ComplaintStatus = 'Pending' | 'Investigating' | 'Resolved';

export interface Complaint {
  id: string;
  restaurantId: string;
  restaurantName: string;
  customerName: string;
  customerEmail: string;
  incidentDate: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  createdAt: string;
}
