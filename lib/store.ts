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

export interface BrandPartner {
  id: string;
  name: string;
  tag: string;
  logo: string;
  fallbackLogo?: string;
  badge?: string;
}

export interface CmsSettings {
  announcementBarText: string;
  showAnnouncementBar: boolean;
  heroHeadline: string;
  heroSubtext: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  bg: string;
}

const INITIAL_BRAND_PARTNERS: BrandPartner[] = [
  {
    id: "bp-1",
    name: "Sleepwell",
    tag: "Mattress Tech Partner",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sleepwell_Logo.png/640px-Sleepwell_Logo.png",
    fallbackLogo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=120",
    badge: "Official Mattress Partner",
  },
  {
    id: "bp-2",
    name: "CenturyPly",
    tag: "Marine Teak Grade",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/CenturyPly_logo.svg/640px-CenturyPly_logo.svg.png",
    fallbackLogo: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=120",
    badge: "700+ Teak Grade",
  },
  {
    id: "bp-3",
    name: "Featherlite",
    tag: "Ergonomic Hardware",
    logo: "https://featherlitefurniture.com/wp-content/uploads/2021/04/Featherlite-Logo-1.png",
    fallbackLogo: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=120",
    badge: "Ergonomic Hardware",
  },
  {
    id: "bp-4",
    name: "Godrej Interio",
    tag: "Steel Joinery",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Godrej_Logo.svg/512px-Godrej_Logo.svg.png",
    fallbackLogo: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=120",
    badge: "Precision Steel Joinery",
  },
  {
    id: "bp-5",
    name: "Pepperfry",
    tag: "Verified Merchant",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Pepperfry_Logo.png/640px-Pepperfry_Logo.png",
    fallbackLogo: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=120",
    badge: "Verified Marketplace Partner",
  },
];

const INITIAL_CMS_SETTINGS: CmsSettings = {
  announcementBarText: "⚡ Monsoon Special: Up to 20% OFF on Teak Seating & Free Delivery Across Odisha!",
  showAnnouncementBar: true,
  heroHeadline: "Transform Your Home into a Cozy Nest",
  heroSubtext: "Discover our premium handcrafted organic solid teak and walnut wood collections, manufactured locally in Bhubaneswar, Odisha.",
};

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

export interface CustomerTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
  verified: boolean;
  date: string;
}

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

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "WHOLESALE" | "ADMIN";
  ordersCount: number;
  lifetimeValue: number;
  joinDate: string;
  company: string;
  gstin?: string;
  phone?: string;
  history: Array<{ id: string; date: string; value: number; status: string }>;
  customDiscountCode?: string;
}

const INITIAL_ORDERS_LIST: OrderRecord[] = [];
const INITIAL_CUSTOMERS_LIST: CustomerRecord[] = [];

const INITIAL_TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: "t1",
    name: "Aarav Mohapatra",
    role: "Architect, Bhubaneswar",
    quote: "Millennium's attention to teak joinery and finish is exceptional. Delivery inside Bhubaneswar was prompt and seamless.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    verified: true,
    date: "May 14, 2026",
  },
  {
    id: "t2",
    name: "Priyanka Patnaik",
    role: "Homeowner, Cuttack",
    quote: "Visiting their local studio in Bhubaneswar convinced me. The blush accent chair is now the highlight of our living room!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    verified: true,
    date: "Apr 28, 2026",
  },
  {
    id: "t3",
    name: "Ranjan Dash",
    role: "Wholesale Partner, Rourkela",
    quote: "Excellent commercial terms and reliable logistics. The build quality of solid wood frames is highly appreciated.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    verified: true,
    date: "Jun 02, 2026",
  },
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
  customers: CustomerRecord[];
  notifications: AppNotification[];
  customerTestimonials: CustomerTestimonial[];
  brandPartners: BrandPartner[];
  activePromoCode: string | null;
  cartDrawerOpen: boolean;
  leadModalOpen: boolean;
  leadContext?: { itemTitle?: string; actionType?: string };
  lastAddedItem: CartItem | null;
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  
  cmsSettings: CmsSettings;
  updateCmsSettings: (settings: Partial<CmsSettings>) => void;

  // Brand Partners Actions
  addBrandPartner: (partner: Omit<BrandPartner, "id">) => void;
  updateBrandPartner: (id: string, partner: Partial<BrandPartner>) => void;
  deleteBrandPartner: (id: string) => void;

  // Testimonial Actions
  addCustomerTestimonial: (testimonial: Omit<CustomerTestimonial, "id" | "date" | "verified">) => void;
  updateCustomerTestimonial: (id: string, testimonial: Partial<CustomerTestimonial>) => void;
  deleteCustomerTestimonial: (id: string) => void;

  // Notification Actions
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AppNotification, "id" | "timeAgo" | "read">) => void;
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: string) => void;

  // Customer CRM Actions
  registerCustomerOnOrder: (order: OrderRecord) => void;
  updateCustomerDiscount: (customerId: string, code: string) => void;
  
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
      customers: INITIAL_CUSTOMERS_LIST,
      notifications: INITIAL_NOTIFICATIONS,
      customerTestimonials: INITIAL_TESTIMONIALS,
      brandPartners: INITIAL_BRAND_PARTNERS,
      activePromoCode: null,
      cartDrawerOpen: false,
      leadModalOpen: false,
      lastAddedItem: null,
      isAuthenticated: false,
      user: null,

      cmsSettings: INITIAL_CMS_SETTINGS,
      updateCmsSettings: (newSettings) =>
        set((state) => ({
          cmsSettings: { ...state.cmsSettings, ...newSettings },
        })),

      addBrandPartner: (partner) => {
        const newBp: BrandPartner = {
          ...partner,
          id: `bp-${Date.now()}`,
        };
        set((state) => ({
          brandPartners: [...state.brandPartners, newBp],
        }));
      },

      updateBrandPartner: (id, fields) => {
        set((state) => ({
          brandPartners: state.brandPartners.map((bp) => (bp.id === id ? { ...bp, ...fields } : bp)),
        }));
      },

      deleteBrandPartner: (id) => {
        set((state) => ({
          brandPartners: state.brandPartners.filter((bp) => bp.id !== id),
        }));
      },

      addCustomerTestimonial: (testimonial) => {
        const newTestimonial: CustomerTestimonial = {
          ...testimonial,
          id: `t-${Date.now()}`,
          verified: true,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        };
        set((state) => ({
          customerTestimonials: [newTestimonial, ...(state.customerTestimonials || [])],
        }));
      },

      updateCustomerTestimonial: (id, fields) => {
        set((state) => ({
          customerTestimonials: (state.customerTestimonials || []).map((t) => (t.id === id ? { ...t, ...fields } : t)),
        }));
      },

      deleteCustomerTestimonial: (id) => {
        set((state) => ({
          customerTestimonials: (state.customerTestimonials || []).filter((t) => t.id !== id),
        }));
      },

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

      addOrder: (newOrder) => {
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
        get().registerCustomerOnOrder(newOrder);
      },

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        })),

      registerCustomerOnOrder: (order) => {
        set((state) => {
          const existingIdx = state.customers.findIndex(
            (c) => c.email.toLowerCase() === order.email.toLowerCase()
          );

          const orderEntry = {
            id: order.id,
            date: order.date,
            value: order.total,
            status: order.status,
          };

          if (existingIdx > -1) {
            const updated = [...state.customers];
            const target = updated[existingIdx];
            updated[existingIdx] = {
              ...target,
              ordersCount: target.ordersCount + 1,
              lifetimeValue: target.lifetimeValue + order.total,
              history: [orderEntry, ...target.history],
              phone: order.phone || target.phone,
            };
            return { customers: updated };
          } else {
            const newCustomer: CustomerRecord = {
              id: `c-${Date.now()}`,
              name: order.customerName,
              email: order.email,
              role: order.type === "Wholesale" ? "WHOLESALE" : "CUSTOMER",
              ordersCount: 1,
              lifetimeValue: order.total,
              joinDate: order.date,
              company: order.type === "Wholesale" ? order.customerName : "Individual Buyer",
              phone: order.phone,
              gstin: order.gstin,
              history: [orderEntry],
            };
            return { customers: [newCustomer, ...state.customers] };
          }
        });
      },

      updateCustomerDiscount: (customerId, code) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === customerId ? { ...c, customDiscountCode: code } : c
          ),
        }));
      },

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
        customers: state.customers,
        notifications: state.notifications,
        customerTestimonials: state.customerTestimonials,
        brandPartners: state.brandPartners,
        activePromoCode: state.activePromoCode,
        cmsSettings: state.cmsSettings,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
