import { supabase } from '../supabase';
import { LogEntry } from './types';

export class LogRepository {
  static async getAll(): Promise<LogEntry[]> {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getById(id: number): Promise<LogEntry | null> {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async create(log: Omit<LogEntry, 'id' | 'created_at'>): Promise<LogEntry> {
    const { data, error } = await supabase
      .from('logs')
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: number, updates: Partial<LogEntry>): Promise<LogEntry> {
    const { data, error } = await supabase
      .from('logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('logs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}