import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CustomFurnitureSpecs {
  finish: string;
  upholstery: string;
  dimensions: { width: number; depth: number; height: number };
  engraving?: string;
  priceDelta: number;
}

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  color: string;
  material: string;
  image: string;
  slug: string;
  bg?: string;
  customSpecs?: CustomFurnitureSpecs;
  appliedOfferCode?: string;
  appliedDiscountAmount?: number;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  discountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  discountValue: number; // e.g. 20 for 20%, 5000 for ₹5000
  targetProductId?: string; // specific product or all
  active: boolean;
  minOrderValue?: number;
  bannerText?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  wholesalePrice: number;
  stock: number;
  status: "active" | "draft";
  featured: boolean;
  bg: string;
  image: string;
  images?: string[];
  description: string;
  colors: string[];
  materials: string[];
  customizable?: boolean;
  dimensions?: string;
  woodType?: string;
  weight?: string;
  reviews?: Review[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  bg: string;
}

const INITIAL_OFFERS: Offer[] = [
  {
    id: "off-1",
    code: "FESTIVE20",
    title: "Festive Season Teak Special",
    discountType: "PERCENTAGE",
    discountValue: 20,
    targetProductId: "p1", // Odisha Teak Lounge Chair
    active: true,
    minOrderValue: 15000,
    bannerText: "Get 20% OFF on Handcrafted Teak Seating with code FESTIVE20",
    createdAt: new Date().toISOString(),
  },
  {
    id: "off-2",
    code: "LUXURY5000",
    title: "Luxury Living Flat Discount",
    discountType: "FIXED",
    discountValue: 5000,
    targetProductId: "p6", // Kalinga Walnut Coffee Table
    active: true,
    minOrderValue: 20000,
    bannerText: "Flat ₹5,000 OFF on Walnut Coffee Tables! Code: LUXURY5000",
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Odisha Teak Lounge Chair",
    slug: "odisha-teak-lounge-chair",
    category: "Seating",
    price: 24500,
    wholesalePrice: 18500,
    stock: 22,
    status: "active",
    featured: true,
    bg: "bg-pastel-mint",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600",
    description: "A comfortable hand-made teak lounge chair with high density foam cushions and full bespoke customizer options.",
    colors: ["Natural Wood", "Charcoal Black", "Honey Teak"],
    materials: ["Solid Teak Wood", "Italian Leather", "Linen Blend"],
    customizable: true,
    seoTitle: "Odisha Teak Lounge Chair | Buy Handmade Teak Chair",
    seoDescription: "Premium handcrafted teak lounge chair built in Bhubaneswar with organic wood finishing.",
  },
  {
    id: "p2",
    name: "Konark Rattan Easy Armchair",
    slug: "konark-rattan-easy-armchair",
    category: "Seating",
    price: 15500,
    wholesalePrice: 11000,
    stock: 5,
    status: "active",
    featured: false,
    bg: "bg-pastel-butter",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=600",
    description: "Eco-friendly rattan weaving armchair. Fits light minimalist living spaces.",
    colors: ["Natural Wood", "Vintage Brown"],
    materials: ["Natural Rattan", "Teak Frame"],
    customizable: true,
    seoTitle: "Konark Rattan Armchair | Millennium B2B Furniture",
    seoDescription: "Shop natural handcrafted rattan dining and lounge armchairs directly from Odisha.",
  },
  {
    id: "p6",
    name: "Kalinga Walnut Coffee Table",
    slug: "kalinga-walnut-coffee-table",
    category: "Tables",
    price: 18900,
    wholesalePrice: 14000,
    stock: 14,
    status: "active",
    featured: true,
    bg: "bg-pastel-blush",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600",
    description: "Walnut coffee table featuring organic soft angles and a magazine shelf underneath.",
    colors: ["Natural Walnut", "Ebonized Oak"],
    materials: ["Walnut Wood", "Oak Veneer"],
    customizable: true,
    seoTitle: "Kalinga Walnut Coffee Table - Millennium Odisha",
    seoDescription: "Premium walnut coffee tables crafted for modern organic living rooms.",
  },
  {
    id: "p10",
    name: "Bhubaneswar Oak Sideboard",
    slug: "bhubaneswar-oak-sideboard",
    category: "Storage",
    price: 48000,
    wholesalePrice: 36000,
    stock: 8,
    status: "draft",
    featured: false,
    bg: "bg-pastel-lavender",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600",
    description: "Oak credenza storage unit with sliding tambour doors.",
    colors: ["Natural Oak", "Dark Walnut Finish"],
    materials: ["Solid Oak Wood"],
    customizable: true,
    seoTitle: "Bhubaneswar Oak Sideboard Credenza",
    seoDescription: "Solid oak timber storage credenza sideboard handcrafted locally in Odisha.",
  }
];

export interface OrderRecord {
  id: string;
  date: string;
  customerName: string;
  email: string;
  type: "Wholesale" | "Retail";
  total: number;
  status: string;
  address: string;
  phone: string;
  gstin?: string;
  items: Array<{ name: string; color?: string; quantity: number; price: number }>;
}

const INITIAL_ORDERS_LIST: OrderRecord[] = [
  {
    id: "PO-2026-0925",
    date: "July 18, 2026",
    customerName: "Mohapatra Interiors",
    email: "procurement@mohapatra.in",
    type: "Wholesale",
    total: 198000,
    status: "Pending",
    address: "Plot 42, Janpath Road, Bhubaneswar, Odisha - 751001",
    phone: "+91 94371 82931",
    gstin: "21AAAFM9283K1Z9",
    items: [
      { name: "Odisha Teak Lounge Chair", color: "Sage Green", quantity: 8, price: 18500 },
      { name: "Kalinga Walnut Coffee Table", color: "Ebonized Oak", quantity: 4, price: 14000 }
    ]
  },
  {
    id: "RET-2026-4081",
    date: "July 17, 2026",
    customerName: "Sujata Mohanty",
    email: "sujata.m@gmail.com",
    type: "Retail",
    total: 24500,
    status: "Approved",
    address: "Duplex 15, Kalinga Vihar, Patia, Bhubaneswar, Odisha - 751024",
    phone: "+91 70081 29381",
    items: [
      { name: "Odisha Teak Lounge Chair", color: "Natural Wood", quantity: 1, price: 24500 }
    ]
  },
  {
    id: "RET-2026-4079",
    date: "July 16, 2026",
    customerName: "Bikram Keshari",
    email: "bikram.k@yahoo.com",
    type: "Retail",
    total: 18900,
    status: "Shipped",
    address: "Block C, 3rd Floor, Mahanadi Towers, Cuttack, Odisha - 753001",
    phone: "+91 82490 19283",
    items: [
      { name: "Kalinga Walnut Coffee Table", color: "Natural Walnut", quantity: 1, price: 18900 }
    ]
  },
  {
    id: "PO-2026-1082",
    date: "July 12, 2026",
    customerName: "Utkal Builders Ltd",
    email: "purchase@utkalbuilders.com",
    type: "Wholesale",
    total: 284000,
    status: "Delivered",
    address: "Utkal Signature, Kalpana Square, Bhubaneswar, Odisha - 751006",
    phone: "+91 99370 18273",
    gstin: "21AAACU8291A1ZB",
    items: [
      { name: "Odisha Teak Lounge Chair", color: "Natural Wood", quantity: 10, price: 18500 },
      { name: "Kalinga Walnut Coffee Table", color: "Natural Walnut", quantity: 5, price: 14000 }
    ]
  }
];

export interface AppNotification {
  id: string;
  orderId: string;
  customerName: string;
  type: "Wholesale" | "Retail";
  total: number;
  timeAgo: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [];

interface AppState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  offers: Offer[];
  products: Product[];
  orders: OrderRecord[];
  notifications: AppNotification[];
  activePromoCode: string | null;
  cartDrawerOpen: boolean;
  leadModalOpen: boolean;
  leadContext?: { itemTitle?: string; actionType?: string };
  lastAddedItem: CartItem | null;
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  
  // Notification Actions
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AppNotification, "id" | "timeAgo" | "read">) => void;
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
  
  // Cart Actions
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
  
  // Promo / Offers Actions
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  addOffer: (offer: Omit<Offer, "id" | "createdAt">) => void;
  updateOffer: (id: string, offer: Partial<Offer>) => void;
  toggleOfferActive: (id: string) => void;
  deleteOffer: (id: string) => void;
  
  // Products Admin Actions
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addProductReview: (productId: string, review: Omit<Review, "id" | "date">) => void;

  // Wishlist Actions
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (slug: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      offers: INITIAL_OFFERS,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS_LIST,
      notifications: INITIAL_NOTIFICATIONS,
      activePromoCode: null,
      cartDrawerOpen: false,
      leadModalOpen: false,
      lastAddedItem: null,
      isAuthenticated: false,
      user: null,

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      addNotification: (notif) => {
        const newNotif: AppNotification = {
          ...notif,
          id: `notif-${Date.now()}`,
          timeAgo: "Just Now",
          read: false,
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
      },

      addOrder: (newOrder) =>
        set((state) => ({
          orders: [newOrder, ...state.orders],
        })),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        })),

      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),

      toggleCartDrawer: (isOpen) =>
        set((state) => ({
          cartDrawerOpen: isOpen !== undefined ? isOpen : !state.cartDrawerOpen,
        })),

      dismissToast: () => set({ lastAddedItem: null }),

      openLeadModal: () => set({ leadModalOpen: true }),
      closeLeadModal: () => set({ leadModalOpen: false }),

      addToCart: (item) => {
        const cart = get().cart;
        const specHash = item.customSpecs
          ? `${item.customSpecs.finish}-${item.customSpecs.upholstery}-${item.customSpecs.dimensions.width}x${item.customSpecs.dimensions.depth}x${item.customSpecs.dimensions.height}`
          : "";
        const rowId = `${item.slug}-${item.color.replace(/\s+/g, "-")}-${item.material.replace(/\s+/g, "-")}${specHash ? `-${specHash}` : ""}`;
        
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

      clearCart: () => set({ cart: [], activePromoCode: null }),

      // Admin & Public Offers Control
      applyPromoCode: (code) => {
        const offers = get().offers;
        const matched = offers.find(
          (o) => o.code.toUpperCase() === code.trim().toUpperCase() && o.active
        );
        if (!matched) {
          return { success: false, message: "Invalid or expired promo code." };
        }
        set({ activePromoCode: matched.code });
        return { success: true, message: `Promo code "${matched.code}" applied successfully!` };
      },

      removePromoCode: () => set({ activePromoCode: null }),

      addOffer: (offer) => {
        const newOffer: Offer = {
          ...offer,
          id: `off-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ offers: [newOffer, ...state.offers] }));
      },

      updateOffer: (id, updatedFields) => {
        set((state) => ({
          offers: state.offers.map((o) => (o.id === id ? { ...o, ...updatedFields } : o)),
        }));
      },

      toggleOfferActive: (id) => {
        set((state) => ({
          offers: state.offers.map((o) => (o.id === id ? { ...o, active: !o.active } : o)),
        }));
      },

      deleteOffer: (id) => {
        set((state) => ({
          offers: state.offers.filter((o) => o.id !== id),
        }));
      },

      // Admin Products CRUD Actions
      addProduct: (product) => {
        const newProd: Product = {
          ...product,
          id: `p-${Date.now()}`,
        };
        set((state) => ({ products: [newProd, ...state.products] }));
      },

      updateProduct: (id, updatedFields) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
        }));
      },

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      addProductReview: (productId, newReview) =>
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id === productId || p.slug === productId) {
              const existingReviews = p.reviews || [];
              const fullReview: Review = {
                ...newReview,
                id: `rev-${Date.now()}`,
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              };
              return {
                ...p,
                reviews: [fullReview, ...existingReviews],
              };
            }
            return p;
          }),
        })),

      // Wishlist
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
        offers: state.offers,
        products: state.products,
        orders: state.orders,
        notifications: state.notifications,
        activePromoCode: state.activePromoCode,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
