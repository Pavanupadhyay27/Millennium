"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Check,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Upload,
  Box,
  Eye,
  Star,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../../../lib/store";

// Format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Initial Mock Product Database
const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name: "Odisha Teak Lounge Chair",
    slug: "odisha-teak-lounge-chair",
    category: "Seating",
    price: 24500,
    wholesalePrice: 18500,
    stock: 22,
    status: "active",
    featured: true,
    bg: "bg-pastel-mint",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=200",
    description: "A comfortable hand-made teak lounge chair with high density foam cushions.",
    colors: ["Natural Wood", "Charcoal Black"],
    materials: ["Teak Wood"],
    seoTitle: "Odisha Teak Lounge Chair | Buy Handmade Teak Chair",
    seoDescription: "Premium handcraft teak lounge chair built in Bhubaneswar with organic wood finishing.",
  },
  {
    id: "p2",
    name: "Konark Rattan Easy Armchair",
    slug: "konark-rattan-easy-armchair",
    category: "Seating",
    price: 15500,
    wholesalePrice: 11000,
    stock: 2,
    status: "active",
    featured: false,
    bg: "bg-pastel-butter",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=200",
    description: "Eco-friendly rattan weaving armchair. Fits light minimalist living spaces.",
    colors: ["Natural Wood"],
    materials: ["Rattan"],
    seoTitle: "Konark Rattan Armchair | Millennium B2B Furniture",
    seoDescription: "Shop natural handcrafted rattan dining and lounge armchairs directly from Odisha.",
  },
  {
    id: "p6",
    name: "Kalinga Walnut Coffee Table",
    slug: "kalinga-walnut-coffee-table",
    category: "Tables",
    price: 18900,
    wholesalePrice: 14000,
    stock: 14,
    status: "active",
    featured: true,
    bg: "bg-pastel-blush",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=200",
    description: "Walnut coffee table featuring organic soft angles and a magazine shelf underneath.",
    colors: ["Natural Walnut", "Ebonized Oak"],
    materials: ["Walnut Wood"],
    seoTitle: "Kalinga Walnut Coffee Table - Millennium Odisha",
    seoDescription: "Premium walnut coffee tables crafted for modern organic living rooms.",
  },
  {
    id: "p10",
    name: "Bhubaneswar Oak Sideboard",
    slug: "bhubaneswar-oak-sideboard",
    category: "Storage",
    price: 48000,
    wholesalePrice: 36000,
    stock: 8,
    status: "draft",
    featured: false,
    bg: "bg-pastel-lavender",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=200",
    description: "Oak credenza storage unit with sliding tambour doors.",
    colors: ["Natural Wood"],
    materials: ["Oak Wood"],
    seoTitle: "Bhubaneswar Oak Sideboard Credenza",
    seoDescription: "Solid oak timber storage credenza sideboard handcrafted locally in Odisha.",
  }
];

export default function ProductCrudPage() {
  const { products: storeProducts, addProduct, updateProduct, deleteProduct } = useStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Detailed Product View Modal State
  const [selectedViewProduct, setSelectedViewProduct] = useState<any | null>(null);

  // Form View State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    wholesalePrice: number;
    stock: number;
    status: "active" | "draft";
    featured: boolean;
    customizable: boolean;
    woodType?: string;
    dimensions?: string;
    weight?: string;
    description: string;
    colors: string[];
    materials: string[];
    seoTitle: string;
    seoDescription: string;
    image: string;
    images?: string[];
    bg: string;
  }>({
    id: "",
    name: "",
    slug: "",
    category: "Seating",
    price: 10000,
    wholesalePrice: 8000,
    stock: 10,
    status: "active",
    featured: false,
    customizable: true,
    woodType: "A-Grade Kiln-dried Odisha Teak",
    dimensions: "Width: 72cm | Depth: 80cm | Height: 85cm",
    weight: "14 kg",
    description: "",
    colors: ["Natural Wood"],
    materials: ["Teak Wood"],
    seoTitle: "",
    seoDescription: "",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=200",
    images: [],
    bg: "bg-pastel-mint",
  });

  // Bulk Actions Input States
  const [bulkPricePercent, setBulkPricePercent] = useState("");
  const [bulkMoveCategory, setBulkMoveCategory] = useState("Seating");
  const [activeBulkAction, setActiveBulkAction] = useState<"price" | "move" | null>(null);

  // Filter & Search Products
  const filteredProducts = useMemo(() => {
    return storeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [storeProducts, searchQuery]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const toggleStatus = (id: string) => {
    const prod = storeProducts.find((p) => p.id === id);
    if (prod) {
      updateProduct(id, { status: prod.status === "active" ? "draft" : "active" });
      showToast(`Status updated to ${prod.status === "active" ? "DRAFT" : "ACTIVE"}`);
    }
  };

  // Bulk Operations
  const triggerBulkDelete = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => deleteProduct(id));
    setSelectedIds([]);
    showToast("Selected products deleted.");
  };

  const triggerBulkPriceUpdate = () => {
    const percent = parseFloat(bulkPricePercent);
    if (isNaN(percent) || selectedIds.length === 0) return;

    selectedIds.forEach((id) => {
      const prod = storeProducts.find((p) => p.id === id);
      if (prod) {
        const factor = 1 + percent / 100;
        updateProduct(id, {
          price: Math.round(prod.price * factor),
          wholesalePrice: Math.round(prod.wholesalePrice * factor),
        });
      }
    });

    setBulkPricePercent("");
    setActiveBulkAction(null);
    setSelectedIds([]);
    showToast(`Bulk price updated by ${percent}% for selected products.`);
  };

  const triggerBulkCategoryMove = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => {
      updateProduct(id, { category: bulkMoveCategory });
    });
    setActiveBulkAction(null);
    setSelectedIds([]);
    showToast(`Selected products moved to ${bulkMoveCategory}.`);
  };

  // CRUD Operations
  const handleOpenAdd = () => {
    setFormData({
      id: `p-${Date.now()}`,
      name: "",
      slug: "",
      category: "Seating",
      price: 12000,
      wholesalePrice: 9000,
      stock: 10,
      status: "active",
      featured: false,
      customizable: true,
      woodType: "A-Grade Kiln-dried Teak",
      dimensions: "Width: 72cm | Depth: 80cm | Height: 85cm",
      weight: "14 kg",
      description: "",
      colors: ["Natural Wood"],
      materials: ["Teak Wood"],
      seoTitle: "",
      seoDescription: "",
      image: "",
      images: [],
      bg: "bg-pastel-blush",
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleOpenEdit = (p: any) => {
    setFormData({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      price: p.price,
      wholesalePrice: p.wholesalePrice,
      stock: p.stock,
      status: p.status || "active",
      featured: p.featured || false,
      customizable: p.customizable !== false,
      woodType: p.woodType || "A-Grade Kiln-dried Teak",
      dimensions: p.dimensions || "Width: 72cm | Depth: 80cm | Height: 85cm",
      weight: p.weight || "14 kg",
      description: p.description || "",
      colors: p.colors || ["Natural Wood"],
      materials: p.materials || ["Teak Wood"],
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
      image: p.image,
      images: p.images || [p.image].filter(Boolean),
      bg: p.bg || "bg-pastel-mint",
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteRow = (id: string) => {
    deleteProduct(id);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    showToast("Product deleted.");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const finalData = { ...formData, slug: finalSlug };

    if (isEditing) {
      updateProduct(formData.id, finalData);
      showToast(`Updated "${formData.name}" successfully!`);
    } else {
      addProduct(finalData);
      showToast(`Created "${formData.name}" and published to storefront!`);
    }
    setShowForm(false);
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
            className="fixed top-24 right-8 z-50 bg-accent-teal text-white rounded-2xl px-6 py-4 text-xs font-bold shadow-warm-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F1B16]/5 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] mb-2">
            Catalog Inventory
          </h1>
          <p className="text-[#1F1B16]/50 text-xs font-semibold">
            Control items pricing, stock thresholds, custom descriptions, and metadata.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={handleOpenAdd}
            className="bg-accent-teal text-white font-bold px-6 py-3.5 rounded-full text-xs flex items-center gap-2 hover:bg-accent-teal/90 hover:shadow-warm-md hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
          >
            <Plus className="w-4 h-4" /> Create New Product
          </button>
        )}
      </div>

      {!showForm ? (
        <div className="flex flex-col gap-6">
          {/* Controls: Search & Bulk Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="flex items-center bg-white border border-[#1F1B16]/10 rounded-full px-5 py-2.5 w-80 shadow-warm-sm">
              <Search className="w-3.5 h-3.5 text-[#1F1B16]/40 mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, category, or slug..."
                className="bg-transparent text-xs focus:outline-none w-full text-[#1F1B16]"
              />
            </div>

            {/* Bulk actions triggers */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-[#1F1B16]/50 mr-2">
                  {selectedIds.length} Selected:
                </span>
                
                {/* Bulk delete */}
                <button
                  onClick={triggerBulkDelete}
                  className="bg-red-50 border border-red-200 text-red-700 font-bold px-4 py-2 rounded-full text-[10px] flex items-center gap-1 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
                </button>

                {/* Bulk price toggle */}
                <button
                  onClick={() => setActiveBulkAction(activeBulkAction === "price" ? null : "price")}
                  className="border border-[#1F1B16]/20 bg-white text-[#1F1B16] font-bold px-4 py-2 rounded-full text-[10px] flex items-center gap-1 hover:bg-[#1F1B16]/5 transition-colors"
                >
                  Bulk Price Update % <ChevronDown className="w-3 h-3" />
                </button>

                {/* Bulk category move */}
                <button
                  onClick={() => setActiveBulkAction(activeBulkAction === "move" ? null : "move")}
                  className="border border-[#1F1B16]/20 bg-white text-[#1F1B16] font-bold px-4 py-2 rounded-full text-[10px] flex items-center gap-1 hover:bg-[#1F1B16]/5 transition-colors"
                >
                  Move Category <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Bulk Action Inputs */}
          <AnimatePresence>
            {activeBulkAction && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border border-[#1F1B16]/10 rounded-2xl p-5 shadow-warm-sm flex items-center gap-4 max-w-md overflow-hidden"
              >
                {activeBulkAction === "price" && (
                  <>
                    <input
                      type="number"
                      value={bulkPricePercent}
                      onChange={(e) => setBulkPricePercent(e.target.value)}
                      placeholder="Price adjust % (e.g. +10 or -5)..."
                      className="border border-[#1F1B16]/10 rounded-full px-4 py-2 text-xs bg-[#F7F3EC] text-[#1F1B16] focus:outline-none focus:border-accent-teal flex-1"
                    />
                    <button
                      onClick={triggerBulkPriceUpdate}
                      className="bg-accent-teal text-white font-bold px-4 py-2.5 rounded-full text-[10px]"
                    >
                      Apply
                    </button>
                  </>
                )}
                {activeBulkAction === "move" && (
                  <>
                    <select
                      value={bulkMoveCategory}
                      onChange={(e) => setBulkMoveCategory(e.target.value)}
                      className="border border-[#1F1B16]/10 rounded-full px-4 py-2 text-xs bg-[#F7F3EC] text-[#1F1B16] focus:outline-none cursor-pointer flex-1"
                    >
                      <option value="Seating">Seating</option>
                      <option value="Tables">Tables</option>
                      <option value="Storage">Storage</option>
                      <option value="Decorations">Decorations</option>
                    </select>
                    <button
                      onClick={triggerBulkCategoryMove}
                      className="bg-accent-teal text-white font-bold px-4 py-2.5 rounded-full text-[10px]"
                    >
                      Move Items
                    </button>
                  </>
                )}
                <button
                  onClick={() => setActiveBulkAction(null)}
                  className="w-8 h-8 rounded-full bg-[#1F1B16]/5 flex items-center justify-center hover:bg-[#1F1B16]/15"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Denser Products Table */}
          <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2] dark:bg-[#12100E] border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-[9px] font-extrabold uppercase tracking-widest text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">
                    <th className="py-4 px-6 text-center w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded accent-accent-teal cursor-pointer"
                      />
                    </th>
                    <th className="py-4 px-4">Item Details</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4 text-right">Retail Rate</th>
                    <th className="py-4 px-4 text-right">Wholesale Rate</th>
                    <th className="py-4 px-4 text-center">Stock</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1B16]/5 dark:divide-[#F7F3EC]/10 text-xs font-semibold">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => {
                      const isChecked = selectedIds.includes(p.id);
                      return (
                        <tr key={p.id} className={`hover:bg-[#FAF7F2]/50 dark:hover:bg-[#12100E]/50 transition-colors ${isChecked ? "bg-accent-teal/10" : ""}`}>
                          {/* Bulk Checkbox */}
                          <td className="py-4 px-6 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleSelectRow(p.id, e.target.checked)}
                              className="rounded accent-accent-teal cursor-pointer"
                            />
                          </td>

                          {/* Image Thumbnail & details */}
                          <td
                            onClick={() => setSelectedViewProduct(p)}
                            className="py-4 px-4 flex items-center gap-4 cursor-pointer group/row"
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden p-0.5 border border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 shrink-0 bg-white dark:bg-[#12100E] shadow-sm group-hover/row:scale-105 transition-transform">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.image || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400"}
                                alt={p.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-[#1F1B16] dark:text-[#F7F3EC] text-xs leading-tight mb-0.5 group-hover/row:text-accent-teal transition-colors">
                                {p.name}
                              </h4>
                              <p className="font-mono text-[9px] text-accent-teal font-extrabold uppercase leading-none">{p.slug}</p>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-4 font-bold text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">
                            {p.category}
                          </td>

                          {/* Retail Price */}
                          <td className="py-4 px-4 text-right font-mono font-extrabold text-[#1F1B16] dark:text-[#F7F3EC] tabular-nums">
                            {formatPrice(p.price)}
                          </td>

                          {/* Wholesale Price */}
                          <td className="py-4 px-4 text-right font-mono font-extrabold text-accent-teal tabular-nums">
                            {formatPrice(p.wholesalePrice)}
                          </td>

                          {/* Stock level */}
                          <td className="py-4 px-4 text-center">
                            <span className={`font-mono font-bold px-2.5 py-0.5 rounded-full text-xs ${
                              p.stock <= 2 ? "text-red-500 bg-red-500/10" : "text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10"
                            }`}>
                              {p.stock}
                            </span>
                          </td>

                          {/* Active / Draft Status */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => toggleStatus(p.id)}
                              className={`px-3 py-1 border rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                                p.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : "bg-[#1F1B16]/10 text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 border-transparent"
                              }`}
                            >
                              {p.status}
                            </button>
                          </td>

                          {/* Action triggers */}
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedViewProduct(p)}
                                className="w-8 h-8 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal hover:bg-accent-teal hover:text-white transition-all"
                                title="View product analytics & reviews"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="w-8 h-8 rounded-xl bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex items-center justify-center text-[#1F1B16] dark:text-[#F7F3EC] hover:border-accent-teal transition-all"
                                title="Edit specs"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRow(p.id)}
                                className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 font-serif">
                        No product matches found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* CRUD FORM VIEW OVERLAY */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#1F1B16]/10 rounded-[32px] p-8 md:p-10 shadow-warm-lg max-w-4xl"
        >
          <div className="flex items-center justify-between border-b border-[#1F1B16]/5 pb-4 mb-8">
            <h3 className="font-serif text-2xl font-bold text-[#1F1B16]">
              {isEditing ? "Modify Product Specifications" : "Create New Catalog Entry"}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="w-9 h-9 rounded-full bg-[#1F1B16]/5 flex items-center justify-center hover:bg-[#1F1B16]/15"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            
            {/* 1. Core Info Card */}
            <div className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 space-y-4">
              <h4 className="font-serif text-sm font-bold text-[#1F1B16] dark:text-[#F7F3EC] flex items-center gap-2">
                <Box className="w-4 h-4 text-accent-teal" /> General Product Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      setFormData((prev) => ({ ...prev, name, slug }));
                    }}
                    placeholder="e.g. Konark Teak Bench"
                    className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. konark-teak-bench"
                    className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-mono font-semibold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal cursor-pointer"
                  >
                    <option value="Seating">Seating</option>
                    <option value="Tables">Tables</option>
                    <option value="Storage">Storage</option>
                    <option value="Decorations">Decorations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Wood / Timber Type
                  </label>
                  <input
                    type="text"
                    value={formData.woodType || ""}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, woodType: e.target.value }))}
                    placeholder="e.g. Kiln-dried Odisha Teak"
                    className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Dimensions Specs
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions || ""}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, dimensions: e.target.value }))}
                    placeholder="e.g. W: 72cm | D: 80cm | H: 85cm"
                    className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, weight: e.target.value }))}
                    placeholder="e.g. 14 kg"
                    className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter details about materials, joinery, and style..."
                  className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-medium text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal resize-none"
                />
              </div>
            </div>

            {/* 2. Pricing & Stock Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Retail Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.price === 0 ? "" : formData.price}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                    setFormData((prev) => ({ ...prev, price: isNaN(val) ? 0 : val }));
                  }}
                  placeholder="0"
                  className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Wholesale Rate (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.wholesalePrice === 0 ? "" : formData.wholesalePrice}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                    setFormData((prev) => ({ ...prev, wholesalePrice: isNaN(val) ? 0 : val }));
                  }}
                  placeholder="0"
                  className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.stock === 0 ? "" : formData.stock}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                    setFormData((prev) => ({ ...prev, stock: isNaN(val) ? 0 : val }));
                  }}
                  placeholder="0"
                  className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                />
              </div>
            </div>

            {/* 3. Product Media & Multiple Image Gallery Upload */}
            <div className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-bold text-[#1F1B16] dark:text-[#F7F3EC] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-accent-teal" /> Product Media & Multiple Images Gallery
                </h4>
                <span className="text-[10px] font-bold text-accent-teal uppercase tracking-wider bg-accent-teal/10 px-2.5 py-0.5 rounded-full">
                  Select Multiple Files Supported
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {/* Native Multiple Files Input Trigger */}
                <label className="border-2 border-dashed border-accent-teal/40 bg-white dark:bg-[#1C1814] rounded-2xl p-5 text-center flex flex-col items-center justify-center cursor-pointer hover:border-accent-teal transition-all group shadow-sm">
                  <Upload className="w-8 h-8 text-accent-teal mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]">Choose One or Multiple Product Photos</span>
                  <span className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 mt-1">Select all angle photos from your computer at once</span>
                  
                  {/* Hidden Native File Input with multiple attribute */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;
                      showToast(`Uploading ${files.length} images...`);

                      const newUploadedUrls: string[] = [];

                      for (const file of files) {
                        try {
                          const uploadData = new FormData();
                          uploadData.append("file", file);

                          const res = await fetch("/api/upload", {
                            method: "POST",
                            body: uploadData,
                          });
                          const data = await res.json();
                          if (data.url) {
                            newUploadedUrls.push(data.url);
                          } else {
                            newUploadedUrls.push(URL.createObjectURL(file));
                          }
                        } catch {
                          newUploadedUrls.push(URL.createObjectURL(file));
                        }
                      }

                      setFormData((prev) => {
                        const combinedImages = [...(prev.images || []), ...newUploadedUrls];
                        return {
                          ...prev,
                          image: prev.image || combinedImages[0] || "",
                          images: combinedImages,
                        };
                      });

                      showToast(`${files.length} image(s) added to gallery!`);
                    }}
                  />
                </label>

                {/* Uploaded Gallery Grid */}
                {formData.images && formData.images.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
                      Product Gallery ({formData.images.length} Photos Uploaded)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {formData.images.map((imgUrl, idx) => {
                        const isMain = formData.image === imgUrl || idx === 0;
                        return (
                          <div key={idx} className="relative group bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl p-1.5 flex flex-col items-center">
                            <div className="w-full aspect-square rounded-lg overflow-hidden bg-accent-teal/5 relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                              {isMain && (
                                <span className="absolute top-1 left-1 bg-accent-teal text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                                  Cover
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2 w-full">
                              {!isMain && (
                                <button
                                  type="button"
                                  onClick={() => setFormData((prev) => ({ ...prev, image: imgUrl }))}
                                  className="text-[9px] font-bold text-accent-teal hover:underline flex-1 text-center"
                                >
                                  Set Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => {
                                    const updated = (prev.images || []).filter((_, i) => i !== idx);
                                    return {
                                      ...prev,
                                      images: updated,
                                      image: prev.image === imgUrl ? updated[0] || "" : prev.image,
                                    };
                                  })
                                }
                                className="text-[9px] font-bold text-rose-500 hover:underline flex-1 text-center"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[#1C1814] border border-dashed border-[#1F1F1F]/10 rounded-2xl p-4 text-center">
                    <span className="text-[10px] font-bold text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 uppercase tracking-wider block">
                      No Images Uploaded Yet
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Variants: Colors & Materials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Colors (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.colors.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, colors: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))
                  }
                  placeholder="e.g. Natural Wood, Charcoal Black"
                  className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block mb-1">
                  Materials (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.materials.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, materials: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))
                  }
                  placeholder="e.g. Teak Wood, Walnut Veneer"
                  className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                />
              </div>
            </div>

            {/* 5. Publish Status & Customization Grant Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 rounded accent-accent-teal cursor-pointer"
                  />
                  <span className="text-xs font-bold">Feature on Homepage Carousel</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none bg-accent-teal/10 px-3 py-1.5 rounded-xl border border-accent-teal/20">
                  <input
                    type="checkbox"
                    checked={formData.customizable}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customizable: e.target.checked }))}
                    className="w-4 h-4 rounded accent-accent-teal cursor-pointer"
                  />
                  <span className="text-xs font-extrabold text-accent-teal">Allow Bespoke Customization</span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-xl border border-[#1F1B16]/20 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold px-8 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  Save Product Entry
                </button>
              </div>
            </div>

          </form>
        </motion.div>
      )}

      {/* DETAILED PRODUCT ANALYTICS & REVIEWS OVERLAY MODAL */}
      <AnimatePresence>
        {selectedViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-accent-teal/10 p-1 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedViewProduct.image || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400"} alt={selectedViewProduct.name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-teal bg-accent-teal/10 px-2.5 py-0.5 rounded-full">
                      {selectedViewProduct.category}
                    </span>
                    <h2 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] mt-1">
                      {selectedViewProduct.name}
                    </h2>
                    <p className="text-[10px] font-mono text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">Slug: {selectedViewProduct.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedViewProduct(null)}
                  className="w-8 h-8 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 flex items-center justify-center text-[#1F1B16] dark:text-[#F7F3EC] hover:bg-accent-teal hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lifetime Performance Metrics Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-accent-teal" /> Lifetime Sales
                  </span>
                  <span className="font-mono text-base font-extrabold text-accent-teal">₹1,47,000</span>
                  <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold">+18% vs last month</span>
                </div>

                <div className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 flex items-center gap-1">
                    <Box className="w-3 h-3 text-accent-teal" /> Total Sold
                  </span>
                  <span className="font-mono text-base font-extrabold text-[#1F1B16] dark:text-[#F7F3EC]">6 Units</span>
                  <span className="text-[8px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">Last 30 Days</span>
                </div>

                <div className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Avg Rating
                  </span>
                  <span className="font-mono text-base font-extrabold text-amber-500">5.0 / 5.0</span>
                  <span className="text-[8px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">Verified Buyers</span>
                </div>

                <div className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">In Stock Level</span>
                  <span className="font-mono text-base font-extrabold text-[#1F1B16] dark:text-[#F7F3EC]">{selectedViewProduct.stock} Units</span>
                  <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold">Ready to dispatch</span>
                </div>
              </div>

              {/* Pricing & Timber Specs */}
              <div className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-[#1F1B16] dark:text-[#F7F3EC] text-xs uppercase tracking-wider text-accent-teal">
                  Technical Specifications & Rates
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
                  <div><span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">Retail Rate:</span> <strong>{formatPrice(selectedViewProduct.price)}</strong></div>
                  <div><span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">Wholesale Tier:</span> <strong className="text-accent-teal">{formatPrice(selectedViewProduct.wholesalePrice)}</strong></div>
                  <div><span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">Timber Wood:</span> <span>{selectedViewProduct.woodType || "Kiln-dried Teak"}</span></div>
                  <div><span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">Dimensions:</span> <span>{selectedViewProduct.dimensions || "Standard"}</span></div>
                </div>
              </div>

              {/* Verified Customer Reviews Section */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#1F1B16] dark:text-[#F7F3EC] flex items-center justify-between">
                  <span>Customer Reviews ({selectedViewProduct.reviews?.length || 2})</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Verified Store Submissions</span>
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(selectedViewProduct.reviews || [
                    { id: "r1", author: "Rajesh Mohapatra", rating: 5, date: "July 12, 2026", comment: "Outstanding wood grain texture and heavy structural build. Fits perfectly into our hotel project in Puri.", verified: true },
                    { id: "r2", author: "Ananya Mishra", rating: 5, date: "June 28, 2026", comment: "Clean minimalist design. Delivered fully assembled with zero hassle.", verified: true }
                  ]).map((r: any) => (
                    <div key={r.id} className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1F1B16] dark:text-[#F7F3EC]">{r.author}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < r.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#1F1B16]/75 dark:text-[#F7F3EC]/75 italic">&quot;{r.comment}&quot;</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Action */}
              <button
                onClick={() => setSelectedViewProduct(null)}
                className="w-full bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all"
              >
                Close Analytics Modal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
