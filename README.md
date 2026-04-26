# Primecut Meat Mart

Production-ready MVP foundation for a meat ordering app in Nigeria (NGN), with:

- Buyer auth (register + login)
- Product catalog + inventory fielding (cow, goat, ram, chicken, turkey sold per kilogram)
- Cart/checkout endpoint with Paystack initialization
- Delivery address + slot capture
- Order tracking
- Reviews API
- Recurring subscriptions API
- Buyer support chat API/page
- Meat-sharing offering (cow slots, ram/goat half & quarter)

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

1. Start app:

```bash
npm run dev
```

## Key routes

- `/` - landing + catalog
- `/meat-sharing` - meat sharing offers
- `/register` - create buyer account
- `/login` - buyer login
- `/checkout` - cart/checkout form
- `/orders` - order tracking
- `/admin` - prices & images (`ADMIN` only; link in header when logged in as admin)
- `/subscriptions` - recurring meat boxes
- `/support-chat` - support chat

## API endpoints

- `POST /api/register`
- `GET /api/catalog`
- `POST /api/checkout/paystack`
- `POST /api/webhooks/paystack` — Paystack webhook (HMAC verification, fulfillment)
- `PATCH /api/admin/products/[id]` — admin only
- `PATCH /api/admin/meat-share/[id]` — admin only
- `GET /api/orders`
- `POST /api/reviews`
- `GET/POST /api/subscriptions`
- `GET/POST /api/chat`
- `POST /api/seed`

## Production checklist (Paystack + fulfillment)

1. **Environment**
   - `DATABASE_URL`, `NEXTAUTH_SECRET`, `PAYSTACK_SECRET_KEY` in the host (e.g. Vercel project settings).
   - The **same** `PAYSTACK_SECRET_KEY` is used for:
     - Transaction Initialize (server → `https://api.paystack.co/transaction/initialize`)
     - Webhook **HMAC**: `createHmac('sha512', secret).update(rawBody).digest('hex')` must match `x-paystack-signature`.

2. **Paystack dashboard**
   - **Settings → API Keys**: copy the **Secret Key** into `PAYSTACK_SECRET_KEY`.
   - **Settings → Webhooks** (or Developer's webhooks): add  
     `https://<your-production-host>/api/webhooks/paystack`  
   - Enable the endpoint and ensure `charge.success` events are sent (test mode for staging).

3. **Fulfillment behavior**
   - Checkout **reserves** nothing: it only validates stock/slots, creates a `PENDING` order, and returns the Paystack authorization URL.
   - On **`charge.success`**, the webhook calls `fulfillPaidOrder` to decrement `Product.inventoryInStock` and meat-sharing slots/portion stock, then sets the order to `PAID`. If stock is no longer available, the order is marked `CANCELLED` (handle refunds in operations).

4. **Admin**
   - Seed creates `admin@primecut.ng` (see `npm run db:seed` / `POST /api/seed` for password). Log in, then open **`/admin`** to edit product prices, kg stock, image URLs, and meat-sharing offers. The **Admin** link appears in the header when you are signed in as `ADMIN`.

## Testing webhooks locally

- Run `npm run dev` and use **Paystack test keys**; complete a test payment in the browser.
- Paystack must reach your machine: expose a tunnel (e.g. [ngrok](https://ngrok.com)) and register  
  `https://<ngrok-id>.ngrok.io/api/webhooks/paystack` in the Paystack dashboard (test mode).
- Send a test webhook from the Paystack dashboard or use a test transaction so `charge.success` hits your local URL.

