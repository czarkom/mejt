import { NextRequest, NextResponse } from 'next/server';
import { LogRepository } from '@/lib/entities/LogRepository';

export async function GET() {
  try {
    const logs = await LogRepository.getAll();
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, date, location, weather } = body;

    if (!title || !content || !date) {
      return NextResponse.json(
        { error: 'Title, content, and date are required' },
        { status: 400 }
      );
    }

    const newLog = await LogRepository.create({
      title,
      content,
      date,
      location,
      weather,
    });

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json(
      { error: 'Failed to create log' },
      { status: 500 }
    );
  }
}