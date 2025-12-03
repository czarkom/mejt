import { NextRequest, NextResponse } from 'next/server';
import { InventoryRepository } from '@/lib/entities/InventoryRepository';
import { InventoryUnit } from '@/lib/entities/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const lowStock = searchParams.get('lowStock');

    let items;
    if (category) {
      items = await InventoryRepository.getByCategory(category);
    } else if (lowStock) {
      const threshold = parseInt(lowStock) || 5;
      items = await InventoryRepository.getLowStock(threshold);
    } else {
      items = await InventoryRepository.getAll();
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, quantity, unit, category, expiry_date, notes } = body;

    if (!name || quantity === undefined || !unit) {
      return NextResponse.json(
        { error: 'Name, quantity, and unit are required' },
        { status: 400 }
      );
    }

    // Validate unit
    if (!Object.values(InventoryUnit).includes(unit as InventoryUnit)) {
      return NextResponse.json(
        { error: 'Invalid unit type' },
        { status: 400 }
      );
    }

    const newItem = await InventoryRepository.create({
      name,
      quantity: parseFloat(quantity),
      unit: unit as InventoryUnit,
      category,
      expiry_date,
      notes,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}