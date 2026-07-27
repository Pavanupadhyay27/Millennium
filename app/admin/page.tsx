"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Plus,
} from "lucide-react";
// Framer motion removed for static flat UI rendering

// Format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Initial Mock Low-Stock Products
const INITIAL_LOW_STOCK = [
  { id: "p2", name: "Konark Rattan Easy Armchair", sku: "KN-RATTAN-ARM", stock: 2, bg: "bg-pastel-butter" },
  { id: "p5", name: "Puri Teak Dining Chair", sku: "PURI-TEAK-CHAIR", stock: 0, bg: "bg-pastel-lavender" },
  { id: "p9", name: "Janpath Teak Dining Table", sku: "JP-TEAK-TABLE", stock: 1, bg: "bg-pastel-mint" },
];

export default function AdminDashboardHome() {
  const [lowStockList, setLowStockList] = useState(INITIAL_LOW_STOCK);
  const [restockInputs, setRestockInputs] = useState<Record<string, number>>({
    p2: 10,
    p5: 15,
    p9: 5,
  });
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
    // Show success toast
    const matched = lowStockList.find((p) => p.id === id);
    if (matched) {
      setToastMessage(`Restocked ${matched.name} with +${qtyToAdd} units.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 bg-accent-teal text-white rounded px-6 py-4 text-xs font-bold flex items-center gap-2 border border-accent-teal">
          <CheckCircle className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1F1B16] mb-2">
          Management Dashboard
        </h1>
        <p className="text-[#1F1B16]/50 text-xs font-semibold">
          Overview of storefront transactions, wholesale partner queues, and stock levels.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Revenue Today */}
        <div className="bg-white border border-[#1F1B16]/10 rounded p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/40 uppercase tracking-wider block mb-1">
              Revenue Today
            </span>
            <h3 className="font-mono text-xl font-extrabold text-[#1F1B16] tabular-nums mb-1">
              {formatPrice(148500)}
            </h3>
            <span className="text-[9px] font-bold text-accent-teal flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% from yesterday
            </span>
          </div>
          {/* Custom SVG Sparkline */}
          <svg className="w-16 h-10 text-accent-teal" viewBox="0 0 100 30" fill="none">
            <path
              d="M0,25 Q15,10 30,22 T60,8 T90,3"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* KPI 2: Weekly Revenue */}
        <div className="bg-white border border-[#1F1B16]/10 rounded p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/40 uppercase tracking-wider block mb-1">
              Revenue This Week
            </span>
            <h3 className="font-mono text-xl font-extrabold text-[#1F1B16] tabular-nums mb-1">
              {formatPrice(842000)}
            </h3>
            <span className="text-[9px] font-bold text-accent-teal flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +6.8% from last week
            </span>
          </div>
          <svg className="w-16 h-10 text-accent-teal" viewBox="0 0 100 30" fill="none">
            <path
              d="M0,15 C20,25 40,5 60,18 C80,30 90,8 100,5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* KPI 3: Orders Pending */}
        <div className="bg-white border border-[#1F1B16]/10 rounded p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/40 uppercase tracking-wider block mb-1">
              Pending Orders
            </span>
            <h3 className="font-mono text-xl font-extrabold text-[#1F1B16] tabular-nums mb-1">
              18
            </h3>
            <span className="text-[9px] font-bold text-[#1F1B16]/40 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 12 retail, 6 B2B bulk
            </span>
          </div>
          <svg className="w-16 h-10 text-[#1F1B16]/20" viewBox="0 0 100 30" fill="none">
            <path
              d="M0,15 H30 L45,5 L55,25 L70,15 H100"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* KPI 4: Low-Stock Alerts */}
        <div className="bg-white border border-[#1F1B16]/10 rounded p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/40 uppercase tracking-wider block mb-1">
              Low-Stock Alerts
            </span>
            <h3 className="font-mono text-xl font-extrabold text-accent-terracotta tabular-nums mb-1">
              3
            </h3>
            <span className="text-[9px] font-bold text-accent-terracotta flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Require immediate restock
            </span>
          </div>
          <svg className="w-16 h-10 text-accent-terracotta" viewBox="0 0 100 30" fill="none">
            <path
              d="M0,5 Q20,30 40,8 T80,25 T100,28"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Main Grid: Orders & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Recent Orders (takes 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#1F1B16]">
              Recent Orders
            </h3>
            <a
              href="/admin/orders"
              className="text-[10px] font-extrabold text-accent-teal hover:underline uppercase tracking-wider"
            >
              All Orders
            </a>
          </div>

          <div className="bg-white border border-[#1F1B16]/10 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1F1B16]/[0.01] border-b border-[#1F1B16]/5 text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/40">
                    <th className="py-3.5 px-5">ID</th>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4 text-right">Value</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1B16]/5">
                  {[
                    { id: "PO-2026-0925", client: "Mohapatra Interiors", type: "Wholesale", value: 198000, status: "Pending", sColor: "text-amber-700 bg-amber-55" },
                    { id: "RET-2026-4081", client: "Sujata Mohanty", type: "Retail", value: 24500, status: "Approved", sColor: "text-blue-700 bg-blue-55" },
                    { id: "RET-2026-4079", client: "Bikram Keshari", type: "Retail", value: 18900, status: "Shipped", sColor: "text-indigo-700 bg-indigo-55" },
                    { id: "PO-2026-1082", client: "Utkal Builders Ltd", type: "Wholesale", value: 284000, status: "Delivered", sColor: "text-emerald-700 bg-emerald-55" },
                  ].map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#1F1B16]/[0.005]">
                      <td className="py-4 px-5 font-mono font-bold text-[#1F1B16]">{ord.id}</td>
                      <td className="py-4 px-4 font-semibold text-[#1F1B16]/80">{ord.client}</td>
                      <td className="py-4 px-4 font-bold text-[#1F1B16]/50">{ord.type}</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-[#1F1B16] tabular-nums">
                        {formatPrice(ord.value)}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${ord.sColor}`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Low Stock Inline Restock (takes 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#1F1B16] flex items-center gap-2">
              Low-Stock Warnings
            </h3>
            <span className="text-[9px] font-extrabold text-accent-terracotta uppercase bg-accent-terracotta/10 border border-accent-terracotta/20 rounded-full px-2.5 py-0.5 animate-pulse">
              Attention Required
            </span>
          </div>

          <div className="bg-white border border-[#1F1B16]/10 rounded p-5 flex flex-col gap-4">
            {lowStockList.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between gap-4 border-b border-[#1F1B16]/5 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`${prod.bg} w-10 h-10 rounded flex items-center justify-center p-1 flex-shrink-0`}>
                    <div className="w-full h-full bg-white/20 rounded flex items-center justify-center font-bold text-xs text-[#1F1B16]/70">
                      {prod.stock}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1F1B16] leading-snug mb-0.5">
                      {prod.name}
                    </h4>
                    <p className="font-mono text-[9px] text-[#1F1B16]/40 uppercase leading-none">
                      {prod.sku}
                    </p>
                  </div>
                </div>

                {/* Inline Restock Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#F7F3EC] border border-[#1F1B16]/10 rounded p-1 max-w-[80px]">
                    <input
                      type="number"
                      value={restockInputs[prod.id] || 0}
                      onChange={(e) => handleRestockChange(prod.id, parseInt(e.target.value, 10) || 0)}
                      className="w-8 text-center bg-transparent focus:outline-none font-bold text-xs text-[#1F1B16]"
                    />
                  </div>
                  <button
                    onClick={() => handleRestockSave(prod.id)}
                    className="bg-accent-teal hover:bg-accent-teal/90 text-white rounded w-8 h-8 flex items-center justify-center"
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
