# Primecut Meat Mart

Production-ready MVP foundation for a meat ordering app in Nigeria (NGN), with:

- Buyer auth (register + login)
- Product catalog + inventory fielding
- Cart/checkout endpoint with Paystack initialization
- Delivery address + slot capture
- Order tracking
- Reviews API
- Recurring subscriptions API
- Buyer support chat API/page

## Local setup

1. Update `.env`:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `PAYSTACK_SECRET_KEY` (required for live Paystack URL)
2. Run migrations and seed:

```bash
npm run db:migrate
npm run db:seed
```

3. Start app:

```bash
npm run dev
```

## Key routes

- `/` - landing + catalog
- `/register` - create buyer account
- `/login` - buyer login
- `/checkout` - cart/checkout form
- `/orders` - order tracking
- `/subscriptions` - recurring meat boxes
- `/support-chat` - support chat

## API endpoints

- `POST /api/register`
- `GET /api/catalog`
- `POST /api/checkout/paystack`
- `GET /api/orders`
- `POST /api/reviews`
- `GET/POST /api/subscriptions`
- `GET/POST /api/chat`
- `POST /api/seed`
