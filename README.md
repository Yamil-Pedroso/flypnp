# flypnp 
![flypnp](client/src/assets/images/png/flypnp.png)

1. [Intro](#intro)
2. [Development Status](#development-status)
3. [Tech Stack](#tech-stack)
4. [Features](#features)

## Intro
 This project is a simplified version of Airbnb, designed to connect hosts with guests looking for accommodation. It allows users to list, discover, and book unique accommodations around the world. Our platform stands out by offering enhanced search capabilities, a seamless booking process, and a user-friendly interface.

 ## Development Status
 This project is currently under active development ---> 85% done.

## Tech Stack
- [Node](#node)
- [React](#react)
- [Typescript](#typescript)
- [Styled components](#styled-components)

## Features
- User Authentication: Secure login and registration system for guests and hosts.
- Wish list: The client can choose his favorite places.
- Booking System: Easy-to-use booking system that allows users to reserve accommodations with a few clicks.
- Ratings and Reviews: Users can rate their stay and leave reviews for properties they have booked.
- Payment method: Stripe

## Stripe test payments

Flypnp uses Stripe Payment Intents and Elements. A Payment Intent belongs to one
booking and is reused when the guest returns to finish a pending payment.

Backend environment:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=http://localhost:5173/
STRIPE_CANCEL_URL=http://localhost:5173/
```

Client environment:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_BASE_URL=http://localhost:8080/api/v1
```

Each Flypnp user gets an individual Stripe Customer automatically. Do not use a
single `STRIPE_CUSTOMER_ID` for every guest.

For local webhook testing, forward Stripe events to the raw-body endpoint:

```bash
stripe listen --forward-to localhost:8080/api/v1/stripe/webhook
```

Copy the `whsec_...` value printed by Stripe CLI into
`STRIPE_WEBHOOK_SECRET`, then restart the backend. The integration handles
`payment_intent.succeeded`, `payment_intent.payment_failed`, and
`payment_intent.canceled`.
