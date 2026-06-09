# STORY India Ecommerce — Backend & Admin Panel Complete Enhancement Prompt

## Project Context

This is a monorepo ecommerce platform with 3 apps:
- `storyuser/` — React + Vite + Tailwind user frontend (FINALIZED, do not modify)
- `story-luxury-admin/` — React + Vite + Tailwind admin panel
- `backend/` — Node.js + Express + Prisma + PostgreSQL API

GitHub: https://github.com/varuntejreddy03/story.git

The user frontend is complete and approved by client. Now we need to make the backend and admin panel fully support everything the frontend expects.

## Tech Stack
- Backend: Node.js (ESM), Express 4, Prisma ORM, PostgreSQL, Razorpay, Nodemailer, JWT (httpOnly cookies), Multer for uploads, Zod for validation
- Admin: React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, Lucide React icons
- Auth: JWT stored in httpOnly cookies, separate admin login at `/api/auth/admin/login`

---

## TASK 1: Backend — Full Product CRUD Enhancement

### Current State
The `Product` Prisma model has fields: `description`, `images[]`, `secondaryImage`, `details` (Json), `composition`, `care`, `sizes` (Json), `colors` (Json), `price`, `discountedPrice`, `stock`, `sku`, `isActive`, `location`

### What Frontend Expects from GET /api/products
```json
{
  "id": "uuid",
  "name": "Wide Leg Pants",
  "slug": "wide-leg-pants",
  "price": 3490,
  "originalPrice": 4490,
  "category": "BOTTOM",
  "categoryId": "uuid",
  "image": "https://...",
  "secondaryImage": "https://...",
  "listImages": ["url1", "url2", "url3"],
  "description": "Flowing wide-leg trousers...",
  "details": ["High waist", "Two side pockets", "Concealed closure"],
  "composition": "90% organic cotton, 10% linen",
  "care": "Dry clean only",
  "sizes": ["XS", "S", "M", "L"],
  "colors": [{"name": "Off-White", "hex": "#ECEBE4"}, {"name": "Black", "hex": "#111111"}],
  "stock": 25,
  "status": "active"
}
```

### Required Backend Changes for Products Router (`backend/src/modules/products/router.js`)

1. **GET /api/products** — Already returns products. Ensure serializer maps:
   - `images[0]` → `image`
   - `images` → `listImages`
   - `discountedPrice` → keep as `originalPrice` if discounted, else `price` is the selling price
   - `details` JSON → array of strings
   - `sizes` JSON → array of strings
   - `colors` JSON → array of `{name, hex}` objects
   - Include `category.name` as `category` field
   - Include `categoryId`

2. **POST /api/admin/products** — Must accept ALL fields:
   - `name`, `sku`, `description`, `composition`, `care`
   - `price` (number), `originalPrice` (number, optional)
   - `stock` (number)
   - `categoryId` (uuid) OR `categorySlug` (string to look up category)
   - `sizes` (JSON array of strings)
   - `colors` (JSON array of {name, hex} objects)
   - `details` (JSON array of strings)
   - `images` (array of URLs OR multipart file upload via multer)
   - `secondaryImage` (URL string)
   - `isActive` (boolean)
   - `location` (string)

3. **PUT /api/admin/products/:id** — Same fields as POST, partial update

4. **PATCH /api/admin/products/:id/stock** — Update stock only (already exists)

5. **DELETE /api/admin/products/:id** — Soft delete (set isActive=false)

---

## TASK 2: Backend — Category Enhancement

### Current State
Category model has: `name`, `slug`, `description`, `imageUrl`, `isActive`, `sortOrder`, `isDynamic`, `parent`

### Frontend Expects from GET /api/categories
```json
{
  "id": "uuid",
  "name": "Uppers",
  "slug": "uppers",
  "description": "Shirts, jackets, tees & layers",
  "image": "https://...",
  "isActive": true,
  "productCount": 12,
  "sortOrder": 1,
  "isDynamic": false,
  "parent": "None"
}
```

### Required Changes
1. **GET /api/categories** — Include `productCount` (count of products in each category)
2. **Serializer** — Map `imageUrl` → `image` in response
3. **POST /api/admin/categories** — Accept multipart `image` file upload OR `imageUrl` string
4. **PUT /api/admin/categories/:id** — Same, partial update with optional image upload

---

## TASK 3: Backend — Order Management Enhancement

### Current State
Order model has: `status`, `paymentStatus`, `trackingUrl`, `notes`

### Admin Needs
1. **GET /api/admin/orders** — Return orders with:
   - `customerName` (from user relation or addressSnapshot)
   - `customerEmail`
   - `amount` (total)
   - `date` (createdAt)
   - `paymentStatus`
   - `fulfillmentStatus` (mapped from `status`)
   
2. **PATCH /api/admin/orders/:id/status** — Accept:
   - `paymentStatus`: "paid" | "pending" | "failed" | "refunded"
   - `status`: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled"
   - `trackingUrl`: optional string

3. **GET /api/admin/orders/:id** — Full order detail with items, address, payment info

---

## TASK 4: Backend — Dashboard Stats API

### Route: GET /api/admin/dashboard/stats

Return aggregated real data:
```json
{
  "revenue": {
    "today": 12500,
    "month": 485000,
    "allTime": 2340000
  },
  "orders": {
    "total": 156,
    "today": 3,
    "month": 42
  },
  "products": 85,
  "users": 234,
  "lowStockProducts": 7
}
```

Implementation:
- `revenue.today` = sum of `total` from orders where `paymentStatus = 'paid'` AND `createdAt >= today start`
- `revenue.month` = sum for current month
- `revenue.allTime` = sum of all paid orders
- `orders.total` = count all orders
- `orders.today` = count orders created today
- `orders.month` = count orders created this month
- `products` = count of active products
- `users` = count of all users
- `lowStockProducts` = count of products where `stock < 5 AND isActive = true`

---

## TASK 5: Backend — Reviews Module

### Current State
`CustomerReview` model exists with: `name`, `tag`, `rating`, `review`, `status`, `createdAt`

### Routes Needed (some may already exist in `backend/src/modules/reviews/router.js`):

1. **GET /api/reviews** — Public, return approved reviews only (`status = 'approved'`)
2. **POST /api/reviews** — Public, create review with `status = 'pending'`
3. **GET /api/admin/reviews** — All reviews regardless of status
4. **PATCH /api/admin/reviews/:id/status** — Update status to `approved`/`rejected`/`pending`
5. **DELETE /api/admin/reviews/:id** — Hard delete

---

## TASK 6: Backend — Settings Module Enhancement

### Current State
Settings are stored as key-value pairs in `settings` table.

### Frontend reads these keys (via GET /api/settings):
```
announcement_ticker_items (comma-separated)
home_hero_eyebrow
home_hero_title
home_hero_body
home_hero_primary_cta
home_hero_secondary_cta
home_hero_image_primary
home_hero_image_secondary
home_hero_image_detail
home_hero_badge_eyebrow
home_hero_badge_text
home_products_eyebrow
home_products_title
home_products_body
home_products_ids (comma-separated product IDs)
home_collection_eyebrow
home_collection_title
home_collection_body
home_collection_image
home_collection_product_ids (comma-separated)
discover_eyebrow
discover_title
discover_search_placeholder
discover_tag_label
home_jewelry_eyebrow
home_jewelry_title
home_jewelry_body
home_recommendation_eyebrow
home_recommendation_title
home_recommendation_ids (comma-separated)
story_categories (JSON string)
store_name
store_email
razorpay_currency
delivery_fee
free_delivery_above
gst_percentage
razorpay_active
razorpay_key_id

# ABOUT PAGE SETTINGS (new)
about_eyebrow
about_title
about_intro_paragraph_1
about_intro_paragraph_2
about_primary_cta_text
about_secondary_cta_text
about_image_1 (URL)
about_image_2 (URL)
about_image_3 (URL)
about_badge_text
about_stats (JSON string: [["2026","Founded"],["7","Core categories"],["100%","Original focus"],["INDIA","Curated for"]])
about_values_eyebrow
about_values_title
about_values (JSON string: [{"title":"Authentic","text":"..."},{"title":"Curated","text":"..."},{"title":"Value","text":"..."}])
about_promise_eyebrow
about_promise_title
about_promise_body
about_promise_image (URL)
```

### Admin writes these via PUT /api/admin/settings (bulk upsert all keys)

Ensure:
1. **GET /api/settings** — Returns flat object of all key-value pairs (public, no auth)
2. **GET /api/admin/settings** — Same but may include sensitive keys
3. **PUT /api/admin/settings** — Accepts object, upserts each key-value pair into settings table

---

## TASK 7: Admin Panel — Full Product Editor

### Current Admin Product Creation (AddProductModal)
Only captures: name, sku, category, price, stock, location, image

### Required Enhancement
The AddProductModal and a new EditProductModal must support ALL product fields:

**Form Fields:**
- Name (text, required)
- SKU (text, auto-generated if empty)
- Category (dropdown from categories list)
- Price (number, required)
- Original Price / MRP (number, optional — for showing discount)
- Stock (number, required)
- Location (text, default "Mumbai Hub")
- Description (textarea, multiline)
- Composition (text)
- Care Instructions (text)
- Details (dynamic list — add/remove detail bullet points)
- Sizes (multi-select chips or comma-separated: XS, S, M, L, XL, XXL, or 28-40 for bottoms)
- Colors (dynamic list — each with name + hex color picker)
- Images (multiple file upload OR multiple URL inputs, first image = primary)
- Secondary Image (single file/URL)
- Status toggle (Active/Draft)

**UI Style:** Match existing admin panel design — black/white/neutral theme, rounded-xl cards, font-mono labels, uppercase tracking-wider headings

**Edit Flow:**
- In ProductsView, each product row should have an "Edit" button
- Clicking Edit opens EditProductModal pre-filled with all product data
- Save calls `PUT /api/admin/products/:id`

---

## TASK 8: Admin Panel — Order Detail & Tracking

### Current State
OrdersView shows list with status update dropdowns

### Enhancement
1. Add expandable order detail row OR modal showing:
   - All order items (name, image, size, color, quantity, price)
   - Shipping address
   - Payment details (Razorpay ID, payment method)
   - Order timeline/status

2. Add **Tracking URL** input field in the status update section
   - When admin updates order to "Shipped", show a text input for tracking URL
   - Save tracking URL via `PATCH /api/admin/orders/:id/status` with `trackingUrl` field

---

## TASK 9: Admin Panel — Dashboard Stats Integration

### Current State
DashboardView exists but may use mock data

### Enhancement
- On mount, call `adminApi.dashboardStats()` which hits `GET /api/admin/dashboard/stats`
- Display real data:
  - Revenue cards: Today / This Month / All Time
  - Order count cards: Total / Today / Month
  - Product count
  - Customer count
  - Low stock alert count (link to Inventory view)
- Add recent orders list (last 5 orders)
- Add quick action buttons: Add Product, Add Category, Create Coupon

---

## TASK 10: Admin Panel — Category Image Upload

### Current State
CategoriesView allows creating/editing categories with image URL

### Enhancement
1. In AddCategoryModal and edit flow, add file upload input for category image
2. When file is selected, upload via FormData to `POST /api/admin/categories`
3. Backend saves to `uploads/` folder and stores path as `imageUrl`
4. Display uploaded image preview in category card

---

## TASK 11: Backend — Admin Auth Hardening

### Ensure these routes work correctly:
1. **POST /api/auth/admin/login** — Validates email + password, checks `role === 'admin'`, sets httpOnly cookie
2. **GET /api/auth/admin/me** — Returns admin user from cookie, rejects if not admin role
3. **POST /api/auth/admin/logout** — Clears auth cookie

### Middleware
- All `/api/admin/*` routes must be protected with `requireAdmin` middleware
- `requireAdmin` checks JWT cookie AND `user.role === 'admin'`

---

## TASK 12: Backend — Seed Script Enhancement

### File: `backend/prisma/seed.js`

Ensure seed creates:
1. Admin user: `admin@story.in` / `StoryAdmin@2026` with `role: 'admin'`
2. At least 7 categories matching frontend: Uppers, Lowers, Dresses, Co-ords, Footwear, Accessories, Inners
3. At least 10 sample products with FULL data (description, details[], sizes[], colors[], composition, care, images)
4. Default settings key-value pairs for all storefront content
5. Sample customer reviews (3-5 approved)

---

## TASK 13: Backend — File Upload & Static Serving

### Current State
Multer is configured, uploads go to `backend/uploads/`

### Ensure:
1. Product images uploaded via admin go to `uploads/products/`
2. Category images go to `uploads/categories/`
3. Images are served at `GET /uploads/products/filename.png` (already configured with express.static)
4. In responses, image URLs should be full path: `${API_URL}/uploads/products/filename.png`
5. Support multiple image upload for products (multer array)

---

## TASK 14: Backend — Contact Requests & Reviews CORS

Ensure these public routes work without auth:
1. `POST /api/contact` — Creates contact request (name, email, phone, topic, message)
2. `POST /api/reviews` — Creates review with status 'pending'
3. `GET /api/reviews` — Returns only approved reviews

---

## TASK 15: Admin Panel — Reviews Management

### Current State
ReviewsView exists with status update and delete

### Ensure It Works:
- Shows all reviews (pending, approved, rejected)
- Status badge colors: pending=yellow, approved=green, rejected=red
- Actions: Approve, Reject, Delete
- Calls correct API endpoints

---

## TASK 16: About Page — Admin Editable + Frontend Dynamic

### Goal
The About page (`storyuser/src/components/AboutView.tsx`) currently has ALL content hardcoded. Make it fully editable from the admin panel via settings.

### Part A: Frontend (`storyuser`) — Make AboutView Read From Settings

Update `storyuser/src/types.ts` — Add to `StorefrontContent` interface:
```typescript
// About page
aboutEyebrow: string;
aboutTitle: string;
aboutIntroParagraph1: string;
aboutIntroParagraph2: string;
aboutPrimaryCtaText: string;
aboutSecondaryCtaText: string;
aboutImage1: string;
aboutImage2: string;
aboutImage3: string;
aboutBadgeText: string;
aboutStats: [string, string][]; // [["2026","Founded"], ...]
aboutValuesEyebrow: string;
aboutValuesTitle: string;
aboutValues: { title: string; text: string }[];
aboutPromiseEyebrow: string;
aboutPromiseTitle: string;
aboutPromiseBody: string;
aboutPromiseImage: string;
```

Update `storyuser/src/api.ts` — In `mapStorefrontContent`, add:
```typescript
aboutEyebrow: settings.about_eyebrow || 'About STORY India',
aboutTitle: settings.about_title || 'Verified Fashion, Curated In India',
aboutIntroParagraph1: settings.about_intro_paragraph_1 || 'STORY is a premium India-based fashion store built for people who want original branded pieces without the noise of fast, careless shopping.',
aboutIntroParagraph2: settings.about_intro_paragraph_2 || 'We curate verified branded fashion across uppers, lowers, dresses, co-ords, footwear, accessories, and inners, with a focus on authenticity, condition, price, and everyday Indian style.',
aboutPrimaryCtaText: settings.about_primary_cta_text || 'Shop Verified Picks',
aboutSecondaryCtaText: settings.about_secondary_cta_text || 'View Curated Drops',
aboutImage1: settings.about_image_1 || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
aboutImage2: settings.about_image_2 || 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
aboutImage3: settings.about_image_3 || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
aboutBadgeText: settings.about_badge_text || 'Premium branded fashion, checked, styled, and priced for modern Indian wardrobes.',
aboutStats: jsonListFromSetting(settings.about_stats, [['2026','Founded'],['7','Core categories'],['100%','Original focus'],['INDIA','Curated for']]),
aboutValuesEyebrow: settings.about_values_eyebrow || 'Our standard',
aboutValuesTitle: settings.about_values_title || 'Original Pieces, Clear Checks',
aboutValues: jsonListFromSetting(settings.about_values, [
  { title: 'Authentic', text: 'Every piece is checked for brand identity, condition, finish, and everyday wearability before it enters the STORY edit.' },
  { title: 'Curated', text: 'We select branded fashion for Indian wardrobes: sharp layers, premium basics, clean footwear, and easy occasion pieces.' },
  { title: 'Value', text: 'The goal is simple: original branded fashion, better prices, and quality that feels worth returning to.' }
]),
aboutPromiseEyebrow: settings.about_promise_eyebrow || 'The STORY promise',
aboutPromiseTitle: settings.about_promise_title || 'Verified Authentic. Best Price. Better Quality.',
aboutPromiseBody: settings.about_promise_body || 'From first scroll to final delivery, STORY keeps the edit focused: real branded pieces, clean product presentation, reliable support, and fashion that fits Indian everyday life.',
aboutPromiseImage: settings.about_promise_image || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
```

Update `storyuser/src/components/AboutView.tsx`:
- Accept `content: StorefrontContent` prop
- Replace all hardcoded text with `content.aboutXxx` values
- Replace hardcoded `ABOUT_IMAGES` with `[content.aboutImage1, content.aboutImage2, content.aboutImage3]`
- Replace hardcoded `STATS` with `content.aboutStats`
- Replace hardcoded `VALUES` with `content.aboutValues`
- Replace hardcoded promise section text with `content.aboutPromiseXxx`
- Keep the existing layout and styling exactly the same

Update `storyuser/src/App.tsx`:
- Pass `content={storefrontContent}` to `<AboutView>`
- Update AboutView props interface

### Part B: Admin Panel — About Page Editor in SettingsView

Add a new section in `story-luxury-admin/src/components/SettingsView.tsx` titled **"About Page"** with these fields:

**Section: About Hero**
- About Eyebrow (text input)
- About Title (text input)
- Intro Paragraph 1 (textarea)
- Intro Paragraph 2 (textarea)
- Primary CTA Text (text input)
- Secondary CTA Text (text input)

**Section: About Images**
- Image 1 URL (text input with preview)
- Image 2 URL (text input with preview)
- Image 3 URL (text input with preview)
- Badge Text (text input)

**Section: About Stats**
- Editable list of stat pairs: [value, label]
- Default: [["2026","Founded"],["7","Core categories"],["100%","Original focus"],["INDIA","Curated for"]]
- Add/remove stat pairs
- Each pair has: value (text) + label (text)

**Section: About Values**
- Values Eyebrow (text input)
- Values Title (text input)
- Editable list of value cards: [{title, text}]
- Default 3 values: Authentic, Curated, Value
- Add/remove/edit value cards
- Each card has: title (text input) + text (textarea)

**Section: About Promise**
- Promise Eyebrow (text input)
- Promise Title (text input)
- Promise Body (textarea)
- Promise Image URL (text input with preview)

### Part C: Admin API Mapping

Update `story-luxury-admin/src/api.ts`:
- In `mapSettings`, add all about_* fields to `StoreSettings`
- In `settingsPayload`, map them back to `about_*` keys

Update `story-luxury-admin/src/types.ts`:
- Add to `StoreSettings` interface:
```typescript
aboutEyebrow: string;
aboutTitle: string;
aboutIntroParagraph1: string;
aboutIntroParagraph2: string;
aboutPrimaryCtaText: string;
aboutSecondaryCtaText: string;
aboutImage1: string;
aboutImage2: string;
aboutImage3: string;
aboutBadgeText: string;
aboutStats: [string, string][];
aboutValuesEyebrow: string;
aboutValuesTitle: string;
aboutValues: { title: string; text: string }[];
aboutPromiseEyebrow: string;
aboutPromiseTitle: string;
aboutPromiseBody: string;
aboutPromiseImage: string;
```

Update `story-luxury-admin/src/data.ts`:
- Add default values for all about fields in `defaultSettings`

---

## IMPORTANT CONSTRAINTS

1. Do NOT modify anything in `storyuser/` folder — it is finalized
2. Keep existing API response envelope format: `{ success: true, data: ... }`
3. Keep httpOnly cookie auth pattern — do NOT switch to Bearer token headers
4. Keep `credentials: 'include'` in all fetch calls
5. Keep Prisma as ORM — do not switch to raw SQL
6. Keep existing Express middleware stack (helmet, cors, cookieParser, morgan, rateLimit)
7. All admin routes must be under `/api/admin/` prefix
8. All public routes under `/api/`
9. Use Zod for request body validation
10. Return proper HTTP status codes (400 for validation, 401 for unauth, 403 for forbidden, 404 for not found)
11. Keep existing CORS configuration that allows frontend and admin URLs

---

## FILE STRUCTURE REFERENCE

```
backend/
├── prisma/
│   ├── schema.prisma (Prisma DB schema)
│   ├── seed.js (DB seeder)
│   └── migrations/
├── src/
│   ├── index.js (Express app entry)
│   ├── config/
│   │   ├── db.js (Prisma client export)
│   │   ├── env.js (Environment config)
│   │   └── razorpay.js (Razorpay instance)
│   ├── middleware/
│   │   ├── auth.js (JWT verify, requireAuth, requireAdmin)
│   │   ├── errorHandler.js (Global error handler)
│   │   ├── upload.js (Multer config)
│   │   └── validate.js (Zod validation middleware)
│   ├── modules/
│   │   ├── admin/router.js (Dashboard stats, users list)
│   │   ├── auth/router.js (Login, register, Google, admin login/me/logout)
│   │   ├── cart/router.js
│   │   ├── categories/router.js (Public + admin CRUD)
│   │   ├── contact/router.js (Public create + admin list/status)
│   │   ├── coupons/router.js (Public validate + admin CRUD)
│   │   ├── orders/router.js (User orders + admin management)
│   │   ├── payment/router.js (Razorpay create + verify + webhook)
│   │   ├── products/router.js (Public list + admin CRUD)
│   │   ├── profile/router.js (User profile + addresses)
│   │   ├── reviews/router.js (Public list/create + admin management)
│   │   └── settings/router.js (Public read + admin write)
│   └── utils/
│       ├── ApiError.js
│       ├── asyncHandler.js
│       ├── localUpload.js
│       ├── money.js
│       ├── orderTotals.js
│       ├── sendEmail.js
│       ├── serializers.js
│       └── slugify.js
├── uploads/ (static file storage)
├── package.json
└── .env.example

story-luxury-admin/
├── src/
│   ├── App.tsx (Main admin shell with sidebar + views)
│   ├── api.ts (All admin API calls)
│   ├── types.ts (TypeScript interfaces)
│   ├── data.ts (Default/fallback data)
│   └── components/
│       ├── DashboardView.tsx
│       ├── OrdersView.tsx
│       ├── ProductsView.tsx
│       ├── CategoriesView.tsx
│       ├── CouponsView.tsx
│       ├── CustomersView.tsx
│       ├── InventoryView.tsx
│       ├── PaymentsView.tsx
│       ├── SettingsView.tsx
│       ├── ClientRequestsView.tsx
│       ├── ReviewsView.tsx
│       └── Modals.tsx (AddProduct, AddCategory, CreateCoupon modals)
├── package.json
└── vite.config.ts
```

---

## DATABASE SCHEMA (Prisma)

```prisma
model User {
  id           String    @id @default(uuid()) @db.Uuid
  firstName    String
  lastName     String?
  email        String    @unique
  phone        String?
  passwordHash String?
  googleSub    String?   @unique
  role         String    @default("user") // "user" | "admin"
  isActive     Boolean   @default(true)
  newsletter   Boolean   @default(true)
  language     String    @default("ENGLISH")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  addresses    Address[]
  cartItems    CartItem[]
  orders       Order[]
}

model Category {
  id          String    @id @default(uuid()) @db.Uuid
  name        String
  slug        String    @unique
  description String?
  imageUrl    String?
  isActive    Boolean   @default(true)
  sortOrder   Int       @default(0)
  isDynamic   Boolean   @default(false)
  parent      String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  products    Product[]
}

model Product {
  id              String    @id @default(uuid()) @db.Uuid
  categoryId      String?   @db.Uuid
  name            String
  slug            String    @unique
  description     String?
  images          String[]  @default([])
  secondaryImage  String?
  details         Json?     // string[]
  composition     String?
  care            String?
  sizes           Json?     // string[]
  colors          Json?     // {name, hex}[]
  price           Decimal   @db.Decimal(10, 2)
  discountedPrice Decimal?  @db.Decimal(10, 2)
  stock           Int       @default(0)
  sku             String?   @unique
  isActive        Boolean   @default(true)
  location        String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  category        Category? @relation(fields: [categoryId], references: [id])
}

model Order {
  id                String   @id @default(uuid()) @db.Uuid
  publicId          String   @unique
  userId            String   @db.Uuid
  addressSnapshot   Json
  status            String   @default("pending")
  subtotal          Decimal
  couponDiscount    Decimal  @default(0)
  deliveryFee       Decimal  @default(0)
  gstAmount         Decimal  @default(0)
  total             Decimal
  paymentStatus     String   @default("pending")
  razorpayOrderId   String?
  razorpayPaymentId String?
  trackingUrl       String?
  notes             String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  items             OrderItem[]
}

model Setting {
  key       String   @id
  value     String
  updatedAt DateTime @updatedAt
}

model ContactRequest {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  email     String
  phone     String?
  topic     String
  message   String
  status    String   @default("new")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model CustomerReview {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  tag       String
  rating    Int      @default(5)
  review    String
  status    String   @default("pending")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## ADMIN PANEL DESIGN SYSTEM

- Background: `bg-[#fafafa]`
- Cards: `bg-white rounded-xl border border-neutral-200/60 shadow-xs p-6`
- Labels: `font-mono text-[10px] uppercase tracking-widest text-neutral-500`
- Headings: `text-sm font-semibold text-neutral-900 uppercase tracking-wider`
- Inputs: `p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900`
- Buttons primary: `bg-neutral-950 text-white font-mono text-[10px] uppercase tracking-widest px-5 py-3`
- Buttons secondary: `border border-neutral-200 text-neutral-600 hover:border-neutral-950`
- Status badges: active/paid=`bg-emerald-50 text-emerald-700`, pending=`bg-amber-50 text-amber-700`, failed/draft=`bg-red-50 text-red-700`
- Icons: Lucide React, size 14-16, strokeWidth 1.5
- Animations: Framer Motion, opacity fade + slight y translate

---

## EXPECTED OUTCOME

After implementing all tasks:
1. Admin can create products with ALL fields (description, sizes, colors, details, multiple images, composition, care)
2. Admin can edit existing products with full form
3. Admin can upload category images
4. Admin can add tracking URL to shipped orders
5. Dashboard shows real aggregated stats from database
6. Seed script creates a complete working dataset
7. All API endpoints return data in the exact format the user frontend expects
8. Reviews flow works end-to-end (user submits → admin approves → shows on frontend)
9. Settings flow works end-to-end (admin edits → saved to DB → frontend reads on load)
10. File uploads work for products and categories
11. About page content is fully editable from admin Settings → reads dynamically on frontend

---

## PRIORITY ORDER

1. Product full CRUD (backend + admin) — HIGHEST IMPACT
2. About page editable (backend settings + admin UI + frontend dynamic) — CLIENT VISIBLE
3. Dashboard stats (backend + admin)
4. Order tracking URL (backend + admin)
5. Category image upload (backend + admin)
6. Seed script with complete data
7. Reviews end-to-end verification
8. Settings end-to-end verification
9. Auth hardening verification
