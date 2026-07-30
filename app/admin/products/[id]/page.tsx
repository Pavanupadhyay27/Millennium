"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore, Product } from "../../../../lib/store";
import {
  ArrowLeft,
  Box,
  TrendingUp,
  Star,
  CheckCircle2,
  DollarSign,
  PackageCheck,
  Edit3,
  Trash2,
  Share2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Calendar,
  Layers
} from "lucide-react";
import { motion } from "framer-motion";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function DedicatedAdminProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { products: storeProducts, updateProduct, deleteProduct, orders } = useStore();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Find product from store
  const product = storeProducts.find((p: Product) => p.id === productId || p.slug === productId) || {
    id: productId || "p1",
    name: "Odisha Teak Lounge Chair",
    slug: "odisha-teak-lounge-chair",
    category: "Seating",
    price: 24500,
    wholesalePrice: 18500,
    stock: 22,
    status: "active",
    featured: true,
    bg: "bg-pastel-mint",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600",
    description: "A comfortable hand-made teak lounge chair with high density foam cushions handcrafted locally in Odisha.",
    woodType: "A-Grade Kiln-dried Odisha Teak",
    dimensions: "Width: 72cm | Depth: 80cm | Height: 85cm",
    weight: "14 kg",
    colors: ["Natural Wood", "Charcoal Black"],
    materials: ["Teak Wood"],
    reviews: [
      { id: "r1", author: "Rajesh Mohapatra", rating: 5, date: "July 12, 2026", comment: "Outstanding wood grain texture and heavy structural build. Fits perfectly into our hotel project in Puri.", verified: true },
      { id: "r2", author: "Ananya Mishra", rating: 5, date: "June 28, 2026", comment: "Clean minimalist design. Delivered fully assembled with zero hassle.", verified: true }
    ],
  };

  // Calculate dynamic sales data
  const productOrders = (orders || []).flatMap((order) => 
    order.items
      .filter((item) => item.name === product.name)
      .map((item) => ({ ...item, orderStatus: order.status }))
  );
  
  const totalUnitsSold = productOrders.reduce((sum, item) => sum + item.quantity, 0);
  const lifetimeSales = productOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [stockInput, setStockInput] = useState(product.stock);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleStockUpdate = () => {
    updateProduct(product.id, { stock: stockInput });
    showToast(`Inventory stock level updated to ${stockInput} units!`);
  };

  const toggleStatus = () => {
    const nextStatus = product.status === "active" ? "draft" : "active";
    updateProduct(product.id, { status: nextStatus });
    showToast(`Product status toggled to ${nextStatus.toUpperCase()}`);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      deleteProduct(product.id);
      router.push("/admin/products");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Toast Alert */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-24 right-8 z-50 bg-accent-teal text-white rounded-2xl px-6 py-3.5 text-xs font-bold shadow-2xl flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> {toastMsg}
        </motion.div>
      )}

      {/* Top Header / Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/products")}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex items-center justify-center text-[#1F1B16] dark:text-[#F7F3EC] hover:bg-accent-teal hover:text-white transition-all shadow-sm"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-teal bg-accent-teal/10 px-3 py-1 rounded-full">
              {product.category} Category
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] mt-1">
              {product.name}
            </h1>
            <p className="text-xs font-mono text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">Product ID: {product.id} • Slug: {product.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/product/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] hover:border-accent-teal transition-all flex items-center gap-1.5 shadow-sm"
          >
            Public Preview <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={toggleStatus}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border ${
              product.status === "active"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}
          >
            Status: {product.status}
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all"
            title="Delete Product Entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-accent-teal" /> Lifetime Sales
          </span>
          <p className="font-mono text-2xl font-extrabold text-accent-teal">{formatPrice(lifetimeSales)}</p>
          <span className="text-[9px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 font-bold">Total revenue</span>
        </div>

        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 flex items-center gap-1.5">
            <Box className="w-4 h-4 text-accent-teal" /> Total Units Sold
          </span>
          <p className="font-mono text-2xl font-extrabold text-[#1F1B16] dark:text-[#F7F3EC]">{totalUnitsSold} Units</p>
          <span className="text-[9px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 font-medium">B2B & Retail Combined</span>
        </div>

        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Customer Satisfaction
          </span>
          <p className="font-mono text-2xl font-extrabold text-amber-500">5.0 / 5.0</p>
          <span className="text-[9px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 font-medium">From {product.reviews?.length || 2} verified buyers</span>
        </div>

        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4 text-emerald-500" /> Available Stock
          </span>
          <p className="font-mono text-2xl font-extrabold text-[#1F1B16] dark:text-[#F7F3EC]">{product.stock} Units</p>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">In-Stock Ready</span>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Image Showcase & Technical Specifications (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo Card */}
          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-4 shadow-sm relative overflow-hidden">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-[#12100E] flex items-center justify-center p-4 border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Detailed Specs Breakdown Card */}
          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1F1B16] dark:text-[#F7F3EC] pb-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-teal" /> Timber Craftsmanship & Dimensions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#FAF7F2] dark:bg-[#12100E] p-4 rounded-2xl border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">Wood Species</span>
                <p className="font-bold text-[#1F1B16] dark:text-[#F7F3EC]">{product.woodType || "Kiln-dried Odisha Teak"}</p>
              </div>

              <div className="bg-[#FAF7F2] dark:bg-[#12100E] p-4 rounded-2xl border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">Dimensions (W x D x H)</span>
                <p className="font-bold font-mono text-[#1F1B16] dark:text-[#F7F3EC]">{product.dimensions || "72cm x 80cm x 85cm"}</p>
              </div>

              <div className="bg-[#FAF7F2] dark:bg-[#12100E] p-4 rounded-2xl border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">Net Weight</span>
                <p className="font-bold font-mono text-[#1F1B16] dark:text-[#F7F3EC]">{product.weight || "14 kg"}</p>
              </div>

              <div className="bg-[#FAF7F2] dark:bg-[#12100E] p-4 rounded-2xl border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">Assembly Delivery</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Fully Assembled Pre-Ship</p>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 block mb-1">Product Description</span>
              <p className="text-xs text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 leading-relaxed font-medium bg-[#FAF7F2] dark:bg-[#12100E] p-4 rounded-2xl border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Admin Controls, Pricing & Reviews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Inventory Controls Card */}
          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1F1B16] dark:text-[#F7F3EC] pb-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex items-center gap-2">
              <Box className="w-4 h-4 text-accent-teal" /> Adjust Inventory Level
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Current Stock Units
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={stockInput}
                    onChange={(e) => setStockInput(Number(e.target.value))}
                    className="flex-1 bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                  />
                  <button
                    onClick={handleStockUpdate}
                    className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Tier Card */}
          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1F1B16] dark:text-[#F7F3EC] pb-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent-teal" /> Pricing Tiers & Profit Margin
            </h3>

            <div className="space-y-3 text-xs font-medium">
              <div className="flex justify-between items-center bg-[#FAF7F2] dark:bg-[#12100E] p-3.5 rounded-xl border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5">
                <span className="text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Retail Price (B2C):</span>
                <span className="font-mono font-bold text-sm text-[#1F1B16] dark:text-[#F7F3EC]">{formatPrice(product.price)}</span>
              </div>

              <div className="flex justify-between items-center bg-[#FAF7F2] dark:bg-[#12100E] p-3.5 rounded-xl border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5">
                <span className="text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Wholesale Tier (B2B):</span>
                <span className="font-mono font-bold text-sm text-accent-teal">{formatPrice(product.wholesalePrice)}</span>
              </div>

              <div className="flex justify-between items-center bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                <span className="font-bold">Estimated B2B Margin:</span>
                <span className="font-mono font-extrabold text-sm">+28.4%</span>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Ratings Control */}
          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
              <h3 className="font-serif text-lg font-bold text-[#1F1B16] dark:text-[#F7F3EC] flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Customer Reviews
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {(product.reviews || []).map((r: any) => (
                <div key={r.id} className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-4 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1F1B16] dark:text-[#F7F3EC]">{r.author}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill={i < r.rating ? "#F59E0B" : "none"} stroke={i < r.rating ? "#F59E0B" : "#D1D5DB"} strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 leading-relaxed font-medium">&quot;{r.comment}&quot;</p>
                  <span className="text-[9px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 font-mono block">{r.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
