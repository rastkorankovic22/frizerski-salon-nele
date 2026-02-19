# Nele Barber Shop — Online Booking System

A full-stack web application for a men's barber shop, featuring online appointment booking, real-time slot availability, and an admin panel for managing reservations with automated email notifications.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite)

## Features

- **Online booking** — Customers select date, time, and service in a 3-step flow
- **Real-time availability** — Booked slots are shown as unavailable to other users
- **Admin dashboard** — Approve or reject booking requests with one click
- **Email notifications** — Automatic confirmation emails via Nodemailer (Gmail SMTP)
- **Responsive design** — Mobile-first, works on all devices
- **Modern UI** — Dark theme with gold accents, Framer Motion animations

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite + Prisma ORM |
| Animations | Framer Motion |
| Icons | Lucide React |
| Email | Nodemailer |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd nele-barber-shop

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add EMAIL_USER and EMAIL_PASS (Gmail App Password)

# Initialize database
npx prisma db push
npx prisma generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `EMAIL_USER` | Gmail address for sending notifications |
| `EMAIL_PASS` | Gmail App Password (not regular password) |

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── booking/          # Booking flow (3-step form)
│   ├── admin/            # Admin panel
│   └── api/              # API routes
│       ├── bookings/     # GET, POST bookings
│       ├── slots/        # Available time slots
│       └── admin/        # Admin booking list
├── lib/
│   ├── prisma.ts         # Database client
│   ├── constants.ts      # Business rules (hours, services)
│   └── sendEmail.ts      # Email notifications
prisma/
└── schema.prisma         # Database schema
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/slots?date=YYYY-MM-DD` | Get available time slots for a date |
| GET | `/api/bookings?date=...` | List bookings for a date |
| POST | `/api/bookings` | Create a new booking request |
| PATCH | `/api/bookings/[id]` | Update booking status (approve/reject) |
| GET | `/api/admin/bookings?status=...` | List all bookings (admin) |

## Business Rules

- **Hours:** Mon–Sat, 8:00 AM – 5:00 PM
- **Closed:** Sundays
- **Slot duration:** 1 hour
- **Booking flow:** Request → Admin approval → Email confirmation

## License

MIT

---

*Portfolio project — built with attention to UX and code quality*
