import nodemailer from 'nodemailer'

type SendStatusEmailParams = {
  to: string
  clientName: string
  date: string
  time: string
  service: string
  status: 'approved' | 'rejected'
}

export async function sendStatusEmail(params: SendStatusEmailParams) {
  const { to, clientName, date, time, service, status } = params

  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS

  if (!emailUser || !emailPass) {
    throw new Error('Email credentials not configured')
  }

  if (!to || !to.includes('@')) {
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  })

  const subject =
    status === 'approved'
      ? `Booking Confirmed - Nele Barber Shop`
      : `Booking Update - Nele Barber Shop`

  const text =
    status === 'approved'
      ? `Hi ${clientName},\n\nYour appointment has been confirmed!\n\nDate: ${date}\nTime: ${time}\nService: ${service}\n\nSee you soon!\nNele Barber Shop`
      : `Hi ${clientName},\n\nUnfortunately, your appointment for ${date} at ${time} (${service}) could not be confirmed.\n\nPlease book another time slot.\n\nNele Barber Shop`

  await transporter.sendMail({
    from: emailUser,
    to,
    subject,
    text,
  })
}
