import { NextRequest, NextResponse } from 'next/server';
import { InventoryRepository } from '@/lib/entities/InventoryRepository';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid inventory item ID' },
        { status: 400 }
      );
    }

    const updatedItem = await InventoryRepository.toggleToBuy(id);

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error toggling to buy status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle to buy status' },
      { status: 500 }
    );
  }
}