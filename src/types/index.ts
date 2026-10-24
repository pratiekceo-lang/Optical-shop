export type FrameShape = 'round' | 'square' | 'geometric' | 'cat-eye' | 'aviator' | 'rimless';
export type FrameMaterial = 'Japanese Titanium' | 'Italian Bio-Acetate' | 'Titanium & Acetate' | 'Stainless Steel';

export interface Frame {
  id: string;
  name: string;
  shape: FrameShape;
  material: FrameMaterial;
  colorName: string;
  colorHex: string;
  secondaryColorHex?: string;
  price: number;
  weightGrams: number;
  lensWidth: number;
  bridgeWidth: number;
  templeLength: number;
  totalWidth: number;
  category: 'all' | 'titanium' | 'acetate' | 'wire' | 'sunglasses' | 'reading';
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  description: string;
  details: string[];
  lensOptions: string[];
  suitableFaceShapes: ('oval' | 'round' | 'square' | 'heart' | 'diamond')[];
}

export interface OpticalService {
  id: string;
  title: string;
  category: 'clinical' | 'fitting' | 'specialty';
  durationMinutes: number;
  price: number;
  priceLabel?: string;
  doctor: string;
  shortDesc: string;
  fullDesc: string;
  includes: string[];
  preparationNote: string;
}

export interface Optometrist {
  id: string;
  name: string;
  title: string;
  credentials: string;
  experienceYears: number;
  specialties: string[];
  bio: string;
  avatarSeed: string;
}

export interface AppointmentBooking {
  id: string;
  bookingRef: string;
  serviceId: string;
  serviceTitle: string;
  servicePrice: number;
  durationMinutes: number;
  optometristId: string;
  optometristName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  insuranceProvider: string;
  notes?: string;
  selectedFrames?: Frame[];
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  createdAt: string;
}
