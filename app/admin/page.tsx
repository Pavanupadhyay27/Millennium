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
  ArrowUpRight
} from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 bg-[#1F1B16] text-white rounded-2xl px-5 py-3 text-xs font-bold flex items-center gap-2 shadow-2xl">
          <CheckCircle className="w-4 h-4 text-accent-teal" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <span className="text-[10px] font-extrabold text-accent-teal bg-accent-teal/10 px-3 py-1 rounded-full uppercase tracking-wider">
          HQ Live Overview
        </span>
      </div>

      {/* Minimal KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 uppercase tracking-wider block mb-1">
              Active Orders
            </span>
            <h3 className="font-serif text-2xl font-bold">18</h3>
            <span className="text-[10px] font-bold text-accent-teal flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> 12 Retail • 6 B2B
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-teal/10 text-accent-teal flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 uppercase tracking-wider block mb-1">
              B2B Leads
            </span>
            <h3 className="font-serif text-2xl font-bold">7</h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <UserCheck className="w-3 h-3" /> 3 New Inquiries
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 uppercase tracking-wider block mb-1">
              Cart Recovery
            </span>
            <h3 className="font-serif text-2xl font-bold text-amber-500">2</h3>
            <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 mt-1">
              <Flame className="w-3 h-3" /> Pending Recovery
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 uppercase tracking-wider block mb-1">
              Low Stock
            </span>
            <h3 className="font-serif text-2xl font-bold text-red-500">3</h3>
            <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> Action Needed
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Cart Recovery Bar */}
      <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
          <h3 className="font-serif text-base font-bold flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" /> Cart Recovery Queue
          </h3>
          <button
            onClick={() => showToast("WhatsApp 10% promo sent to all pending leads!")}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3 h-3" /> Auto Broadcast All (10% Off)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {abandonedCarts.map((ac) => (
            <div key={ac.id} className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs">{ac.customer}</h4>
                  <span className="text-[9px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 font-mono">{ac.timeAgo}</span>
                </div>
                <p className="text-[11px] text-accent-teal font-bold mt-0.5">{ac.item} ({formatPrice(ac.price)})</p>
              </div>

              <button
                onClick={() => handleSendRecoveryMessage(ac.id, ac.customer)}
                disabled={ac.messageSent}
                className="bg-accent-teal text-white disabled:opacity-50 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
              >
                {ac.messageSent ? <Check className="w-3 h-3" /> : <Send className="w-3 h-3" />}
                {ac.messageSent ? "Sent" : "WhatsApp Promo"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Recent Orders & Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Orders (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold">Recent Orders</h3>
            <a
              href="/admin/orders"
              className="text-xs font-bold text-accent-teal hover:underline flex items-center gap-0.5"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] dark:bg-[#12100E] border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1B16]/10 dark:divide-[#F7F3EC]/10 font-medium">
                {[
                  { id: "PO-2026-0925", client: "Mohapatra Interiors", type: "Wholesale", value: 198000, status: "Pending", sColor: "text-amber-600 bg-amber-500/10" },
                  { id: "RET-2026-4081", client: "Sujata Mohanty", type: "Retail", value: 24500, status: "Approved", sColor: "text-blue-600 bg-blue-500/10" },
                  { id: "RET-2026-4079", client: "Bikram Keshari", type: "Retail", value: 18900, status: "Shipped", sColor: "text-indigo-600 bg-indigo-500/10" },
                  { id: "PO-2026-1082", client: "Utkal Builders Ltd", type: "Wholesale", value: 284000, status: "Delivered", sColor: "text-emerald-600 bg-emerald-500/10" },
                ].map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F2]/50 dark:hover:bg-[#12100E]/50">
                    <td className="py-3 px-4 font-mono font-bold text-accent-teal text-[11px]">{ord.id}</td>
                    <td className="py-3 px-3 font-semibold text-xs">{ord.client}</td>
                    <td className="py-3 px-3 text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">{ord.type}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-xs">{formatPrice(ord.value)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${ord.sColor}`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warnings (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold">Low Stock</h3>
            <span className="text-[9px] font-bold text-red-500 bg-red-500/10 rounded-full px-2 py-0.5">
              Action Required
            </span>
          </div>

          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-4 space-y-3 shadow-sm">
            {lowStockList.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between gap-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-teal/10 text-accent-teal font-bold text-xs flex items-center justify-center shrink-0">
                    {prod.stock}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-snug">{prod.name}</h4>
                    <p className="font-mono text-[9px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">{prod.sku}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={restockInputs[prod.id] || 0}
                    onChange={(e) => handleRestockChange(prod.id, parseInt(e.target.value, 10) || 0)}
                    className="w-12 text-center bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-lg py-1 font-bold text-xs"
                  />
                  <button
                    onClick={() => handleRestockSave(prod.id)}
                    className="bg-accent-teal text-white rounded-lg w-7 h-7 flex items-center justify-center shadow-sm"
                    title="Restock"
                  >
                    <Plus className="w-3.5 h-3.5" />
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

