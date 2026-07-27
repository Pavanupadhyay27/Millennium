import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string; // unique cart item id (e.g. product slug + color + material)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  material: string;
  image: string;
  slug: string;
  bg?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  bg: string;
}

interface AppState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  cartDrawerOpen: boolean;
  leadModalOpen: boolean;
  lastAddedItem: CartItem | null;
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  
  // Actions
  toggleCartDrawer: (isOpen?: boolean) => void;
  dismissToast: () => void;
  openLeadModal: (context?: { itemTitle?: string; actionType?: string }) => void;
  closeLeadModal: () => void;
  login: (user: { name: string; email: string }) => void;
  logout: () => void;
  addToCart: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (slug: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      cartDrawerOpen: false,
      leadModalOpen: false,
      lastAddedItem: null,
      isAuthenticated: false,
      user: null,

      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),

      toggleCartDrawer: (isOpen) =>
        set((state) => ({
          cartDrawerOpen: isOpen !== undefined ? isOpen : !state.cartDrawerOpen,
        })),

      dismissToast: () => set({ lastAddedItem: null }),

      openLeadModal: (context) =>
        set({
          leadModalOpen: true,
        }),

      closeLeadModal: () =>
        set({
          leadModalOpen: false,
        }),

      addToCart: (item) => {
        const cart = get().cart;
        const rowId = `${item.slug}-${item.color.replace(/\s+/g, "-")}-${item.material.replace(/\s+/g, "-")}`;
        const existingIndex = cart.findIndex((i) => i.id === rowId);

        let addedRecord: CartItem;

        if (existingIndex > -1) {
          const updated = [...cart];
          updated[existingIndex].quantity += item.quantity || 1;
          addedRecord = updated[existingIndex];
          set({ cart: updated, lastAddedItem: addedRecord });
        } else {
          addedRecord = { ...item, id: rowId, quantity: item.quantity || 1 };
          set({
            cart: [...cart, addedRecord],
            lastAddedItem: addedRecord,
          });
        }
      },

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      updateCartQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (item) => {
        const wishlist = get().wishlist;
        const exists = wishlist.some((i) => i.slug === item.slug);
        if (exists) {
          set({ wishlist: wishlist.filter((i) => i.slug !== item.slug) });
        } else {
          set({ wishlist: [...wishlist, item] });
        }
      },

      isInWishlist: (slug) => {
        return get().wishlist.some((i) => i.slug === slug);
      },
    }),
    {
      name: "millennium-store-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
