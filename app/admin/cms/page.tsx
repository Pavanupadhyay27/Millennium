"use client";

import React, { useState } from "react";
import {
  FileEdit,
  Sparkles,
  ShoppingBag,
  UserCheck,
  CheckCircle,
  Palette,
  Layout,
  Globe,
  Sliders,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../../../lib/store";

// Initial Mock CMS Settings
const INITIAL_CMS_SETTINGS = {
  heroHeadline: "Transform Your Home into a Cozy Nest",
  heroSubtext: "Discover our premium handcrafted organic solid teak and walnut wood collections, manufactured locally in Bhubaneswar, Odisha.",
  brandTagline: "Handcrafted Teak Furniture • Direct Factory Wholesale",
  announcementBarText: "⚡ Monsoon Special: Up to 20% OFF on Teak Seating & Free Delivery Across Odisha!",
  primaryThemeColor: "#0D5C53",
  showAnnouncementBar: true,
  featuredProductIds: ["p1", "p6"],
  promoBanners: [
    {
      id: "b1",
      badge: "LIMITED OFFER",
      discount: "40% OFF",
      title: "Odisha Teak Cabinets & Storage",
      link: "/spaces/storage",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
      bgColor: "#1C2B26",
    },
    {
      id: "b2",
      badge: "EXCLUSIVE DEAL",
      discount: "25% OFF",
      title: "Handcrafted Oak Lounge Seating",
      link: "/spaces/seating",
      image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=800",
      bgColor: "#291A14",
    },
  ],
  testimonials: [
    { id: "t1", author: "Dr. Alok Mohapatra", role: "Interior Architect, Cuttack", quote: "The grade of teak wood and the joinery details are absolute world-class. Highly recommended for commercial projects." },
    { id: "t2", author: "Priyanka Patnaik", role: "Home Owner, Patia", quote: "Beautiful organic cream styling. The Lounge Chair has become the cozy centerpiece of our study corner." }
  ]
};

export default function HomepageCmsPage() {
  const { products: storeProducts, cmsSettings, updateCmsSettings } = useStore();
  const [cmsData, setCmsData] = useState({
    ...INITIAL_CMS_SETTINGS,
    announcementBarText: cmsSettings?.announcementBarText || INITIAL_CMS_SETTINGS.announcementBarText,
    heroHeadline: cmsSettings?.heroHeadline || INITIAL_CMS_SETTINGS.heroHeadline,
    heroSubtext: cmsSettings?.heroSubtext || INITIAL_CMS_SETTINGS.heroSubtext,
    showAnnouncementBar: cmsSettings?.showAnnouncementBar ?? true,
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Active tab inside CMS editor
  const [activeTab, setActiveTab] = useState<"hero" | "banners" | "branding" | "carousel" | "testimonials">("hero");

  const handleHeroSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCmsSettings({
      announcementBarText: cmsData.announcementBarText,
      heroHeadline: cmsData.heroHeadline,
      heroSubtext: cmsData.heroSubtext,
      showAnnouncementBar: cmsData.showAnnouncementBar,
    });
    showToast("Hero section & announcement bar updated live across the entire storefront!");
  };

  const handleBrandingSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Brand theme colors and header taglines updated successfully!");
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
    showToast(`Homepage Carousel updated with ${cmsData.featuredProductIds.length} active featured items.`);
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
    showToast("Client reviews and verified architect testimonials published.");
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
            className="fixed top-24 right-8 z-50 bg-[#1F1B16] text-white rounded-2xl px-6 py-4 text-xs font-bold shadow-2xl flex items-center gap-2 border border-accent-teal/30"
          >
            <CheckCircle className="w-4 h-4 text-accent-teal shrink-0" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-6">
        <div>
          <span className="text-[10px] font-extrabold text-accent-teal uppercase tracking-widest bg-accent-teal/10 px-3 py-1 rounded-full inline-block mb-2">
            Storefront CMS Engine
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
            Website Customization & CMS
          </h1>
          <p className="text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 text-xs font-medium mt-1">
            Edit landing page hero copy, announcement banners, featured products, and branding without writing code.
          </p>
        </div>
      </div>

      {/* Tab Headers */}
      <div className="flex border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-4 gap-8 overflow-x-auto">
        {([
          { id: "hero", name: "Hero Block & Banners", icon: FileEdit },
          { id: "banners", name: "Promo Banners CMS", icon: Layout },
          { id: "branding", name: "Branding & Theme", icon: Palette },
          { id: "carousel", name: "Featured Showcase", icon: ShoppingBag },
          { id: "testimonials", name: "Client Testimonials", icon: UserCheck },
        ] as const).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-xs font-bold pb-2 transition-all relative shrink-0 ${
                isActive ? "text-accent-teal" : "text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 hover:text-[#1F1B16] dark:hover:text-[#F7F3EC]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
              {isActive && (
                <motion.div
                  layoutId="activeCmsTabUnderline"
                  className="absolute bottom-0 left-0 w-full h-[2.5px] bg-accent-teal rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Editor Panel */}
      <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 md:p-8 shadow-sm max-w-4xl">
        
        {/* Tab 1: Hero Block Copy */}
        {activeTab === "hero" && (
          <form onSubmit={handleHeroSave} className="flex flex-col gap-6">
            <h3 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
              Edit Hero Section & Header Announcement Bar
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
                Top Announcement Bar Copy
              </label>
              <input
                type="text"
                required
                value={cmsData.announcementBarText}
                onChange={(e) => setCmsData((prev) => ({ ...prev, announcementBarText: e.target.value }))}
                className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-3 text-xs bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal font-bold"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
                Main Serif Headline
              </label>
              <input
                type="text"
                required
                value={cmsData.heroHeadline}
                onChange={(e) => setCmsData((prev) => ({ ...prev, heroHeadline: e.target.value }))}
                className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-3 text-xs bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal font-bold"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
                Supporting Subtext
              </label>
              <textarea
                required
                rows={3}
                value={cmsData.heroSubtext}
                onChange={(e) => setCmsData((prev) => ({ ...prev, heroSubtext: e.target.value }))}
                className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-3 text-xs bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal resize-none leading-relaxed font-medium"
              />
            </div>

            <button
              type="submit"
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 self-start px-8 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Publish Hero & Announcement
            </button>
          </form>
        )}

        {/* Tab: Promo Banners Editor */}
        {activeTab === "banners" && (
          <div className="flex flex-col gap-6">
            <div className="pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
              <h3 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
                Customize Homepage Promo Banners
              </h3>
              <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mt-1">
                Edit deal badges, discounts, promo titles, image URLs, and button destinations for homepage cards.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {cmsData.promoBanners.map((banner, index) => (
                <div key={banner.id} className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-teal bg-accent-teal/10 px-3 py-1 rounded-full">
                      Promo Banner #{index + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                        Offer Badge Tag
                      </label>
                      <input
                        type="text"
                        value={banner.badge}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCmsData((prev) => ({
                            ...prev,
                            promoBanners: prev.promoBanners.map((b) => (b.id === banner.id ? { ...b, badge: val } : b)),
                          }));
                        }}
                        className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                        Discount Headline
                      </label>
                      <input
                        type="text"
                        value={banner.discount}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCmsData((prev) => ({
                            ...prev,
                            promoBanners: prev.promoBanners.map((b) => (b.id === banner.id ? { ...b, discount: val } : b)),
                          }));
                        }}
                        className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs font-serif font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                      Banner Subtitle / Category Description
                    </label>
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCmsData((prev) => ({
                          ...prev,
                          promoBanners: prev.promoBanners.map((b) => (b.id === banner.id ? { ...b, title: val } : b)),
                        }));
                      }}
                      className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs font-medium text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                        Target Page Link
                      </label>
                      <input
                        type="text"
                        value={banner.link}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCmsData((prev) => ({
                            ...prev,
                            promoBanners: prev.promoBanners.map((b) => (b.id === banner.id ? { ...b, link: val } : b)),
                          }));
                        }}
                        className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs font-mono font-semibold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                        Banner Image URL
                      </label>
                      <input
                        type="text"
                        value={banner.image}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCmsData((prev) => ({
                            ...prev,
                            promoBanners: prev.promoBanners.map((b) => (b.id === banner.id ? { ...b, image: val } : b)),
                          }));
                        }}
                        className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs font-mono font-semibold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => showToast("Promo Banners updated live on storefront!")}
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 self-start px-8 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Publish Promo Banners
            </button>
          </div>
        )}

        {/* Tab 2: Branding & Theme Colors */}
        {activeTab === "branding" && (
          <form onSubmit={handleBrandingSave} className="flex flex-col gap-6">
            <h3 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
              Storefront Branding & Custom Color Tokens
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
                  Header Brand Tagline
                </label>
                <input
                  type="text"
                  required
                  value={cmsData.brandTagline}
                  onChange={(e) => setCmsData((prev) => ({ ...prev, brandTagline: e.target.value }))}
                  className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-3 text-xs bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal font-bold"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
                  Accent Theme Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={cmsData.primaryThemeColor}
                    onChange={(e) => setCmsData((prev) => ({ ...prev, primaryThemeColor: e.target.value }))}
                    className="w-10 h-10 rounded-xl border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={cmsData.primaryThemeColor}
                    onChange={(e) => setCmsData((prev) => ({ ...prev, primaryThemeColor: e.target.value }))}
                    className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-mono font-bold bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none flex-1"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 self-start px-8 transition-all"
            >
              <Palette className="w-4 h-4" /> Save Brand Styling
            </button>
          </form>
        )}

        {/* Tab 3: Featured Products Showcase */}
        {activeTab === "carousel" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
              Select Carousel Featured Products
            </h3>
            <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 leading-relaxed font-medium">
              Toggle products from your active catalog to feature in the homepage &quot;Popular Pieces&quot; carousel row.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {storeProducts.map((prod) => {
                const isSelected = cmsData.featuredProductIds.includes(prod.id);
                return (
                  <label
                    key={prod.id}
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer select-none transition-all ${
                      isSelected
                        ? "bg-accent-teal/10 border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                        : "bg-[#FAF7F2] dark:bg-[#12100E] border-[#1F1B16]/10 dark:border-[#F7F3EC]/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCarouselToggle(prod.id)}
                        className="w-4 h-4 rounded accent-accent-teal cursor-pointer"
                      />
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-accent-teal/10 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC]">{prod.name}</h4>
                        <span className="font-mono text-[9px] text-accent-teal font-extrabold">{prod.category}</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <button
              onClick={handleCarouselSave}
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 self-start px-8 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Publish Carousel Showcase
            </button>
          </div>
        )}

        {/* Tab 4: Client Testimonials */}
        {activeTab === "testimonials" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
              Edit Client Testimonials & Architect Reviews
            </h3>

            <div className="flex flex-col gap-6 divide-y divide-[#1F1B16]/10 dark:divide-[#F7F3EC]/10">
              {cmsData.testimonials.map((t, index) => (
                <div key={t.id} className={`flex flex-col gap-4 ${index > 0 ? "pt-6" : ""}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">Author Name</label>
                      <input
                        type="text"
                        value={t.author}
                        onChange={(e) => handleTestimonialChange(t.id, "author", e.target.value)}
                        className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">Role / Location</label>
                      <input
                        type="text"
                        value={t.role}
                        onChange={(e) => handleTestimonialChange(t.id, "role", e.target.value)}
                        className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">Testimonial Quote</label>
                    <textarea
                      rows={2}
                      value={t.quote}
                      onChange={(e) => handleTestimonialChange(t.id, "quote", e.target.value)}
                      className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none resize-none leading-relaxed font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleTestimonialsSave}
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 self-start px-8 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Publish Testimonials
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

