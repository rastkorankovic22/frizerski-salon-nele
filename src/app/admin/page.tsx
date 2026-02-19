'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { ArrowLeft, Check, X, RefreshCw, Loader2, Calendar, Phone, Scissors } from 'lucide-react'

type Booking = {
  id: string
  date: string
  time: string
  clientName: string
  clientPhone: string
  clientEmail: string | null
  service: string
  status: string
  notes: string | null
  createdAt: string
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [actioning, setActioning] = useState<string | null>(null)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('status', filter)
      const res = await fetch(`/api/admin/bookings?${params}`)
      const data = await res.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [filter])

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setActioning(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
      }
    } catch {
      console.error('Failed')
    } finally {
      setActioning(null)
    }
  }

  return (
    <main className="min-h-screen bg-nele-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-nele-sand/70 hover:text-nele-gold mb-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-nele-cream mb-2">Admin panel</h1>
          <p className="text-nele-sand/70">Approve or reject booking requests. Customers receive email confirmation automatically.</p>
        </motion.div>

        <motion.button
          onClick={fetchBookings}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-nele-graphite border border-nele-gold/30 rounded-lg text-nele-sand hover:border-nele-gold hover:text-nele-gold mb-8 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </motion.button>

        <div className="flex flex-wrap gap-2 mb-8">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f ? 'bg-nele-gold text-nele-black shadow-nele' : 'bg-nele-graphite text-nele-sand/80 hover:bg-nele-coal'
              }`}
            >
              {f === 'pending' && 'Pending'}
              {f === 'approved' && 'Approved'}
              {f === 'rejected' && 'Rejected'}
              {f === 'all' && 'All'}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-nele-gold animate-spin mb-4" />
            <p className="text-nele-sand/50">Loading...</p>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-nele-graphite rounded-xl border border-nele-gold/20"
          >
            <Scissors className="w-20 h-20 text-nele-sand/30 mx-auto mb-6" />
            <p className="text-nele-sand/70 text-lg font-medium">No bookings</p>
            <p className="text-nele-sand/50 text-sm mt-2">
              {filter === 'pending' && 'No pending requests'}
              {filter === 'approved' && 'No approved bookings'}
              {filter === 'rejected' && 'No rejected requests'}
              {filter === 'all' && 'List is empty'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-nele-graphite rounded-xl p-6 border transition-colors ${
                    b.status === 'pending' ? 'border-nele-gold/40 shadow-nele' : 'border-nele-sand/10'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-display text-xl text-nele-cream">{b.clientName}</span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            b.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : ''
                          } ${b.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''} ${
                            b.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''
                          }`}
                        >
                          {b.status === 'pending' && 'Pending'}
                          {b.status === 'approved' && 'Approved'}
                          {b.status === 'rejected' && 'Rejected'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-nele-sand/80 text-sm">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-nele-gold" />
                          {format(new Date(b.date + 'T12:00:00'), 'EEEE, MMMM d', { locale: enUS })} at {b.time}
                        </span>
                        <a href={`tel:${b.clientPhone}`} className="flex items-center gap-1.5 hover:text-nele-gold transition-colors">
                          <Phone className="w-4 h-4" />{b.clientPhone}
                        </a>
                      </div>
                      <p className="text-nele-gold font-medium mt-2">{b.service}</p>
                      {b.notes && <p className="text-nele-sand/60 text-sm mt-2 italic">Note: {b.notes}</p>}
                    </div>
                    {b.status === 'pending' && (
                      <div className="flex gap-2 shrink-0">
                        <motion.button
                          onClick={() => handleAction(b.id, 'approved')}
                          disabled={actioning === b.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                          {actioning === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Approve
                        </motion.button>
                        <motion.button
                          onClick={() => handleAction(b.id, 'rejected')}
                          disabled={actioning === b.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" /> Reject
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  )
}
