# Flypnp Services

## Feature purpose

Services lets authenticated travelers request additional support for a trip:

- **Airport Transfer:** transportation between an airport and an accommodation.
- **Pet Care:** local care for a pet on a selected date and time.
- **Local Guide:** a private local guide matched to the traveler's language and interests.

This is an assisted operations workflow rather than an automatically available catalog. The traveler submits a request, and the Flypnp team selects a provider, prepares a quote and manages the service through payment and confirmation.

## Complete workflow

1. An authenticated traveler completes the form at `/services`.
2. The backend validates the service type, date, time, participant count and service-specific fields.
3. The request is saved with the `requested` status.
4. An administrator reviews it at `/admin/services`.
5. The administrator assigns a provider, enters the base price and sends the quote.
6. The request becomes `quoted`; the traveler receives an in-app notification and an email.
7. The traveler reviews the quote and pays in CHF. Flypnp adds a 10% service fee.
8. Stripe confirms the Payment Intent through the application and its signed webhook.
9. The request becomes `confirmed`. The traveler receives a confirmation and can see provider contact details in Trips.
10. A traveler or administrator can cancel before confirmation. Confirmed services require support assistance.

## Statuses

| Status | Meaning |
| --- | --- |
| `requested` | Created and waiting for operational review. |
| `quoted` | A provider has been assigned and the quote is ready for payment. |
| `confirmed` | Payment is confirmed and the service is operational. |
| `cancelled` | Cancelled before the service was delivered. |

## Frontend components

- `Services.tsx`: service catalog, request form, traveler requests, quotes and payment access.
- `AdminServices.tsx`: operations desk for reviewing requests, assigning providers and sending quotes.
- `ServiceIcon.tsx`: renders Flypnp's custom service icons with Tailwind-controlled colors.
- `Trips.tsx`: displays upcoming and past services and reveals provider contacts after confirmation.
- `MyPayment.tsx` and `TestStripePayment.tsx`: price summary and secure Stripe Elements checkout.
- `NotificationsPage.tsx`: actionable notifications with read and unread states.

## API

### Authenticated traveler

- `POST /api/v1/service-requests`: create a request.
- `GET /api/v1/service-requests`: list the current user's active requests.
- `DELETE /api/v1/service-requests/:id`: cancel an unconfirmed request.
- `POST /api/v1/create-payment`: create or recover the Payment Intent for a quote.
- `POST /api/v1/payment/:id/confirm`: verify the payment with Stripe and confirm it.

### Administrator

- `GET /api/v1/admin/service-requests`: list every service request.
- `PATCH /api/v1/admin/service-requests/:id/quote`: assign a provider and send a quote.
- `GET /api/v1/admin/email-deliveries`: inspect recent email deliveries.
- `PATCH /api/v1/admin/email-deliveries/:id/retry`: retry a failed email.

### Webhook

- `POST /api/v1/stripe/webhook`: receives signed Stripe events and synchronizes payments and requests.

## Security and business rules

- Operational routes require authentication.
- Administrative routes also enforce `isAdmin` on the backend.
- Prices come from MongoDB quotes; URL or client-supplied prices are never trusted.
- Only CHF payments are accepted.
- Provider email and phone details are removed from traveler responses until confirmation.
- The Stripe webhook verifies its signature against the raw request body.
- Confirmation events and emails use idempotency keys to prevent duplicates.
- Distributed limits are stored in MongoDB:
  - 10 service requests per traveler per hour.
  - 20 payment preparations per traveler per hour.
  - 100 quotes per administrator per hour.

## Notifications

A quote, confirmation or administrative cancellation generates a structured in-app notification with a type, title, message, action link, read state and deduplication key.

Emails are written to a persistent MongoDB outbox before delivery. A background worker sends them through Resend with an idempotency key and retries up to five times with exponential backoff. A temporary email provider failure does not roll back a quote or payment.

Before production:

1. Verify a sending subdomain in Resend.
2. Configure SPF and DKIM; DMARC is recommended.
3. Use an `EMAIL_FROM` address from the verified domain.
4. Monitor or retry failed deliveries with the administrative endpoints.

## Environment variables

### Backend

```text
NODE_ENV=production
MONGO_URI=
CLIENT_URL=https://...
JWT_SECRET=
GOOGLE_CLIENT_ID=

STRIPE_MODE=live
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=https://.../succeeded-payment
STRIPE_CANCEL_URL=https://.../trips

APP_NAME=Flypnp
RESEND_API_KEY=re_...
EMAIL_FROM=Flypnp <notifications@updates.example.com>
EMAIL_REPLY_TO=support@example.com
EMAIL_WORKER_INTERVAL_MS=30000
```

Staging must use `STRIPE_MODE=test` with an `sk_test_...` key.

### Client

```text
VITE_BASE_URL=https://.../api/v1
VITE_GOOGLE_CLIENT_ID=
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

Staging must use a `pk_test_...` key.

## External configuration

### Stripe

1. Register `https://API-DOMAIN/api/v1/stripe/webhook`.
2. Subscribe to at least:
   - `payment_intent.succeeded`;
   - `payment_intent.payment_failed`;
   - `payment_intent.canceled`.
3. Store the signing secret as `STRIPE_WEBHOOK_SECRET`.
4. Confirm that all return URLs use HTTPS.

### Resend

1. Verify the sending domain or subdomain.
2. Create a production API key.
3. Configure `RESEND_API_KEY`, `EMAIL_FROM` and `EMAIL_REPLY_TO`.
4. Monitor bounces and complaints from the Resend dashboard.

## Staging smoke test

The `scripts/services-smoke-test.mjs` script creates a request, verifies that an administrator can see and quote it, confirms that provider contacts remain private and cancels the test request.

```bash
API_BASE_URL=https://api-staging.example.com/api/v1 \
USER_TOKEN=... \
ADMIN_TOKEN=... \
node scripts/services-smoke-test.mjs
```

Add `SMOKE_INCLUDE_PAYMENT=true` to create and then cancel a Stripe test Payment Intent. The smoke test does not enter card details or create a real charge.

## Deployment checklist

- Run backend and client tests, typecheck, lint and builds.
- Run the smoke test against staging.
- Complete one checkout with a Stripe test card.
- Verify webhook delivery and the resulting `confirmed` status.
- Confirm that provider contacts appear only after payment.
- Confirm quote and payment emails are delivered.
- Review CORS, HTTPS, Resend domain status and production variables.
- Change Stripe from test to live mode only after every verification passes.
