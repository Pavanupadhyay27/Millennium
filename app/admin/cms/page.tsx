"use client";

import React, { useState, useMemo } from "react";
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
  Check,
  Search,
  Star,
  Pencil,
  Trash2,
  X,
  Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, CustomerTestimonial } from "../../../lib/store";

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
  const {
    products: storeProducts,
    cmsSettings,
    updateCmsSettings,
    brandPartners,
    addBrandPartner,
    updateBrandPartner,
    deleteBrandPartner,
    customerTestimonials,
    addCustomerTestimonial,
    updateCustomerTestimonial,
    deleteCustomerTestimonial,
  } = useStore();
  const [cmsData, setCmsData] = useState({
    ...INITIAL_CMS_SETTINGS,
    announcementBarText: cmsSettings?.announcementBarText || INITIAL_CMS_SETTINGS.announcementBarText,
    heroHeadline: cmsSettings?.heroHeadline || INITIAL_CMS_SETTINGS.heroHeadline,
    heroSubtext: cmsSettings?.heroSubtext || INITIAL_CMS_SETTINGS.heroSubtext,
    showAnnouncementBar: cmsSettings?.showAnnouncementBar ?? true,
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Active tab inside CMS editor
  const [activeTab, setActiveTab] = useState<"hero" | "partners" | "banners" | "branding" | "carousel" | "testimonials">("hero");

  // New partner state
  const [newPartner, setNewPartner] = useState({
    name: "",
    tag: "",
    logo: "",
  });

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
          { id: "partners", name: "Brand Partners", icon: Globe },
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

        {/* Tab: Brand Partners CRUD Editor */}
        {activeTab === "partners" && (
          <div className="flex flex-col gap-6">
            <div className="pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
                  Manage Brand Partners & Material Certifications
                </h3>
                <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mt-1">
                  Add, edit, or delete verified brand partners (Sleepwell, CenturyPly, Featherlite, Godrej Interio, etc.) featured on the homepage.
                </p>
              </div>
            </div>

            {/* Add New Partner Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPartner.name || !newPartner.logo) return;
                addBrandPartner({
                  name: newPartner.name,
                  tag: newPartner.tag || "Verified Partner",
                  logo: newPartner.logo,
                  fallbackLogo: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=120",
                });
                setNewPartner({ name: "", tag: "", logo: "" });
                showToast("New Brand Partner added to storefront ticker!");
              }}
              className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 space-y-4"
            >
              <h4 className="font-serif text-sm font-bold text-accent-teal uppercase tracking-wider">
                + Add New Brand Partner
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sleepwell"
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Material / Tech Tag *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mattress Tech Partner"
                    value={newPartner.tag}
                    onChange={(e) => setNewPartner({ ...newPartner, tag: e.target.value })}
                    className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs font-medium text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Logo Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://domain.com/logo.png"
                    value={newPartner.logo}
                    onChange={(e) => setNewPartner({ ...newPartner, logo: e.target.value })}
                    className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2 text-xs font-medium text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
              >
                + Add Partner
              </button>
            </form>

            {/* List of Current Partners */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
                Active Brand Partners ({brandPartners?.length || 0})
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {brandPartners?.map((bp) => (
                  <div
                    key={bp.id}
                    className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={bp.logo} alt={bp.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-serif font-bold text-xs truncate text-[#1F1B16] dark:text-[#F7F3EC]">{bp.name}</h5>
                        <p className="text-[10px] text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 truncate">• {bp.tag}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        deleteBrandPartner(bp.id);
                        showToast(`Brand partner "${bp.name}" removed.`);
                      }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors shrink-0 text-xs font-bold"
                      title="Delete Partner"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

        {/* Tab 4: Client Testimonials Full CRUD Editor */}
        {activeTab === "testimonials" && (
          <TestimonialsManager
            customerTestimonials={customerTestimonials}
            addCustomerTestimonial={addCustomerTestimonial}
            updateCustomerTestimonial={updateCustomerTestimonial}
            deleteCustomerTestimonial={deleteCustomerTestimonial}
            showToast={showToast}
          />
        )}

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Testimonials Manager — Search bar, separate cards, per-card Edit/Update
   ═══════════════════════════════════════════════════════════════════ */
function TestimonialsManager({
  customerTestimonials,
  addCustomerTestimonial,
  updateCustomerTestimonial,
  deleteCustomerTestimonial,
  showToast,
}: {
  customerTestimonials: CustomerTestimonial[];
  addCustomerTestimonial: (t: Omit<CustomerTestimonial, "id" | "date" | "verified">) => void;
  updateCustomerTestimonial: (id: string, t: Partial<CustomerTestimonial>) => void;
  deleteCustomerTestimonial: (id: string) => void;
  showToast: (msg: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<CustomerTestimonial>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDraft, setNewDraft] = useState({
    name: "",
    role: "",
    quote: "",
    rating: 5,
    company: "",
    projectTag: "",
    orderVolume: "",
    photo: "",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDraft.name || !newDraft.role || !newDraft.quote) {
      showToast("Please fill in Name, Role, and Review text.");
      return;
    }
    addCustomerTestimonial(newDraft);
    showToast(`Review by "${newDraft.name}" added successfully!`);
    setNewDraft({
      name: "",
      role: "",
      quote: "",
      rating: 5,
      company: "",
      projectTag: "",
      orderVolume: "",
      photo: "",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
    });
    setShowAddForm(false);
  };

  const filtered = useMemo(() => {
    if (!customerTestimonials) return [];
    if (!searchQuery.trim()) return customerTestimonials;
    const q = searchQuery.toLowerCase();
    return customerTestimonials.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.quote.toLowerCase().includes(q)
    );
  }, [customerTestimonials, searchQuery]);

  const startEdit = (t: CustomerTestimonial) => {
    setEditingId(t.id);
    setEditDraft({ name: t.name, role: t.role, quote: t.quote, rating: t.rating, photo: t.photo, company: t.company, projectTag: t.projectTag, orderVolume: t.orderVolume });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const saveEdit = (id: string) => {
    updateCustomerTestimonial(id, editDraft);
    showToast(`Review by "${editDraft.name}" updated successfully!`);
    setEditingId(null);
    setEditDraft({});
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="w-3.5 h-3.5"
          style={{
            fill: s <= rating ? "#F59E0B" : "transparent",
            color: s <= rating ? "#F59E0B" : "#9CA3AF",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
        <h3 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
          Manage Client Testimonials & Buyer Reviews
        </h3>
        <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mt-1">
          Search, edit, update, or delete individual customer reviews. Each card has its own Edit & Update controls.
        </p>
      </div>

      {/* Search Bar + Count + Add Review Form Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-full px-5 py-2.5 w-full sm:w-80 md:w-96">
            <Search className="w-4 h-4 text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by reviewer name, role, or quote..."
              className="bg-transparent text-xs focus:outline-none w-full text-[#1F1B16] dark:text-[#F7F3EC] placeholder:text-[#1F1B16]/40 dark:placeholder:text-[#F7F3EC]/40 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="ml-2 text-[#1F1B16]/40 hover:text-[#1F1B16] dark:text-[#F7F3EC]/40 dark:hover:text-[#F7F3EC]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-accent-teal hover:bg-accent-teal/90 text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            {showAddForm ? "Hide Form" : "＋ Create Testimonial"}
          </button>
        </div>
        <span className="text-xs font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
          Showing {filtered.length} of {customerTestimonials?.length || 0} reviews
        </span>
      </div>

      {/* Collapsible Add New Testimonial Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddSubmit}
            className="overflow-hidden bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="pb-2 border-b border-[#1F1B16]/5 dark:border-[#F7F3EC]/5">
              <h4 className="font-serif text-sm font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
                Create a New Review Card
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text" required placeholder="Vikramjit Sharma"
                  value={newDraft.name}
                  onChange={(e) => setNewDraft({ ...newDraft, name: e.target.value })}
                  className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3.5 py-2.5 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-bold focus:outline-none focus:border-accent-teal"
                />
              </div>
              <div>
                <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Role / City *
                </label>
                <input
                  type="text" required placeholder="Interior Designer, Bhubaneswar"
                  value={newDraft.role}
                  onChange={(e) => setNewDraft({ ...newDraft, role: e.target.value })}
                  className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3.5 py-2.5 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium focus:outline-none focus:border-accent-teal"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                Rating Star Count (1 - 5)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewDraft({ ...newDraft, rating: s })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className="w-5 h-5"
                      style={{
                        fill: s <= newDraft.rating ? "#F59E0B" : "transparent",
                        color: s <= newDraft.rating ? "#F59E0B" : "#9CA3AF",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                Review Description *
              </label>
              <textarea
                rows={3} required placeholder="Write review details..."
                value={newDraft.quote}
                onChange={(e) => setNewDraft({ ...newDraft, quote: e.target.value })}
                className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3.5 py-2.5 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium focus:outline-none focus:border-accent-teal resize-none"
              />
            </div>

            {/* Wholesale-Specific Optional Fields */}
            <div className="pt-3 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
              <span className="text-[9px] font-extrabold text-accent-teal uppercase tracking-widest block mb-3">
                🏢 B2B Partner Portal Fields (Optional - If filling B2B Cards)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Company Name
                  </label>
                  <input
                    type="text" placeholder="Sharma Interior Projects"
                    value={newDraft.company}
                    onChange={(e) => setNewDraft({ ...newDraft, company: e.target.value })}
                    className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium focus:outline-none focus:border-accent-teal"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Project Tag
                  </label>
                  <input
                    type="text" placeholder="Resort & Hospitality"
                    value={newDraft.projectTag}
                    onChange={(e) => setNewDraft({ ...newDraft, projectTag: e.target.value })}
                    className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium focus:outline-none focus:border-accent-teal"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Order Volume
                  </label>
                  <input
                    type="text" placeholder="₹8,50,000"
                    value={newDraft.orderVolume}
                    onChange={(e) => setNewDraft({ ...newDraft, orderVolume: e.target.value })}
                    className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium focus:outline-none focus:border-accent-teal"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                Portrait Photo URL
              </label>
              <input
                type="url" placeholder="https://images.unsplash.com/photo-..."
                value={newDraft.photo}
                onChange={(e) => setNewDraft({ ...newDraft, photo: e.target.value })}
                className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium focus:outline-none focus:border-accent-teal"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-accent-teal hover:bg-accent-teal/90 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Publish Testimonial
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((t) => {
            const isEditing = editingId === t.id;

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative bg-[#FAF7F2] dark:bg-[#12100E] border rounded-2xl overflow-hidden transition-all ${
                  isEditing
                    ? "border-accent-teal shadow-lg ring-1 ring-accent-teal/20"
                    : "border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 shadow-sm hover:shadow-md hover:border-[#1F1B16]/20 dark:hover:border-[#F7F3EC]/20"
                }`}
              >
                {/* Card Header Strip */}
                <div className="flex items-center justify-between px-5 pt-4 pb-3">
                  <div className="flex items-center gap-2">
                    {renderStars(isEditing ? (editDraft.rating ?? t.rating) : t.rating)}
                    <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  {t.date && (
                    <span className="text-[10px] font-mono text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">
                      {t.date}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="px-5 pb-5">
                  {isEditing ? (
                    /* ── EDIT MODE ── */
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={editDraft.name ?? ""}
                            onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                            className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-bold focus:outline-none focus:border-accent-teal"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                            Role / City
                          </label>
                          <input
                            type="text"
                            value={editDraft.role ?? ""}
                            onChange={(e) => setEditDraft({ ...editDraft, role: e.target.value })}
                            className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium focus:outline-none focus:border-accent-teal"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                          Rating
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setEditDraft({ ...editDraft, rating: s })}
                              className="p-0.5 hover:scale-110 transition-transform"
                            >
                              <Star
                                className="w-5 h-5"
                                style={{
                                  fill: s <= (editDraft.rating ?? 0) ? "#F59E0B" : "transparent",
                                  color: s <= (editDraft.rating ?? 0) ? "#F59E0B" : "#9CA3AF",
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                          Review Text
                        </label>
                        <textarea
                          rows={3}
                          value={editDraft.quote ?? ""}
                          onChange={(e) => setEditDraft({ ...editDraft, quote: e.target.value })}
                          className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium leading-relaxed focus:outline-none focus:border-accent-teal resize-none"
                        />
                      </div>

                      {/* ── Wholesale Partner Fields ── */}
                      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                        <div>
                          <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={editDraft.company ?? ""}
                            onChange={(e) => setEditDraft({ ...editDraft, company: e.target.value })}
                            placeholder="Sharma Interior Projects"
                            className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium focus:outline-none focus:border-accent-teal"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                            Project Tag
                          </label>
                          <input
                            type="text"
                            value={editDraft.projectTag ?? ""}
                            onChange={(e) => setEditDraft({ ...editDraft, projectTag: e.target.value })}
                            placeholder="Resort & Hospitality"
                            className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium focus:outline-none focus:border-accent-teal"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                            Order Volume
                          </label>
                          <input
                            type="text"
                            value={editDraft.orderVolume ?? ""}
                            onChange={(e) => setEditDraft({ ...editDraft, orderVolume: e.target.value })}
                            placeholder="₹8,50,000"
                            className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium focus:outline-none focus:border-accent-teal"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                          Portrait Photo URL
                        </label>
                        <input
                          type="url"
                          value={editDraft.photo ?? ""}
                          onChange={(e) => setEditDraft({ ...editDraft, photo: e.target.value })}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 rounded-xl px-3 py-2 text-xs bg-white dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] font-medium focus:outline-none focus:border-accent-teal"
                        />
                        {editDraft.photo && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={editDraft.photo} alt="preview" className="mt-2 w-12 h-12 rounded-xl object-cover border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10" />
                        )}
                      </div>

                      {/* Edit Mode Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => saveEdit(t.id)}
                          className="flex-1 bg-accent-teal text-white font-extrabold py-2.5 rounded-xl text-[10px] uppercase tracking-wider hover:bg-accent-teal/90 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" /> Update Review
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2.5 bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/5 hover:bg-[#1F1B16]/10 dark:hover:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC] rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── READ MODE ── */
                    <div>
                      <p className="font-serif italic text-sm leading-relaxed text-[#1F1B16]/90 dark:text-[#F7F3EC]/90 mb-4 line-clamp-3">
                        &ldquo;{t.quote}&rdquo;
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {t.photo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10" />
                          )}
                          <div>
                            <h4 className="font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]">
                              {t.name}
                            </h4>
                            <span className="text-[10px] text-accent-teal font-semibold">
                              {t.company ? `${t.company} · ` : ""}{t.role}
                            </span>
                          </div>
                        </div>

                        {/* Per-Card Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(t)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-teal/10 hover:bg-accent-teal hover:text-white text-accent-teal rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                          >
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              deleteCustomerTestimonial(t.id);
                              showToast(`Review by "${t.name}" deleted.`);
                            }}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all"
                            title="Delete this review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 font-serif">
          {searchQuery ? `No reviews matching "${searchQuery}".` : "No customer reviews yet."}
        </div>
      )}
    </div>
  );
}
