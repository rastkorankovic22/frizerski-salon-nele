import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDay } from 'date-fns'
import { WORKING_HOURS, CLOSED_DAYS } from '@/lib/constants'

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')
  if (!date) {
    return NextResponse.json({ error: 'Date parameter required' }, { status: 400 })
  }

  const selectedDate = new Date(date + 'T12:00:00')
  if (CLOSED_DAYS.includes(getDay(selectedDate))) {
    return NextResponse.json({ slots: [], message: 'Closed on Sundays' })
  }

  const slots: { time: string; available: boolean }[] = []
  for (let h = WORKING_HOURS.start; h < WORKING_HOURS.end; h++) {
    slots.push({ time: `${h.toString().padStart(2, '0')}:00`, available: true })
  }

  const bookings = await prisma.booking.findMany({
    where: { date, status: { in: ['approved', 'pending'] } },
  })
  const taken = new Set(bookings.map((b) => b.time))
  slots.forEach((s) => { s.available = !taken.has(s.time) })

  return NextResponse.json({ slots, date })
}
