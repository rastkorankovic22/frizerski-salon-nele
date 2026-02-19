'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { format, getDay, isBefore, startOfDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, Check, Calendar } from 'lucide-react'
import { SERVICES, CLOSED_DAYS } from '@/lib/constants'

type Slot = { time: string; available: boolean }

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState(SERVICES[0])
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    notes: '',
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const today = startOfDay(new Date())

  const fetchSlots = async (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    setLoading(true)
    try {
      const res = await fetch(`/api/slots?date=${dateStr}`)
      const data = await res.json()
      setSlots(data.slots || [])
    } catch {
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate)
  }, [selectedDate])

  const getDaysInMonth = () => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (Date | null)[] = []
    const startPadding = (getDay(firstDay) + 6) % 7
    for (let i = 0; i < startPadding; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d))
    }
    return days
  }

  const isDateDisabled = (date: Date) => {
    if (isBefore(date, today)) return true
    return CLOSED_DAYS.includes(getDay(date))
  }

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return
    setSubmitStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          clientName: formData.clientName,
          clientPhone: formData.clientPhone,
          clientEmail: formData.clientEmail || undefined,
          service: selectedService.name,
          notes: formData.notes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Failed to create booking')
        return
      }
      setSubmitStatus('success')
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Connection error. Please try again.')
    }
  }

  if (submitStatus === 'success') {
    return (
      <main className="min-h-screen bg-nele-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-nele-gold/20 flex items-center justify-center mx-auto mb-8 border-2 border-nele-gold/40"
          >
            <Check className="w-12 h-12 text-nele-gold" strokeWidth={3} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl md:text-5xl text-nele-cream mb-4"
          >
            Request sent!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-nele-sand/80 mb-8 leading-relaxed"
          >
            Your booking is pending approval. We&apos;ll confirm via email shortly.
            <br />
            <span className="text-nele-gold font-medium mt-2 block">
              {selectedDate && format(selectedDate, 'EEEE, MMMM d', { locale: enUS })} at {selectedTime}
            </span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-nele-gold hover:text-nele-gold-light font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
          </motion.div>
        </motion.div>
      </main>
    )
  }

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <main className="min-h-screen bg-nele-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-nele-sand/70 hover:text-nele-gold mb-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="font-display text-5xl md:text-6xl text-nele-cream mb-2">Book an appointment</h1>
          <p className="text-nele-sand/70 mb-12">Choose a date, time, and fill in your details.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= s ? 'bg-nele-gold' : 'bg-nele-graphite'}`} />
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <h2 className="font-display text-2xl text-nele-gold mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" /> 1. Choose date
              </h2>
              <div className="bg-nele-graphite rounded-xl p-6 border border-nele-gold/20 shadow-nele">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                    className="p-2 hover:bg-nele-coal rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-display text-xl text-nele-cream capitalize">
                    {format(calendarMonth, 'MMMM yyyy', { locale: enUS })}
                  </span>
                  <button
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                    className="p-2 hover:bg-nele-coal rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((d) => (
                    <div key={d} className="text-center text-nele-sand/50 text-sm py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth().map((date, i) => (
                    <motion.button
                      key={i}
                      onClick={() => date && handleDateSelect(date)}
                      disabled={!date || isDateDisabled(date)}
                      whileHover={date && !isDateDisabled(date) ? { scale: 1.05 } : {}}
                      whileTap={date && !isDateDisabled(date) ? { scale: 0.98 } : {}}
                      className={`
                        aspect-square rounded-lg flex items-center justify-center text-sm transition-colors
                        ${!date ? 'invisible' : ''}
                        ${date && isDateDisabled(date) ? 'text-nele-sand/30 cursor-not-allowed' : ''}
                        ${date && !isDateDisabled(date) && (!selectedDate || format(date, 'yyyy-MM-dd') !== format(selectedDate!, 'yyyy-MM-dd'))
                          ? 'text-nele-sand/80 hover:bg-nele-gold/20'
                          : ''}
                        ${selectedDate && date && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                          ? 'bg-nele-gold text-nele-black font-semibold shadow-nele'
                          : ''}
                      `}
                    >
                      {date?.getDate()}
                    </motion.button>
                  ))}
                </div>
              </div>
              {selectedDate && (
                <p className="mt-4 text-nele-sand/70">
                  Selected: <span className="text-nele-gold font-medium">{format(selectedDate, 'EEEE, MMMM d', { locale: enUS })}</span>
                </p>
              )}
              <motion.button
                onClick={() => selectedDate && setStep(2)}
                disabled={!selectedDate}
                whileHover={selectedDate ? { scale: 1.02 } : {}}
                whileTap={selectedDate ? { scale: 0.98 } : {}}
                className="mt-8 bg-nele-gold hover:bg-nele-gold-light disabled:bg-nele-graphite disabled:text-nele-sand/50 disabled:cursor-not-allowed text-nele-black font-semibold px-8 py-4 rounded-lg shadow-nele transition-colors"
              >
                Next — Choose time
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <h2 className="font-display text-2xl text-nele-gold mb-6">2. Choose time</h2>
              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-10 h-10 text-nele-gold animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-8">
                  {slots.map((slot) => (
                    <motion.button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      whileHover={slot.available ? { scale: 1.05 } : {}}
                      whileTap={slot.available ? { scale: 0.98 } : {}}
                      className={`
                        py-3 px-4 rounded-lg font-medium transition-all
                        ${slot.available
                          ? selectedTime === slot.time
                            ? 'bg-nele-gold text-nele-black shadow-nele'
                            : 'bg-nele-graphite border border-nele-gold/30 hover:border-nele-gold hover:bg-nele-gold/10'
                          : 'bg-nele-coal text-nele-sand/40 cursor-not-allowed line-through'}
                      `}
                    >
                      {slot.time}
                    </motion.button>
                  ))}
                </div>
              )}
              {slots.length > 0 && <p className="text-nele-sand/50 text-sm mb-6">Crossed-out slots are already booked</p>}
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-nele-sand/30 text-nele-sand hover:border-nele-gold hover:text-nele-gold rounded-lg transition-colors">
                  Back
                </button>
                <button
                  onClick={() => selectedTime && setStep(3)}
                  disabled={!selectedTime}
                  className="bg-nele-gold hover:bg-nele-gold-light disabled:bg-nele-graphite disabled:text-nele-sand/50 disabled:cursor-not-allowed text-nele-black font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Next — Your details
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-2xl text-nele-gold mb-6">3. Your details</h2>
              <div className="bg-nele-graphite rounded-xl p-6 border border-nele-gold/20 shadow-nele mb-6">
                <p className="text-nele-sand/80 mb-6 p-4 bg-nele-coal/50 rounded-lg">
                  <span className="text-nele-gold font-medium">{selectedDate && format(selectedDate, 'MMMM d', { locale: enUS })}</span>
                  {' '}at{' '}
                  <span className="text-nele-gold font-medium">{selectedTime}</span>
                  {' — '}{selectedService.name} ({selectedService.price})
                </p>
                <div className="mb-6">
                  <label className="block text-nele-sand/70 text-sm mb-2">Service</label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map((s) => (
                      <motion.button
                        key={s.id}
                        onClick={() => setSelectedService(s)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedService.id === s.id ? 'bg-nele-gold text-nele-black' : 'bg-nele-coal text-nele-sand/80 hover:bg-nele-coal/80'
                        }`}
                      >
                        {s.name} — {s.price}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-nele-sand/70 text-sm mb-1">Full name *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full bg-nele-coal border border-nele-sand/20 rounded-lg px-4 py-3 text-nele-cream placeholder-nele-sand/40 focus:border-nele-gold focus:outline-none transition-colors"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-nele-sand/70 text-sm mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      className="w-full bg-nele-coal border border-nele-sand/20 rounded-lg px-4 py-3 text-nele-cream placeholder-nele-sand/40 focus:border-nele-gold focus:outline-none transition-colors"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className="block text-nele-sand/70 text-sm mb-1">Email (for confirmation)</label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full bg-nele-coal border border-nele-sand/20 rounded-lg px-4 py-3 text-nele-cream placeholder-nele-sand/40 focus:border-nele-gold focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-nele-sand/70 text-sm mb-1">Notes (optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={2}
                      className="w-full bg-nele-coal border border-nele-sand/20 rounded-lg px-4 py-3 text-nele-cream placeholder-nele-sand/40 focus:border-nele-gold focus:outline-none resize-none transition-colors"
                      placeholder="e.g. Short on sides, longer on top..."
                    />
                  </div>
                  {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setStep(2)} className="px-6 py-3 border border-nele-sand/30 text-nele-sand hover:border-nele-gold hover:text-nele-gold rounded-lg transition-colors">
                      Back
                    </button>
                    <motion.button
                      type="submit"
                      disabled={submitStatus === 'loading'}
                      whileHover={submitStatus !== 'loading' ? { scale: 1.01 } : {}}
                      whileTap={submitStatus !== 'loading' ? { scale: 0.99 } : {}}
                      className="flex-1 bg-nele-gold hover:bg-nele-gold-light disabled:opacity-70 disabled:cursor-not-allowed text-nele-black font-semibold px-8 py-3 rounded-lg flex items-center justify-center gap-2 shadow-nele transition-colors"
                    >
                      {submitStatus === 'loading' ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                      ) : (
                        'Submit booking request'
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
