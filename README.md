# 🌿 Kahf Greens — Premium E-Commerce Portal

[![Vite](https://img.shields.io/badge/Vite-v8.3-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange)](https://github.com/pmndrs/zustand)
[![Location](https://img.shields.io/badge/Region-UAE%20%7C%20Dubai-green)](https://www.kahfgreens.ae)

A modern, high-performance e-commerce storefront and database administration control panel developed for **Kahf Greens LLC** (Dubai, UAE) — premier supplier of Italian and international luxury planters, garden pots, and landscape containers.

---

## 🌟 Key Highlights & Architecture

- **Storefront & Tech Stack:** React 19 + Vite 8 + Tailwind CSS 3.4 + Radix UI primitives + Lucide Icons + Framer Motion.
- **Master Catalog Data:** Built directly from the processed company inventory (`ecommerce.xlsx`), cataloging **50+ product families**, **269 variant configurations**, and real-time stock levels in AED.
- **Accurate Swatch Engine:** Mapped 64 unique color finishes including Italian resins (*Clay Resnova, Nova Carbon, Sabbia, Impruneta, Terracotta*), metallic finishes (*Gold, Silver, Metallic Copper*), dual-tone split gradients (*Black/White, White/Terracotta*), and frosted glass tints.
- **Click-to-Preview Color Switching:** Clicking any color dot instantly updates the product picture to that specific variant across all product cards and detail galleries.
- **Dual-Spec Size Selector:** Unified multi-capacity models (e.g., `Idel DANTE 0.7L (10 cm)` & `2.5L (17 cm)`, `Idel VOLTERRA 14L/17L/21L`) with automatic price & SKU switching.
- **Interactive Full-Screen Lightbox:** Full-screen zoom and inspection modal with arrow keys, thumbnail scrubber, and color indicator tags.
- **Admin Control Panel (`/admin`):** Complete management dashboard with real-time KPIs, inline price/name editing, variant stock adjustments, and sold-out toggling.
- **UAE-Tailored Commerce:** Transparent 5% VAT calculation, free delivery progress counter (orders over AED 200), and one-click WhatsApp instant order integration.

---

## 🚀 Quick Start

### 1. Installation & Local Development
```bash
# Clone the repository
git clone https://github.com/kahfgreens-landscaping/ecommerce-kahf-greens.git
cd ecommerce-kahf-greens

# Install dependencies
npm install

# Start development server
npm run dev
```
→ Storefront runs at: **http://localhost:3002/**  
→ Admin Control Panel at: **http://localhost:3002/admin**

### 2. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔐 Admin Control Center

Accessible directly at: **`/admin`**

### Admin Features:
- 📊 **Real-time Inventory Metrics:** Total product families, variants, stock units on hand, sold-out items, and average catalog price.
- ✏️ **Spreadsheet-style Inline Quick Edit:** Update titles and prices directly in the grid without navigating away.
- 📦 **Per-Variant Drilldown:** Expand any product row to manage specific SKUs, colors, quantities, and prices.
- 🔴 **Sold-Out Management:** Instantly mark items as sold-out or back-in-stock.
- ⚠️ **Low-Stock Tracker:** Dedicated alert tab for all items with 10 or fewer units in stock.

---

## 🗂️ Project Directory Structure

```
ecommerce-kahf-greens/
├── public/
│   ├── images/
│   │   ├── placeholder-pot.jpg
│   │   └── products/                 ← High-res product images library
├── src/
│   ├── components/
│   │   ├── cart/
│   │   │   └── CartDrawer.jsx         ← Slide-in cart with VAT & free delivery counter
│   │   ├── layout/
│   │   │   ├── Header.jsx             ← Sticky header, search modal, cart drawer
│   │   │   └── Footer.jsx             ← UAE company details, VAT TRN, social links
│   │   └── ui/
│   │       ├── ProductCard.jsx        ← Interactive cards with instant color switching
│   │       ├── SearchModal.jsx        ← Live fuzzy product search
│   │       └── WhatsAppFloat.jsx      ← Sticky WhatsApp UAE support button
│   ├── data/
│   │   ├── catalog.json               ← Master catalog generated from ecommerce.xlsx
│   │   └── imageMap.js                ← Slug & color → image indexing engine
│   ├── lib/
│   │   └── utils.js                   ← AED price formatting, 64-color swatch styles, helpers
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx         ← Secure admin authentication gate
│   │   │   ├── AdminDashboard.jsx     ← KPIs, inline quick-edit, inventory manager
│   │   │   └── AdminPage.jsx
│   │   ├── HomePage.jsx               ← Brand hero, UAE trust badges, bestsellers, B2B callout
│   │   ├── ProductsPage.jsx           ← Filter sidebar (color swatches, price slider, categories)
│   │   ├── ProductDetailPage.jsx      ← Multi-view gallery, dual-spec size picker, lightbox
│   │   ├── CollectionPage.jsx         ← Brand range collections (Idel, Pottery Pots, Desch)
│   │   ├── WishlistPage.jsx           ← Persistent wishlist
│   │   └── ContactPage.jsx            ← UAE office details, Google Map & contact form
│   ├── store/
│   │   ├── cartStore.js               ← Zustand cart with LocalStorage persistence
│   │   ├── wishlistStore.js           ← Zustand wishlist
│   │   └── adminStore.js              ← Admin CRUD & in-memory catalog state
│   ├── App.jsx                        ← Lazy-loaded routing
│   ├── main.jsx                       ← Root application mounting
│   └── index.css                      ← Tailwind base, brand tokens & utility classes
├── scripts/
│   ├── parse-excel-full.cjs           ← Excel (.xlsx) inventory parser & catalog compiler
│   └── generate-image-map.cjs         ← Curated image mapper with photo scoring
└── vite.config.js
```

---

## 🔄 Catalog & Image Automation Scripts

Whenever new products or images are added from Google Drive:

```bash
# 1. Compile fresh catalog from ecommerce.xlsx
node scripts/parse-excel-full.cjs

# 2. Re-index and rank the product photo library
node scripts/generate-image-map.cjs
```

---

## 🏢 About Kahf Greens LLC

- **Company:** Kahf Greens LLC (Dubai, United Arab Emirates)
- **Official Website:** [https://www.kahfgreens.ae](https://www.kahfgreens.ae)
- **Phone:** +971 4 224 0733
- **WhatsApp:** +971 56 509 6880
- **Email:** shop@kahfgreens.ae
