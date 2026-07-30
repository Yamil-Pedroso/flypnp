# Flypnp

![Flypnp](client/src/assets/images/png/flypnp.png)

## Table of Contents

1. [Intro](#intro)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Stripe Integration](#stripe-integration)

## Intro

Flypnp is a simplified version of Airbnb, designed to connect hosts with guests looking for accommodation. It allows users to list, discover, and book unique accommodations around the world. The platform offers enhanced search capabilities, a seamless booking process, and a user-friendly interface.

## Tech Stack

### Frontend (`client/`)

| Category       | Technology                        |
| -------------- | --------------------------------- |
| Framework      | React 19                          |
| Language       | TypeScript 6                      |
| Build Tool     | Vite 8                            |
| Styling        | Tailwind CSS 4                    |
| Routing        | React Router 7                    |
| State          | Context API + custom hooks        |
| HTTP Client    | Axios                             |
| Animations     | Framer Motion                     |
| Icons          | Lucide React, React Icons         |
| Payments       | Stripe (React Stripe JS)          |
| Auth           | Google OAuth                      |
| Notifications  | React Toastify, Sonner            |
| Testing        | Vitest, Testing Library           |

### Backend (`backend/`)

| Category       | Technology                        |
| -------------- | --------------------------------- |
| Runtime        | Node.js                           |
| Framework      | Express 5                         |
| Language       | TypeScript 7                      |
| Database       | MongoDB (Mongoose 9)              |
| Auth           | JWT + Google OAuth                |
| Payments       | Stripe                            |
| Image Hosting  | Cloudinary                        |
| File Upload    | Multer                            |
| Security       | Helmet, CORS, Cookie Parser       |
| Logging        | Morgan                            |
| Testing        | Vitest, Supertest                 |

## Project Structure

```
flypnp/
├── client/                          # React frontend
│   ├── src/
│   │   ├── assets/                  # Images, icons, static files
│   │   ├── components/              # UI components
│   │   │   ├── navbar/              # Navigation bar + menus
│   │   │   ├── search/              # Search bar with filters
│   │   │   ├── place-card/          # Place card for grid display
│   │   │   ├── place-gallery/       # Gallery + place details
│   │   │   ├── places-form/         # Create/edit places
│   │   │   ├── user-auth/           # Login & Register
│   │   │   ├── user-profile/        # Profile page
│   │   │   ├── bookings/            # Booking components
│   │   │   ├── payment/             # Stripe payment
│   │   │   ├── trips/               # Trips view
│   │   │   ├── wishlist/            # Wishlist management
│   │   │   ├── notifications/       # Notifications
│   │   │   ├── welcome/             # Welcome modal
│   │   │   └── common/              # Shared UI elements
│   │   ├── layouts/                 # Page layouts (With/Without Navbar)
│   │   ├── pages/                   # Route pages
│   │   ├── providers/               # Context providers
│   │   ├── services/                # API service layer
│   │   ├── lib/hooks/               # Custom React hooks
│   │   └── data/                    # Static seed data
│   └── public/                      # Static assets (favicon, etc.)
│
├── backend/                         # Express API
│   └── src/
│       ├── config/                  # App configuration
│       ├── controllers/             # Route handlers
│       ├── middlewares/              # Auth, error handling
│       ├── models/                  # Mongoose schemas
│       ├── routes/                  # API routes
│       ├── server/                  # Server entry point
│       ├── types/                   # TypeScript types
│       ├── utils/                   # Helpers & utilities
│       └── data/                    # Seed data
│
└── README.md
```

## Features

- **User Authentication** — Secure login and registration with email/password and Google OAuth
- **Place Listings** — Browse accommodations with photo galleries, ratings, and detailed descriptions
- **Advanced Search** — Filter by destination, check-in/check-out dates, and guest count
- **Wishlist** — Save favorite places to personal wishlists
- **Booking System** — Reserve accommodations with date selection and guest management
- **Payment Processing** — Secure payments via Stripe with Payment Intents
- **Share** — Share places via WhatsApp, Facebook, X (Twitter), or copy link
- **Notifications** — Real-time notifications for bookings and updates
- **Responsive Design** — Optimized for mobile, tablet, and desktop
- **Welcome Experience** — Animated modal for first-time visitors

## Getting Started

### Prerequisites

- Node.js >= 24.0.0
- MongoDB instance (local or Atlas)
- Stripe account (test mode)
- Cloudinary account (for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/flypnp.git
cd flypnp

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Running the App

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /client)
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:8080`.

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/flypnp
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=http://localhost:5173/
STRIPE_CANCEL_URL=http://localhost:5173/
```

### Frontend (`client/.env`)

```env
VITE_BASE_URL=http://localhost:8080/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Stripe Integration

Flypnp uses Stripe Payment Intents and Elements. A Payment Intent belongs to one booking and is reused when the guest returns to finish a pending payment.

Each Flypnp user gets an individual Stripe Customer automatically. Do not use a single `STRIPE_CUSTOMER_ID` for every guest.

### Local Webhook Testing

For local webhook testing, forward Stripe events to the raw-body endpoint:

```bash
stripe listen --forward-to localhost:8080/api/v1/stripe/webhook
```

Copy the `whsec_...` value printed by Stripe CLI into `STRIPE_WEBHOOK_SECRET`, then restart the backend. The integration handles `payment_intent.succeeded`, `payment_intent.payment_failed`, and `payment_intent.canceled` for reservations and gift-card purchases. See [docs/gift-cards.md](docs/gift-cards.md) for the end-to-end staging flow.

### Testing Cards

| Card Number          | Scenario              |
| -------------------- | --------------------- |
| `4242 4242 4242 4242` | Payment succeeds    |
| `4000 0000 0000 0002` | Payment declined    |
| `4000 0025 0000 3155` | Requires authentication |
