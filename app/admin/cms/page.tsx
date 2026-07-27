"use client";

import React, { useState } from "react";
import {
  FileEdit,
  Sparkles,
  ShoppingBag,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Initial Mock CMS Settings
const INITIAL_CMS_SETTINGS = {
  heroHeadline: "Transform Your Home into a Cozy Nest",
  heroSubtext: "Discover our premium handcrafted organic solid teak and walnut wood collections, manufactured locally in Bhubaneswar, Odisha.",
  featuredProductIds: ["p1", "p6"],
  testimonials: [
    { id: "t1", author: "Dr. Alok Mohapatra", role: "Interior Architect, Cuttack", quote: "The grade of teak wood and the joinery details are absolute world-class. Highly recommended for commercial projects." },
    { id: "t2", author: "Priyanka Patnaik", role: "Home Owner, Patia", quote: "Beautiful organic cream styling. The Lounge Chair has become the cozy centerpiece of our study corner." }
  ]
};

const AVAILABLE_PRODUCTS = [
  { id: "p1", name: "Odisha Teak Lounge Chair", sku: "OD-TEAK-CHAIR" },
  { id: "p2", name: "Konark Rattan Easy Armchair", sku: "KN-RATTAN-ARM" },
  { id: "p6", name: "Kalinga Walnut Coffee Table", sku: "KL-WALNUT-TAB" },
  { id: "p10", name: "Bhubaneswar Oak Sideboard", sku: "BB-OAK-BOARD" }
];

export default function HomepageCmsPage() {
  const [cmsData, setCmsData] = useState(INITIAL_CMS_SETTINGS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Active tab inside CMS editor
  const [activeTab, setActiveTab] = useState<"hero" | "carousel" | "testimonials">("hero");

  const handleHeroSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Hero section modifications saved to public database.");
  };

  const handleCarouselToggle = (id: string) => {
    setCmsData((prev) => {
      const isSelected = prev.featuredProductIds.includes(id);
      const updatedIds = isSelected
        ? prev.featuredProductIds.filter((pId) => pId !== id)
        : [...prev.featuredProductIds, id];
      return { ...prev, featuredProductIds: updatedIds };
    });
  };

  const handleCarouselSave = () => {
    showToast(`Carousel items updated with ${cmsData.featuredProductIds.length} active products.`);
  };

  const handleTestimonialChange = (id: string, field: string, value: string) => {
    setCmsData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
    }));
  };

  const handleTestimonialsSave = () => {
    showToast("Client testimonials updated and published.");
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
            Storefront CMS
          </h1>
          <p className="text-[#1F1B16]/50 text-xs font-semibold">
            Edit landing page hero copy, swap featured products, and modify testimonials without editing code.
          </p>
        </div>
      </div>

      {/* Tab Headers */}
      <div className="flex border-b border-[#1F1B16]/10 pb-4 gap-8">
        {([
          { id: "hero", name: "Hero Block Copy", icon: FileEdit },
          { id: "carousel", name: "Featured Showcase", icon: ShoppingBag },
          { id: "testimonials", name: "Client Testimonials", icon: UserCheck },
        ] as const).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-xs font-bold pb-2 transition-all relative ${
                isActive ? "text-accent-teal" : "text-[#1F1B16]/50 hover:text-[#1F1B16]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
              {isActive && (
                <motion.div
                  layoutId="activeCmsTabUnderline"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-teal"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Editor Panel */}
      <div className="bg-white border border-[#1F1B16]/10 rounded-[32px] p-6 md:p-8 shadow-warm-sm max-w-3xl">
        
        {/* Tab 1: Hero Block Copy */}
        {activeTab === "hero" && (
          <form onSubmit={handleHeroSave} className="flex flex-col gap-6">
            <h3 className="font-serif text-lg font-bold text-[#1F1B16] pb-4 border-b border-[#1F1B16]/5">
              Edit Hero Heading & Subheading
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50">Main Serif Headline</label>
              <input
                type="text"
                required
                value={cmsData.heroHeadline}
                onChange={(e) => setCmsData((prev) => ({ ...prev, heroHeadline: e.target.value }))}
                className="border border-[#1F1B16]/10 rounded-full px-5 py-3 text-xs bg-[#F7F3EC] text-[#1F1B16] focus:outline-none focus:border-accent-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50">Supporting Subtext</label>
              <textarea
                required
                rows={4}
                value={cmsData.heroSubtext}
                onChange={(e) => setCmsData((prev) => ({ ...prev, heroSubtext: e.target.value }))}
                className="border border-[#1F1B16]/10 rounded-2xl px-5 py-3 text-xs bg-[#F7F3EC] text-[#1F1B16] focus:outline-none focus:border-accent-teal w-full resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3.5 rounded-full mt-4 text-xs shadow-warm-md flex items-center justify-center gap-2 self-start px-8"
            >
              <Sparkles className="w-4 h-4" /> Publish Hero Changes
            </button>
          </form>
        )}

        {/* Tab 2: Featured Products Showcase */}
        {activeTab === "carousel" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-lg font-bold text-[#1F1B16] pb-4 border-b border-[#1F1B16]/5">
              Select Carousel Featured Products
            </h3>
            <p className="text-xs text-[#1F1B16]/50 leading-relaxed mb-2">
              Check the boxes next to the catalog products that should be displayed inside the homepage &quot;Popular Products&quot; carousel row.
            </p>

            <div className="flex flex-col gap-3">
              {AVAILABLE_PRODUCTS.map((prod) => {
                const isSelected = cmsData.featuredProductIds.includes(prod.id);
                return (
                  <label
                    key={prod.id}
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer select-none transition-all ${
                      isSelected ? "bg-accent-teal/5 border-accent-teal/30" : "bg-[#F7F3EC]/30 border-[#1F1B16]/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCarouselToggle(prod.id)}
                        className="w-4 h-4 rounded accent-accent-teal cursor-pointer"
                      />
                      <span className="text-xs font-bold text-[#1F1B16]">{prod.name}</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#1F1B16]/40 uppercase">{prod.sku}</span>
                  </label>
                );
              })}
            </div>

            <button
              onClick={handleCarouselSave}
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3.5 rounded-full mt-4 text-xs shadow-warm-md flex items-center justify-center gap-2 self-start px-8"
            >
              <Sparkles className="w-4 h-4" /> Publish Carousel Showcase
            </button>
          </div>
        )}

        {/* Tab 3: Client Testimonials */}
        {activeTab === "testimonials" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-lg font-bold text-[#1F1B16] pb-4 border-b border-[#1F1B16]/5">
              Edit Store Testimonials
            </h3>

            <div className="flex flex-col gap-6 divide-y divide-[#1F1B16]/5">
              {cmsData.testimonials.map((t, index) => (
                <div key={t.id} className={`flex flex-col gap-4 ${index > 0 ? "pt-6" : ""}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/50">Author Name</label>
                      <input
                        type="text"
                        value={t.author}
                        onChange={(e) => handleTestimonialChange(t.id, "author", e.target.value)}
                        className="border border-[#1F1B16]/10 rounded-full px-5 py-2.5 text-xs bg-[#F7F3EC] text-[#1F1B16] focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/50">Role / Location</label>
                      <input
                        type="text"
                        value={t.role}
                        onChange={(e) => handleTestimonialChange(t.id, "role", e.target.value)}
                        className="border border-[#1F1B16]/10 rounded-full px-5 py-2.5 text-xs bg-[#F7F3EC] text-[#1F1B16] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/50">Testimonial Quote</label>
                    <textarea
                      rows={2}
                      value={t.quote}
                      onChange={(e) => handleTestimonialChange(t.id, "quote", e.target.value)}
                      className="border border-[#1F1B16]/10 rounded-xl px-5 py-2.5 text-xs bg-[#F7F3EC] text-[#1F1B16] focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleTestimonialsSave}
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3.5 rounded-full mt-4 text-xs shadow-warm-md flex items-center justify-center gap-2 self-start px-8"
            >
              <Sparkles className="w-4 h-4" /> Publish Testimonials
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
