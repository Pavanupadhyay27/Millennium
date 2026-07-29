"use client";

import React, { useState } from "react";
import {
  UserCheck,
  XCircle,
  Building2,
  TrendingUp,
  FileText,
  Mail,
  RefreshCw,
  Plus,
  Trash2,
  X,
  History,
  Phone,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, WholesaleApplication } from "../../../lib/store";

// Format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function WholesaleRequestQueuePage() {
  const {
    wholesaleApplications,
    addWholesaleApplication,
    updateWholesaleApplication,
    deleteWholesaleApplication,
  } = useStore();

  const [selectedApp, setSelectedApp] = useState<WholesaleApplication | null>(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // New Wholesale Application Form State
  const [newAppData, setNewAppData] = useState({
    businessName: "",
    gstin: "",
    contactPerson: "",
    email: "",
    phone: "",
    expectedVolume: 150000,
    notes: "",
  });

  const fetchLiveInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/wholesale/inquire");
      const data = await res.json();
      if (data.inquiries && Array.isArray(data.inquiries)) {
        data.inquiries.forEach((inq: any) => {
          const exists = wholesaleApplications.some((a) => a.email === inq.email || a.id === inq.id);
          if (!exists) {
            addWholesaleApplication({
              businessName: inq.companyName || "Independent Trade Partner",
              gstin: "21AAAFM" + Math.floor(1000 + Math.random() * 9000) + "1Z9",
              contactPerson: inq.name,
              email: inq.email,
              phone: inq.phone || "+91 98765 43210",
              expectedVolume: Number(inq.quantity) ? Number(inq.quantity) * 15000 : 150000,
              notes: inq.notes || "Submitted via B2B Inquiry Portal",
            });
          }
        });
        showToast("Synced new online submissions with trade database!");
      }
    } catch (err) {
      console.error("Failed to fetch live inquiries", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteChange = (id: string, note: string) => {
    setAdminNotes((prev) => ({ ...prev, [id]: note }));
    updateWholesaleApplication(id, { notes: note });
  };

  const handleApprove = (id: string) => {
    const matched = wholesaleApplications.find((app) => app.id === id);
    if (!matched) return;

    updateWholesaleApplication(id, { status: "Approved" });
    showToast(
      `Approved ${matched.businessName}! Account upgraded to WHOLESALE. Welcoming B2B invoice instructions dispatched to ${matched.email}.`
    );
  };

  const handleReject = (id: string) => {
    const matched = wholesaleApplications.find((app) => app.id === id);
    if (!matched) return;

    updateWholesaleApplication(id, { status: "Rejected" });
    showToast(`Rejected B2B application for ${matched.businessName}. Rejection notice dispatched to ${matched.email}.`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteWholesaleApplication(id);
    if (selectedApp?.id === id) setSelectedApp(null);
    showToast(`Deleted wholesale partner application for "${name}". Changes saved permanently.`);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppData.businessName || !newAppData.contactPerson || !newAppData.email) return;

    addWholesaleApplication({
      businessName: newAppData.businessName,
      gstin: newAppData.gstin || ("21AAAFM" + Math.floor(1000 + Math.random() * 9000) + "1Z9"),
      contactPerson: newAppData.contactPerson,
      email: newAppData.email,
      phone: newAppData.phone || "+91 94370 00000",
      expectedVolume: Number(newAppData.expectedVolume) || 150000,
      notes: newAppData.notes || "Created directly from Admin Desk",
      history: [],
    });

    setNewModalOpen(false);
    setNewAppData({
      businessName: "",
      gstin: "",
      contactPerson: "",
      email: "",
      phone: "",
      expectedVolume: 150000,
      notes: "",
    });
    showToast(`Created new Wholesale Trade Application for ${newAppData.businessName}!`);
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
            Evaluate GST tax credentials, manage account status, review purchase history, and create or delete wholesale leads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewModalOpen(true)}
            className="bg-accent-teal hover:bg-accent-teal/90 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-2 uppercase tracking-wider transition-all"
          >
            <Plus className="w-4 h-4" /> + Add Wholesale Lead
          </button>

          <button
            onClick={fetchLiveInquiries}
            disabled={isLoading}
            className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm hover:border-accent-teal flex items-center gap-2 text-[#1F1B16] dark:text-[#F7F3EC] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-accent-teal ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Syncing..." : "Sync Live Inquiries"}
          </button>
        </div>
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
                <th className="py-4 px-4">Status & Notes</th>
                <th className="py-4 px-4">Verification Audit Remarks</th>
                <th className="py-4 px-6 text-center">Decision & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1B16]/5 dark:divide-[#F7F3EC]/10 text-xs font-medium">
              {wholesaleApplications && wholesaleApplications.length > 0 ? (
                wholesaleApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-[#FAF7F2]/50 dark:hover:bg-[#12100E]/50 transition-colors group cursor-pointer"
                  >
                    {/* Business Name and GSTIN - CLICKABLE TO OPEN DETAIL MODAL */}
                    <td
                      onClick={() => setSelectedApp(app)}
                      className="py-5 px-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-accent-teal/10 text-accent-teal flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1F1B16] dark:text-[#F7F3EC] text-xs group-hover:text-accent-teal transition-colors">
                            {app.businessName}
                          </h4>
                          <span className="font-mono text-[9px] text-[#1F1B16]/45 dark:text-[#F7F3EC]/45 font-bold uppercase">
                            GSTIN: {app.gstin}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Representative contact */}
                    <td
                      onClick={() => setSelectedApp(app)}
                      className="py-5 px-4"
                    >
                      <div className="font-bold text-[#1F1B16] dark:text-[#F7F3EC]">{app.contactPerson}</div>
                      <div className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-mono leading-none mt-1">{app.email}</div>
                      <div className="text-[10px] text-accent-teal font-mono font-bold mt-1">📞 {app.phone}</div>
                    </td>

                    {/* Monthly Volume */}
                    <td
                      onClick={() => setSelectedApp(app)}
                      className="py-5 px-4 font-mono font-bold text-[#1F1B16] dark:text-[#F7F3EC] tabular-nums"
                    >
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs w-fit">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {formatPrice(app.expectedVolume)}
                      </div>
                    </td>

                    {/* Applicant Notes & Status Badge */}
                    <td
                      onClick={() => setSelectedApp(app)}
                      className="py-5 px-4 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 leading-relaxed max-w-xs"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          app.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : app.status === "Rejected"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}>
                          {app.status || "Pending"}
                        </span>
                      </div>
                      <div className="flex gap-1.5 items-start text-[11px] truncate">
                        <FileText className="w-3.5 h-3.5 text-accent-teal mt-0.5 shrink-0" />
                        <span className="truncate">{app.notes}</span>
                      </div>
                    </td>

                    {/* Admin Verification remarks */}
                    <td className="py-5 px-4">
                      <input
                        type="text"
                        value={adminNotes[app.id] ?? app.notes}
                        onChange={(e) => handleNoteChange(app.id, e.target.value)}
                        placeholder="Add review remarks..."
                        className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-3.5 py-2 text-[11px] font-semibold bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal w-full max-w-[200px]"
                      />
                    </td>

                    {/* Actions: Approve / Reject / Delete / View Profile */}
                    <td className="py-5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 bg-[#FAF7F2] dark:bg-[#12100E] hover:bg-accent-teal hover:text-white rounded-xl text-xs font-bold transition-all text-[#1F1B16] dark:text-[#F7F3EC]"
                          title="View Full Profile & Purchase History"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => handleApprove(app.id)}
                          className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold px-3 py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all shadow-md active:scale-95"
                          title="Approve Wholesale Trade Account"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Approve
                        </button>

                        <button
                          onClick={() => handleReject(app.id)}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-2.5 py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all active:scale-95 border border-amber-500/20"
                          title="Reject Application"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>

                        <button
                          onClick={() => handleDelete(app.id, app.businessName)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl text-xs font-bold transition-all"
                          title="Permanently Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 font-serif">
                    Wholesale request queue is empty. Click "+ Add Wholesale Lead" to create an application.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW WHOLESALE APPLICATION MODAL */}
      <AnimatePresence>
        {newModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-2xl z-10 text-[#1F1B16] dark:text-[#F7F3EC]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-accent-teal/10 text-accent-teal flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">Add Wholesale Partner Lead</h3>
                    <p className="text-[10px] text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Create new trade application record directly</p>
                  </div>
                </div>
                <button
                  onClick={() => setNewModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 hover:bg-accent-teal hover:text-white flex items-center justify-center transition-all text-xs font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1">
                    Business / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAppData.businessName}
                    onChange={(e) => setNewAppData({ ...newAppData, businessName: e.target.value })}
                    placeholder="e.g. Trident Luxury Resorts"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-bold focus:outline-none focus:border-accent-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1">
                      Contact Representative *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAppData.contactPerson}
                      onChange={(e) => setNewAppData({ ...newAppData, contactPerson: e.target.value })}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-medium focus:outline-none focus:border-accent-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1">
                      GSTIN Tax Code
                    </label>
                    <input
                      type="text"
                      value={newAppData.gstin}
                      onChange={(e) => setNewAppData({ ...newAppData, gstin: e.target.value })}
                      placeholder="21AAAFM9283K1Z9"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-mono uppercase focus:outline-none focus:border-accent-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={newAppData.email}
                      onChange={(e) => setNewAppData({ ...newAppData, email: e.target.value })}
                      placeholder="purchase@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-mono focus:outline-none focus:border-accent-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={newAppData.phone}
                      onChange={(e) => setNewAppData({ ...newAppData, phone: e.target.value })}
                      placeholder="+91 94370 00000"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-mono focus:outline-none focus:border-accent-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1">
                    Expected Monthly Spend (₹)
                  </label>
                  <input
                    type="number"
                    value={newAppData.expectedVolume}
                    onChange={(e) => setNewAppData({ ...newAppData, expectedVolume: Number(e.target.value) })}
                    placeholder="150000"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-mono font-bold focus:outline-none focus:border-accent-teal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1">
                    Application / Contract Notes
                  </label>
                  <textarea
                    rows={3}
                    value={newAppData.notes}
                    onChange={(e) => setNewAppData({ ...newAppData, notes: e.target.value })}
                    placeholder="Specify project scope, teak wood specs, or custom stain requirements..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-medium focus:outline-none focus:border-accent-teal resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent-teal text-white font-extrabold py-3.5 rounded-full text-xs uppercase tracking-wider hover:bg-accent-teal/90 transition-all shadow-md mt-2"
                >
                  Create Wholesale Application
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WHOLESALE PARTNER DETAIL & HISTORY DRAWER MODAL */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-2xl z-10 text-[#1F1B16] dark:text-[#F7F3EC]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 mb-4 sticky top-0 bg-white dark:bg-[#1C1814] z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-accent-teal/10 text-accent-teal flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">{selectedApp.businessName}</h3>
                    <span className="font-mono text-xs text-accent-teal font-extrabold uppercase">
                      GSTIN: {selectedApp.gstin}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-8 h-8 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 hover:bg-accent-teal hover:text-white flex items-center justify-center transition-all text-xs font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Editable Fields in Detail Modal */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={selectedApp.businessName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedApp({ ...selectedApp, businessName: val });
                        updateWholesaleApplication(selectedApp.id, { businessName: val });
                      }}
                      className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-bold focus:outline-none focus:border-accent-teal"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                      GSTIN Tax Code
                    </label>
                    <input
                      type="text"
                      value={selectedApp.gstin}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedApp({ ...selectedApp, gstin: val });
                        updateWholesaleApplication(selectedApp.id, { gstin: val });
                      }}
                      className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-mono font-bold uppercase focus:outline-none focus:border-accent-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                      Contact Representative
                    </label>
                    <input
                      type="text"
                      value={selectedApp.contactPerson}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedApp({ ...selectedApp, contactPerson: val });
                        updateWholesaleApplication(selectedApp.id, { contactPerson: val });
                      }}
                      className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-medium focus:outline-none focus:border-accent-teal"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                      Account Status
                    </label>
                    <select
                      value={selectedApp.status || "Pending"}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setSelectedApp({ ...selectedApp, status: val });
                        updateWholesaleApplication(selectedApp.id, { status: val });
                      }}
                      className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-bold focus:outline-none focus:border-accent-teal"
                    >
                      <option value="Pending">Pending Audit</option>
                      <option value="Approved">Approved Trade Partner</option>
                      <option value="Rejected">Application Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={selectedApp.email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedApp({ ...selectedApp, email: val });
                        updateWholesaleApplication(selectedApp.id, { email: val });
                      }}
                      className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-mono focus:outline-none focus:border-accent-teal"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={selectedApp.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedApp({ ...selectedApp, phone: val });
                        updateWholesaleApplication(selectedApp.id, { phone: val });
                      }}
                      className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-mono focus:outline-none focus:border-accent-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Expected Monthly Volume (₹)
                  </label>
                  <input
                    type="number"
                    value={selectedApp.expectedVolume}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSelectedApp({ ...selectedApp, expectedVolume: val });
                      updateWholesaleApplication(selectedApp.id, { expectedVolume: val });
                    }}
                    className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-mono font-bold focus:outline-none focus:border-accent-teal"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Application / Contract Notes
                  </label>
                  <textarea
                    rows={3}
                    value={selectedApp.notes}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedApp({ ...selectedApp, notes: val });
                      updateWholesaleApplication(selectedApp.id, { notes: val });
                    }}
                    className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-medium focus:outline-none focus:border-accent-teal resize-none"
                  />
                </div>

                {/* Purchase History Ledger */}
                <div className="pt-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-3 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-accent-teal" /> Wholesale Order & Invoicing History
                  </span>

                  {selectedApp.history && selectedApp.history.length > 0 ? (
                    <div className="space-y-2">
                      {selectedApp.history.map((h) => (
                        <div
                          key={h.id}
                          className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl p-3 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-[#1F1B16] dark:text-[#F7F3EC]">{h.id}</span>
                            <span className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-mono block">{h.date}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-accent-teal block">{formatPrice(h.value)}</span>
                            <span className="text-[9px] font-extrabold uppercase text-emerald-600">{h.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 italic py-2">
                      No past B2B contract orders on record. Once an approved wholesale order is placed, invoice records appear here.
                    </p>
                  )}
                </div>

                <div className="pt-4 flex justify-between items-center gap-3">
                  <button
                    onClick={() => handleDelete(selectedApp.id, selectedApp.businessName)}
                    className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Partner Record
                  </button>

                  <button
                    onClick={() => {
                      showToast(`Saved changes for ${selectedApp.businessName}.`);
                      setSelectedApp(null);
                    }}
                    className="bg-accent-teal text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-accent-teal/90 transition-all"
                  >
                    Save & Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
