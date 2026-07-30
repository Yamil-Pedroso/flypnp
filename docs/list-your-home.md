# List Your Home

## Feature purpose

List Your Home gives authenticated Flypnp users a dedicated host workspace. It connects the existing property API to a usable interface where a host can publish homes, maintain listing information and follow reservations made for their own properties.

The user-menu entry is named **List your home** and opens `/host`.

## First-version workflow

1. The host signs in to Flypnp.
2. The host opens **List your home** from the user menu.
3. The dashboard loads only properties owned by that user.
4. The host can publish a new property or edit an existing one.
5. Guest reservations for those properties appear in Recent reservations.
6. Dashboard totals are calculated from the host's actual listings and confirmed bookings.

## Routes

| Route | Purpose |
| --- | --- |
| `/host` | Host dashboard. |
| `/host/listings/new` | Create a property listing. |
| `/host/listings/:id/edit` | Edit an owned listing. |
| `/place/:category/:id` | Open the public traveler view of a listing. |

## Frontend components

- `HostDashboard.tsx`: loads and coordinates listings, reservations, errors and deletion.
- `HostHero.tsx`: introduces the hosting workspace and primary create action.
- `HostStats.tsx`: displays listing count, upcoming confirmed stays and confirmed booking value.
- `HostListings.tsx`: listing cards with edit, public preview and safe removal actions.
- `HostBookings.tsx`: recent guest reservations for properties owned by the current host.
- `CreatePlaceButton.tsx`: reusable call to action for the listing form.
- `PlacesForm.tsx`: create and edit form, including Cloudinary-backed uploads and remote image import.

## Listing form

The form captures:

- title;
- full address;
- category;
- nightly CHF price;
- maximum guest capacity;
- comma-separated perks;
- description;
- house rules and extra information;
- one or more property photos.

Photos can be uploaded from the user's device or imported from a public image URL. The existing authenticated upload endpoints store them through Cloudinary.

## API

### Listings

- `GET /api/v1/user-places`: list properties owned by the authenticated user.
- `POST /api/v1/add-places`: create a property owned by the authenticated user.
- `PUT /api/v1/update-place/:id`: update an owned property.
- `DELETE /api/v1/delete-place/:id`: delete an owned property without reservation history.
- `POST /api/v1/upload`: upload image files.
- `POST /api/v1/upload-from-link`: import a public image URL.

### Host reservations

- `GET /api/v1/host-bookings`: list bookings whose property belongs to the authenticated host.

The backend first resolves the current user's property IDs and then queries bookings only for those IDs. Guest name, email and avatar are populated for host operations.

## Dashboard metrics

- **Your listings:** number of properties owned by the current host.
- **Upcoming stays:** confirmed reservations whose checkout date has not passed.
- **Confirmed booking value:** sum of the base booking prices for confirmed reservations.

The final metric is booking value, not a payout balance. Flypnp does not yet calculate commissions, refunds or provider payouts for hosts.

## Ownership and data protection

- Every listing write operation requires authentication.
- New properties receive the authenticated user as `owner`; a client-provided owner is ignored.
- Only the owner or an administrator can update a listing.
- Only the owner or an administrator can delete a listing.
- A listing with any reservation history cannot be deleted, preventing orphaned bookings or payment records.
- Host reservation queries are scoped to property IDs owned by the current user.
- Listing creation is limited to 20 properties per user in a 24-hour window.

## Empty, loading and failure states

- Logged-out visitors see a clear sign-in requirement.
- New hosts see an onboarding empty state and a **List a new place** action.
- Dashboard and edit screens display dedicated loading states.
- API errors provide retry actions or toast feedback.
- Removing a property requires browser confirmation and remains server-protected.

## Current scope

This first version includes real listing CRUD, image management, portfolio metrics and incoming reservation visibility.

The following capabilities are intentionally future work:

- availability calendar management;
- pause or unpublish without deleting;
- host payout accounts and payout ledger;
- refund and cancellation operations for hosts;
- guest-host messaging;
- occupancy and revenue analytics;
- listing review or approval workflow;
- tax and identity verification.

## Production checklist

- Configure Cloudinary backend variables.
- Verify authenticated image uploads in staging.
- Create a listing and open its public traveler page.
- Edit the listing and confirm the public data changes.
- Make a test reservation with a separate guest account.
- Confirm the reservation appears only for the correct host.
- Confirm that a listing with reservation history cannot be deleted.
- Run backend and client tests, typecheck, lint and production builds.
