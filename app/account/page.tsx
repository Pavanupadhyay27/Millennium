"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useStore } from "../../lib/store";
import {
  ShoppingBag,
  MapPin,
  Heart,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronUp,
  PackageCheck,
  Check,
  Plus,
  Trash2,
  UserCheck,
  LogOut,
  Sparkles,
  ArrowRight,
  Shield,
  Truck,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const MOCK_RETAIL_ORDERS = [
  {
    id: "RET-2026-3021",
    date: "May 10, 2026",
    status: "Delivered",
    total: 24500,
    items: [
      { name: "Odisha Teak Lounge Chair", color: "Natural Wood", quantity: 1, price: 24500, image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=300" }
    ]
  },
  {
    id: "RET-2026-2815",
    date: "April 18, 2026",
    status: "Delivered",
    total: 18900,
    items: [
      { name: "Kalinga Walnut Coffee Table", color: "Natural Walnut", quantity: 1, price: 18900, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=300" }
    ]
  }
];

export default function CustomerAccountPage() {
  const { wishlist, toggleWishlist, addToCart, logout, user, isAuthenticated, orders } = useStore();
  const [activeTab, setActiveTab] = useState<"overview" | "wishlist" | "orders" | "addresses" | "settings">("overview");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Combine Mock and Real Store Orders for customer profile history
  const allUserOrders = React.useMemo(() => {
    const formattedStoreOrders = orders.map((o) => ({
      id: o.id,
      date: o.date,
      status: o.status || "Delivered",
      total: o.total,
      items: o.items.map((i) => ({
        name: i.name,
        color: i.color || "Natural Wood",
        quantity: i.quantity,
        price: i.price,
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=300",
      })),
    }));
    return [...formattedStoreOrders, ...MOCK_RETAIL_ORDERS];
  }, [orders]);

  // Address State
  const [addresses, setAddresses] = useState([
    {
      id: "a1",
      label: "Primary Residence",
      name: user?.name || "Pawan",
      address: "Plot 412, Kharvel Nagar, Janpath Road",
      city: "Bhubaneswar",
      state: "Odisha",
      postal: "751001",
      phone: "+91 70081 29381",
      isDefault: true
    }
  ]);
  const [newAddressForm, setNewAddressForm] = useState(false);
  const [addressInput, setAddressInput] = useState({
    label: "",
    name: "",
    address: "",
    city: "Bhubaneswar",
    state: "Odisha",
    postal: "",
    phone: ""
  });

  // Profile Settings State
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || "Pawan",
    email: user?.email || "Pk@gmail.com",
    phone: "+91 70081 29381"
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleOrderRow = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        isDefault: false,
        ...addressInput
      }
    ]);
    setNewAddressForm(false);
    setAddressInput({ label: "", name: "", address: "", city: "Bhubaneswar", state: "Odisha", postal: "", phone: "" });
    showToast("New delivery address saved successfully.");
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Profile credentials updated successfully.");
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] font-sans selection:bg-accent-teal/20 flex flex-col justify-between transition-colors duration-300">
      <div>
        <Navbar />

        <main className="max-w-[1350px] mx-auto px-6 md:px-12 pt-28 pb-20">
          
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="fixed top-24 right-8 z-50 bg-accent-teal text-white rounded-2xl px-6 py-3.5 text-xs font-bold shadow-2xl flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> {toastMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* TOP INTEGRATED BRAND HEADER */}
          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent-teal text-white font-serif font-bold text-2xl flex items-center justify-center shrink-0 shadow-sm">
                {profileSettings.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="font-serif text-2xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
                    {profileSettings.name}
                  </h1>
                  <span className="text-[9px] font-bold text-accent-teal bg-accent-teal/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Verified Member
                  </span>
                </div>
                <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 font-medium">
                  {profileSettings.email} • {profileSettings.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-6 bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 px-5 py-2.5 rounded-2xl text-xs">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block">Orders</span>
                  <span className="font-serif font-bold text-base text-[#1F1B16] dark:text-[#F7F3EC]">{allUserOrders.length} Completed</span>
                </div>
                <div className="w-px h-7 bg-[#1F1B16]/10 dark:bg-[#F7F3EC]/10" />
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block">Wishlist</span>
                  <span className="font-serif font-bold text-base text-accent-teal">{wishlist.length} Items</span>
                </div>
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => logout()}
                  className="p-3 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all text-xs font-bold"
                  title="Sign Out Account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* MAIN DASHBOARD GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT NAVIGATION COLUMN (3 cols) */}
            <aside className="lg:col-span-3 bg-white dark:bg-[#1C1814] p-3 rounded-3xl border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 shadow-sm space-y-1 sticky top-24">
              {([
                { id: "overview", label: "Dashboard", icon: Sparkles, count: undefined },
                { id: "wishlist", label: "Saved Wishlist", icon: Heart, count: wishlist.length },
                { id: "orders", label: "Order History", icon: ShoppingBag, count: MOCK_RETAIL_ORDERS.length },
                { id: "addresses", label: "Addresses", icon: MapPin, count: undefined },
                { id: "settings", label: "Settings", icon: SettingsIcon, count: undefined },
              ] as const).map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-accent-teal text-white shadow-sm"
                        : "text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 hover:bg-[#FAF7F2] dark:hover:bg-[#12100E]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                        isActive ? "bg-white text-accent-teal" : "bg-accent-teal text-white"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </aside>

            {/* RIGHT MAIN CONTENT PANEL (9 cols) */}
            <section className="lg:col-span-9 bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[500px]">
              
              {/* TAB 0: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent-teal block mb-1">
                      Account Dashboard
                    </span>
                    <h2 className="font-serif text-2xl font-bold">Welcome, {profileSettings.name}</h2>
                    <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mt-1">
                      Quick overview of your active furniture orders, saved wishlist items, and delivery address.
                    </p>
                  </div>

                  {/* Recent Order Block */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif font-bold text-base">Recent Order</h3>
                      <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-accent-teal hover:underline flex items-center gap-1">
                        View All History <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-charcoal/5 shrink-0 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={MOCK_RETAIL_ORDERS[0].items[0].image} alt="Order item" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-mono font-bold text-xs text-accent-teal">{MOCK_RETAIL_ORDERS[0].id}</span>
                          <h4 className="font-bold text-xs mt-0.5">{MOCK_RETAIL_ORDERS[0].items[0].name}</h4>
                          <p className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">{MOCK_RETAIL_ORDERS[0].date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="font-serif font-extrabold text-sm">{formatPrice(MOCK_RETAIL_ORDERS[0].total)}</span>
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1">
                          <PackageCheck className="w-3 h-3" /> Delivered
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Saved Wishlist Snippet */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif font-bold text-base">Saved Wishlist ({wishlist.length})</h3>
                      <button onClick={() => setActiveTab("wishlist")} className="text-xs font-bold text-accent-teal hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {wishlist.slice(0, 2).map((item) => (
                          <div key={item.id} className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-3 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-charcoal/5 shrink-0 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-xs truncate">{item.name}</h4>
                              <span className="text-xs font-bold text-accent-teal">{formatPrice(item.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 italic">No saved items in wishlist.</p>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 1: WISHLIST */}
              {activeTab === "wishlist" && (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 mb-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Saved Wishlist</h2>
                      <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Handcrafted pieces saved for your space.</p>
                    </div>
                    <span className="text-xs font-bold text-accent-teal bg-accent-teal/10 px-3 py-1 rounded-full">
                      {wishlist.length} Items Saved
                    </span>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-16">
                      <Heart className="w-12 h-12 text-[#1F1B16]/20 dark:text-[#F7F3EC]/20 mx-auto mb-3" />
                      <h3 className="font-serif text-lg font-bold mb-1">Your wishlist is empty</h3>
                      <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mb-4 max-w-xs mx-auto">
                        Save your favorite teak sofas, dining tables, and loungers by clicking the heart icon.
                      </p>
                      <a
                        href="/spaces/home"
                        className="inline-flex items-center gap-2 bg-accent-teal text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-accent-teal/90 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Explore Collections
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-3 flex items-center gap-3 hover:shadow-sm transition-all group"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-charcoal/5 shrink-0 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-bold text-xs truncate mb-0.5">{item.name}</h4>
                            <span className="font-serif font-extrabold text-xs block mb-1.5 text-accent-teal">{formatPrice(item.price)}</span>
                            
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  addToCart({
                                    productId: item.id,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image,
                                    color: "Natural Wood",
                                    material: "Solid Teak",
                                    slug: item.slug,
                                    quantity: 1,
                                  });
                                }}
                                className="bg-[#1F1B16] text-[#F7F3EC] dark:bg-[#F7F3EC] dark:text-[#1F1B16] hover:bg-accent-teal dark:hover:bg-accent-teal hover:text-white dark:hover:text-white text-[10px] font-bold px-3 py-1 rounded-full transition-all shadow-sm"
                              >
                                Add +
                              </button>
                              <button
                                onClick={() => toggleWishlist(item)}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                title="Remove from wishlist"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ORDERS */}
              {activeTab === "orders" && (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 mb-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Order History & Purchased Details</h2>
                      <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Track your past purchases, furniture joinery specs, and delivery status.</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                      {allUserOrders.length} Orders Logged
                    </span>
                  </div>

                  <div className="space-y-4">
                    {allUserOrders.map((ord) => {
                      const isExpanded = expandedOrderId === ord.id;
                      return (
                        <div
                          key={ord.id}
                          className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 transition-all"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                            <div>
                              <span className="font-mono font-bold text-accent-teal block mb-0.5">{ord.id}</span>
                              <span className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-medium">{ord.date}</span>
                            </div>

                            <span className="font-serif font-extrabold text-base tabular-nums">
                              {formatPrice(ord.total)}
                            </span>

                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              <PackageCheck className="w-3.5 h-3.5" /> {ord.status}
                            </span>

                            <button
                              onClick={() => toggleOrderRow(ord.id)}
                              className="border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 hover:bg-accent-teal hover:text-white dark:hover:bg-accent-teal text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 transition-all"
                            >
                              {isExpanded ? <>Collapse <ChevronUp className="w-3.5 h-3.5" /></> : <>Items <ChevronDown className="w-3.5 h-3.5" /></>}
                            </button>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 space-y-2 overflow-hidden"
                              >
                                {ord.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-charcoal/5 shrink-0 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">{item.color}</p>
                                      </div>
                                    </div>
                                    <span className="font-mono font-bold">{item.quantity}x {formatPrice(item.price)}</span>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: ADDRESSES */}
              {activeTab === "addresses" && (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 mb-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Saved Delivery Addresses</h2>
                      <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Manage your shipping destinations.</p>
                    </div>
                    <button
                      onClick={() => setNewAddressForm(!newAddressForm)}
                      className="bg-accent-teal text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-accent-teal/90 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Address
                    </button>
                  </div>

                  {newAddressForm && (
                    <form onSubmit={handleAddAddress} className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 space-y-3 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Address Label</label>
                          <input
                            type="text"
                            required
                            value={addressInput.label}
                            onChange={(e) => setAddressInput({ ...addressInput, label: e.target.value })}
                            placeholder="e.g. Work Office"
                            className="w-full px-3.5 py-2 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-white dark:bg-[#1C1814] text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Recipient Name</label>
                          <input
                            type="text"
                            required
                            value={addressInput.name}
                            onChange={(e) => setAddressInput({ ...addressInput, name: e.target.value })}
                            placeholder="Full Name"
                            className="w-full px-3.5 py-2 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-white dark:bg-[#1C1814] text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Street Address</label>
                        <input
                          type="text"
                          required
                          value={addressInput.address}
                          onChange={(e) => setAddressInput({ ...addressInput, address: e.target.value })}
                          placeholder="House/Flat No., Street, Area"
                          className="w-full px-3.5 py-2 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-white dark:bg-[#1C1814] text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">City</label>
                          <input
                            type="text"
                            required
                            value={addressInput.city}
                            onChange={(e) => setAddressInput({ ...addressInput, city: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-white dark:bg-[#1C1814] text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">PIN Code</label>
                          <input
                            type="text"
                            required
                            value={addressInput.postal}
                            onChange={(e) => setAddressInput({ ...addressInput, postal: e.target.value })}
                            placeholder="751001"
                            className="w-full px-3.5 py-2 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-white dark:bg-[#1C1814] text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Phone</label>
                          <input
                            type="text"
                            required
                            value={addressInput.phone}
                            onChange={(e) => setAddressInput({ ...addressInput, phone: e.target.value })}
                            placeholder="+91..."
                            className="w-full px-3.5 py-2 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-white dark:bg-[#1C1814] text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button type="submit" className="bg-accent-teal text-white text-xs font-bold px-5 py-2 rounded-xl shadow-sm">Save Address</button>
                        <button type="button" onClick={() => setNewAddressForm(false)} className="border border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 text-xs font-bold px-5 py-2 rounded-xl">Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-teal">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">Default</span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm mb-1">{addr.name}</h4>
                          <p className="text-xs text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 leading-relaxed mb-2">
                            {addr.address}, {addr.city}, {addr.state} – {addr.postal}
                          </p>
                          <p className="text-xs font-semibold text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">{addr.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SETTINGS */}
              {activeTab === "settings" && (
                <div>
                  <div className="pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 mb-6">
                    <h2 className="font-serif text-2xl font-bold">Profile Credentials</h2>
                    <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Update your account name, email & phone contact.</p>
                  </div>

                  <form onSubmit={handleSettingsSave} className="max-w-md space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">Full Name</label>
                      <input
                        type="text"
                        value={profileSettings.name}
                        onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">Email Address</label>
                      <input
                        type="email"
                        value={profileSettings.email}
                        onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">Phone Number</label>
                      <input
                        type="text"
                        value={profileSettings.phone}
                        onChange={(e) => setProfileSettings({ ...profileSettings, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
                    >
                      Save Profile Credentials
                    </button>
                  </form>
                </div>
              )}

            </section>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
