/**
 * store/adminStore.js
 * Admin panel state — products loaded from catalog.json, editable in-memory
 */
import { create } from 'zustand';
import catalogData from '../data/catalog.json';

// Deep clone to avoid mutating the import
const initProducts = () => JSON.parse(JSON.stringify(catalogData.products));

export const useAdminStore = create((set, get) => ({
  products: initProducts(),
  categories: catalogData.categories,
  isAuthenticated: false,
  adminUser: null,

  /* ── Auth ──────────────────────────────────────────────────── */
  login: (username, password) => {
    // In production replace with real JWT/API auth
    if (username === 'admin' && password === 'kahfgreens2024') {
      set({ isAuthenticated: true, adminUser: { name: 'Kahf Admin', role: 'owner' } });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, adminUser: null }),

  /* ── Product CRUD ──────────────────────────────────────────── */
  updateProduct: (productId, updates) => {
    set(state => ({
      products: state.products.map(p =>
        p.id === productId ? { ...p, ...updates } : p
      ),
    }));
  },

  updateVariant: (productId, sku, variantUpdates) => {
    set(state => ({
      products: state.products.map(p =>
        p.id === productId
          ? {
              ...p,
              variants: p.variants.map(v =>
                v.sku === sku ? { ...v, ...variantUpdates } : v
              ),
            }
          : p
      ),
    }));
  },

  addProduct: (product) => {
    set(state => ({ products: [product, ...state.products] }));
  },

  deleteProduct: (productId) => {
    set(state => ({
      products: state.products.filter(p => p.id !== productId),
    }));
  },

  /* ── Bulk price update ─────────────────────────────────────── */
  bulkUpdatePrice: (productId, newPrice) => {
    set(state => ({
      products: state.products.map(p =>
        p.id === productId
          ? {
              ...p,
              minPrice: newPrice,
              maxPrice: newPrice,
              variants: p.variants.map(v => ({ ...v, price: newPrice })),
            }
          : p
      ),
    }));
  },

  /* ── Toggle sold-out ───────────────────────────────────────── */
  toggleSoldOut: (productId, sku) => {
    set(state => ({
      products: state.products.map(p => {
        if (p.id !== productId) return p;
        const variants = p.variants.map(v => {
          if (v.sku !== sku) return v;
          const newQty = v.soldOut ? 1 : 0;
          return { ...v, quantity: newQty, inStock: !v.soldOut, soldOut: !v.soldOut };
        });
        return { ...p, variants, totalQuantity: variants.reduce((s, v) => s + v.quantity, 0) };
      }),
    }));
  },

  /* ── Image management ──────────────────────────────────────── */
  updateProductImages: (productId, images) => {
    set(state => ({
      products: state.products.map(p =>
        p.id === productId ? { ...p, images } : p
      ),
    }));
  },

  /* ── Stats ─────────────────────────────────────────────────── */
  getStats: () => {
    const products = get().products;
    const totalProducts  = products.length;
    const totalVariants  = products.reduce((s, p) => s + p.variants.length, 0);
    const totalStock     = products.reduce((s, p) => s + p.totalQuantity, 0);
    const soldOutCount   = products.reduce((s, p) => s + p.variants.filter(v => v.soldOut).length, 0);
    const lowStockCount  = products.filter(p => p.totalQuantity > 0 && p.totalQuantity <= 10).length;
    const avgPrice       = products
      .filter(p => p.minPrice !== null)
      .reduce((s, p) => s + (p.minPrice + p.maxPrice) / 2, 0) / totalProducts;
    return { totalProducts, totalVariants, totalStock, soldOutCount, lowStockCount, avgPrice: Math.round(avgPrice) };
  },
}));
