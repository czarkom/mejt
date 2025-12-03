import { supabase } from '../supabase';
import { InventoryItem } from './types';

export class InventoryRepository {
  static async getAll(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async getById(id: number): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async create(item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from('inventory')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: number, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from('inventory')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async getByCategory(category: string): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async getLowStock(threshold: number = 5): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .lte('quantity', threshold)
      .order('quantity', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async getToBuyItems(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('to_buy', true)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async toggleToBuy(id: number): Promise<InventoryItem> {
    // First get current state
    const { data: currentItem, error: fetchError } = await supabase
      .from('inventory')
      .select('to_buy')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Toggle the to_buy status
    const { data, error } = await supabase
      .from('inventory')
      .update({ to_buy: !currentItem.to_buy, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}