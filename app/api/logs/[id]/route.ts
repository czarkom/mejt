import { NextRequest, NextResponse } from 'next/server';
import { LogRepository } from '@/lib/entities/LogRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid log ID' },
        { status: 400 }
      );
    }

    const log = await LogRepository.getById(id);
    if (!log) {
      return NextResponse.json(
        { error: 'Log not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error('Error fetching log:', error);
    return NextResponse.json(
      { error: 'Failed to fetch log' },
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
        { error: 'Invalid log ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updatedLog = await LogRepository.update(id, body);

    return NextResponse.json(updatedLog);
  } catch (error) {
    console.error('Error updating log:', error);
    return NextResponse.json(
      { error: 'Failed to update log' },
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
        { error: 'Invalid log ID' },
        { status: 400 }
      );
    }

    await LogRepository.delete(id);
    return NextResponse.json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Error deleting log:', error);
    return NextResponse.json(
      { error: 'Failed to delete log' },
      { status: 500 }
    );
  }
}