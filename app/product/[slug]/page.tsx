"use client";

import React, { useState, useMemo } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import {
  Plus,
  Minus,
  ShoppingBag,
  FileText,
  Truck,
  Shield,
  ArrowRight,
  Star,
  CheckCircle2,
  MessageSquarePlus,
  User,
  Heart,
  RotateCcw,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Offer, Review } from "../../../lib/store";

// Helper to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const { products: storeProducts, addToCart, offers, addProductReview, toggleWishlist, wishlist, toggleCartDrawer } = useStore();

  // Find product from live Zustand store or fallback
  const storeProduct = useMemo(() => {
    return storeProducts.find((p) => p.slug === slug || p.id === slug);
  }, [storeProducts, slug]);

  const product = useMemo(() => {
    if (storeProduct) {
      return {
        id: storeProduct.id,
        name: storeProduct.name,
        price: storeProduct.price,
        wholesalePrice: storeProduct.wholesalePrice,
        category: storeProduct.category,
        description: storeProduct.description || "Handcrafted with premium organic solid timber and precision joinery in Odisha.",
        images: (storeProduct.images && storeProduct.images.length > 0)
          ? storeProduct.images
          : [storeProduct.image || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800"],
        colors: (storeProduct.colors && storeProduct.colors.length > 0)
          ? storeProduct.colors.map((c, i) => ({ name: c, value: i === 0 ? "#D97B3F" : "#1F1B16", priceDelta: 0, imgIdx: 0 }))
          : [{ name: "Natural Teak", value: "#D97B3F", priceDelta: 0, imgIdx: 0 }],
        materials: (storeProduct.materials && storeProduct.materials.length > 0)
          ? storeProduct.materials.map((m) => ({ name: m, priceDelta: 0 }))
          : [{ name: "Solid Teak Wood", priceDelta: 0 }],
        dimensions: storeProduct.dimensions || "Width: 72cm | Depth: 80cm | Height: 85cm",
        woodType: storeProduct.woodType || "A-Grade Kiln-dried Odisha Teak",
        weight: storeProduct.weight || "14 kg",
        reviews: storeProduct.reviews || [
          { id: "r1", author: "Rajesh Mohapatra", rating: 5, date: "July 12, 2026", comment: "Outstanding wood grain texture and heavy structural build. Fits perfectly into our hotel project in Puri.", verified: true },
          { id: "r2", author: "Ananya Mishra", rating: 5, date: "June 28, 2026", comment: "Clean minimalist design. Delivered fully assembled with zero hassle.", verified: true }
        ],
      };
    }

    // Default fallback
    return {
      id: slug,
      name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      price: 24500,
      wholesalePrice: 18500,
      category: "Seating",
      description: "Indulge in mid-century elegance with our signature piece. Handcrafted by local artisans in Bhubaneswar using premium, sustainably harvested solid teak timber.",
      images: [
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800",
      ],
      colors: [
        { name: "Natural Wood", value: "#D97B3F", priceDelta: 0, imgIdx: 0 },
        { name: "Charcoal Black", value: "#1F1B16", priceDelta: 1500, imgIdx: 1 },
      ],
      materials: [{ name: "Standard Solid Teak", priceDelta: 0 }],
      dimensions: "Width: 72cm | Depth: 80cm | Height: 85cm",
      woodType: "A-Grade Kiln-dried Odisha Teak",
      weight: "14 kg",
      reviews: [
        { id: "r1", author: "Rajesh Mohapatra", rating: 5, date: "July 12, 2026", comment: "Outstanding wood grain texture and heavy structural build. Fits perfectly into our hotel project in Puri.", verified: true },
        { id: "r2", author: "Ananya Mishra", rating: 5, date: "June 28, 2026", comment: "Clean minimalist design. Delivered fully assembled with zero hassle.", verified: true }
      ],
    };
  }, [storeProduct, slug]);

  // Gallery Active Image Index
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Variant & Customization States
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [customSpecs, setCustomSpecs] = useState({
    finish: "Natural Organic Teak",
    upholstery: "Breathable Organic Linen",
    width: 72,
    depth: 80,
    height: 85,
    engraving: "",
  });

  // Role Preview Toggle (Dev/B2B Mode)
  const [simulatedRole, setSimulatedRole] = useState<"CUSTOMER" | "WHOLESALE">("CUSTOMER");
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews" | "shipping">("description");

  // New Review Form States
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Calculate dynamic price based on variants & custom specs selection
  const calculatedPrice = useMemo(() => {
    const base = simulatedRole === "WHOLESALE" ? product.wholesalePrice : product.price;
    const finishDelta = customSpecs.finish === "Charcoal Ebonized Black" ? 1500 : customSpecs.finish === "Aged Rosewood Polish" ? 2500 : customSpecs.finish === "Warm Honey Teak Polish" ? 1000 : 0;
    const upholsteryDelta = customSpecs.upholstery === "Top-Grain Italian Leather" ? 6500 : customSpecs.upholstery === "Plush Velvet Upholstery" ? 2000 : customSpecs.upholstery === "Textured Bouclé Fabric" ? 3500 : 0;
    const delta = (selectedColor.priceDelta || 0) + finishDelta + upholsteryDelta;
    return base + delta;
  }, [product, selectedColor, customSpecs, simulatedRole]);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: calculatedPrice,
      originalPrice: product.price,
      quantity,
      color: selectedColor.name,
      material: customSpecs.upholstery,
      image: product.images[activeImgIdx] || product.images[0],
      slug: slug,
      customSpecs: {
        finish: customSpecs.finish,
        upholstery: customSpecs.upholstery,
        dimensions: { width: customSpecs.width, depth: customSpecs.depth, height: customSpecs.height },
        engraving: customSpecs.engraving,
        priceDelta: calculatedPrice - product.price,
      },
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim() || reviewRating === 0) {
      showToast("Please select a star rating between 1 and 5!");
      return;
    }

    addProductReview(product.id, {
      author: reviewAuthor.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      verified: true,
    });

    setReviewAuthor("");
    setReviewComment("");
    setReviewRating(0);
    showToast("Thank you! Your verified review has been published.");
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Average Rating
  const avgRating = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) return 5.0;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / product.reviews.length).toFixed(1);
  }, [product.reviews]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] font-sans selection:bg-accent-teal/20 flex flex-col justify-between transition-colors duration-300">
      <div>
        <Navbar />

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-24 right-8 z-50 bg-[#1F1B16] text-white rounded-2xl px-6 py-4 text-xs font-bold shadow-2xl flex items-center gap-2 border border-accent-teal/30"
            >
              <CheckCircle2 className="w-4 h-4 text-accent-teal shrink-0" /> {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product View Area */}
        <main className="max-w-[1300px] mx-auto px-4 md:px-8 pt-24 pb-16">
          
          {/* Simulated role banner */}
          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal"></span>
              </span>
              <p className="text-xs font-medium text-[#1F1B16]/80 dark:text-[#F7F3EC]/80">
                <span className="font-bold text-accent-teal">B2B Trade Pricing Preview:</span> Switch role to view verified wholesale rates.
              </p>
            </div>
            <div className="flex bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl p-1 text-[10px] font-bold">
              <button
                onClick={() => setSimulatedRole("CUSTOMER")}
                className={`rounded-lg px-3 py-1 transition-all ${
                  simulatedRole === "CUSTOMER" ? "bg-accent-teal text-white shadow-sm" : "text-[#1F1B16]/60 dark:text-[#F7F3EC]/60"
                }`}
              >
                Retail Price
              </button>
              <button
                onClick={() => setSimulatedRole("WHOLESALE")}
                className={`rounded-lg px-3 py-1 transition-all ${
                  simulatedRole === "WHOLESALE" ? "bg-accent-teal text-white shadow-sm" : "text-[#1F1B16]/60 dark:text-[#F7F3EC]/60"
                }`}
              >
                Wholesale Tier
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT: Product Image Gallery */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Main Image Display */}
              <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-3 aspect-[4/3] flex items-center justify-center overflow-hidden shadow-sm relative group max-h-[460px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[activeImgIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <button
                  onClick={() => toggleWishlist({ id: product.id, slug: product.id, name: product.name, price: product.price, image: product.images[0], bg: "bg-cream" })}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-[#1C1814]/90 backdrop-blur-md shadow-md text-[#1F1B16] dark:text-[#F7F3EC] hover:scale-110 transition-all border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10"
                >
                  <Heart className={`w-4 h-4 ${wishlist.some(w => w.id === product.id) ? "fill-accent-terracotta text-accent-terracotta" : "opacity-60"}`} />
                </button>
              </div>

              {/* Thumbnails Strip (Rendered strictly when multiple images > 1 exist for this product) */}
              {Array.isArray(product.images) && product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img: string, idx: number) => {
                    const isActive = idx === activeImgIdx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIdx(idx)}
                        className={`w-16 h-16 rounded-xl p-1 bg-white dark:bg-[#1C1814] overflow-hidden border-2 transition-all ${
                          isActive ? "border-accent-teal shadow-md scale-105" : "border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded-lg" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT: Product Specs & Customizer Panel */}
            <div className="lg:col-span-6 flex flex-col items-start">
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-accent-teal text-[10px] font-extrabold uppercase tracking-widest bg-accent-teal/10 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-[10px] font-bold text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 flex items-center gap-1 bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {avgRating} ({product.reviews?.length || 0} reviews)
                </span>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] leading-tight mb-3">
                {product.name}
              </h1>

              {/* Pricing Display */}
              <div className="mb-6 flex flex-col gap-1">
                {simulatedRole === "WHOLESALE" ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-accent-teal">
                        {formatPrice(calculatedPrice)}
                      </span>
                      <span className="text-[9px] font-black text-white bg-accent-teal px-2 py-0.5 rounded uppercase tracking-wider">
                        Wholesale Rate
                      </span>
                    </div>
                    <span className="text-xs text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 line-through">
                      Regular Retail: {formatPrice(product.price + (selectedColor.priceDelta || 0))}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-[#1F1B16] dark:text-[#F7F3EC]">
                    {formatPrice(calculatedPrice)}
                  </span>
                )}
                <p className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-medium">Inclusive of all taxes • Handcrafted in Bhubaneswar</p>
              </div>

              <div className="w-full border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pt-6 mb-6 flex flex-col gap-6">
                
                {/* Bespoke Customization Studio Panel */}
                <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#1F1B16]/5 dark:border-[#F7F3EC]/10 pb-3">
                    <span className="text-[10px] font-extrabold text-accent-teal uppercase tracking-widest bg-accent-teal/10 px-3 py-1 rounded-full">
                      Custom Timber & Finishing Options
                    </span>
                  </div>

                  {/* Wood Timber Finish */}
                  <div>
                    <label className="text-[11px] font-bold text-[#1F1B16] dark:text-[#F7F3EC] block mb-2">
                      1. Custom Wood Finish: <span className="text-accent-teal">{customSpecs.finish}</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "Natural Organic Teak", delta: 0 },
                        { name: "Charcoal Ebonized Black", delta: 1500 },
                        { name: "Warm Honey Teak Polish", delta: 1000 },
                        { name: "Aged Rosewood Polish", delta: 2500 },
                      ].map((f) => (
                        <button
                          key={f.name}
                          type="button"
                          onClick={() => setCustomSpecs((prev) => ({ ...prev, finish: f.name }))}
                          className={`px-3 py-2 rounded-xl text-[10px] font-bold text-left border transition-all ${
                            customSpecs.finish === f.name
                              ? "bg-accent-teal text-white border-accent-teal shadow-sm"
                              : "bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 hover:border-accent-teal"
                          }`}
                        >
                          {f.name} {f.delta > 0 ? `(+${formatPrice(f.delta)})` : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upholstery Choice */}
                  <div>
                    <label className="text-[11px] font-bold text-[#1F1B16] dark:text-[#F7F3EC] block mb-1.5">
                      2. Upholstery Fabric: <span className="text-accent-teal">{customSpecs.upholstery}</span>
                    </label>
                    <select
                      value={customSpecs.upholstery}
                      onChange={(e) => setCustomSpecs((prev) => ({ ...prev, upholstery: e.target.value }))}
                      className="w-full bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-3 py-2 text-[11px] font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                    >
                      <option value="Breathable Organic Linen">Breathable Organic Linen (+₹0)</option>
                      <option value="Plush Velvet Upholstery">Plush Velvet Upholstery (+₹2,000)</option>
                      <option value="Top-Grain Italian Leather">Top-Grain Italian Leather (+₹6,500)</option>
                      <option value="Textured Bouclé Fabric">Textured Bouclé Fabric (+₹3,500)</option>
                    </select>
                  </div>
                </div>

                {/* Quantity and Cart Button */}
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 mb-3">
                    Select Quantity
                  </h4>
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Stepper */}
                    <div className="flex items-center bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-1.5 shadow-sm">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#1F1B16]/5 dark:hover:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#1F1B16]/5 dark:hover:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Action buttons: Add to Cart & Buy Now - 3D Skeuomorphic */}
                    <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={handleAddToCart}
                        className="w-full sm:w-auto flex-1 text-[#1F1B16] dark:text-[#F7F3EC] font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md uppercase tracking-widest text-xs transition-all transform active:translate-y-0.5 border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 relative overflow-hidden"
                        style={{
                          background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,238,233,0.95) 100%)",
                          boxShadow: "0 6px 16px -2px rgba(0,0,0,0.15), inset 0 1.5px 0 rgba(255,255,255,1), inset 0 -2.5px 0 rgba(0,0,0,0.1)",
                        }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                        <ShoppingBag className="w-4 h-4 text-emerald-600 relative z-10" />
                        <span className="relative z-10">Add To Cart</span>
                      </button>

                      <button
                        onClick={() => {
                          handleAddToCart();
                          toggleCartDrawer(true);
                        }}
                        className="w-full sm:w-auto flex-1 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs transform active:translate-y-0.5 relative overflow-hidden border border-emerald-400/30"
                        style={{
                          background: "linear-gradient(180deg, #34D399 0%, #10B981 50%, #059669 100%)",
                          boxShadow: "0 8px 22px -2px rgba(16, 185, 129, 0.5), inset 0 1.5px 0 rgba(255, 255, 255, 0.5), inset 0 -3px 0 rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                        <Zap className="w-4 h-4 text-amber-300 fill-amber-300 relative z-10" />
                        <span className="relative z-10">Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* TABS: Description, Specs, Reviews, Shipping */}
          <div className="mt-20 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pt-12">
            
            {/* Tab Headers */}
            <div className="flex border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-4 gap-8 overflow-x-auto">
              {([
                { id: "description", name: "Overview & Craft", icon: FileText },
                { id: "specs", name: "Dimensions & Materials", icon: Shield },
                { id: "reviews", name: `Customer Reviews (${product.reviews?.length || 0})`, icon: Star },
                { id: "shipping", name: "Shipping & Returns", icon: Truck },
              ] as const).map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 text-xs font-bold pb-2 transition-all relative shrink-0 ${
                      isActive ? "text-accent-teal" : "text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 hover:text-[#1F1B16] dark:hover:text-[#F7F3EC]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 w-full h-[2.5px] bg-accent-teal rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="py-8 min-h-[200px]">
              {activeTab === "description" && (
                <div className="max-w-3xl text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 text-sm leading-relaxed flex flex-col gap-4">
                  <p className="text-base font-medium">{product.description}</p>
                  <p>Each order is handcrafted individually to maintain joinery accuracy and quality. We apply premium food-safe wood wax oils to highlight the natural golden glow of teak timber.</p>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="max-w-2xl text-xs text-[#1F1B16] dark:text-[#F7F3EC] flex flex-col gap-3 font-semibold">
                  <div className="flex justify-between py-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                    <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-bold uppercase tracking-wider">Dimensions</span>
                    <span className="font-mono">{product.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                    <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-bold uppercase tracking-wider">Wood Type</span>
                    <span>{product.woodType}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                    <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-bold uppercase tracking-wider">Weight</span>
                    <span className="font-mono">{product.weight}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                    <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-bold uppercase tracking-wider">Assembly</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Fully assembled on delivery</span>
                  </div>
                </div>
              )}

              {/* REVIEWS TAB & SUBMISSION FORM */}
              {activeTab === "reviews" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Existing Reviews */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((rev) => (
                        <div key={rev.id} className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-accent-teal/10 text-accent-teal flex items-center justify-center font-bold text-xs">
                                <User className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]">{rev.author}</h5>
                                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 font-mono">{rev.date}</span>
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className="w-4 h-4 shrink-0"
                                viewBox="0 0 24 24"
                                fill={i < rev.rating ? "#F59E0B" : "none"}
                                stroke={i < rev.rating ? "#F59E0B" : "#D1D5DB"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>

                          <p className="text-xs text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 leading-relaxed font-medium">
                            &quot;{rev.comment}&quot;
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-white dark:bg-[#1C1814] rounded-2xl border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-xs text-[#1F1B16]/50">
                        No reviews yet. Be the first to leave a review!
                      </div>
                    )}
                  </div>

                  {/* Right Column: Write a Review Form */}
                  <div className="lg:col-span-5 bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-6 shadow-sm space-y-4">
                    <h4 className="font-serif text-lg font-bold text-[#1F1B16] dark:text-[#F7F3EC] flex items-center gap-2">
                      <MessageSquarePlus className="w-4 h-4 text-accent-teal" /> Write a Customer Review
                    </h4>

                    <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder="e.g. Subhakanta Jena"
                          className="w-full bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                          Rating Rating *
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1 transition-transform hover:scale-125 focus:outline-none"
                            >
                              <svg
                                className="w-5 h-5 shrink-0"
                                viewBox="0 0 24 24"
                                fill={star <= reviewRating ? "#F59E0B" : "none"}
                                stroke={star <= reviewRating ? "#F59E0B" : "#D1D5DB"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                          Your Review *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Describe the timber finish, durability, and delivery experience..."
                          className="w-full bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-medium text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                      >
                        Submit Verified Review
                      </button>
                    </form>
                  </div>

                </div>
              )}

              {activeTab === "shipping" && (
                <div className="max-w-3xl text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 text-xs md:text-sm leading-relaxed flex flex-col gap-4 font-medium">
                  <p><strong>Bhubaneswar & Cuttack:</strong> Free white-glove studio delivery within 3–5 working days.</p>
                  <p><strong>Rest of Odisha:</strong> Local freight carrier delivery with transit crates.</p>
                  <p><strong>B2B Logistics:</strong> Commercial bulk logistics handled via national cargo networks.</p>
                  <p><strong>Structural Warranty:</strong> Lifetime structural warranty covering solid wood joinery.</p>
                </div>
              )}
            </div>

          </div>

          {/* SIMILAR PRODUCT SUGGESTIONS (YOU MAY ALSO LIKE) */}
          <div className="mt-20 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pt-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-teal bg-accent-teal/10 px-3 py-1 rounded-full inline-block mb-2">
                  Handcrafted Alternatives
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
                  You May Also Like
                </h3>
              </div>
              <a
                href="/spaces/home"
                className="text-xs font-bold text-accent-teal hover:underline flex items-center gap-1.5 self-start sm:self-auto"
              >
                Browse Full Catalog <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {storeProducts
                .filter((p) => p.id !== product.id && p.status === "active")
                .slice(0, 4)
                .map((item) => (
                  <a
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="group glass-panel rounded-3xl p-2.5 sm:p-3.5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] w-full bg-[#FAF7F2] dark:bg-[#12100E] rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex-1 mt-3 sm:mt-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-accent-teal uppercase tracking-widest block mb-0.5">
                          {item.category}
                        </span>
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1F1B16] dark:text-[#F7F3EC] group-hover:text-accent-teal transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#1F1B16]/5 dark:border-[#F7F3EC]/10">
                        <span className="font-mono font-extrabold text-xs sm:text-sm text-[#1F1B16] dark:text-[#F7F3EC]">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-[10px] font-bold text-accent-teal flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          View &rarr;
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
}

