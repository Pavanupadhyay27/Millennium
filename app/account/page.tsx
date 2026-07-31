"use client";

import React, { useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useStore } from "../../lib/store";
import {
  ShoppingBag, MapPin, Heart, Settings as SettingsIcon,
  ChevronDown, ChevronUp, PackageCheck, Check, Plus, Trash2,
  UserCheck, LogOut, Sparkles, ArrowRight, Shield, Coins,
  Download, Truck, RotateCcw, CheckCircle2, User, Mail, Phone,
  Camera, Award, ShieldAlert, Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fmt = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const MOCK_RETAIL_ORDERS = [
  {
    id: "MAT-2026-9041", date: "July 29, 2026", status: "Foam Layering", total: 38500,
    expectedDeliveryDate: "Aug 10, 2026",
    items: [{ name: "Millennium Ortho-Teak Latex Mattress", color: "Ivory White", quantity: 1, price: 38500, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=300" }]
  },
  {
    id: "RET-2026-3021", date: "May 10, 2026", status: "Delivered", total: 24500,
    expectedDeliveryDate: "Delivered",
    items: [{ name: "Odisha Teak Lounge Chair", color: "Natural Wood", quantity: 1, price: 24500, image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=300" }]
  },
  {
    id: "RET-2026-2815", date: "April 18, 2026", status: "Delivered", total: 18900,
    expectedDeliveryDate: "Delivered",
    items: [{ name: "Kalinga Walnut Coffee Table", color: "Natural Walnut", quantity: 1, price: 18900, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=300" }]
  }
];

export default function CustomerAccountPage() {
  const { wishlist, toggleWishlist, addToCart, logout, user, isAuthenticated, orders, addresses: storeAddresses, updateProfile } = useStore();
  const [activeTab, setActiveTab] = useState<"overview" | "wishlist" | "orders" | "addresses" | "settings">("overview");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [redeemedCoupon, setRedeemedCoupon] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const allUserOrders = useMemo(() => {
    const storeOrds = orders.map((o) => ({
      id: o.id, date: o.date, status: o.status || "Delivered", total: o.total,
      expectedDeliveryDate: o.expectedDeliveryDate,
      items: o.items.map((i) => ({
        name: i.name, color: i.color || "Natural Wood", quantity: i.quantity, price: i.price,
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=300",
      })),
    }));
    return [...storeOrds, ...MOCK_RETAIL_ORDERS];
  }, [orders]);

  const activeOrder = useMemo(() => {
    if (selectedOrderId) {
      const match = allUserOrders.find((o) => o.id === selectedOrderId);
      if (match) return match;
    }
    // Fallback: first non-delivered order, otherwise the first order
    const pendingOrder = allUserOrders.find((o) => o.status !== "Delivered");
    return pendingOrder || allUserOrders[0] || null;
  }, [allUserOrders, selectedOrderId]);

  const getActiveStepIndex = (status: string) => {
    const s = status.toUpperCase().trim();
    if (s === "ORDER BOOKED") return 0;
    if (s === "ORDER ACCEPTED") return 1;
    if (s === "CRAFTING" || s === "FOAM LAYERING" || s === "TIMBER SELECTION" || s === "QUALITY INSPECTION") return 2;
    if (s === "PAINTING" || s === "COVER STITCHING" || s === "HAND CARVING" || s === "SECURED PACKING") return 3;
    if (s === "SHIPPED") return 4;
    if (s === "DELIVERED") return 5;
    // Legacy mapping
    if (s === "PENDING") return 0;
    if (s === "APPROVED" || s === "CONFIRMED") return 1;
    if (s === "PROCESSING") return 2;
    return 0;
  };

  const activeStepIdx = useMemo(() => {
    if (!activeOrder) return 0;
    return getActiveStepIndex(activeOrder.status);
  }, [activeOrder]);

  const firstItemImage = useMemo(() => {
    const item = activeOrder.items[0];
    return (item && "image" in item ? (item as any).image : null) || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=300";
  }, [activeOrder]);

  const [addresses, setAddresses] = useState(
    storeAddresses && storeAddresses.length > 0
      ? storeAddresses.map((a) => ({ id: a.id, label: a.label, name: a.name, address: a.address, city: a.city, state: a.state, postal: a.postalCode, phone: a.phone, isDefault: a.isDefault ?? true }))
      : [{ id: "a1", label: "Primary Residence", name: user?.name || "Pawan", address: "Plot 412, Kharvel Nagar, Janpath Road", city: "Bhubaneswar", state: "Odisha", postal: "751001", phone: "+91 70081 29381", isDefault: true }]
  );
  const [newAddressForm, setNewAddressForm] = useState(false);
  const [addressInput, setAddressInput] = useState({ label: "", name: "", address: "", city: "Bhubaneswar", state: "Odisha", postal: "", phone: "" });
  const [profileSettings, setProfileSettings] = useState({ name: user?.name || "Pawan", email: user?.email || "Pk@gmail.com", phone: user?.phone || "+91 70081 29381" });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 4000); };

  React.useEffect(() => {
    if (user) {
      setProfileSettings({
        name: user.name,
        email: user.email,
        phone: user.phone || "+91 70081 29381"
      });
    }
  }, [user]);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Error: Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        updateProfile({ profileImage: reader.result });
        showToast("Changes saved successfully.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses((prev) => [...prev, { id: `a-${Date.now()}`, isDefault: false, ...addressInput }]);
    setNewAddressForm(false);
    setAddressInput({ label: "", name: "", address: "", city: "Bhubaneswar", state: "Odisha", postal: "", phone: "" });
    showToast("New address added successfully.");
  };

  // Loyalty Program: Coins redemption
  const handleRedeemCoins = () => {
    setIsRedeeming(true);
    setTimeout(() => {
      const code = `TEAKGOLD-${Math.floor(1000 + Math.random() * 9000)}`;
      setRedeemedCoupon(code);
      setIsRedeeming(false);
      showToast(`Success! Generated 10% Discount Code: ${code}`);
    }, 1500);
  };

  // Order Reordering
  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      addToCart({
        productId: `reorder-${item.name}`,
        name: item.name,
        price: item.price,
        image: item.image || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=300",
        color: item.color || "Natural Wood",
        material: "Premium Solid Timber",
        slug: "odisha-teak-lounge-chair",
        quantity: item.quantity
      });
    });
    showToast(`Added ${order.items.length} items from order ${order.id} back to your cart!`);
  };

  // Invoice simulation download
  const handleDownloadInvoice = (orderId: string) => {
    setIsDownloadingInvoice(orderId);
    setTimeout(() => {
      const textContent = `
========================================
       MILLENNIUM FURNITURE ODISHA
========================================
Invoice: INV-${orderId}
Customer: ${profileSettings.name}
Email: ${profileSettings.email}
Date: 31-07-2026
----------------------------------------
Item: Odisha Teak Lounge Chair (x1) - ₹24,500
Total: ₹24,500 (Paid via Razorpay)
----------------------------------------
Handcrafted with A-Grade Odisha Teak
Thank you for supporting local artisans!
========================================
`;
      const blob = new Blob([textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${orderId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloadingInvoice(null);
      showToast(`Invoice INV-${orderId} generated & downloaded successfully.`);
    }, 1200);
  };

  const TABS = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlist.length },
    { id: "orders", label: "Orders", icon: ShoppingBag, count: allUserOrders.length },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ] as const;

  const isMattressOrder = useMemo(() => {
    if (!activeOrder || !activeOrder.items) return false;
    return activeOrder.items.some((item: any) =>
      item.name.toLowerCase().includes("mattress")
    );
  }, [activeOrder]);

  const currentSteps = useMemo(() => {
    const flow = (activeOrder as any)?.trackingFlow || (isMattressOrder ? "Mattress" : "Furniture");

    if (flow === "Mattress") {
      return [
        { label: "Order Booked",    icon: "📋", desc: "We received your order" },
        { label: "Order Accepted",  icon: "✅", desc: "Confirmed by factory" },
        { label: "Foam Layering",   icon: "🧵", desc: "Core assembly & comfort profiling" },
        { label: "Cover Stitching", icon: "🪡", desc: "Quilt wrapping & tufting" },
        { label: "Shipped",         icon: "🚚", desc: "Dispatched in roll-pack" },
        { label: "Delivered",       icon: "🏠", desc: "Delivered & unrolled" },
      ];
    }

    if (flow === "Custom Woodwork") {
      return [
        { label: "Order Booked",     icon: "📋", desc: "We received your order" },
        { label: "Order Accepted",   icon: "✅", desc: "Customized dimensions approved" },
        { label: "Timber Selection", icon: "🪓", desc: "Selecting matching premium grains" },
        { label: "Hand Carving",     icon: "🔨", desc: "Sculpting fine decorative edges" },
        { label: "Shipped",          icon: "🚚", desc: "Dispatched in crate box" },
        { label: "Delivered",        icon: "🏠", desc: "Delivered & assembled" },
      ];
    }

    if (flow === "Ready-Ship") {
      return [
        { label: "Order Booked",        icon: "📋", desc: "We received your order" },
        { label: "Order Accepted",      icon: "✅", desc: "Order details verified" },
        { label: "Quality Inspection",  icon: "🔍", desc: "Polishing & defect verification" },
        { label: "Secured Packing",     icon: "📦", desc: "Shockproof custom wrapping" },
        { label: "Shipped",             icon: "🚚", desc: "Dispatched via standard transit" },
        { label: "Delivered",           icon: "🏠", desc: "Handover completed" },
      ];
    }

    // Default: Furniture
    return [
      { label: "Order Booked",    icon: "📋", desc: "We received your order" },
      { label: "Order Accepted",  icon: "✅", desc: "Confirmed by workshop" },
      { label: "Crafting",        icon: "🪚", desc: "Timber joinery & shaping" },
      { label: "Painting",        icon: "🖌️", desc: "Finishing & wax coat" },
      { label: "Shipped",         icon: "🚚", desc: "Out for delivery" },
      { label: "Delivered",       icon: "🏠", desc: "Delivered & set up" },
    ];
  }, [activeOrder, isMattressOrder]);

  return (
    <div className="min-h-screen font-sans flex flex-col bg-[#FAF7F2] dark:bg-gradient-to-br dark:from-[#0E0C0A] dark:to-[#1A1612] text-[#1F1B16] dark:text-[#F7F3EC] transition-colors duration-300">
      <Navbar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold text-white shadow-xl bg-accent-teal border border-accent-teal/10"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-[1300px] mx-auto w-full px-4 md:px-8 pt-28 pb-20">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar Nav */}
          <aside className="glass-panel lg:col-span-3 rounded-3xl p-3 sticky top-24 space-y-1">
            {/* User Profile Summary */}
            <div className="flex items-center gap-3 p-3.5 mb-2 rounded-2xl bg-charcoal/[0.02] dark:bg-white/[0.02]">
              {user?.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImage} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm" />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm text-white shrink-0 shadow-sm"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, #2F6F62, #184A41)",
                  }}
                >
                  {profileSettings.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="font-serif text-xs font-bold text-charcoal dark:text-white truncate leading-snug">{profileSettings.name}</h4>
                <p className="text-[9px] text-[#0D9488] dark:text-[#FBBF24] font-black uppercase tracking-wider leading-none mt-0.5">Elite VIP</p>
              </div>
            </div>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                    isActive
                      ? "bg-accent-teal/10 border-accent-teal/20 text-accent-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                      : "border-transparent text-charcoal/60 dark:text-[#F7F3EC]/50 hover:text-accent-teal dark:hover:text-accent-teal hover:bg-charcoal/5 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </div>
                  {"count" in tab && tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`w-5 h-5 rounded-full text-[9px] font-extrabold flex items-center justify-center ${
                        isActive
                          ? "bg-accent-teal/20 text-accent-teal"
                          : "bg-charcoal/10 dark:bg-white/10 text-charcoal/70 dark:text-[#F7F3EC]/70"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
            
            {/* Quick Sign Out at the Bottom */}
            <div className="pt-2 mt-2 border-t border-charcoal/5 dark:border-white/5">
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-500/5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Session</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="glass-panel lg:col-span-9 rounded-3xl p-6 sm:p-8 min-h-[520px]">
            
            {/* ── OVERVIEW TAB ─────────────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                
                {/* Heading block */}
                <div className="pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-accent-teal dark:text-emerald-400 block mb-0.5">Welcome Back</span>
                    <h2 className="font-serif text-xl font-bold text-charcoal dark:text-white">Workspace Overview</h2>
                  </div>
                  <span className="text-[10px] text-charcoal/40 dark:text-white/30 font-mono font-medium">Bhubaneswar Studio</span>
                </div>

                {/* Tracking Shipment Dialog Panel (Animate Height) */}
                <AnimatePresence>
                  {trackingOrder && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1A1612] shadow-sm mb-4">
                        <div className="flex items-center justify-between mb-3.5">
                          <div className="flex items-center gap-1.5 text-accent-teal dark:text-emerald-400">
                            <Truck className="w-4 h-4" />
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest">Live Workshop Tracking ({trackingOrder})</h4>
                          </div>
                          <button onClick={() => setTrackingOrder(null)} className="text-[9px] font-bold text-charcoal/40 dark:text-white/40 hover:underline">
                            Close
                          </button>
                        </div>
                        <ul className="text-xs space-y-2.5 text-[#1F1B16] dark:text-[#F7F3EC]/90 font-medium">
                          <li className="flex justify-between pb-0.5"><span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/40">Workshop Phase:</span> <span className="font-bold text-[#1F1B16] dark:text-white">{activeOrder.status}</span></li>
                           <li className="flex justify-between pb-0.5"><span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/40">Logistics Carrier:</span> <span className="font-bold text-[#1F1B16] dark:text-white">Premium Surface Crates</span></li>
                          <li className="flex justify-between"><span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/40">Expected Delivery:</span> <span className="font-bold text-accent-teal dark:text-emerald-400 font-mono">{activeOrder.expectedDeliveryDate || "2-3 Working Days"}</span></li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Recent Order & Visual Stepper */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-charcoal/40 dark:text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Active Artisanal Order</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-accent-teal dark:text-emerald-400 text-[10px] font-bold hover:underline flex items-center gap-0.5">
                      All Orders <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#1A1612] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/5 shadow-[6px_6px_15px_rgba(0,0,0,0.06),-6px_-6px_15px_rgba(255,255,255,0.9),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),6px_6px_20px_rgba(0,0,0,0.6)] space-y-6">
                    
                    {/* Item info row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-[inset_0_2px_5px_rgba(0,0,0,0.15)] border border-charcoal/5 dark:border-white/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={firstItemImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-mono text-[9px] font-bold text-accent-teal dark:text-emerald-400 block">{activeOrder.id}</span>
                          <h4 className="text-charcoal dark:text-white text-sm font-bold">{activeOrder.items[0]?.name || "Odisha Teak Lounge Chair"}</h4>
                          <span className="text-[10px] text-charcoal/40 dark:text-white/35 font-semibold">Teak Timber Finish · Qty: {activeOrder.items[0]?.quantity || 1}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-charcoal dark:text-white text-base">{fmt(activeOrder.total)}</span>
                        <span className={`text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full border shadow-sm ${
                          activeOrder.status === "Delivered"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
                        }`}>
                          {activeOrder.status}
                        </span>
                      </div>
                    </div>

                    {/* 6-Stage Order Tracking Timeline */}
                    <div className="pt-2">

                      {/* Expected delivery date from admin */}
                      {(activeOrder as any).expectedDeliveryDate && (
                        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-accent-teal/8 dark:bg-accent-teal/10">
                          <span className="text-[8px] font-black uppercase tracking-widest text-accent-teal dark:text-emerald-400">📦 Expected</span>
                          <span className="text-xs font-bold text-charcoal dark:text-white font-mono">{(activeOrder as any).expectedDeliveryDate}</span>
                          <span className="ml-auto flex items-center gap-1 text-[9px] text-accent-teal font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse inline-block" />
                            Live
                          </span>
                        </div>
                      )}

                      {/* Vertical pursuit timeline */}
                      <div className="relative flex flex-col gap-0">
                        {/* Skeuomorphic Glass Tube Track */}
                        <div className="absolute left-[11.5px] top-[26px] bottom-[26px] w-1.5 rounded-full overflow-hidden bg-[#1F1B16]/5 dark:bg-white/5 border border-[#1F1B16]/5 dark:border-white/5 shadow-[inset_1.5px_1.5px_3px_rgba(31,27,22,0.08)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.5)]">
                          {/* Live Pulsing Neon Liquid Flow */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(activeStepIdx / (currentSteps.length - 1)) * 100}%` }}
                            transition={{ duration: 1.4, ease: "easeOut" }}
                            className="w-full rounded-full relative"
                            style={{
                              background: "linear-gradient(180deg, #34D399 0%, #10B981 50%, #0D9488 100%)",
                              boxShadow: "0 0 10px rgba(16,185,129,0.8), 0 0 20px rgba(16,185,129,0.35)",
                            }}
                          >
                            {/* Living fluid overlay animation */}
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)] animate-pulse" />
                          </motion.div>
                        </div>

                        {currentSteps.map((step, idx) => {
                          const isDone = idx < activeStepIdx;
                          const isCurrent = idx === activeStepIdx;
                          const isPending = idx > activeStepIdx;
                          return (
                            <div key={idx} className={`flex items-start gap-4 py-3 pl-0.5 relative z-10 transition-all ${isPending ? "opacity-35" : ""}`}>
                              {/* Glowing Concentric Node */}
                              <div className="relative shrink-0 mt-0.5">
                                {isCurrent && (
                                  <>
                                    <span className="absolute -inset-2.5 rounded-full animate-ping bg-[#0D9488]/20" style={{ animationDuration: "2.5s" }} />
                                    <span className="absolute -inset-1.5 rounded-full animate-pulse bg-[#0D9488]/15" />
                                  </>
                                )}
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isDone
                                      ? "bg-gradient-to-b from-[#10B981] to-[#059669] border border-emerald-500/20 text-white shadow-[0_2.5px_6px_rgba(16,185,129,0.3),inset_0_1px_1px_rgba(255,255,255,0.45)]"
                                      : isCurrent
                                      ? "bg-gradient-to-b from-[#0D9488] to-[#0F766E] border border-teal-400/40 text-white shadow-[0_0_15px_rgba(13,148,136,0.95),0_0_30px_rgba(13,148,136,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.6)]"
                                      : "bg-charcoal/5 dark:bg-black/35 border border-charcoal/10 dark:border-white/5 shadow-[inset_1px_1.5px_2.5px_rgba(0,0,0,0.06)] text-charcoal/30 dark:text-white/25"
                                  }`}
                                >
                                  {isDone ? (
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  ) : (
                                    <span style={{ fontSize: "11px" }}>{step.icon}</span>
                                  )}
                                </div>
                              </div>

                              {/* Label + Description */}
                              <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold ${
                                    isCurrent ? "text-accent-teal dark:text-emerald-400" : isDone ? "text-charcoal dark:text-white/90" : "text-charcoal/40 dark:text-white/30"
                                  }`}>
                                    {step.label}
                                  </span>
                                  {isCurrent && (
                                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-accent-teal dark:text-emerald-400">
                                      <span className="w-1.5 h-1.5 rounded-full bg-accent-teal dark:bg-emerald-400 animate-pulse" />
                                      Live
                                    </span>
                                  )}
                                  {isDone && (
                                    <span className="text-[9px] font-bold text-emerald-500 dark:text-emerald-400">✓ Done</span>
                                  )}
                                </div>
                                <p className="text-[10px] text-charcoal/45 dark:text-white/35 mt-0.5 leading-relaxed">{step.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stepper actions (embossed buttons) */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => setTrackingOrder(activeOrder.id)}
                        className="px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-[0.98] flex items-center gap-1.5 border-t border-white/15 border-b border-black/20 text-white dark:text-[#1F1B16] bg-gradient-to-b from-[#0D9488] to-[#0F766E] dark:from-[#FBBF24] dark:to-[#B8892E] shadow-[0_2px_4px_rgba(15,118,110,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] dark:shadow-[0_2px_4px_rgba(212,168,83,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] hover:opacity-95"
                      >
                        <Truck className="w-3.5 h-3.5" /> Track Logistics
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(activeOrder.id)}
                        disabled={isDownloadingInvoice === activeOrder.id}
                        className="px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-[0.98] flex items-center gap-1.5 border border-charcoal/10 dark:border-white/10 text-charcoal/70 dark:text-white/70 bg-gradient-to-b from-white to-[#FAF8F5] dark:from-[#25201A] dark:to-[#161310] shadow-[0_1.5px_3px_rgba(31,27,22,0.04),inset_0_1px_0_#FFF] dark:shadow-[0_1.5px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] hover:from-[#FAF8F5] hover:to-[#EBE7DF] dark:hover:from-[#1C1814] dark:hover:to-[#12100E]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {isDownloadingInvoice === activeOrder.id ? "Downloading..." : "Commercial Invoice"}
                      </button>
                      <button
                        onClick={() => handleReorder(activeOrder)}
                        className="px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-[0.98] flex items-center gap-1.5 ml-auto border border-charcoal/10 dark:border-white/10 text-charcoal/70 dark:text-white/70 bg-gradient-to-b from-white to-[#FAF8F5] dark:from-[#25201A] dark:to-[#161310] shadow-[0_1.5px_3px_rgba(31,27,22,0.04),inset_0_1px_0_#FFF] dark:shadow-[0_1.5px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] hover:from-[#FAF8F5] hover:to-[#EBE7DF] dark:hover:from-[#1C1814] dark:hover:to-[#12100E]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reorder
                      </button>
                    </div>

                  </div>
                </div>

                {/* Minimalist Horizontal Wishlist Carousel */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-charcoal/40 dark:text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Saved Collections</h3>
                    <button onClick={() => setActiveTab("wishlist")} className="text-accent-teal dark:text-emerald-400 text-[10px] font-bold hover:underline flex items-center gap-0.5">
                      Open Wishlist ({wishlist.length}) <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {wishlist.length > 0 ? (
                    <div className="flex overflow-x-auto gap-4 scrollbar-thin pb-2 scroll-smooth">
                      {wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="w-48 shrink-0 rounded-2xl p-2.5 bg-charcoal/[0.02] dark:bg-black/15 border border-charcoal/10 dark:border-white/5 relative group"
                        >
                          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#12100E] relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <button
                              onClick={() => toggleWishlist(item)}
                              title="Delete Item"
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3 text-rose-400" />
                            </button>
                          </div>
                          <div className="mt-2 text-left">
                            <h4 className="text-charcoal dark:text-white/90 text-xs font-bold truncate leading-tight mb-0.5">{item.name}</h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[11px] font-mono font-bold text-accent-teal dark:text-emerald-400">{fmt(item.price)}</span>
                              <button
                                onClick={() => addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, color: "Natural Wood", material: "Solid Teak", slug: item.slug, quantity: 1 })}
                                className="text-[9px] font-bold text-accent-teal hover:underline"
                              >
                                + Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-charcoal/30 dark:text-white/30 text-xs italic border border-dashed border-charcoal/10 dark:border-white/10 rounded-2xl">
                      No saved items currently.
                    </div>
                  )}
                </div>


              </div>
            )}

            {/* ── WISHLIST TAB ─────────────────────────────────────────────────── */}
            {activeTab === "wishlist" && (
              <div>
                <div className="flex items-center justify-between pb-4 mb-6">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-accent-teal dark:text-emerald-400 block mb-0.5">Collections</span>
                    <h2 className="font-serif text-xl font-bold text-charcoal dark:text-white">Your Saved Wishlist</h2>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {wishlist.length} Items Saved
                  </span>
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center gap-4">
                    <Heart className="w-12 h-12 text-charcoal/15 dark:text-white/10" />
                    <div>
                      <h3 className="text-charcoal/70 dark:text-white/60 text-sm font-bold mb-1">Your wishlist is empty</h3>
                      <p className="text-charcoal/40 dark:text-white/30 text-xs">Explore our catalog and click the heart icon on your favorite items.</p>
                    </div>
                    <a
                      href="/spaces/home"
                      className="px-4 py-2 bg-accent-teal text-white rounded-xl text-xs font-bold hover:bg-accent-teal/90 transition-all flex items-center gap-1 shadow-sm"
                    >
                      Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl overflow-hidden group bg-gradient-to-b from-white to-[#FAF8F5] dark:from-white/3 dark:to-white/1 border border-charcoal/5 dark:border-white/5 p-3 flex flex-col justify-between shadow-sm"
                      >
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#12100E] relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="mt-3 text-left">
                          <h4 className="text-charcoal dark:text-white/90 text-xs font-bold truncate mb-0.5">{item.name}</h4>
                          <span className="font-mono text-xs font-bold text-accent-teal dark:text-emerald-400 block mb-3">{fmt(item.price)}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, color: "Natural Wood", material: "Solid Teak", slug: item.slug, quantity: 1 })}
                              className="flex-1 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest text-white dark:text-[#1F1B16] bg-gradient-to-b from-[#0D9488] to-[#0F766E] dark:from-[#FBBF24] dark:to-[#B8892E] shadow-[0_2px_4px_rgba(15,118,110,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] dark:shadow-[0_2px_4px_rgba(212,168,83,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] hover:opacity-95 border-t border-white/15 border-b border-black/20"
                            >
                              Add To Cart
                            </button>
                            <button
                              onClick={() => toggleWishlist(item)}
                              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 shrink-0"
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

            {/* ── ORDERS TAB ───────────────────────────────────────────────────── */}
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between pb-4 mb-6">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-accent-teal dark:text-emerald-400 block mb-0.5">Purchases</span>
                    <h2 className="font-serif text-xl font-bold text-charcoal dark:text-white">Order History</h2>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {allUserOrders.length} Completed Orders
                  </span>
                </div>

                <div className="space-y-4">
                  {allUserOrders.map((ord) => {
                    const isExpanded = expandedOrderId === ord.id;
                    return (
                      <div
                        key={ord.id}
                        className="rounded-2xl p-6 bg-gradient-to-b from-white to-[#FAF8F5] dark:from-white/3 dark:to-white/1 border border-charcoal/5 dark:border-white/5 shadow-sm space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <span className="font-mono text-xs font-bold text-accent-teal dark:text-emerald-400 block">{ord.id}</span>
                            <span className="text-charcoal/40 dark:text-white/40 text-[10px]">{ord.date}</span>
                          </div>
                          <span className="font-serif font-bold text-charcoal dark:text-white text-sm">{fmt(ord.total)}</span>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                              {ord.status}
                            </span>
                            <button
                              onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                              className="text-[10px] font-bold text-charcoal/50 dark:text-white/40 hover:text-accent-teal dark:hover:text-white transition-all flex items-center gap-0.5"
                            >
                              {isExpanded ? "Hide Details" : "View Items"}
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden pt-2 space-y-4"
                            >
                              <div className="space-y-2">
                                {ord.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                        <p className="text-charcoal dark:text-white/90 font-bold">{item.name}</p>
                                        <p className="text-charcoal/50 dark:text-white/35 text-[10px]">{item.color}</p>
                                      </div>
                                    </div>
                                    <span className="font-mono text-charcoal/70 dark:text-white/60 font-bold">{item.quantity} × {fmt(item.price)}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Order Action Row */}
                              <div className="flex flex-wrap gap-2 pt-3 border-t border-charcoal/5 dark:border-white/5">
                                <button
                                  onClick={() => handleDownloadInvoice(ord.id)}
                                  disabled={isDownloadingInvoice === ord.id}
                                  className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold text-charcoal/70 dark:text-white/70 hover:bg-charcoal/5 dark:hover:bg-white/5 border border-charcoal/10 dark:border-white/10 transition-all flex items-center gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  {isDownloadingInvoice === ord.id ? "Downloading..." : "Commercial Invoice"}
                                </button>
                                <button
                                  onClick={() => handleReorder(ord)}
                                  className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold text-charcoal/70 dark:text-white/70 hover:bg-charcoal/5 dark:hover:bg-white/5 border border-charcoal/10 dark:border-white/10 transition-all flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" /> Reorder All Items
                                </button>
                                {ord.status !== "Delivered" && (
                                  <button
                                    onClick={() => {
                                      setSelectedOrderId(ord.id);
                                      setTrackingOrder(ord.id);
                                      setActiveTab("overview");
                                      showToast(`Switched tracking workspace to Order: ${ord.id}`);
                                    }}
                                    className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold bg-accent-teal/10 dark:bg-emerald-500/10 hover:bg-accent-teal/20 dark:hover:bg-emerald-500/20 border border-accent-teal/20 dark:border-emerald-500/20 text-accent-teal dark:text-emerald-400 transition-all flex items-center gap-1"
                                  >
                                    <Truck className="w-3.5 h-3.5" /> Track Logistics
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── ADDRESSES TAB ────────────────────────────────────────────────── */}
            {activeTab === "addresses" && (
              <div>
                <div className="flex items-center justify-between pb-4 mb-6">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-accent-teal dark:text-emerald-400 block mb-0.5">Logistics</span>
                    <h2 className="font-serif text-xl font-bold text-charcoal dark:text-white">Shipping Directories</h2>
                  </div>
                  <button
                    onClick={() => setNewAddressForm(!newAddressForm)}
                    className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-3 py-2 rounded-xl transition-all active:scale-[0.98] border border-charcoal/10 dark:border-white/10 text-charcoal/70 dark:text-white/70 bg-gradient-to-b from-white to-[#FAF8F5] dark:from-[#25201A] dark:to-[#161310] shadow-[0_1.5px_3px_rgba(31,27,22,0.04),inset_0_1px_0_#FFF] dark:shadow-[0_1.5px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] hover:from-[#FAF8F5] hover:to-[#EBE7DF]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                </div>

                {newAddressForm && (
                  <form
                    onSubmit={handleAddAddress}
                    className="rounded-2xl p-6 space-y-4 mb-6 bg-[#FAF7F2] dark:bg-[#1A1612] shadow-sm border border-charcoal/5 dark:border-white/5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Address Name (e.g. Office)", key: "label", placeholder: "Work Office" },
                        { label: "Recipient Name", key: "name", placeholder: "Pawan" },
                      ].map(({ label, key, placeholder }) => (
                        <div key={key}>
                          <label className="block text-[9px] font-extrabold uppercase tracking-wider text-charcoal/40 dark:text-white/35 mb-1">{label}</label>
                          <input
                            type="text" required placeholder={placeholder}
                            value={addressInput[key as keyof typeof addressInput]}
                            onChange={(e) => setAddressInput({ ...addressInput, [key]: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl text-xs outline-none transition-all glass-field focus:border-accent-teal focus:ring-1 focus:ring-accent-teal bg-[#FAF7F2] dark:bg-black/20"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase tracking-wider text-charcoal/40 dark:text-white/35 mb-1">Street Address</label>
                      <input
                        type="text" required placeholder="Plot No., Janpath Road"
                        value={addressInput.address}
                        onChange={(e) => setAddressInput({ ...addressInput, address: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-xs outline-none transition-all glass-field focus:border-accent-teal focus:ring-1 focus:ring-accent-teal bg-[#FAF7F2] dark:bg-black/20"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "City", key: "city" },
                        { label: "Postal PIN", key: "postal", placeholder: "751001" },
                        { label: "Contact Phone", key: "phone", placeholder: "+91..." },
                      ].map(({ label, key, placeholder }) => (
                        <div key={key}>
                          <label className="block text-[9px] font-extrabold uppercase tracking-wider text-charcoal/40 dark:text-white/35 mb-1">{label}</label>
                          <input
                            type="text" required placeholder={placeholder}
                            value={addressInput[key as keyof typeof addressInput]}
                            onChange={(e) => setAddressInput({ ...addressInput, [key]: e.target.value })}
                            className="w-full px-3 py-3 rounded-xl text-xs outline-none transition-all glass-field focus:border-accent-teal focus:ring-1 focus:ring-accent-teal bg-[#FAF7F2] dark:bg-black/20"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-[0.98] border-t border-white/15 border-b border-black/20 text-white dark:text-[#1F1B16] bg-gradient-to-b from-[#0D9488] to-[#0F766E] dark:from-[#FBBF24] dark:to-[#B8892E] shadow-[0_2px_4px_rgba(15,118,110,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] dark:shadow-[0_2px_4px_rgba(212,168,83,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] hover:opacity-95"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewAddressForm(false)}
                        className="px-5 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-[0.98] border border-charcoal/10 dark:border-white/10 text-charcoal/70 dark:text-white/70 bg-gradient-to-b from-white to-[#FAF8F5] dark:from-[#25201A] dark:to-[#161310] shadow-[0_1.5px_3px_rgba(31,27,22,0.04),inset_0_1px_0_#FFF] dark:shadow-[0_1.5px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] hover:from-[#FAF8F5] hover:to-[#EBE7DF]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`rounded-2xl p-5 bg-gradient-to-b from-white to-[#FAF8F5] dark:from-white/3 dark:to-white/1 border ${
                        addr.isDefault
                          ? "border-[#0D9488]/30 dark:border-[#0D9488]/40 shadow-[0_4px_12px_rgba(13,148,136,0.04)]"
                          : "border-[#1F1B16]/8 dark:border-white/5"
                      } transition-all`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-accent-terracotta dark:text-amber-400">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[8px] font-extrabold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            Primary Shipping
                          </span>
                        )}
                      </div>
                      <h4 className="text-charcoal dark:text-white/90 text-xs font-bold mb-1.5">{addr.name}</h4>
                      <p className="text-charcoal/60 dark:text-white/45 text-xs leading-relaxed">{addr.address}, {addr.city}, {addr.state} – {addr.postal}</p>
                      <p className="text-charcoal/50 dark:text-white/40 text-[10px] mt-2 font-mono font-medium">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* ── SETTINGS TAB ─────────────────────────────────────────────────── */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Header */}
                <div className="pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-accent-teal dark:text-emerald-400 block mb-0.5">Workspace</span>
                    <h2 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-white">Profile Workspace</h2>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Member
                  </span>
                </div>

                {/* Minimalist Profile Editor */}
                <div className="p-6 rounded-2xl bg-gradient-to-b from-white to-[#FAF8F5] dark:from-white/3 dark:to-white/1 border border-charcoal/5 dark:border-white/5 shadow-sm space-y-6">
                  {/* Top user badge */}
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0F766E] dark:from-[#FBBF24] dark:to-[#B8892E] p-0.5 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                        {user?.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#FAF7F2] dark:bg-[#1A1612] flex items-center justify-center font-serif text-lg font-black text-[#1F1B16] dark:text-white relative">
                            {profileSettings.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => document.getElementById("profile-image-file-input")?.click()}
                        title="Upload Profile Picture"
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-charcoal hover:bg-accent-teal text-white flex items-center justify-center border border-[#FAF7F2] dark:border-[#1A1612] shadow transition-colors"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                      <input
                        type="file"
                        id="profile-image-file-input"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageUpload}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-charcoal dark:text-white">{profileSettings.name}</h4>
                      <p className="text-[10px] text-charcoal/40 dark:text-white/35 font-medium">{profileSettings.email}</p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateProfile({
                        name: profileSettings.name,
                        phone: profileSettings.phone,
                        email: profileSettings.email
                      });
                      showToast("Changes saved successfully.");
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                  >
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase tracking-wider text-charcoal/40 dark:text-white/35 mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30 dark:text-white/20" />
                        <input
                          type="text" required
                          value={profileSettings.name}
                          onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 rounded-xl text-xs outline-none transition-all glass-field focus:border-accent-teal focus:ring-1 focus:ring-accent-teal bg-[#FAF7F2] dark:bg-black/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold uppercase tracking-wider text-charcoal/40 dark:text-white/35 mb-1.5">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30 dark:text-white/20" />
                        <input
                          type="email" required
                          value={profileSettings.email}
                          onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 rounded-xl text-xs outline-none transition-all glass-field focus:border-accent-teal focus:ring-1 focus:ring-accent-teal bg-[#FAF7F2] dark:bg-black/20"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[9px] font-extrabold uppercase tracking-wider text-charcoal/40 dark:text-white/35 mb-1.5">Contact Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30 dark:text-white/20" />
                        <input
                          type="text"
                          value={profileSettings.phone}
                          onChange={(e) => setProfileSettings({ ...profileSettings, phone: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 rounded-xl text-xs outline-none transition-all glass-field focus:border-accent-teal focus:ring-1 focus:ring-accent-teal bg-[#FAF7F2] dark:bg-black/20"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-[0.98] border-t border-white/15 border-b border-black/20 text-white dark:text-[#1F1B16] bg-gradient-to-b from-[#0D9488] to-[#0F766E] dark:from-[#FBBF24] dark:to-[#B8892E] shadow-[0_2px_4px_rgba(15,118,110,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] dark:shadow-[0_2px_4px_rgba(212,168,83,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] hover:opacity-95"
                      >
                        Save Profile Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
