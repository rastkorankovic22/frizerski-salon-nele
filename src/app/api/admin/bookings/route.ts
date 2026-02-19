import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get('status')
  const from = request.nextUrl.searchParams.get('from')
  const to = request.nextUrl.searchParams.get('to')

  try {
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (from || to) {
      where.date = {} as Record<string, string>
      if (from) (where.date as Record<string, string>).gte = from
      if (to) (where.date as Record<string, string>).lte = to
    }

    const bookings = await prisma.booking.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    })
    return NextResponse.json(bookings)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
