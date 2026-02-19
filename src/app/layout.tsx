import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Nele Barber Shop | Book Your Appointment Online',
  description: 'Professional men\'s barber shop. Book haircuts, beard trims, and grooming services online. Mon–Sat 8 AM – 5 PM.',
  openGraph: {
    title: 'Nele Barber Shop | Book Online',
    description: 'Professional men\'s barber shop. Book your appointment in a few clicks.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${bebas.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-nele-black text-nele-cream">
        {children}
      </body>
    </html>
  )
}
