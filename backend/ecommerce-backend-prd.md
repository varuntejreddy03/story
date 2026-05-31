# STORY India Ecommerce Backend PRD

## Goal
Build and maintain the backend for the STORY India ecommerce storefront and admin panel.

The backend serves:
- customer storefront APIs
- role-based admin APIs
- PostgreSQL persistence through Prisma
- Google/email authentication
- Razorpay test-mode checkout
- local image uploads stored under `backend/uploads/`

## Runtime Stack
- Node.js
- Express
- Prisma
- PostgreSQL
- JWT HTTP-only cookie auth
- Razorpay
- Nodemailer
- Multer with local disk persistence

## Local Services
- API: `http://localhost:5000`
- Storefront: `http://localhost:3000`
- Admin: `http://localhost:3001`
- Uploaded image files: `http://localhost:5000/uploads/...`

## Environment
Use `backend/.env` for local secrets and `backend/.env.example` for safe defaults.

Required keys:

```env
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

DATABASE_URL="postgresql://user:password@host:5432/story_india?sslmode=require"

JWT_SECRET="replace-with-a-minimum-32-character-secret"
JWT_EXPIRES_IN=7d
COOKIE_DOMAIN=

GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RAZORPAY_WEBHOOK_SECRET="your-razorpay-webhook-secret"

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER="your-store-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
EMAIL_FROM="STORY India <orders@story.in>"

FRONTEND_URL=http://localhost:3000
ADMIN_FRONTEND_URL=http://localhost:3001

ADMIN_EMAIL=admin@story.in
ADMIN_PASSWORD=StoryAdmin@2026
```

Do not use external image storage keys. Product and category image uploads are stored directly in `backend/uploads/`.

## Data Model
Core Prisma models:
- `User`
- `PasswordResetToken`
- `Address`
- `Category`
- `Product`
- `CartItem`
- `Coupon`
- `Order`
- `OrderItem`
- `PaymentTransaction`
- `Setting`

Product records include:
- name, slug, SKU
- category relation
- `images` array
- local image URLs
- sizes and colors JSON
- details, composition, care
- price, discounted price
- stock and active status
- warehouse location

Cart items are unique by:
- user
- product
- selected size
- selected color

Order items snapshot:
- product name
- image
- selected size/color
- price
- quantity
- subtotal

## Upload Behavior
Admin product and category uploads use `multipart/form-data`.

Backend behavior:
1. Multer accepts image files in memory.
2. `uploadBufferToLocal` validates the MIME type.
3. Files are written to:
   - `backend/uploads/products/`
   - `backend/uploads/categories/`
4. API responses return public image URLs based on `API_URL`.

Allowed image types:
- JPEG
- PNG
- WebP
- GIF
- AVIF

`backend/uploads/*` is ignored by git, except `uploads/.gitkeep`.

## API Surface
Public storefront:
- `GET /api/products`
- `GET /api/products/:slug`
- `GET /api/categories`
- `GET /api/settings`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Authenticated customer:
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:productId`
- `DELETE /api/cart/items/:productId`
- `DELETE /api/cart`
- `GET /api/profile`
- `PUT /api/profile`
- CRUD profile addresses
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders/:id/cancel`
- `POST /api/coupons/validate`
- `POST /api/payment/verify`

Admin:
- `GET /api/admin/dashboard/stats`
- CRUD products
- CRUD categories
- CRUD coupons
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `PATCH /api/admin/orders/:id/tracking`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/status`
- `GET /api/admin/payments`
- `GET /api/admin/settings`
- `PUT /api/admin/settings`

## Development Commands
From project root:

```bash
npm run dev
```

This starts backend, storefront, and admin together.

Backend-only:

```bash
cd backend
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

## Verification
Required checks:

```bash
npm --prefix backend run prisma:validate
npm --prefix storyuser run lint
npm --prefix storyuser run build
npm --prefix story-luxury-admin run lint
npm --prefix story-luxury-admin run build
npm --prefix backend audit --omit=dev
```
