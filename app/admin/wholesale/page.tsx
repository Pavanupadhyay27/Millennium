"use client";

import React, { useState } from "react";
import {
  UserCheck,
  XCircle,
  Building2,
  TrendingUp,
  FileText,
  Mail,
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

// Initial Mock B2B Applications
const INITIAL_APPLICATIONS = [
  {
    id: "app-1",
    businessName: "Mohapatra Interiors Ltd",
    gstin: "21AAAFM9283K1Z9",
    contactPerson: "Rajesh Mohapatra",
    email: "rajesh@mohapatrainteriors.com",
    phone: "+91 94370 19283",
    expectedVolume: 150000,
    notes: "Requires solid teak dining chairs for a restaurant project in Cuttack.",
    status: "Pending",
  },
  {
    id: "app-2",
    businessName: "Odisha Housing Corp",
    gstin: "21AABCO1928K2Z5",
    contactPerson: "Siddharth Patnaik",
    email: "spatnaik@odishahousing.gov.in",
    phone: "+91 674 2530182",
    expectedVolume: 400000,
    notes: "Government housing contracts. Seeking bulk workstations and bookshelves.",
    status: "Pending",
  },
  {
    id: "app-3",
    businessName: "Kalinga Co-working Spaces",
    gstin: "21AAACK1982A1ZA",
    contactPerson: "Ananya Mishra",
    email: "spaces@kalingahub.co.in",
    phone: "+91 99371 82931",
    expectedVolume: 100000,
    notes: "Opening a new hub in Rourkela. Need desks and custom stools.",
    status: "Pending",
  }
];

export default function WholesaleRequestQueuePage() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  
  // Note inputs state per row
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  
  // Toast Alert Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleNoteChange = (id: string, note: string) => {
    setAdminNotes((prev) => ({ ...prev, [id]: note }));
  };

  const handleApprove = (id: string) => {
    const matched = applications.find((app) => app.id === id);
    if (!matched) return;

    // Upgrading mock account role & dispatching email
    setApplications((prev) => prev.filter((app) => app.id !== id));
    showToast(
      `Approved ${matched.businessName}! Account upgraded to WHOLESALE. Welcoming B2B invoice instructions dispatched to ${matched.email} via Resend.`
    );
  };

  const handleReject = (id: string) => {
    const matched = applications.find((app) => app.id === id);
    if (!matched) return;

    setApplications((prev) => prev.filter((app) => app.id !== id));
    showToast(`Rejected B2B application for ${matched.businessName}. Rejection notice dispatched to ${matched.email}.`);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
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
            className="fixed top-24 right-8 z-50 bg-[#1F1B16] text-white rounded-2xl px-6 py-4 text-xs font-bold shadow-warm-lg flex items-center gap-2 max-w-md"
          >
            <Mail className="w-4 h-4 text-accent-teal" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F1B16]/5 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] mb-2">
            Wholesale Applications
          </h1>
          <p className="text-[#1F1B16]/50 text-xs font-semibold">
            Evaluate GST tax credentials and monthly expected volume, review admin notes, and upgrade client accounts.
          </p>
        </div>
      </div>

      {/* Applications Table list */}
      <div className="bg-white border border-[#1F1B16]/10 rounded-[28px] overflow-hidden shadow-warm-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1F1B16]/[0.01] border-b border-[#1F1B16]/10 text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/40">
                <th className="py-4 px-6">Company / GSTIN</th>
                <th className="py-4 px-4">Representative</th>
                <th className="py-4 px-4">Expected Monthly Volume</th>
                <th className="py-4 px-4">Partner Application Notes</th>
                <th className="py-4 px-4">Verification Audit Remarks</th>
                <th className="py-4 px-6 text-center">Decision Triggers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1B16]/5 text-xs">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#1F1B16]/[0.005]">
                    {/* Business Name and GSTIN */}
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-accent-teal" />
                        <div>
                          <h4 className="font-bold text-[#1F1B16]">{app.businessName}</h4>
                          <span className="font-mono text-[9px] text-[#1F1B16]/45 font-bold uppercase">
                            GSTIN: {app.gstin}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Representative contact */}
                    <td className="py-5 px-4">
                      <div className="font-semibold text-[#1F1B16]">{app.contactPerson}</div>
                      <div className="text-[10px] text-[#1F1B16]/50 leading-none mt-0.5">{app.email}</div>
                      <div className="text-[10px] text-[#1F1B16]/50 mt-0.5">{app.phone}</div>
                    </td>

                    {/* Monthly Volume */}
                    <td className="py-5 px-4 font-mono font-bold text-[#1F1B16] tabular-nums">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-accent-teal" />
                        {formatPrice(app.expectedVolume)}
                      </div>
                    </td>

                    {/* Applicant Notes */}
                    <td className="py-5 px-4 text-[#1F1B16]/60 leading-relaxed max-w-xs">
                      <div className="flex gap-1.5 items-start">
                        <FileText className="w-3.5 h-3.5 text-[#1F1B16]/30 mt-0.5 flex-shrink-0" />
                        <span>{app.notes}</span>
                      </div>
                    </td>

                    {/* Admin Verification remarks */}
                    <td className="py-5 px-4">
                      <input
                        type="text"
                        value={adminNotes[app.id] || ""}
                        onChange={(e) => handleNoteChange(app.id, e.target.value)}
                        placeholder="Add review remarks..."
                        className="border border-[#1F1B16]/10 rounded-full px-4 py-2 text-[10px] font-semibold bg-[#F7F3EC] text-[#1F1B16] focus:outline-none focus:border-accent-teal w-full max-w-[200px]"
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="bg-accent-teal text-white font-bold px-4 py-2 rounded-full text-[10px] flex items-center gap-1 hover:bg-accent-teal/90 transition-colors shadow-warm-sm"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          className="bg-red-50 border border-red-200 text-red-700 font-bold px-4 py-2 rounded-full text-[10px] flex items-center gap-1 hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#1F1B16]/40 font-serif">
                    Wholesale request queue is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
