"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Plus,
  ShoppingBag,
  UserCheck,
  Send,
  MessageSquare,
  Flame,
  Check,
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const INITIAL_LOW_STOCK = [
  { id: "p2", name: "Konark Rattan Easy Armchair", sku: "KN-RATTAN-ARM", stock: 2 },
  { id: "p5", name: "Puri Teak Dining Chair", sku: "PURI-TEAK-CHAIR", stock: 0 },
  { id: "p9", name: "Janpath Teak Dining Table", sku: "JP-TEAK-TABLE", stock: 1 },
];

const ABANDONED_CARTS = [
  {
    id: "ac-1",
    customer: "Ananya Patnaik",
    phone: "+91 98765 43210",
    item: "Odisha Teak Lounge Chair",
    price: 24500,
    timeAgo: "15m ago",
    status: "Pending Recovery",
    messageSent: false
  },
  {
    id: "ac-2",
    customer: "Rajesh Mohanty",
    phone: "+91 70081 12345",
    item: "Aura Curved Velvet Sofa",
    price: 84999,
    timeAgo: "2h ago",
    status: "Pending Recovery",
    messageSent: false
  }
];

export default function AdminDashboardHome() {
  const { offers, toggleOfferActive, cmsSettings, updateCmsSettings } = useStore();
  const [lowStockList, setLowStockList] = useState(INITIAL_LOW_STOCK);
  const [abandonedCarts, setAbandonedCarts] = useState(ABANDONED_CARTS);
  const [restockInputs, setRestockInputs] = useState<Record<string, number>>({ p2: 10, p5: 15, p9: 5 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRestockChange = (id: string, val: number) => {
    setRestockInputs((prev) => ({ ...prev, [id]: Math.max(1, val) }));
  };

  const handleRestockSave = (id: string) => {
    const qtyToAdd = restockInputs[id] || 0;
    setLowStockList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: item.stock + qtyToAdd } : item
      )
    );
    const matched = lowStockList.find((p) => p.id === id);
    if (matched) {
      showToast(`Restocked ${matched.name} (+${qtyToAdd})`);
    }
  };

  const handleSendRecoveryMessage = (id: string, customer: string) => {
    setAbandonedCarts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, messageSent: true, status: "Sent" } : c))
    );
    showToast(`WhatsApp promo sent to ${customer}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Time-based dynamic greeting calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: "Good Morning", icon: "☀️" };
    if (hour >= 12 && hour < 17) return { text: "Good Afternoon", icon: "🌤️" };
    if (hour >= 17 && hour < 22) return { text: "Good Evening", icon: "🌆" };
    return { text: "Good Night", icon: "🌙" };
  };

  const greeting = getGreeting();

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-8 z-50 bg-[#1F1B16] text-white rounded-2xl px-6 py-3.5 text-xs font-bold flex items-center gap-2.5 shadow-2xl border border-accent-teal/30"
        >
          <CheckCircle className="w-4 h-4 text-accent-teal" /> {toastMessage}
        </motion.div>
      )}

      {/* Hero Welcome Banner */}
      <div className="bg-[#1C1814] text-[#F7F3EC] rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#F7F3EC]/10">
        <div className="relative z-10">
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
            {greeting.text}, Administrator {greeting.icon}
          </h1>
        </div>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase tracking-wider block mb-1">
              Active Orders
            </span>
            <h3 className="font-serif text-3xl font-bold">18</h3>
            <span className="text-[11px] font-extrabold text-accent-teal flex items-center gap-1 mt-2">
              <Clock className="w-3.5 h-3.5" /> 12 Retail • 6 B2B
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-teal/10 text-accent-teal flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase tracking-wider block mb-1">
              B2B Trade Leads
            </span>
            <h3 className="font-serif text-3xl font-bold">7</h3>
            <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">
              <UserCheck className="w-3.5 h-3.5" /> 3 New Inquiries
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase tracking-wider block mb-1">
              Cart Recovery
            </span>
            <h3 className="font-serif text-3xl font-bold text-amber-500">2</h3>
            <span className="text-[11px] font-extrabold text-amber-500 flex items-center gap-1 mt-2">
              <Flame className="w-3.5 h-3.5" /> Pending Broadcast
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase tracking-wider block mb-1">
              Low Stock Warnings
            </span>
            <h3 className="font-serif text-3xl font-bold text-red-500">3</h3>
            <span className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-2">
              <AlertCircle className="w-3.5 h-3.5" /> Restock Needed
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* LIVE PROMOTIONS & ANNOUNCEMENT CONTROL MASTER */}
      <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1F1B16] dark:text-[#F7F3EC] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-teal" /> Public Site Promotions & Master Switches
            </h3>
            <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 font-medium">
              Turn public offers, announcement bars, or discount codes ON/OFF instantly.
            </p>
          </div>

          <button
            onClick={() => {
              const nextState = !cmsSettings.showAnnouncementBar;
              updateCmsSettings({ showAnnouncementBar: nextState });
              showToast(`Header Announcement Bar is now ${nextState ? "VISIBLE" : "HIDDEN"}.`);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm ${
              cmsSettings?.showAnnouncementBar
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
            }`}
          >
            {cmsSettings?.showAnnouncementBar ? "Header Announcement: ON" : "Header Announcement: OFF"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {offers.map((off) => (
            <div
              key={off.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                off.active
                  ? "bg-[#FAF7F2] dark:bg-[#12100E] border-accent-teal/30"
                  : "bg-red-500/5 border-red-500/20 opacity-70"
              }`}
            >
              <div className="min-w-0">
                <span className="font-mono text-xs font-bold text-accent-teal block truncate">
                  {off.code}
                </span>
                <span className="text-[11px] font-bold text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 truncate block">
                  {off.title}
                </span>
              </div>

              <button
                onClick={() => {
                  toggleOfferActive(off.id);
                  showToast(`Offer ${off.code} is now ${!off.active ? "ON" : "OFF"}.`);
                }}
                className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase shrink-0 transition-all ${
                  off.active
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {off.active ? "Turn OFF" : "Turn ON"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Recovery Queue */}
      <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
                Automated Cart Recovery Queue
              </h3>
              <p className="text-xs text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-medium">
                Dispatch instant WhatsApp promo discounts to visitors with incomplete checkouts.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {abandonedCarts.map((ac) => (
            <div key={ac.id} className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-sm text-[#1F1B16] dark:text-[#F7F3EC]">{ac.customer}</h4>
                  <span className="text-[10px] font-bold text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 font-mono">{ac.timeAgo}</span>
                </div>
                <p className="text-xs text-accent-teal font-extrabold">{ac.item} ({formatPrice(ac.price)})</p>
                <p className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-mono mt-0.5">{ac.phone}</p>
              </div>

              <button
                onClick={() => handleSendRecoveryMessage(ac.id, ac.customer)}
                disabled={ac.messageSent}
                className="bg-accent-teal hover:bg-accent-teal/90 text-white disabled:opacity-50 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 shadow-md transition-all"
              >
                {ac.messageSent ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                {ac.messageSent ? "Sent" : "WhatsApp Promo"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold">Recent Storefront Orders</h3>
            <a
              href="/admin/orders"
              className="text-xs font-bold text-accent-teal hover:underline flex items-center gap-1"
            >
              View Orders Queue <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] dark:bg-[#12100E] border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">
                  <th className="py-4 px-5">Order ID</th>
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4 text-right">Amount</th>
                  <th className="py-4 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1B16]/10 dark:divide-[#F7F3EC]/10 font-semibold">
                {[
                  { id: "PO-2026-0925", client: "Mohapatra Interiors", type: "Wholesale", value: 198000, status: "Pending", sColor: "text-amber-600 bg-amber-500/10" },
                  { id: "RET-2026-4081", client: "Sujata Mohanty", type: "Retail", value: 24500, status: "Approved", sColor: "text-blue-600 bg-blue-500/10" },
                  { id: "RET-2026-4079", client: "Bikram Keshari", type: "Retail", value: 18900, status: "Shipped", sColor: "text-indigo-600 bg-indigo-500/10" },
                  { id: "PO-2026-1082", client: "Utkal Builders Ltd", type: "Wholesale", value: 284000, status: "Delivered", sColor: "text-emerald-600 bg-emerald-500/10" },
                ].map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F2]/50 dark:hover:bg-[#12100E]/50 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-accent-teal text-xs">{ord.id}</td>
                    <td className="py-4 px-4 font-bold text-xs">{ord.client}</td>
                    <td className="py-4 px-4 text-[11px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">{ord.type}</td>
                    <td className="py-4 px-4 text-right font-mono font-bold tabular-nums text-xs">{formatPrice(ord.value)}</td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${ord.sColor}`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Restock Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold">Low Stock Inventory</h3>
            <span className="text-[10px] font-extrabold text-red-500 bg-red-500/10 rounded-full px-3 py-1 uppercase tracking-wider">
              Restock Needed
            </span>
          </div>

          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-5 space-y-4 shadow-sm">
            {lowStockList.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between gap-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-accent-teal/10 text-accent-teal font-extrabold text-xs flex items-center justify-center shrink-0">
                    {prod.stock}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-snug">{prod.name}</h4>
                    <p className="font-mono text-[10px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">{prod.sku}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={restockInputs[prod.id] || 0}
                    onChange={(e) => handleRestockChange(prod.id, parseInt(e.target.value, 10) || 0)}
                    className="w-14 text-center bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 rounded-xl py-1.5 font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                  />
                  <button
                    onClick={() => handleRestockSave(prod.id)}
                    className="bg-accent-teal hover:bg-accent-teal/90 text-white rounded-xl w-8 h-8 flex items-center justify-center shadow-md transition-all shrink-0"
                    title="Restock units"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


