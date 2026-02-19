import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendStatusEmail } from '@/lib/sendEmail'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status } = await request.json()

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    })

    if (booking.clientEmail) {
      try {
        await sendStatusEmail({
          to: booking.clientEmail,
          clientName: booking.clientName,
          date: booking.date,
          time: booking.time,
          service: booking.service,
          status: status as 'approved' | 'rejected',
        })
      } catch {
        // Booking is still updated; email failure is non-blocking
      }
    }

    return NextResponse.json(booking)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
