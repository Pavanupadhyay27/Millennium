"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Plus,
  ShoppingBag,
  UserCheck,
  Box,
  Users
} from "lucide-react";

// Format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Low-Stock Products List
const INITIAL_LOW_STOCK = [
  { id: "p2", name: "Konark Rattan Easy Armchair", sku: "KN-RATTAN-ARM", stock: 2 },
  { id: "p5", name: "Puri Teak Dining Chair", sku: "PURI-TEAK-CHAIR", stock: 0 },
  { id: "p9", name: "Janpath Teak Dining Table", sku: "JP-TEAK-TABLE", stock: 1 },
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
    const matched = lowStockList.find((p) => p.id === id);
    if (matched) {
      setToastMessage(`Restocked ${matched.name} with +${qtyToAdd} units.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 bg-accent-teal text-white rounded-2xl px-6 py-3.5 text-xs font-bold flex items-center gap-2 shadow-2xl">
          <CheckCircle className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-teal block mb-1">
          Store Operations Command
        </span>
        <h1 className="font-serif text-3xl font-bold mb-1">
          Store HQ Operations Dashboard
        </h1>
        <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 font-medium">
          Manage storefront order volume, pending wholesale partner queues, and stock inventory.
        </p>
      </div>

      {/* Operations KPI Metric Cards (No Revenue Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Pending Orders */}
        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase tracking-wider block mb-1">
              Active Orders Queue
            </span>
            <h3 className="font-serif text-2xl font-bold mb-1">18 Orders</h3>
            <span className="text-[10px] font-bold text-accent-teal flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 12 Retail • 6 B2B Bulk
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-teal/10 text-accent-teal flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: B2B Inquiries */}
        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase tracking-wider block mb-1">
              B2B Trade Queue
            </span>
            <h3 className="font-serif text-2xl font-bold mb-1">7 Inquiries</h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> 3 New Applications
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Active Products */}
        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase tracking-wider block mb-1">
              Catalog Products
            </span>
            <h3 className="font-serif text-2xl font-bold mb-1">42 SKUs</h3>
            <span className="text-[10px] font-bold text-accent-teal">
              Across 4 Space Categories
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-teal/10 text-accent-teal flex items-center justify-center shrink-0">
            <Box className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Low-Stock Alerts */}
        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase tracking-wider block mb-1">
              Stock Warnings
            </span>
            <h3 className="font-serif text-2xl font-bold text-red-500 mb-1">3 Items</h3>
            <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Requires Restock
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Orders & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Recent Orders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold">
              Recent Storefront Orders
            </h3>
            <a
              href="/admin/orders"
              className="text-xs font-bold text-accent-teal hover:underline uppercase tracking-wider"
            >
              View All Orders →
            </a>
          </div>

          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2] dark:bg-[#12100E] border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
                    <th className="py-3.5 px-5">Order ID</th>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4 text-right">Value</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1B16]/10 dark:divide-[#F7F3EC]/10">
                  {[
                    { id: "PO-2026-0925", client: "Mohapatra Interiors", type: "Wholesale", value: 198000, status: "Pending", sColor: "text-amber-600 bg-amber-500/10" },
                    { id: "RET-2026-4081", client: "Sujata Mohanty", type: "Retail", value: 24500, status: "Approved", sColor: "text-blue-600 bg-blue-500/10" },
                    { id: "RET-2026-4079", client: "Bikram Keshari", type: "Retail", value: 18900, status: "Shipped", sColor: "text-indigo-600 bg-indigo-500/10" },
                    { id: "PO-2026-1082", client: "Utkal Builders Ltd", type: "Wholesale", value: 284000, status: "Delivered", sColor: "text-emerald-600 bg-emerald-500/10" },
                  ].map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF7F2]/50 dark:hover:bg-[#12100E]/50">
                      <td className="py-4 px-5 font-mono font-bold text-accent-teal">{ord.id}</td>
                      <td className="py-4 px-4 font-semibold">{ord.client}</td>
                      <td className="py-4 px-4 font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">{ord.type}</td>
                      <td className="py-4 px-4 text-right font-mono font-bold tabular-nums">
                        {formatPrice(ord.value)}
                      </td>
                      <td className="py-4 px-5 text-center">
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
        </div>

        {/* RIGHT: Low Stock Inline Restock (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold flex items-center gap-2">
              Low-Stock Warnings
            </h3>
            <span className="text-[9px] font-bold text-red-500 uppercase bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-0.5">
              Action Required
            </span>
          </div>

          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-5 space-y-4 shadow-sm">
            {lowStockList.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between gap-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-teal/10 text-accent-teal font-bold text-xs flex items-center justify-center shrink-0">
                    {prod.stock}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-snug mb-0.5">
                      {prod.name}
                    </h4>
                    <p className="font-mono text-[9px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase">
                      {prod.sku}
                    </p>
                  </div>
                </div>

                {/* Inline Restock Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 rounded-xl p-1 max-w-[70px]">
                    <input
                      type="number"
                      value={restockInputs[prod.id] || 0}
                      onChange={(e) => handleRestockChange(prod.id, parseInt(e.target.value, 10) || 0)}
                      className="w-full text-center bg-transparent focus:outline-none font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]"
                    />
                  </div>
                  <button
                    onClick={() => handleRestockSave(prod.id)}
                    className="bg-accent-teal hover:bg-accent-teal/90 text-white rounded-xl w-8 h-8 flex items-center justify-center shadow-sm"
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
