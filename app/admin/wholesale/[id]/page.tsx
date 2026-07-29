"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  TrendingUp,
  ArrowLeft,
  UserCheck,
  XCircle,
  Trash2,
  History,
  Phone,
  Mail,
  FileText,
  Save,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../../../../lib/store";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function WholesalePartnerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    wholesaleApplications,
    updateWholesaleApplication,
    deleteWholesaleApplication,
  } = useStore();

  const application = wholesaleApplications.find((app) => app.id === id);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: application?.businessName || "",
    gstin: application?.gstin || "",
    contactPerson: application?.contactPerson || "",
    email: application?.email || "",
    phone: application?.phone || "",
    expectedVolume: application?.expectedVolume || 150000,
    notes: application?.notes || "",
    status: application?.status || "Pending",
  });

  if (!application) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <Building2 className="w-16 h-16 text-[#1F1B16]/20 dark:text-[#F7F3EC]/20 mb-4" />
        <h2 className="font-serif text-2xl font-bold mb-2">Wholesale Partner Profile Not Found</h2>
        <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mb-6">
          The requested wholesale trade account could not be found or has been deleted.
        </p>
        <button
          onClick={() => router.push("/admin/wholesale")}
          className="bg-accent-teal text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Wholesale Queue
        </button>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSave = () => {
    updateWholesaleApplication(application.id, formData);
    showToast(`Updated profile details for ${formData.businessName}.`);
  };

  const handleApprove = () => {
    setFormData((prev) => ({ ...prev, status: "Approved" }));
    updateWholesaleApplication(application.id, { status: "Approved" });
    showToast(`Approved ${formData.businessName}! Welcome B2B notice sent to ${formData.email}.`);
  };

  const handleReject = () => {
    setFormData((prev) => ({ ...prev, status: "Rejected" }));
    updateWholesaleApplication(application.id, { status: "Rejected" });
    showToast(`Status updated to Rejected for ${formData.businessName}.`);
  };

  const handleDelete = () => {
    deleteWholesaleApplication(application.id);
    router.push("/admin/wholesale");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 right-8 z-50 bg-[#1F1B16] text-white rounded-2xl px-6 py-4 text-xs font-bold shadow-2xl flex items-center gap-2.5 border border-accent-teal/30 max-w-md"
          >
            <Mail className="w-4 h-4 text-accent-teal shrink-0" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button & Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/wholesale")}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex items-center justify-center text-[#1F1B16] dark:text-[#F7F3EC] hover:bg-accent-teal hover:text-white transition-all shadow-sm"
            title="Back to Wholesale Requests"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                formData.status === "Approved"
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : formData.status === "Rejected"
                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              }`}>
                {formData.status}
              </span>
              <span className="font-mono text-[10px] text-accent-teal font-extrabold uppercase">
                GSTIN: {formData.gstin}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
              {formData.businessName}
            </h1>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2">
          {formData.status !== "Approved" && (
            <button
              onClick={handleApprove}
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
            >
              <UserCheck className="w-4 h-4" /> Approve Partner
            </button>
          )}

          {formData.status !== "Rejected" && (
            <button
              onClick={handleReject}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <XCircle className="w-4 h-4" /> Reject Application
            </button>
          )}

          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>
      </div>

      {/* Main Profile Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Account Overview Card */}
        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
            <div className="w-12 h-12 rounded-2xl bg-accent-teal/10 text-accent-teal flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base">Trade Account</h3>
              <p className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-mono">{application.id}</p>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
              Account Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-3.5 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-bold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
            >
              <option value="Pending">Pending Audit</option>
              <option value="Approved">Approved Trade Partner</option>
              <option value="Rejected">Application Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
              Expected Monthly Volume (₹)
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.expectedVolume}
                onChange={(e) => setFormData({ ...formData, expectedVolume: Number(e.target.value) })}
                className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-3.5 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-mono font-bold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
              />
            </div>
            <p className="text-[10px] text-emerald-600 font-bold font-mono mt-1">
              Formatted: {formatPrice(formData.expectedVolume)} / month
            </p>
          </div>

          <div className="pt-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
            <button
              onClick={handleDelete}
              className="w-full bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Delete Partner Record
            </button>
          </div>
        </div>

        {/* Right 2 Columns - Detailed Editable Credentials & Notes */}
        <div className="md:col-span-2 bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-3">
            Company Credentials & Contact Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                Business / Company Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-3.5 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-bold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                GSTIN Tax Identification Code
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-3.5 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-mono font-bold uppercase focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                Contact Representative Name *
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-3.5 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-medium focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                Official B2B Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-3.5 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-mono focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                Direct Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-3.5 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-mono focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                Application & Custom Contract Specifications
              </label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Details regarding project scope, teak wood grade preferences, or delivery terms..."
                className="w-full border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-3.5 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] font-medium focus:outline-none focus:border-accent-teal resize-none text-[#1F1B16] dark:text-[#F7F3EC]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* B2B Purchase History Ledger */}
      <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-3">
          <h3 className="font-serif text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-accent-teal" /> Wholesale Order & Invoicing Ledger
          </h3>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-accent-teal/10 text-accent-teal px-3 py-1 rounded-full">
            Contract Records
          </span>
        </div>

        {application.history && application.history.length > 0 ? (
          <div className="divide-y divide-[#1F1B16]/5 dark:divide-[#F7F3EC]/10">
            {application.history.map((h) => (
              <div key={h.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-[#1F1B16] dark:text-[#F7F3EC] block">{h.id}</span>
                  <span className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-mono">{h.date}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-accent-teal block">{formatPrice(h.value)}</span>
                  <span className="text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {h.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 italic">
            No past B2B contract orders on record. Once an approved wholesale order is placed by {formData.businessName}, invoice records will automatically compile here.
          </div>
        )}
      </div>
    </div>
  );
}
