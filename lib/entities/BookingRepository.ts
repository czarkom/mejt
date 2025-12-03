import { supabase } from '../supabase';
import { Booking, BookingPerson } from './types';

export class BookingRepository {
  static async getAll(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('start_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async getById(id: number): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async create(booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: number, updates: Partial<Booking>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async getByDateRange(startDate: string, endDate: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('start_date', startDate)
      .lte('end_date', endDate)
      .order('start_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async getByPerson(person: BookingPerson): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('person', person)
      .order('start_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async checkAvailability(startDate: string, endDate: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('status', 'confirmed')
      .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);
    
    if (error) throw error;
    return !data || data.length === 0;
  }
}