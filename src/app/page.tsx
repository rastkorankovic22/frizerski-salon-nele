'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Scissors, Clock, MapPin, Calendar } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-nele-black text-nele-cream overflow-hidden">
      {/* Subtle grid pattern background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(201,162,39,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,162,39,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 py-6 px-6 flex justify-between items-center bg-nele-black/80 backdrop-blur-md border-b border-nele-gold/10"
      >
        <Link href="/" className="font-display text-2xl text-nele-gold tracking-wider hover:text-nele-gold-light transition-colors">
          NELE
        </Link>
        <div className="flex gap-6">
          <Link href="/booking" className="text-nele-sand/80 hover:text-nele-gold text-sm font-medium transition-colors hidden sm:block">
            Book Now
          </Link>
          <Link href="/admin" className="text-nele-sand/50 hover:text-nele-sand/80 text-xs transition-colors">
            Admin
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <header className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-nele-gold text-xl md:text-2xl tracking-[0.4em] uppercase mb-6"
          >
            Men&apos;s Barber Shop
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-8xl md:text-[10rem] lg:text-[12rem] text-nele-cream tracking-tight mb-8 relative"
          >
            NELE
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-nele-gold to-transparent" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-nele-sand/80 text-lg md:text-xl max-w-md mx-auto mb-14 leading-relaxed"
          >
            Professional haircuts and grooming.
            <br />
            <span className="text-nele-gold font-medium">Book your appointment online.</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/booking"
              className="group inline-flex items-center gap-2 bg-nele-gold hover:bg-nele-gold-light text-nele-black font-semibold px-10 py-4 rounded-sm transition-all duration-300 shadow-nele hover:shadow-gold-glow"
            >
              <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
              Book Appointment
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative scissors */}
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 0.15, rotate: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-20 right-10 md:right-20"
        >
          <Scissors className="w-24 h-24 text-nele-gold" strokeWidth={1} />
        </motion.div>
      </header>

      {/* Info cards */}
      <section className="relative py-28 px-4 bg-nele-graphite border-y border-nele-gold/10">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl text-nele-cream text-center mb-16"
          >
            Why <span className="text-nele-gold">Nele</span>?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Opening Hours',
                text: 'Mon – Sat',
                sub: '8:00 AM – 5:00 PM',
                note: 'Closed Sundays',
              },
              {
                icon: Scissors,
                title: 'Services',
                text: 'Haircuts, beard trims',
                sub: 'Kids cuts available',
                note: 'Booking required',
              },
              {
                icon: MapPin,
                title: 'Online Booking',
                text: 'Available 24/7',
                sub: 'Email confirmation',
                note: 'Quick and easy',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-nele-coal/80 border border-nele-gold/20 rounded-lg p-8 hover:border-nele-gold/40 transition-colors"
              >
                <div className="inline-flex p-3 rounded-lg bg-nele-gold/10 group-hover:bg-nele-gold/20 mb-6">
                  <item.icon className="w-8 h-8 text-nele-gold" />
                </div>
                <h3 className="font-display text-2xl text-nele-cream mb-2">{item.title}</h3>
                <p className="text-nele-sand/90 text-lg">{item.text}</p>
                <p className="text-nele-gold font-medium mt-1">{item.sub}</p>
                <p className="text-nele-sand/50 text-sm mt-2">{item.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-5xl md:text-6xl text-nele-cream mb-6">
            Ready for a fresh cut?
          </h2>
          <p className="text-nele-sand/80 text-lg mb-12">
            Book your appointment in a few clicks. See available slots and get instant confirmation.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 border-2 border-nele-gold text-nele-gold hover:bg-nele-gold hover:text-nele-black font-semibold px-10 py-4 rounded-sm transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
            Book Now
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-nele-gold/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="font-display text-2xl text-nele-gold hover:text-nele-gold-light transition-colors">
            NELE
          </Link>
          <p className="text-nele-sand/60 text-sm">
            © {new Date().getFullYear()} Nele Barber Shop
          </p>
          <Link href="/admin" className="text-nele-sand/40 hover:text-nele-sand/70 text-xs transition-colors">
            Admin
          </Link>
        </div>
      </footer>
    </main>
  )
}
