"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  User,
  ShieldAlert,
  Tag,
  ChevronDown,
  X,
  CheckCircle,
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

interface CustomerHistory {
  id: string;
  date: string;
  value: number;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  role: string;
  ordersCount: number;
  lifetimeValue: number;
  joinDate: string;
  company: string;
  gstin?: string;
  history: CustomerHistory[];
  customDiscountCode?: string;
}

// Initial B2B & Retail Customers database
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "u1",
    name: "Rajesh Mohapatra",
    email: "rajesh@mohapatrainteriors.com",
    role: "WHOLESALE",
    ordersCount: 4,
    lifetimeValue: 482000,
    joinDate: "Jan 12, 2026",
    company: "Mohapatra Interiors Ltd",
    gstin: "21AAAFM9283K1Z9",
    history: [
      { id: "PO-2026-0925", date: "July 18, 2026", value: 198000, status: "Pending" },
      { id: "PO-2026-1082", date: "July 12, 2026", value: 284000, status: "Delivered" }
    ],
    customDiscountCode: "MOHAPATRA5"
  },
  {
    id: "u2",
    name: "Sujata Mohanty",
    email: "sujata.m@gmail.com",
    role: "CUSTOMER",
    ordersCount: 1,
    lifetimeValue: 24500,
    joinDate: "March 15, 2026",
    company: "",
    history: [
      { id: "RET-2026-4081", date: "July 17, 2026", value: 24500, status: "Approved" }
    ]
  },
  {
    id: "u3",
    name: "Bikram Keshari",
    email: "bikram.k@yahoo.com",
    role: "CUSTOMER",
    ordersCount: 1,
    lifetimeValue: 18900,
    joinDate: "Feb 22, 2026",
    company: "",
    history: [
      { id: "RET-2026-4079", date: "July 16, 2026", value: 18900, status: "Shipped" }
    ]
  },
  {
    id: "u4",
    name: "Admin Manager",
    email: "hq@millenniumfurniture.in",
    role: "ADMIN",
    ordersCount: 0,
    lifetimeValue: 0,
    joinDate: "Jan 01, 2026",
    company: "Millennium Studio Core",
    history: []
  }
];

export default function CustomerCrmPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom discount input state
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [customers, searchQuery]);

  const handleRoleChange = (id: string, newRole: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, role: newRole } : c))
    );
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer((prev) => (prev ? { ...prev, role: newRole } : null));
    }
    showToast(`Account authorization group updated to ${newRole}.`);
  };

  const handleAddDiscountCode = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!discountCodeInput.trim()) return;

    const code = discountCodeInput.trim().toUpperCase();
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, customDiscountCode: code } : c))
    );
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer((prev) => (prev ? { ...prev, customDiscountCode: code } : null));
    }
    setDiscountCodeInput("");
    showToast(`Custom discount code '${code}' attached to profile.`);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
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
            className="fixed top-24 right-8 z-50 bg-[#1F1B16] text-white rounded-2xl px-6 py-4 text-xs font-bold shadow-warm-lg flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-accent-teal" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F1B16]/5 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] mb-2">
            CRM Directory
          </h1>
          <p className="text-[#1F1B16]/50 text-xs font-semibold">
            Track customer lifecycles, adjust authorization roles, see aggregate metrics, and assign promo discount codes.
          </p>
        </div>
      </div>

      {/* Controls: Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center bg-white border border-[#1F1B16]/10 rounded-full px-5 py-2.5 w-80 shadow-warm-sm">
          <Search className="w-3.5 h-3.5 text-[#1F1B16]/40 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, or company..."
            className="bg-transparent text-xs focus:outline-none w-full text-[#1F1B16]"
          />
        </div>
      </div>

      {/* Main Grid: CRM Table + Detail Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Customer List Table */}
        <div className={selectedCustomer ? "xl:col-span-7 flex flex-col gap-4" : "xl:col-span-12 flex flex-col gap-4"}>
          <div className="bg-white border border-[#1F1B16]/10 rounded-[28px] overflow-hidden shadow-warm-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1F1B16]/[0.01] border-b border-[#1F1B16]/10 text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/40">
                    <th className="py-4 px-6">Client profile</th>
                    <th className="py-4 px-4">Role Group</th>
                    <th className="py-4 px-4 text-center">Orders</th>
                    <th className="py-4 px-4 text-right">Lifetime spend</th>
                    <th className="py-4 px-4">Date Joined</th>
                    <th className="py-4 px-6 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1B16]/5">
                  {filteredCustomers.map((c) => {
                    const isSelected = selectedCustomer?.id === c.id;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCustomer(c)}
                        className={`text-xs cursor-pointer transition-colors ${
                          isSelected ? "bg-accent-teal/5" : "hover:bg-[#1F1B16]/[0.005]"
                        }`}
                      >
                        {/* Avatar name details */}
                        <td className="py-5 px-6 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent-teal/10 text-accent-teal font-bold flex items-center justify-center shadow-warm-sm">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1F1B16]">{c.name}</h4>
                            <p className="text-[10px] text-[#1F1B16]/40 leading-none mt-0.5">{c.email}</p>
                            {c.company && (
                              <p className="text-[9px] text-accent-teal font-semibold mt-0.5">{c.company}</p>
                            )}
                          </div>
                        </td>

                        {/* Authorization Role */}
                        <td className="py-5 px-4 font-bold text-[#1F1B16]/75">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            c.role === "ADMIN"
                              ? "bg-red-50 text-red-800 border border-red-200"
                              : c.role === "WHOLESALE"
                              ? "bg-accent-teal/10 text-accent-teal border border-accent-teal/20"
                              : "bg-[#1F1B16]/5 text-[#1F1B16]/65 border border-[#1F1B16]/10"
                          }`}>
                            {c.role}
                          </span>
                        </td>

                        {/* Order count */}
                        <td className="py-5 px-4 text-center font-bold text-[#1F1B16]">
                          {c.ordersCount}
                        </td>

                        {/* Monospace Lifetime value */}
                        <td className="py-5 px-4 text-right font-mono font-bold text-[#1F1B16] tabular-nums">
                          {formatPrice(c.lifetimeValue)}
                        </td>

                        {/* Join date */}
                        <td className="py-5 px-4 text-[#1F1B16]/50 font-semibold">
                          {c.joinDate}
                        </td>

                        <td className="py-5 px-6 text-center font-bold text-accent-teal">
                          Profile
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Customer Detail Panel */}
        <AnimatePresence>
          {selectedCustomer && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="xl:col-span-5 bg-white border border-[#1F1B16]/10 rounded-[32px] p-6 md:p-8 shadow-warm-lg flex flex-col gap-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-[#1F1B16]/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1F1B16]/5 flex items-center justify-center text-[#1F1B16]/40">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1F1B16] leading-none mb-1">
                      {selectedCustomer.name}
                    </h3>
                    <span className="text-[10px] text-[#1F1B16]/40 block leading-none font-semibold">
                      Registered: {selectedCustomer.joinDate}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-8 h-8 rounded-full bg-[#1F1B16]/5 flex items-center justify-center hover:bg-[#1F1B16]/15"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Adjust authorization Role */}
              <div>
                <span className="text-[9px] font-bold text-[#1F1B16]/40 uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-accent-teal" /> Modify Authorization Group
                </span>
                <div className="relative">
                  <select
                    value={selectedCustomer.role}
                    onChange={(e) => handleRoleChange(selectedCustomer.id, e.target.value)}
                    className="w-full border border-[#1F1B16]/10 rounded-full px-5 py-3 text-xs font-bold bg-[#F7F3EC] text-[#1F1B16] focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="CUSTOMER">CUSTOMER (Retail Access)</option>
                    <option value="WHOLESALE">WHOLESALE (Contract B2B Portal)</option>
                    <option value="ADMIN">ADMIN (Full Storefront HQ Control)</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#1F1B16]/50" />
                </div>
              </div>

              {/* Attach Custom Promo Code */}
              <div>
                <span className="text-[9px] font-bold text-[#1F1B16]/40 uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-accent-teal" /> Attached Discount Code
                </span>
                
                {selectedCustomer.customDiscountCode ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs font-bold flex justify-between items-center">
                    <span>Code Attached: {selectedCustomer.customDiscountCode}</span>
                    <button
                      onClick={() => handleRoleChange(selectedCustomer.id, selectedCustomer.role)} // re-triggers refresh without code
                      className="text-[9px] underline text-emerald-700 hover:text-emerald-900"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleAddDiscountCode(e, selectedCustomer.id)} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={discountCodeInput}
                      onChange={(e) => setDiscountCodeInput(e.target.value)}
                      placeholder="e.g. VIPCO15"
                      className="border border-[#1F1B16]/10 rounded-full px-4 py-2.5 text-xs bg-[#F7F3EC] text-[#1F1B16] focus:outline-none focus:border-accent-teal flex-1 uppercase font-bold"
                    />
                    <button
                      type="submit"
                      className="bg-[#1F1B16] text-[#F7F3EC] font-bold px-5 py-2.5 rounded-full text-xs"
                    >
                      Assign
                    </button>
                  </form>
                )}
              </div>

              {/* Company parameters (If B2B) */}
              {selectedCustomer.role === "WHOLESALE" && (
                <div className="bg-[#F7F3EC]/50 border border-[#1F1B16]/5 rounded-2xl p-4 text-xs flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#1F1B16]/50">Company Name</span>
                    <span className="font-bold text-[#1F1B16]">{selectedCustomer.company || "Not set"}</span>
                  </div>
                  {selectedCustomer.gstin && (
                    <div className="flex justify-between">
                      <span className="font-bold text-[#1F1B16]/50">GSTIN Tax Code</span>
                      <span className="font-mono font-bold text-accent-teal uppercase">{selectedCustomer.gstin}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Purchase History Ledger */}
              <div>
                <span className="text-[9px] font-bold text-[#1F1B16]/40 uppercase tracking-wider block mb-3">Historical invoices</span>
                {selectedCustomer.history.length > 0 ? (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {selectedCustomer.history.map((h) => (
                      <div key={h.id} className="flex justify-between items-center text-xs pb-2 border-b border-[#1F1B16]/5 last:border-0 last:pb-0">
                        <div>
                          <h6 className="font-mono font-bold text-[#1F1B16]">{h.id}</h6>
                          <span className="text-[9px] text-[#1F1B16]/40 font-semibold">{h.date}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-[#1F1B16] tabular-nums block">{formatPrice(h.value)}</span>
                          <span className="text-[8px] font-extrabold uppercase text-[#1F1B16]/40 leading-none">{h.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#1F1B16]/40 italic py-2 text-center">No past orders on record.</p>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
