/**
 * store/cartStore.js
 * Zustand cart store with localStorage persistence
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],         // { product, variant, quantity }
      isOpen: false,

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart:() => set(s => ({ isOpen: !s.isOpen })),

      addItem: (product, variant, quantity = 1) => {
        set(state => {
          const existing = state.items.find(
            i => i.variant.sku === variant.sku
          );
          if (existing) {
            return {
              items: state.items.map(i =>
                i.variant.sku === variant.sku
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, variant, quantity }] };
        });
      },

      removeItem: (sku) =>
        set(state => ({ items: state.items.filter(i => i.variant.sku !== sku) })),

      updateQuantity: (sku, quantity) => {
        if (quantity <= 0) { get().removeItem(sku); return; }
        set(state => ({
          items: state.items.map(i =>
            i.variant.sku === sku ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      get totalItems() { return get().items.reduce((s, i) => s + i.quantity, 0); },
      get subtotal() {
        return get().items.reduce((s, i) => s + (i.variant.price || 0) * i.quantity, 0);
      },
    }),
    { name: 'kahf-cart' }
  )
);
