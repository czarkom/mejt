import { NextRequest, NextResponse } from 'next/server';
import { BookingRepository } from '@/lib/entities/BookingRepository';
import { BookingPerson, BookingStatus } from '@/lib/entities/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const person = searchParams.get('person');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let bookings;
    if (person && Object.values(BookingPerson).includes(person as BookingPerson)) {
      bookings = await BookingRepository.getByPerson(person as BookingPerson);
    } else if (startDate && endDate) {
      bookings = await BookingRepository.getByDateRange(startDate, endDate);
    } else {
      bookings = await BookingRepository.getAll();
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { person, start_date, end_date, comment, status = 'confirmed' } = body;

    if (!person || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Person, start date, and end date are required' },
        { status: 400 }
      );
    }

    // Validate person
    if (!Object.values(BookingPerson).includes(person as BookingPerson)) {
      return NextResponse.json(
        { error: 'Invalid person. Must be one of: Mama, Tata, Matiz, Mroziak, Pela' },
        { status: 400 }
      );
    }

    // Validate status
    if (!Object.values(BookingStatus).includes(status as BookingStatus)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Validate date range
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    
    if (startDateObj > endDateObj) {
      return NextResponse.json(
        { error: 'Start date must be before or equal to end date' },
        { status: 400 }
      );
    }

    // Check availability if status is confirmed
    if (status === 'confirmed') {
      const isAvailable = await BookingRepository.checkAvailability(start_date, end_date);
      if (!isAvailable) {
        return NextResponse.json(
          { error: 'Boat is not available for the selected dates' },
          { status: 409 }
        );
      }
    }

    const newBooking = await BookingRepository.create({
      person: person as BookingPerson,
      start_date,
      end_date,
      comment,
      status: status as BookingStatus,
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}