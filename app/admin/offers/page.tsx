"use client";

import React, { useState } from "react";
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Sparkles,
  Layers,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Offer } from "../../../lib/store";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function AdminOffersPage() {
  const { offers, products, addOffer, updateOffer, toggleOfferActive, deleteOffer } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    code: string;
    title: string;
    discountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
    discountValue: number;
    targetProductId: string;
    minOrderValue: number;
    bannerText: string;
    active: boolean;
  }>({
    code: "",
    title: "",
    discountType: "PERCENTAGE",
    discountValue: 15,
    targetProductId: "",
    minOrderValue: 10000,
    bannerText: "",
    active: true,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      code: "",
      title: "",
      discountType: "PERCENTAGE",
      discountValue: 15,
      targetProductId: "",
      minOrderValue: 10000,
      bannerText: "",
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (offer: Offer) => {
    setEditingId(offer.id);
    setFormData({
      code: offer.code,
      title: offer.title,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      targetProductId: offer.targetProductId || "",
      minOrderValue: offer.minOrderValue || 0,
      bannerText: offer.bannerText || "",
      active: offer.active,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.title.trim()) return;

    if (editingId) {
      updateOffer(editingId, {
        code: formData.code.toUpperCase(),
        title: formData.title,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        targetProductId: formData.targetProductId || undefined,
        minOrderValue: Number(formData.minOrderValue),
        bannerText: formData.bannerText,
        active: formData.active,
      });
      showToast("Offer updated successfully!");
    } else {
      addOffer({
        code: formData.code.toUpperCase(),
        title: formData.title,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        targetProductId: formData.targetProductId || undefined,
        minOrderValue: Number(formData.minOrderValue),
        bannerText: formData.bannerText || `Get ${formData.discountType === "PERCENTAGE" ? `${formData.discountValue}% OFF` : `${formatPrice(formData.discountValue)} OFF`} with code ${formData.code.toUpperCase()}`,
        active: formData.active,
      });
      showToast(`New offer code ${formData.code.toUpperCase()} created!`);
    }
    setShowModal(false);
  };

  const filteredOffers = offers.filter(
    (o) =>
      o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 right-8 z-50 bg-accent-teal text-white rounded-2xl px-6 py-3.5 text-xs font-bold shadow-2xl flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full inline-block mb-1">
            Admin Offers & Discounts HQ
          </span>
          <h1 className="font-serif text-3xl font-bold">Promotions & Coupons</h1>
          <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 font-medium">
            Manage promotional discounts, coupon codes, and target specific furniture items on the public storefront.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Offer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase tracking-wider block mb-1">Total Coupons</span>
            <h3 className="font-serif text-2xl font-bold">{offers.length} Offers</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-teal/10 text-accent-teal flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase tracking-wider block mb-1">Active Offers</span>
            <h3 className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {offers.filter((o) => o.active).length} Running
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 uppercase tracking-wider block mb-1">Targeted Furniture</span>
            <h3 className="font-serif text-2xl font-bold text-amber-500">
              {offers.filter((o) => o.targetProductId).length} Specific Items
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-[#1F1B16]/40 dark:text-[#F7F3EC]/40" />
        <input
          type="text"
          placeholder="Search offers by code or promo title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs font-semibold focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => {
          const targetProd = products.find((p) => p.id === offer.targetProductId);
          return (
            <div
              key={offer.id}
              className={`bg-white dark:bg-[#1C1814] border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all relative overflow-hidden ${
                offer.active
                  ? "border-[#1F1B16]/10 dark:border-[#F7F3EC]/10"
                  : "border-red-500/20 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-sm font-black text-accent-teal bg-accent-teal/10 px-3 py-1 rounded-xl border border-accent-teal/20">
                    {offer.code}
                  </span>

                  <button
                    onClick={() => {
                      toggleOfferActive(offer.id);
                      showToast(`Offer ${offer.code} is now ${!offer.active ? "ACTIVE" : "PAUSED"}.`);
                    }}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1 transition-all ${
                      offer.active
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {offer.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {offer.active ? "Active" : "Paused"}
                  </button>
                </div>

                <h3 className="font-serif text-lg font-bold mb-1">{offer.title}</h3>
                <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mb-4">{offer.bannerText}</p>

                <div className="space-y-2 text-xs border-t border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 py-3 my-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-medium">Discount Value</span>
                    <span className="font-bold text-accent-teal">
                      {offer.discountType === "PERCENTAGE" && `${offer.discountValue}% OFF`}
                      {offer.discountType === "FIXED" && `${formatPrice(offer.discountValue)} OFF`}
                      {offer.discountType === "FREE_SHIPPING" && "FREE DELIVERY"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-medium">Target Furniture</span>
                    <span className="font-bold text-right truncate max-w-[150px]">
                      {targetProd ? targetProd.name : "All Storefront Items"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-medium">Min Order Amount</span>
                    <span className="font-mono font-bold">{formatPrice(offer.minOrderValue || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleOpenEdit(offer)}
                  className="p-2.5 rounded-xl border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 hover:bg-accent-teal hover:text-white transition-all text-[#1F1B16] dark:text-[#F7F3EC]"
                  title="Edit Offer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    deleteOffer(offer.id);
                    showToast(`Offer ${offer.code} deleted.`);
                  }}
                  className="p-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  title="Delete Offer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-4">
              <h2 className="font-serif text-xl font-bold">
                {editingId ? "Edit Promotion Offer" : "Create New Offer Code"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LUXURY20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-accent-teal"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Offer Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value as "PERCENTAGE" | "FIXED" | "FREE_SHIPPING" })
                    }
                    className="w-full bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-teal"
                  >
                    <option value="PERCENTAGE">Percentage (%) Off</option>
                    <option value="FIXED">Flat Amount (₹) Off</option>
                    <option value="FREE_SHIPPING">Free Delivery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monsoon Teak Sale 20% Off"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Discount Value ({formData.discountType === "PERCENTAGE" ? "%" : "₹"})
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-teal"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-teal"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Target Product (Optional)
                </label>
                <select
                  value={formData.targetProductId}
                  onChange={(e) => setFormData({ ...formData, targetProductId: e.target.value })}
                  className="w-full bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-teal"
                >
                  <option value="">All Storefront Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatPrice(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Public Banner Display Copy
                </label>
                <textarea
                  rows={2}
                  placeholder="Banner prompt text to highlight on product page..."
                  value={formData.bannerText}
                  onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                  className="w-full bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-accent-teal resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent-teal text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-accent-teal/90"
                >
                  {editingId ? "Save Changes" : "Publish Offer"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}