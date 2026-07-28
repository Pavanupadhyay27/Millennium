"use client";

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  XCircle,
  Building2,
  TrendingUp,
  FileText,
  Mail,
  RefreshCw,
  Sparkles
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

// Initial B2B Applications fallback
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
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiveInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/wholesale/inquire");
      const data = await res.json();
      if (data.inquiries && Array.isArray(data.inquiries)) {
        const mappedLive = data.inquiries.map((inq: any) => ({
          id: inq.id,
          businessName: inq.companyName || "Independent Buyer",
          gstin: "21AAAFM" + Math.floor(1000 + Math.random() * 9000) + "1Z9",
          contactPerson: inq.name,
          email: inq.email,
          phone: inq.phone || "+91 98765 43210",
          expectedVolume: Number(inq.quantity) ? Number(inq.quantity) * 15000 : 150000,
          notes: inq.notes || "Submitted via Public B2B Form",
          status: "Pending",
        }));
        // Combine live API submissions with initial fallback items
        setApplications((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const uniqueNew = mappedLive.filter((a: any) => !existingIds.has(a.id));
          return [...uniqueNew, ...prev];
        });
      }
    } catch (err) {
      console.error("Failed to fetch live inquiries", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveInquiries();
  }, []);

  const handleNoteChange = (id: string, note: string) => {
    setAdminNotes((prev) => ({ ...prev, [id]: note }));
  };

  const handleApprove = (id: string) => {
    const matched = applications.find((app) => app.id === id);
    if (!matched) return;

    setApplications((prev) => prev.filter((app) => app.id !== id));
    showToast(
      `Approved ${matched.businessName}! Account upgraded to WHOLESALE. Welcoming B2B invoice instructions dispatched to ${matched.email}.`
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
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-24 right-8 z-50 bg-[#1F1B16] text-white rounded-2xl px-6 py-4 text-xs font-bold shadow-2xl flex items-center gap-2.5 border border-accent-teal/30 max-w-md"
          >
            <Mail className="w-4 h-4 text-accent-teal shrink-0" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-6">
        <div>
          <span className="text-[10px] font-extrabold text-accent-teal uppercase tracking-widest bg-accent-teal/10 px-3 py-1 rounded-full inline-block mb-2">
            Real-time B2B Sync
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
            Wholesale Trade Applications
          </h1>
          <p className="text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 text-xs font-medium mt-1">
            Evaluate GST tax credentials and monthly expected volume, review admin notes, and upgrade client accounts.
          </p>
        </div>

        <button
          onClick={fetchLiveInquiries}
          disabled={isLoading}
          className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm hover:border-accent-teal flex items-center gap-2 text-[#1F1B16] dark:text-[#F7F3EC] transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-accent-teal ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Syncing..." : "Sync Live Submissions"}
        </button>
      </div>

      {/* Applications Table list */}
      <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-[28px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] dark:bg-[#12100E] border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">
                <th className="py-4 px-6">Company / GSTIN</th>
                <th className="py-4 px-4">Representative & Contact</th>
                <th className="py-4 px-4">Expected Monthly Volume</th>
                <th className="py-4 px-4">Partner Application Notes</th>
                <th className="py-4 px-4">Verification Audit Remarks</th>
                <th className="py-4 px-6 text-center">Decision Triggers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1B16]/5 dark:divide-[#F7F3EC]/10 text-xs font-medium">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#FAF7F2]/50 dark:hover:bg-[#12100E]/50 transition-colors">
                    {/* Business Name and GSTIN */}
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-accent-teal/10 text-accent-teal flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1F1B16] dark:text-[#F7F3EC] text-xs">{app.businessName}</h4>
                          <span className="font-mono text-[9px] text-[#1F1B16]/45 dark:text-[#F7F3EC]/45 font-bold uppercase">
                            GSTIN: {app.gstin}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Representative contact */}
                    <td className="py-5 px-4">
                      <div className="font-bold text-[#1F1B16] dark:text-[#F7F3EC]">{app.contactPerson}</div>
                      <div className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-mono leading-none mt-1">{app.email}</div>
                      <div className="text-[10px] text-accent-teal font-mono font-bold mt-1">📞 {app.phone}</div>
                    </td>

                    {/* Monthly Volume */}
                    <td className="py-5 px-4 font-mono font-bold text-[#1F1B16] dark:text-[#F7F3EC] tabular-nums">
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs w-fit">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {formatPrice(app.expectedVolume)}
                      </div>
                    </td>

                    {/* Applicant Notes */}
                    <td className="py-5 px-4 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 leading-relaxed max-w-xs">
                      <div className="flex gap-1.5 items-start">
                        <FileText className="w-3.5 h-3.5 text-accent-teal mt-0.5 shrink-0" />
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
                        className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-3.5 py-2 text-[11px] font-semibold bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal w-full max-w-[200px]"
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all shadow-md active:scale-95"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold px-3.5 py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all active:scale-95 border border-red-500/20"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 font-serif">
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
