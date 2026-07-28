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
    description: string;
    colors: string[];
    materials: string[];
    seoTitle: string;
    seoDescription: string;
    image: string;
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
    description: "",
    colors: ["Natural Wood"],
    materials: ["Teak Wood"],
    seoTitle: "",
    seoDescription: "",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=200",
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
      description: "",
      colors: ["Natural Wood"],
      materials: ["Teak Wood"],
      seoTitle: "",
      seoDescription: "",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=200",
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
      description: p.description || "",
      colors: p.colors || ["Natural Wood"],
      materials: p.materials || ["Teak Wood"],
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
      image: p.image,
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
          <div className="bg-white border border-[#1F1B16]/10 rounded-[28px] overflow-hidden shadow-warm-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1F1B16]/[0.01] border-b border-[#1F1B16]/10 text-[9px] font-bold uppercase tracking-wider text-[#1F1B16]/40">
                    <th className="py-4 px-6 text-center w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded accent-accent-teal cursor-pointer"
                      />
                    </th>
                    <th className="py-4 px-4">Item details</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4 text-right">Retail Rate</th>
                    <th className="py-4 px-4 text-right">Wholesale Rate</th>
                    <th className="py-4 px-4 text-center">Stock</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1B16]/5">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => {
                      const isChecked = selectedIds.includes(p.id);
                      return (
                        <tr key={p.id} className={`text-xs hover:bg-[#1F1B16]/[0.005] ${isChecked ? "bg-accent-teal/5" : ""}`}>
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
                          <td className="py-4 px-4 flex items-center gap-4">
                            <div className={`${p.bg} w-11 h-11 rounded-xl overflow-hidden p-1 flex items-center justify-center shadow-warm-sm flex-shrink-0`}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div>
                              <h4 className="font-bold text-[#1F1B16] leading-tight mb-0.5">{p.name}</h4>
                              <p className="font-mono text-[9px] text-[#1F1B16]/40 uppercase leading-none">{p.slug}</p>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-4 font-bold text-[#1F1B16]/60">
                            {p.category}
                          </td>

                          {/* Retail Price */}
                          <td className="py-4 px-4 text-right font-mono font-bold text-[#1F1B16] tabular-nums">
                            {formatPrice(p.price)}
                          </td>

                          {/* Wholesale Price */}
                          <td className="py-4 px-4 text-right font-mono font-bold text-accent-teal tabular-nums">
                            {formatPrice(p.wholesalePrice)}
                          </td>

                          {/* Stock level */}
                          <td className="py-4 px-4 text-center">
                            <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                              p.stock <= 2 ? "text-accent-terracotta bg-accent-terracotta/10" : "text-[#1F1B16]/60 bg-[#1F1B16]/5"
                            }`}>
                              {p.stock}
                            </span>
                          </td>

                          {/* Active / Draft Status */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => toggleStatus(p.id)}
                              className={`px-3 py-1 border rounded-full text-[9px] font-extrabold uppercase transition-all ${
                                p.status === "active"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-charcoal/10 text-charcoal/80 border-charcoal/15"
                              }`}
                            >
                              {p.status}
                            </button>
                          </td>

                          {/* Action triggers */}
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[#1F1B16]/50 hover:bg-[#1F1B16]/5"
                                title="Edit specs"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRow(p.id)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50"
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
                      <td colSpan={8} className="py-16 text-center text-[#1F1B16]/40 font-serif">
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
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: parseInt(e.target.value, 10) || 0 }))}
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
                  value={formData.wholesalePrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wholesalePrice: parseInt(e.target.value, 10) || 0 }))}
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
                  value={formData.stock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] focus:outline-none focus:border-accent-teal"
                />
              </div>
            </div>

            {/* 3. Product Media & File Manager Upload */}
            <div className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-bold text-[#1F1B16] dark:text-[#F7F3EC] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-accent-teal" /> Product Media & Local File Upload
                </h4>
                <span className="text-[10px] font-bold text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">PNG, JPG, WebP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Native File Upload Trigger */}
                <label className="border-2 border-dashed border-accent-teal/40 bg-white dark:bg-[#1C1814] rounded-2xl p-5 text-center flex flex-col items-center justify-center cursor-pointer hover:border-accent-teal transition-all group shadow-sm">
                  <Upload className="w-8 h-8 text-accent-teal mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]">Open File Manager to Choose Image</span>
                  <span className="text-[10px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 mt-1">Select furniture photo from your computer</span>
                  
                  {/* Hidden Native File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      showToast(`Uploading ${file.name} to Cloudinary...`);

                      try {
                        const uploadData = new FormData();
                        uploadData.append("file", file);

                        const res = await fetch("/api/upload", {
                          method: "POST",
                          body: uploadData,
                        });
                        const data = await res.json();

                        if (data.url) {
                          setFormData((prev) => ({ ...prev, image: data.url }));
                          showToast(`Image uploaded & saved permanently!`);
                        } else {
                          showToast(`Upload failed, fallback enabled.`);
                        }
                      } catch {
                        const localUrl = URL.createObjectURL(file);
                        setFormData((prev) => ({ ...prev, image: localUrl }));
                        showToast(`Saved local preview.`);
                      }
                    }}
                  />
                </label>

                {/* Current Image Preview Card */}
                <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-accent-teal/10 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">Active Main Image</span>
                    <p className="text-[11px] font-mono truncate text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">{formData.image}</p>
                  </div>
                </div>
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
    </div>
  );
}
