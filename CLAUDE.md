# Ecommerce (Customer Storefront) — CLAUDE.md

## 📋 အလုပ်လုပ်ရမည့် စည်းမျဉ်းများ (Strict Workflow Rules)

အောက်ပါစည်းမျဉ်းများကို **မဖြစ်မနေ** လိုက်နာရမည်။

### ၁. ဘာသာစကားသတ်မှတ်ချက် (Language Requirement)
- **All responses, status updates, implementation plans, and code comments MUST be written in Myanmar Language (မြန်မာဘာသာ).**
- English may only be used for: code itself, technical terms, and direct quotes from existing documentation.

### ၂. Plan First Principle
- **NEVER write or modify code directly** without first creating an implementation plan.
- When asked to make changes: draft a detailed Implementation Plan in Myanmar Language → show user → wait for approval.

### ၃. Auto-Save Plan Files
- Save plans in `ecommerce/plans/` folder.
- Format: `YYYY-MM-DD-short-description-plan.md`
- Example: `2026-07-27-add-search-feature-plan.md`

### ၄. Wait for Explicit Approval
- Present the plan in Myanmar Language.
- **DO NOT** modify any files until the user explicitly says "OK", "Go ahead", "လုပ်ပါ", or equivalent.

---

## 🚀 Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Vite dev server (--host for network access)
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

---

## 🧩 Project Purpose

This is a **customer-facing medicine ordering storefront** — a separate application from the POS system. Customers can:
- Browse medicines by brand and category
- View product pricing tiers
- Add items to cart and place orders
- Track order history

The app connects to the same backend API as the dashboard, but uses **customer-facing endpoints** (`/ecommerce/*`, `/customer/*`).

---

## 🏗️ Architecture

```
ecommerce/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Root — login gate → CartProvider → Router
│   ├── index.css             # Global styles + Tailwind directives
│   ├── pages/
│   │   ├── Home.tsx           # Hero banner + Brands + Limited Sale
│   │   ├── Products.tsx       # Brand → Category → Product drill-down
│   │   ├── Cart.tsx           # Cart with order submission
│   │   ├── ProductDetail.tsx  # Product detail + variant selection
│   │   ├── Login.tsx          # Phone-based login
│   │   ├── Search.tsx         # Product search
│   │   ├── Profile.tsx        # User profile
│   │   ├── LimitedProducts.tsx # Limited sale products
│   │   └── About.tsx          # About page
│   ├── pages/products/
│   │   ├── types.ts           # Product type definitions
│   │   ├── BrandGrid.tsx      # Brand selection grid
│   │   ├── CategoryGrid.tsx   # Category selection grid
│   │   ├── ProductList.tsx    # Product listing with categories
│   │   └── ProductRow.tsx     # Product row component
│   ├── components/
│   │   ├── Navbar.tsx          # Top nav with cart badge
│   │   ├── HeroBanner.tsx      # Promotional banner
│   │   ├── BrandSection.tsx    # Brand grid on home page
│   │   ├── LimitedSaleSection.tsx # Limited sale section
│   │   ├── ProductCard.tsx     # Product display card
│   │   ├── SearchHeader.tsx    # Search bar
│   │   ├── Skeleton.tsx        # Loading skeleton
│   │   ├── GridButton.tsx      # Navigation button
│   │   ├── GridPage.tsx        # Generic grid page layout
│   │   ├── LogoutModal.tsx     # Logout confirmation
│   │   └── ScrollToTop.tsx     # Scroll-to-top on route change
│   ├── context/
│   │   └── CartContext.tsx     # Cart state with localStorage persistence
│   ├── services/
│   │   ├── axios.ts            # Axios instance (base URL + JWT interceptor)
│   │   └── auth.service.ts     # Login/logout (phone + hardcoded password)
│   ├── utils/
│   │   └── pricing.ts          # findBestTierIndex() — price tier selection
│   ├── constants/
│   │   └── colors.ts           # Color constants
│   └── assets/
│       ├── fonts/              # ChivoMono-Regular, Tagus (custom fonts)
│       └── images/             # Logo, product images, banner
├── public/
│   └── medicines.json          # Static product data (fallback)
├── dist/                       # Built production assets
├── rules/                      # Coding rules and patterns
└── plans/                      # Implementation plans
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3 + TypeScript 5.5 |
| Build | Vite 5.4 |
| Routing | react-router-dom v7.13 |
| HTTP | Axios 1.16 (with JWT interceptor) |
| Styling | Tailwind CSS 3.4 |
| Icons | lucide-react 0.344 |
| State | React Context (CartContext) |
| Fonts | ChivoMono, Tagus (custom .ttf) |

---

## 🗺️ Routing

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero + Brands + Limited Sale |
| `/products` | Products | Brand → Category → Product drill-down |
| `/product/:id` | ProductDetail | Product detail + variant selection + add to cart |
| `/cart` | Cart | Cart items + order submission |
| `/search` | Search | Product search |
| `/profile` | Profile | User profile |
| `/limited-products` | LimitedProducts | Limited sale products |
| `/about` | About | About this store |
| `*` | → Redirect to Home | Catch-all |

---

## 🎨 UI Patterns & Conventions

### Styling
- **Tailwind CSS 3.4** via PostCSS (installed via npm, unlike dashboard which uses CDN)
- **Custom fonts**: ChivoMono (monospace for prices) + Tagus (headings)
- **Primary color**: Blue (`#3B82F6`) — defined in `constants/colors.ts`
- **Consumer-friendly UI**: Rounded corners, shadows, Myanmar text throughout
- **Mobile-first responsive design** with md: breakpoints

### Component Patterns
- **Page layout**: `bg-[#f8f9fa] min-h-screen pb-40` (bottom spacing for fixed cart bar)
- **Cards**: `bg-white rounded-3xl p-5 border border-gray-100 shadow-sm`
- **Modals**: Overlay success/error modals with `backdrop-blur-sm` and `animate-in` transitions
- **Loading states**: Skeleton component + `animate-pulse` text
- **Empty states**: Centered icon + message + action button

### Navigation Flow
1. **Home** → BrandSection → click brand → goes to `/products?brand=X`
2. **Products** → CategoryGrid → click category → goes to `/products?brand=X&category=Y`
3. **Products** → ProductList → click product → goes to `/product/:id`
4. **ProductDetail** → select variant + quantity → add to cart → navigates to `/cart`
5. **Cart** → review items → place order → success modal → redirect to home

---

## 🛒 Cart & Ordering Flow

### Cart (CartContext)
- **Persistence**: localStorage (`cart_items` key) — survives page refresh
- **Items**: `{ id, inventoryId, name, price, quantity, unit, prices[] }`
- **Pricing**: `recalcPrice()` auto-selects best tier using `findBestTierIndex()`
- **Quantity**: Min 1, adjustable via +/− buttons or direct input

### Order Submission
1. Cart page → "အော်ဒါတင်မယ်" button
2. Sends `POST /ecommerce/order` with `{ products: [{ inventoryId, quantity, unit }] }`
3. JWT auth via `access_token` in localStorage
4. Success → clear cart + show success modal
5. Error → show error modal with message

---

## 🔐 Authentication

- **Login**: Phone-based (`POST /customer/login`)
  - Hardcoded password: `password123`
  - Stores JWT in `localStorage("access_token")`
  - Stores user info in `localStorage("user_info")`
- **App entry**: `App.tsx` checks `localStorage("isLoggedIn")` — if false, renders `<Login />` directly (no routing)
- **Logout**: Clears all localStorage auth keys via `authService.logout()`
- **Axios interceptor**: Auto-adds `Authorization: Bearer <token>`, redirects to `/` on 401

---

## 🌐 Backend API Integration

Connects to the same backend at `VITE_API_URL` (from `.env`):

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/customer/login` | POST | No | Phone login |
| `/customer/register` | POST | No | Customer registration |
| `/ecommerce/products/brands` | GET | No | List product brands |
| `/ecommerce/products/categories` | GET | No | List categories by brand |
| `/ecommerce/products` | GET | No | List products by brand + category |
| `/ecommerce/order` | POST | JWT | Place order |
| `/ecommerce/orders` | GET | JWT | My order history |

---

## 📦 Key Business Features

| Feature | Description |
|---|---|
| **Brand Browsing** | Grid of brands on home page and `/products` |
| **Category Filtering** | Categories within a brand |
| **Product Listing** | Products grouped by category within a brand |
| **Pricing Tiers** | Multiple units (e.g., strip, box, bottle) with different prices |
| **Smart Pricing** | Auto-select best price tier based on quantity |
| **Cart Management** | Add/remove/update quantities, localStorage persistence |
| **Order Placement** | Submit order to backend with JWT auth |
| **Limited Sale** | Special promotions section |
| **Product Search** | Search by product name |

---

## 📁 Rules & Plans

- **Coding rules & patterns:** `ecommerce/rules/`
- **Implementation plans:** `ecommerce/plans/`
