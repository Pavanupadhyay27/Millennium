"use client";

import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  Check,
} from "lucide-react";

// Mock B2B Past Bulk Orders
const PAST_ORDERS = [
  {
    id: "PO-2026-1082",
    date: "July 12, 2026",
    status: "Delivered", // Delivered status
    itemsCount: 15,
    total: 284000,
    discountApplied: 14200, // 5%
    shipping: 0,
    items: [
      { sku: "OD-TEAK-CHAIR", name: "Odisha Teak Lounge Chair", color: "Natural Wood", quantity: 10, unitPrice: 18500 },
      { sku: "KL-WALNUT-TAB", name: "Kalinga Walnut Coffee Table", color: "Natural Walnut", quantity: 5, unitPrice: 14000 }
    ]
  },
  {
    id: "PO-2026-1041",
    date: "June 28, 2026",
    status: "Shipped", // Shipped status
    itemsCount: 8,
    total: 133500,
    discountApplied: 0,
    shipping: 3500,
    items: [
      { sku: "BB-OAK-BOARD", name: "Bhubaneswar Oak Sideboard", color: "Natural Wood", quantity: 3, unitPrice: 36000 },
      { sku: "KN-RATTAN-ARM", name: "Konark Rattan Easy Armchair", color: "Natural Wood", quantity: 2, unitPrice: 11000 },
      { sku: "KN-TERRA-LAMP", name: "Konark Terracotta Table Lamp", color: "Terracotta", quantity: 3, unitPrice: 3200 }
    ]
  },
  {
    id: "PO-2026-0992",
    date: "June 10, 2026",
    status: "Approved", // Approved status
    itemsCount: 22,
    total: 423000,
    discountApplied: 47000, // 10%
    shipping: 0,
    items: [
      { sku: "BB-BOUCLE-SOFA", name: "Bhubaneswar Boucle Sofa", color: "Cream", quantity: 6, unitPrice: 65000 },
      { sku: "OD-TEAK-CHAIR", name: "Odisha Teak Lounge Chair", color: "Charcoal Black", quantity: 8, unitPrice: 18500 },
      { sku: "DH-MARBLE-TAB", name: "Dhauli Marble Nested Table", color: "Cream", quantity: 8, unitPrice: 9800 }
    ]
  },
  {
    id: "PO-2026-0925",
    date: "May 18, 2026",
    status: "Pending", // Pending status
    itemsCount: 12,
    total: 198000,
    discountApplied: 9900, // 5%
    shipping: 0,
    items: [
      { sku: "OD-TEAK-CHAIR", name: "Odisha Teak Lounge Chair", color: "Sage Green", quantity: 8, unitPrice: 18500 },
      { sku: "KL-WALNUT-TAB", name: "Kalinga Walnut Coffee Table", color: "Ebonized Oak", quantity: 4, unitPrice: 14000 }
    ]
  }
];

// Helper to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function WholesaleOrderHistoryPage() {
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedOrders((prev) =>
      prev.includes(id) ? prev.filter((oId) => oId !== id) : [...prev, id]
    );
  };

  const handleReorder = (order: typeof PAST_ORDERS[0]) => {
    setReorderedId(order.id);
    // Simulate copying elements to active state
    setTimeout(() => {
      setReorderedId(null);
      // Redirect to bulk order builder page
      window.location.href = "/wholesale/order";
    }, 1500);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return { bg: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock };
      case "Approved":
        return { bg: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle };
      case "Shipped":
        return { bg: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: Truck };
      case "Delivered":
        return { bg: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: PackageCheck };
      default:
        return { bg: "bg-charcoal/10 text-charcoal/80 border-charcoal/15", icon: Clock };
    }
  };

  return (
    <div className="min-h-screen bg-cream font-sans selection:bg-accent-teal/20 selection:text-charcoal flex flex-col justify-between">
      <div>
        <Navbar />

        {/* History Catalog */}
        <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24">
          
          <div className="border-b border-charcoal/5 pb-6 mb-10">
            <span className="text-accent-teal text-sm font-bold tracking-widest uppercase mb-1.5 block">
              B2B Accounts Ledger
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal">
              Wholesale Order History
            </h1>
          </div>

          {/* Table Container */}
          <div className="bg-cream border border-charcoal/10 rounded-[28px] overflow-hidden shadow-warm-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-charcoal/[0.02] border-b border-charcoal/10 text-[10px] font-extrabold uppercase tracking-widest text-charcoal/45">
                    <th className="py-4 px-6">Purchase Order #</th>
                    <th className="py-4 px-4">Date Submitted</th>
                    <th className="py-4 px-4 text-center">Items Qty</th>
                    <th className="py-4 px-4 text-right">Invoice Total</th>
                    <th className="py-4 px-4 text-center">Order Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {PAST_ORDERS.map((order) => {
                    const isExpanded = expandedOrders.includes(order.id);
                    const statusMeta = getStatusStyle(order.status);
                    const StatusIcon = statusMeta.icon;

                    return (
                      <React.Fragment key={order.id}>
                        {/* Main row */}
                        <tr className="text-xs hover:bg-charcoal/[0.01] transition-colors">
                          {/* Order ID */}
                          <td className="py-5 px-6 font-mono font-bold text-charcoal tracking-wide">
                            {order.id}
                          </td>

                          {/* Date */}
                          <td className="py-5 px-4 font-semibold text-charcoal/70">
                            {order.date}
                          </td>

                          {/* Count */}
                          <td className="py-5 px-4 text-center font-bold text-charcoal">
                            {order.itemsCount}
                          </td>

                          {/* Total Value */}
                          <td className="py-5 px-4 text-right font-mono font-bold text-charcoal tabular-nums">
                            {formatPrice(order.total)}
                          </td>

                          {/* Status Badge */}
                          <td className="py-5 px-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase border ${statusMeta.bg}`}>
                              <StatusIcon className="w-3.5 h-3.5" /> {order.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-5 px-6 flex items-center justify-center gap-3">
                            <button
                              onClick={() => toggleRow(order.id)}
                              className="border border-charcoal/20 bg-cream text-charcoal rounded-full px-4 py-2 text-[10px] font-bold flex items-center gap-1 hover:bg-charcoal hover:text-cream transition-all"
                            >
                              {isExpanded ? (
                                <>Collapse <ChevronUp className="w-3 h-3" /></>
                              ) : (
                                <>View Details <ChevronDown className="w-3 h-3" /></>
                              )}
                            </button>
                            
                            <button
                              onClick={() => handleReorder(order)}
                              disabled={reorderedId !== null}
                              className="bg-charcoal text-cream rounded-full px-4 py-2 text-[10px] font-bold flex items-center gap-1 hover:bg-charcoal-light hover:shadow-warm-sm transition-all disabled:opacity-50"
                            >
                              {reorderedId === order.id ? (
                                <><Check className="w-3 h-3 animate-pulse" /> Cloned...</>
                              ) : (
                                <><RefreshCw className="w-3 h-3" /> Reorder</>
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded details row */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="bg-charcoal/[0.01] px-8 py-6 border-t border-b border-charcoal/5 shadow-inner">
                              <div className="bg-cream rounded-2xl p-6 border border-charcoal/10 max-w-4xl shadow-warm-sm">
                                <div className="flex items-center gap-2 mb-4 border-b border-charcoal/5 pb-3">
                                  <FileText className="w-4 h-4 text-accent-teal" />
                                  <h4 className="font-serif font-bold text-sm text-charcoal">Items Specification Ledger</h4>
                                </div>

                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="border-b border-charcoal/10 text-[9px] font-extrabold uppercase tracking-widest text-charcoal/40">
                                      <th className="pb-3 text-left">SKU</th>
                                      <th className="pb-3 text-left">Product details</th>
                                      <th className="pb-3 text-left">Variant</th>
                                      <th className="pb-3 text-right">Wholesale Rate</th>
                                      <th className="pb-3 text-center">Quantity</th>
                                      <th className="pb-3 text-right">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-charcoal/5">
                                    {order.items.map((item) => (
                                      <tr key={item.sku} className="text-[11px] text-charcoal/80">
                                        <td className="py-3 font-mono font-semibold uppercase">{item.sku}</td>
                                        <td className="py-3 font-bold text-charcoal">{item.name}</td>
                                        <td className="py-3 font-semibold text-charcoal/60">{item.color}</td>
                                        <td className="py-3 text-right font-mono tabular-nums">{formatPrice(item.unitPrice)}</td>
                                        <td className="py-3 text-center font-bold text-charcoal">{item.quantity}</td>
                                        <td className="py-3 text-right font-mono font-bold text-charcoal tabular-nums">
                                          {formatPrice(item.unitPrice * item.quantity)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>

                                {/* Expand totals card */}
                                <div className="border-t border-charcoal/5 pt-4 mt-4 flex justify-end">
                                  <div className="w-64 text-[11px] font-semibold text-charcoal/60 flex flex-col gap-2">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span className="font-mono text-charcoal tabular-nums">
                                        {formatPrice(order.total + (order.discountApplied || 0) - (order.shipping || 0))}
                                      </span>
                                    </div>
                                    {order.discountApplied > 0 && (
                                      <div className="flex justify-between text-accent-teal">
                                        <span>Volume Discount:</span>
                                        <span className="font-mono tabular-nums">-{formatPrice(order.discountApplied)}</span>
                                      </div>
                                    )}
                                    {order.shipping > 0 && (
                                      <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span className="font-mono text-charcoal tabular-nums">{formatPrice(order.shipping)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between text-xs font-bold text-charcoal pt-2 border-t border-charcoal/5">
                                      <span>Invoice Total:</span>
                                      <span className="font-mono text-charcoal tabular-nums">{formatPrice(order.total)}</span>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
}
