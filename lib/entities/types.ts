export interface LogEntry {
  id?: number;
  created_at?: string;
  title: string;
  content: string;
  date: string;
  location?: string;
  weather?: string;
}

export interface InventoryItem {
  id?: number;
  created_at?: string;
  updated_at?: string;
  name: string;
  quantity: number;
  unit: InventoryUnit;
  category?: string;
  expiry_date?: string;
  notes?: string;
}

export interface Booking {
  id?: number;
  created_at?: string;
  person: BookingPerson;
  start_date: string;
  end_date: string;
  comment?: string;
  status: BookingStatus;
}

export enum InventoryUnit {
  PIECES = 'pieces',
  GRAMS = 'grams',
  KILOGRAMS = 'kg',
  LITERS = 'liters',
  MILLILITERS = 'ml',
  BOTTLES = 'bottles',
  CANS = 'cans',
  PACKAGES = 'packages',
  METERS = 'meters',
  CENTIMETERS = 'cm'
}

export enum BookingPerson {
  MAMA = 'Mama',
  TATA = 'Tata',
  MATIZ = 'Matiz',
  MROZIAK = 'Mroziak',
  PELA = 'Pela'
}

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  CANCELLED = 'cancelled'
}