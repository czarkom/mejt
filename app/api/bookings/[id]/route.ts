import { NextRequest, NextResponse } from 'next/server';
import { BookingRepository } from '@/lib/entities/BookingRepository';
import { BookingPerson, BookingStatus } from '@/lib/entities/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const booking = await BookingRepository.getById(id);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate person if provided
    if (body.person && !Object.values(BookingPerson).includes(body.person as BookingPerson)) {
      return NextResponse.json(
        { error: 'Invalid person. Must be one of: Mama, Tata, Matiz, Mroziak, Pela' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (body.status && !Object.values(BookingStatus).includes(body.status as BookingStatus)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Validate date range if dates are provided
    if (body.start_date && body.end_date) {
      const startDateObj = new Date(body.start_date);
      const endDateObj = new Date(body.end_date);
      
      if (startDateObj > endDateObj) {
        return NextResponse.json(
          { error: 'Start date must be before or equal to end date' },
          { status: 400 }
        );
      }
    }

    const updatedBooking = await BookingRepository.update(id, body);

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    await BookingRepository.delete(id);
    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}