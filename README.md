# Farm Direct Connect

Build a full-stack web app called "Farm Link" — a marketplace that connects 

farmers directly with buyers (individual customers and retailers), cutting 

out middlemen. Use Supabase for auth and database.

## Roles

Three user roles: Farmer, Buyer, Admin. Role is chosen at signup (Farmer/Buyer); 

Admin is a protected role assigned manually in the database.

## Authentication

- Email/password signup and login via Supabase Auth

- Separate signup forms for Farmer and Buyer (capture role-specific fields)

- Farmer signup fields: full name, phone number, farm name, farm location 

  (state/district), primary crops grown

- Buyer signup fields: full name, phone number, delivery address, buyer type 

  (individual/retailer)

- Forgot password / reset password flow

- Protected routes: redirect unauthenticated users to /login

- Persist session, show logged-in user's name and role in the navbar

## Landing Page (public, before login)

- Hero section explaining Farm Link's mission (connecting farmers and buyers)

- Featured/trending produce listings (read-only preview)

- How it works section (3 steps for farmers, 3 steps for buyers)

- Testimonials section

- Call-to-action buttons: "Join as Farmer" and "Shop Now"

## Farmer Dashboard (after login, role = Farmer)

- Overview cards: total listings, active orders, total earnings, pending 

  payouts

- "My Produce" section: table/grid of the farmer's listings with edit/delete 

  actions

- "Add New Produce" form: name, category (vegetables/fruits/grains/dairy/etc), 

  price per unit, unit type (kg/dozen/liter), quantity available, harvest 

  date, description, upload up to 4 photos

- "Orders" tab: incoming orders with buyer name, items, quantity, status 

  (pending/confirmed/shipped/delivered), and a status-update dropdown

- Simple sales chart (last 30 days) using a chart library

- Profile settings page: edit farm details, bank/payout info, profile photo

## Buyer Dashboard (after login, role = Buyer)

- Browse Produce page: grid of listings with filters (category, price range, 

  location/distance, freshness/harvest date) and a search bar

- Each listing card: photo, name, farmer name, price, unit, "Add to Cart" 

  button

- Product detail page: full description, farmer profile link, quantity 

  selector, add to cart

- Cart page: line items, quantity edit, remove item, subtotal, checkout button

- Checkout flow: delivery address confirmation, order summary, payment 

  method selection (mock/placeholder payment step is fine), place order

- "My Orders" page: order history with status tracking (pending → confirmed → 

  shipped → delivered), reorder button

- Wishlist/favorites (optional toggle on listing cards)

- Profile settings page: edit delivery address, contact info, profile photo

## Admin Dashboard (role = Admin)

- Overview: total farmers, total buyers, total listings, total orders, 

  platform revenue

- User management table: view/search/suspend farmers and buyers

- Listings moderation: approve/reject/remove flagged produce listings

- Orders overview: all orders across the platform with status and dispute 

  flagging

- Basic analytics charts: signups over time, orders over time, top-selling 

  categories

## Shared / Global Features

- Responsive design (mobile-first, works well on phones since farmers may 

  use mobile)

- Notifications (toast/in-app) for order status changes, new orders (farmer 

  side), successful checkout

- Search functionality across produce listings

- Clean, earthy/agricultural color palette (greens, warm neutrals) — avoid a 

  generic SaaS look

- Loading states and empty states for all data-driven pages

- Error handling for failed form submissions and network calls

- Footer with About, Contact, Terms, and social links

## Database (Supabase tables, high-level)

- profiles (id, role, name, phone, avatar_url)

- farmer_details (user_id, farm_name, location, crops, bank_info)

- buyer_details (user_id, address, buyer_type)

- listings (id, farmer_id, name, category, price, unit, quantity, 

  harvest_date, description, images, status)

- orders (id, buyer_id, status, total, created_at)

- order_items (order_id, listing_id, quantity, price_at_purchase)

- Row-level security: farmers can only edit their own listings/orders view; 

  buyers can only see their own orders; admin has full access

Start by scaffolding the landing page, auth flow, and role-based routing 

first, then build out the Farmer and Buyer dashboards, then Admin last.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://farm-fresh-direct-43.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/568aa55c-b6db-5747-8080-8994411322ce).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
