import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDay, format } from 'date-fns'
import { WORKING_HOURS, CLOSED_DAYS } from '@/lib/constants'

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')
  const month = request.nextUrl.searchParams.get('month')

  try {
    if (date) {
      const bookings = await prisma.booking.findMany({
        where: { date },
        orderBy: { time: 'asc' },
      })
      return NextResponse.json(bookings)
    }
    if (month) {
      const [y, m] = month.split('-').map(Number)
      const start = format(new Date(y, m - 1, 1), 'yyyy-MM-dd')
      const end = format(new Date(y, m, 0), 'yyyy-MM-dd')
      const bookings = await prisma.booking.findMany({
        where: {
          date: { gte: start, lte: end },
          status: { in: ['approved', 'pending'] },
        },
      })
      return NextResponse.json(bookings)
    }
    return NextResponse.json({ error: 'Date or month parameter required' }, { status: 400 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, time, clientName, clientPhone, clientEmail, service, notes } = body

    if (!date || !time || !clientName || !clientPhone) {
      return NextResponse.json(
        { error: 'Name, phone, and time slot are required' },
        { status: 400 }
      )
    }

    const d = new Date(date + 'T12:00:00')
    if (CLOSED_DAYS.includes(getDay(d))) {
      return NextResponse.json(
        { error: 'We are closed on Sundays. Please choose another day.' },
        { status: 400 }
      )
    }

    const [h] = time.split(':').map(Number)
    if (h < WORKING_HOURS.start || h >= WORKING_HOURS.end) {
      return NextResponse.json(
        { error: 'Business hours are 8 AM – 5 PM' },
        { status: 400 }
      )
    }

    const existing = await prisma.booking.findUnique({
      where: { date_time: { date, time } },
    })
    if (existing && ['approved', 'pending'].includes(existing.status)) {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please choose another.' },
        { status: 409 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        date,
        time,
        clientName,
        clientPhone,
        clientEmail: clientEmail || null,
        service: service || 'Haircut',
        notes: notes || null,
      },
    })
    return NextResponse.json(booking)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
