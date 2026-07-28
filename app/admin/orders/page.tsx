"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Printer,
  Mail,
  CheckCircle,
  Clock,
  Truck,
  PackageCheck,
  Building,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Initial B2B and Retail orders list
const INITIAL_ORDERS = [
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

export default function OrderProcessorPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<typeof INITIAL_ORDERS[0] | null>(null);
  
  // Filter States
  const [typeFilter, setTypeFilter] = useState<"All" | "Retail" | "Wholesale">("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Type Match
      if (typeFilter !== "All" && o.type !== typeFilter) return false;
      
      // Status Match
      if (statusFilter !== "All" && o.status !== statusFilter) return false;

      // Search Query Match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          o.id.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query) ||
          o.email.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [orders, typeFilter, statusFilter, searchQuery]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    // If selectedOrder is currently showing, update its status as well
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    
    // Trigger mock email alert notification
    const matched = orders.find((o) => o.id === orderId);
    if (matched) {
      showToast(`Status updated to ${newStatus}. Email alert dispatched to ${matched.email} via Resend.`);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return Clock;
      case "Approved": return CheckCircle;
      case "Shipped": return Truck;
      case "Delivered": return PackageCheck;
      default: return Clock;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-50 text-amber-800 border-amber-200";
      case "Approved": return "bg-blue-50 text-blue-800 border-blue-200";
      case "Shipped": return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Delivered": return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default: return "bg-charcoal/10 text-charcoal/80 border-charcoal/15";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 right-8 z-50 bg-[#1F1B16] text-white rounded-2xl px-6 py-4 text-xs font-bold shadow-warm-lg flex items-center gap-2 max-w-sm"
          >
            <Mail className="w-4 h-4 text-accent-teal" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] mb-2">
            Order Fulfillment
          </h1>
          <p className="text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 text-xs font-semibold">
            Track customer invoicing, shipping status overrides, and send automated notifications.
          </p>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex items-center bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-full px-5 py-2.5 w-80 shadow-warm-sm">
          <Search className="w-3.5 h-3.5 text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID or client email..."
            className="bg-transparent text-xs focus:outline-none w-full text-[#1F1B16] dark:text-[#F7F3EC] placeholder:text-[#1F1B16]/40 dark:placeholder:text-[#F7F3EC]/40"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          
          {/* Retail vs Wholesale Filter */}
          <div className="flex bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-full p-1 text-[10px] font-bold shadow-warm-sm">
            {(["All", "Retail", "Wholesale"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  typeFilter === type
                    ? "bg-[#1F1B16] text-[#F7F3EC] dark:bg-accent-teal dark:text-white"
                    : "text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 hover:text-accent-teal"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Status Select filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-full pl-5 pr-10 py-2.5 text-[10px] font-bold bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none cursor-pointer appearance-none shadow-warm-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-[#1F1B16]/40 dark:text-[#F7F3EC]/40" />
          </div>

        </div>

      </div>

      {/* Main Layout: Orders Table + Details panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Orders list (takes 7 or 12 cols depending if order is selected) */}
        <div className={selectedOrder ? "xl:col-span-7 flex flex-col gap-4" : "xl:col-span-12 flex flex-col gap-4"}>
          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-[28px] overflow-hidden shadow-warm-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2] dark:bg-[#12100E] border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Customer & Contact</th>
                    <th className="py-4 px-4">Mobile Number</th>
                    <th className="py-4 px-4 text-center">Type</th>
                    <th className="py-4 px-4 text-right">Invoice Total</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1B16]/5 dark:divide-[#F7F3EC]/10">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((o) => {
                      const isSelected = selectedOrder?.id === o.id;
                      const Icon = getStatusIcon(o.status);
                      return (
                        <tr
                          key={o.id}
                          onClick={() => setSelectedOrder(o)}
                          className={`text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-accent-teal/15 dark:bg-accent-teal/25"
                              : "hover:bg-[#FAF7F2]/60 dark:hover:bg-[#12100E]/60"
                          }`}
                        >
                          <td className="py-5 px-6 font-mono font-extrabold text-accent-teal">{o.id}</td>
                          <td className="py-5 px-4 font-semibold text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">{o.date}</td>
                          <td className="py-5 px-4">
                            <div className="font-bold text-[#1F1B16] dark:text-[#F7F3EC]">{o.customerName}</div>
                            <div className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-mono leading-none mt-1">{o.email}</div>
                          </td>
                          <td className="py-5 px-4">
                            <div className="inline-flex items-center gap-1.5 bg-accent-teal/10 text-accent-teal px-3 py-1 rounded-full text-xs font-mono font-extrabold shadow-sm border border-accent-teal/20">
                              📞 {o.phone}
                            </div>
                          </td>
                          <td className="py-5 px-4 text-center font-extrabold text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">{o.type}</td>
                          <td className="py-5 px-4 text-right font-mono font-extrabold text-[#1F1B16] dark:text-[#F7F3EC] tabular-nums">
                            {formatPrice(o.total)}
                          </td>
                          <td className="py-5 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusBadgeClass(o.status)}`}>
                              <Icon className="w-3 h-3" /> {o.status}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-center font-extrabold text-accent-teal hover:underline">
                            Inspect →
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-[#1F1B16]/40 font-serif">
                        No orders match filter queries.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Order Details panel (takes 5 cols, animates in when set) */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="xl:col-span-5 bg-white border border-[#1F1B16]/10 rounded-[32px] p-6 md:p-8 shadow-warm-lg flex flex-col gap-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-[#1F1B16]/5 pb-4">
                <div>
                  <span className="text-[9px] font-bold text-[#1F1B16]/40 uppercase tracking-widest block mb-1">
                    Invoice Details
                  </span>
                  <h3 className="font-mono text-lg font-bold text-[#1F1B16]">
                    {selectedOrder.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-[#1F1B16]/5 flex items-center justify-center hover:bg-[#1F1B16]/15"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status workflow dropdown */}
              <div>
                <span className="text-[9px] font-bold text-[#1F1B16]/40 uppercase tracking-wider block mb-2">Update status (Triggers Email confirmation)</span>
                <div className="relative">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="w-full border border-[#1F1B16]/10 rounded-full px-5 py-3 text-xs font-bold bg-[#F7F3EC] text-[#1F1B16] focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#1F1B16]/50" />
                </div>
              </div>

              {/* Client specifications */}
              <div className="bg-[#F7F3EC]/40 border border-[#1F1B16]/5 rounded-2xl p-4 flex flex-col gap-3 text-xs">
                <div className="flex gap-2.5 items-start">
                  {selectedOrder.type === "Wholesale" ? (
                    <Building className="w-4 h-4 text-accent-teal mt-0.5" />
                  ) : (
                    <User className="w-4 h-4 text-[#1F1B16]/40 mt-0.5" />
                  )}
                  <div>
                    <h5 className="font-bold text-[#1F1B16]">{selectedOrder.customerName}</h5>
                    <p className="text-[#1F1B16]/50 mt-0.5">{selectedOrder.email}</p>
                    <p className="text-[#1F1B16]/50">{selectedOrder.phone}</p>
                    {selectedOrder.gstin && (
                      <p className="text-accent-teal font-mono text-[9px] font-bold mt-1 uppercase">GSTIN: {selectedOrder.gstin}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#1F1B16]/5 pt-3 mt-1 flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/40">Shipping destination</span>
                  <p className="text-[#1F1B16]/70 leading-relaxed font-semibold">{selectedOrder.address}</p>
                </div>
              </div>

              {/* Itemized lines */}
              <div>
                <span className="text-[9px] font-bold text-[#1F1B16]/40 uppercase tracking-wider block mb-3">Itemized items</span>
                <div className="flex flex-col gap-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-[#1F1B16]/5 last:border-0 last:pb-0">
                      <div>
                        <h6 className="font-bold text-[#1F1B16]">{item.name}</h6>
                        <span className="text-[9px] text-[#1F1B16]/40 font-semibold">{item.color}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#1F1B16]">{item.quantity}x</span>
                        <span className="font-mono text-[#1F1B16]/60 ml-2">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="border-t border-[#1F1B16]/10 pt-4 flex justify-between items-end">
                <span className="text-xs font-bold text-[#1F1B16] uppercase tracking-wider">Invoice total</span>
                <span className="font-mono text-xl font-extrabold text-[#1F1B16] tabular-nums leading-none">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>

              {/* Print Packing Slips Actions */}
              <button
                onClick={() => window.print()}
                className="w-full bg-[#1F1B16] hover:bg-[#1F1B16]/90 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:shadow-warm-md transition-all duration-300"
              >
                <Printer className="w-4 h-4" /> Print Packing Slip & Invoice
              </button>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
