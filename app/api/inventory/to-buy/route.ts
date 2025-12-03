import { NextResponse } from 'next/server';
import { InventoryRepository } from '@/lib/entities/InventoryRepository';

export async function GET() {
  try {
    const items = await InventoryRepository.getToBuyItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching to-buy items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch to-buy items' },
      { status: 500 }
    );
  }
}