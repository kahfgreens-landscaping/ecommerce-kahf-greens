/**
 * store/wishlistStore.js
 * Zustand wishlist with localStorage persistence
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],   // product objects

      toggle: (product) => {
        const exists = get().items.some(p => p.id === product.id);
        set(state => ({
          items: exists
            ? state.items.filter(p => p.id !== product.id)
            : [...state.items, product],
        }));
      },

      isWishlisted: (productId) => get().items.some(p => p.id === productId),
      count: () => get().items.length,
    }),
    { name: 'kahf-wishlist' }
  )
);
