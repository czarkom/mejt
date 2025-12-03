import { NextRequest, NextResponse } from 'next/server';
import { InventoryRepository } from '@/lib/entities/InventoryRepository';
import { InventoryUnit } from '@/lib/entities/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid inventory item ID' },
        { status: 400 }
      );
    }

    const item = await InventoryRepository.getById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid inventory item ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate unit if provided
    if (body.unit && !Object.values(InventoryUnit).includes(body.unit as InventoryUnit)) {
      return NextResponse.json(
        { error: 'Invalid unit type' },
        { status: 400 }
      );
    }

    // Convert quantity to number if provided
    if (body.quantity !== undefined) {
      body.quantity = parseFloat(body.quantity);
    }

    const updatedItem = await InventoryRepository.update(id, body);

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid inventory item ID' },
        { status: 400 }
      );
    }

    await InventoryRepository.delete(id);
    return NextResponse.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to delete inventory item' },
      { status: 500 }
    );
  }
}