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
  notes?: string;
  to_buy?: boolean;
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
  PIECES = 'szt',
  GRAMS = 'g',
  KILOGRAMS = 'kg',
  LITERS = 'l',
  MILLILITERS = 'ml',
  BOTTLES = 'butelki',
  CANS = 'puszki',
  PACKAGES = 'opakowania'
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