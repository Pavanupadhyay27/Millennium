"use client";

import React, { useState, useMemo, useRef } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import {
  Search,
  Upload,
  Trash2,
  AlertTriangle,
  Plus,
  Minus,
  Save,
  Send,
  FileSpreadsheet,
  CheckCircle,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

// Mock Product catalog with B2B Wholesale base rates and variants mapping
const CATALOG_PRODUCTS = [
  { id: "p1", name: "Odisha Teak Lounge Chair", sku: "OD-TEAK-CHAIR", wholesalePrice: 18500, bg: "bg-pastel-mint", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=200", colors: ["Natural Wood", "Charcoal Black", "Sage Green"] },
  { id: "p2", name: "Konark Rattan Easy Armchair", sku: "KN-RATTAN-ARM", wholesalePrice: 11000, bg: "bg-pastel-butter", image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=200", colors: ["Natural Wood"] },
  { id: "p3", name: "Mahanadi Teak Bench", sku: "MH-TEAK-BENCH", wholesalePrice: 16000, bg: "bg-pastel-mint", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=200", colors: ["Natural Wood"] },
  { id: "p4", name: "Bhubaneswar Boucle Sofa", sku: "BB-BOUCLE-SOFA", wholesalePrice: 65000, bg: "bg-pastel-blush", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200", colors: ["Cream", "Charcoal Black"] },
  { id: "p6", name: "Kalinga Walnut Coffee Table", sku: "KL-WALNUT-TAB", wholesalePrice: 14000, bg: "bg-pastel-blush", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=200", colors: ["Natural Walnut", "Ebonized Oak"] },
  { id: "p7", name: "Dhauli Marble Nested Table", sku: "DH-MARBLE-TAB", wholesalePrice: 9800, bg: "bg-pastel-mint", image: "https://images.unsplash.com/photo-1551215934-37d0573d6622?auto=format&fit=crop&q=80&w=200", colors: ["Cream"] },
  { id: "p10", name: "Bhubaneswar Oak Sideboard", sku: "BB-OAK-BOARD", wholesalePrice: 36000, bg: "bg-pastel-lavender", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=200", colors: ["Natural Wood"] },
  { id: "p13", name: "Konark Terracotta Table Lamp", sku: "KN-TERRA-LAMP", wholesalePrice: 3200, bg: "bg-pastel-butter", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=200", colors: ["Terracotta"] }
];

interface OrderItem {
  id: string; // unique row id
  productId: string;
  name: string;
  sku: string;
  wholesalePrice: number;
  bg: string;
  image: string;
  selectedColor: string;
  quantity: number;
}

// Helper to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function BulkOrderBuilderPage() {
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: "row-1",
      productId: "p1",
      name: "Odisha Teak Lounge Chair",
      sku: "OD-TEAK-CHAIR",
      wholesalePrice: 18500,
      bg: "bg-pastel-mint",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=200",
      selectedColor: "Natural Wood",
      quantity: 5,
    },
    {
      id: "row-2",
      productId: "p6",
      name: "Kalinga Walnut Coffee Table",
      sku: "KL-WALNUT-TAB",
      wholesalePrice: 14000,
      bg: "bg-pastel-blush",
      image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=200",
      selectedColor: "Natural Walnut",
      quantity: 2,
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search Results Matcher
  const filteredCatalog = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return CATALOG_PRODUCTS.filter(
      (prod) =>
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleAddItem = (prod: typeof CATALOG_PRODUCTS[0]) => {
    // Check if item with same product and first color is already present
    const existingIndex = items.findIndex(
      (item) => item.productId === prod.id && item.selectedColor === prod.colors[0]
    );

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      setItems(updated);
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: `row-${Date.now()}`,
          productId: prod.id,
          name: prod.name,
          sku: prod.sku,
          wholesalePrice: prod.wholesalePrice,
          bg: prod.bg,
          image: prod.image,
          selectedColor: prod.colors[0],
          quantity: 1,
        },
      ]);
    }
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleQtyChange = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const handleColorChange = (id: string, color: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selectedColor: color } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // CSV Import Parser
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/);
      
      const newItems: OrderItem[] = [];
      const errors: string[] = [];

      lines.forEach((line, index) => {
        // Skip header or empty lines
        if (index === 0 && line.toLowerCase().includes("sku")) return;
        if (!line.trim()) return;

        const parts = line.split(",");
        if (parts.length < 2) {
          errors.push(`Row ${index + 1}: Invalid format. Expected 'sku, quantity'.`);
          return;
        }

        const sku = parts[0].trim().toUpperCase();
        const qty = parseInt(parts[1].trim(), 10);

        if (isNaN(qty) || qty <= 0) {
          errors.push(`Row ${index + 1}: Invalid quantity '${parts[1]}'. Must be positive integer.`);
          return;
        }

        // Validate SKU against catalog
        const match = CATALOG_PRODUCTS.find((p) => p.sku === sku);
        if (!match) {
          errors.push(`Row ${index + 1}: Unrecognized SKU '${sku}'.`);
          return;
        }

        newItems.push({
          id: `row-${Date.now()}-${index}`,
          productId: match.id,
          name: match.name,
          sku: match.sku,
          wholesalePrice: match.wholesalePrice,
          bg: match.bg,
          image: match.image,
          selectedColor: match.colors[0],
          quantity: qty,
        });
      });

      if (newItems.length > 0) {
        // Merge with existing items (matching product and color)
        setItems((prev) => {
          const merged = [...prev];
          newItems.forEach((newItem) => {
            const matchIdx = merged.findIndex(
              (m) => m.productId === newItem.productId && m.selectedColor === newItem.selectedColor
            );
            if (matchIdx > -1) {
              merged[matchIdx].quantity += newItem.quantity;
            } else {
              merged.push(newItem);
            }
          });
          return merged;
        });
        showSuccessMessage(`Imported ${newItems.length} lines successfully.`);
      }

      setCsvErrors(errors);
      // Reset input element
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const showSuccessMessage = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => {
      setActionSuccess(null);
    }, 4000);
  };

  // Order Summary Calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.wholesalePrice * item.quantity, 0);
  }, [items]);

  // Volume discount tiers:
  // Tier 1: 5% off over 1,50,000
  // Tier 2: 10% off over 4,00,000
  const discountDetails = useMemo(() => {
    if (subtotal >= 400000) {
      return { rate: 0.1, value: subtotal * 0.1, nextTier: null, progress: 100, label: "10% Gold Tier Applied" };
    }
    if (subtotal >= 150000) {
      const remaining = 400000 - subtotal;
      const progress = ((subtotal - 150000) / 250000) * 100;
      return {
        rate: 0.05,
        value: subtotal * 0.05,
        nextTier: 400000,
        remaining,
        progress,
        label: "5% Silver Tier Applied",
      };
    }
    const remaining = 150000 - subtotal;
    const progress = (subtotal / 150000) * 100;
    return {
      rate: 0,
      value: 0,
      nextTier: 150000,
      remaining,
      progress,
      label: "No Tier Discount",
    };
  }, [subtotal]);

  const estShipping = subtotal > 0 ? (subtotal > 200000 ? 0 : 3500) : 0; // Free above 2L
  const total = subtotal - discountDetails.value + estShipping;

  const handleOrderSubmission = () => {
    if (items.length === 0) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cream font-sans selection:bg-accent-teal/20 selection:text-charcoal flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Order Area */}
        <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24">
          
          {/* Breadcrumb / Title */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal/5 pb-6 mb-10">
            <div>
              <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-widest mb-1.5">
                Logged in as: Mohapatra Interiors (Wholesale)
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal">
                Bulk Order Builder
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* CSV Upload button */}
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleCsvUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="border border-charcoal/20 bg-cream text-charcoal rounded-full px-5 py-2.5 text-xs font-bold flex items-center gap-2 hover:bg-charcoal hover:text-cream transition-colors"
              >
                <Upload className="w-4 h-4" /> Import CSV (SKU, Qty)
              </button>
            </div>
          </div>

          {/* Alert messages */}
          <AnimatePresence>
            {actionSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-accent-teal text-cream rounded-2xl p-4 text-sm font-semibold mb-6 flex items-center gap-2 shadow-warm-sm"
              >
                <CheckCircle className="w-5 h-5" /> {actionSuccess}
              </motion.div>
            )}
            {csvErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-accent-terracotta/10 border border-accent-terracotta/20 text-accent-terracotta rounded-2xl p-4 text-xs font-semibold mb-6 flex flex-col gap-2 shadow-warm-sm"
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <AlertTriangle className="w-4 h-4" /> CSV Import Validation Flags:
                </div>
                <ul className="list-disc list-inside pl-2">
                  {csvErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: Spreadsheet Order Table (takes 8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Search Bar to Add Products */}
                <div className="relative">
                  <div className="relative flex items-center bg-cream border border-charcoal/10 rounded-full px-5 py-3 shadow-warm-sm">
                    <Search className="w-4 h-4 text-charcoal/40 mr-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchResults(true);
                      }}
                      placeholder="Quick add: search by product name or SKU (e.g. OD-TEAK-CHAIR)..."
                      className="bg-transparent text-charcoal text-xs focus:outline-none w-full"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearchResults(false);
                        }}
                        className="text-xs font-bold text-charcoal/40 hover:text-charcoal"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {showSearchResults && filteredCatalog.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-cream border border-charcoal/10 shadow-warm-lg rounded-2xl mt-2 overflow-hidden z-30 max-h-60 overflow-y-auto">
                      {filteredCatalog.map((prod) => (
                        <button
                          key={prod.id}
                          onClick={() => handleAddItem(prod)}
                          className="w-full text-left px-5 py-3.5 hover:bg-charcoal/5 border-b border-charcoal/5 flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={prod.image} alt={prod.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <p className="font-bold text-charcoal leading-none mb-1">{prod.name}</p>
                              <p className="text-[10px] text-charcoal/40 uppercase">{prod.sku}</p>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-charcoal">
                            {formatPrice(prod.wholesalePrice)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Table card */}
                <div className="bg-cream border border-charcoal/10 rounded-[28px] overflow-hidden shadow-warm-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-charcoal/[0.02] border-b border-charcoal/10 text-[10px] font-extrabold uppercase tracking-widest text-charcoal/45">
                          <th className="py-4 px-6">Product details</th>
                          <th className="py-4 px-4">Variant (Color)</th>
                          <th className="py-4 px-4 text-right">Unit Rate</th>
                          <th className="py-4 px-4 text-center">Quantity</th>
                          <th className="py-4 px-4 text-right">Subtotal</th>
                          <th className="py-4 px-6 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-charcoal/5">
                        {items.length > 0 ? (
                          items.map((item) => {
                            const catalogItem = CATALOG_PRODUCTS.find((p) => p.id === item.productId);
                            const availableColors = catalogItem?.colors || [item.selectedColor];
                            
                            return (
                              <tr key={item.id} className="text-xs group hover:bg-charcoal/[0.01] transition-colors">
                                {/* Thumbnail and Details */}
                                <td className="py-4 px-6 flex items-center gap-4">
                                  <div className={`${item.bg} w-11 h-11 rounded-xl overflow-hidden p-1 flex items-center justify-center shadow-warm-sm flex-shrink-0`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-charcoal leading-tight mb-0.5">{item.name}</h4>
                                    <p className="font-mono text-[9px] text-charcoal/40 uppercase leading-none">{item.sku}</p>
                                  </div>
                                </td>

                                {/* Color Dropdown */}
                                <td className="py-4 px-4">
                                  {availableColors.length > 1 ? (
                                    <select
                                      value={item.selectedColor}
                                      onChange={(e) => handleColorChange(item.id, e.target.value)}
                                      className="border border-charcoal/10 rounded-full px-3 py-1.5 text-[10px] font-bold bg-cream text-charcoal focus:outline-none cursor-pointer"
                                    >
                                      {availableColors.map((color) => (
                                        <option key={color} value={color}>
                                          {color}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span className="text-[10px] font-bold text-charcoal/60 px-2 py-1 bg-charcoal/5 rounded-full">
                                      {item.selectedColor}
                                    </span>
                                  )}
                                </td>

                                {/* Monospace Unit wholesale Price */}
                                <td className="py-4 px-4 text-right font-mono font-semibold text-charcoal tabular-nums">
                                  {formatPrice(item.wholesalePrice)}
                                </td>

                                {/* Quantity Increments */}
                                <td className="py-4 px-4">
                                  <div className="flex items-center justify-center bg-charcoal/5 border border-charcoal/10 rounded-full p-1 max-w-[100px] mx-auto">
                                    <button
                                      onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                      className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-charcoal/10 text-charcoal"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <input
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value, 10) || 1)}
                                      className="w-8 text-center bg-transparent focus:outline-none font-bold text-xs"
                                    />
                                    <button
                                      onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                      className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-charcoal/10 text-charcoal"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>

                                {/* Monospace Line Subtotal */}
                                <td className="py-4 px-4 text-right font-mono font-bold text-charcoal tabular-nums">
                                  {formatPrice(item.wholesalePrice * item.quantity)}
                                </td>

                                {/* Remove Button */}
                                <td className="py-4 px-6 text-center">
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal/40 hover:bg-accent-terracotta/10 hover:text-accent-terracotta transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-16 text-center text-charcoal/40 font-serif">
                              No items added yet. Search products above or import a CSV file.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CSV Format Helper Info */}
                <div className="bg-charcoal/[0.02] border border-charcoal/5 rounded-2xl p-5 text-xs text-charcoal/60 leading-relaxed flex items-start gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-charcoal mb-1">CSV Template Format</h5>
                    <p>Format your bulk ordering CSV file with two columns: <code>sku, quantity</code> (comma-separated, without header). For example:</p>
                    <pre className="bg-cream border border-charcoal/10 rounded-lg p-2.5 mt-2 font-mono text-[10px] text-charcoal font-semibold">
                      OD-TEAK-CHAIR, 10{"\n"}
                      KL-WALNUT-TAB, 4{"\n"}
                      BB-BOUCLE-SOFA, 2
                    </pre>
                  </div>
                </div>

              </div>

              {/* RIGHT: Live Summary Card (takes 4 cols) */}
              <div className="lg:col-span-4 sticky top-28">
                <div className="bg-cream border border-charcoal/10 rounded-[28px] p-6 md:p-8 shadow-warm-lg">
                  <h3 className="font-serif text-xl font-bold text-charcoal mb-6 pb-4 border-b border-charcoal/5">
                    Order Summary
                  </h3>

                  {/* Summary Rows */}
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex justify-between items-center text-xs font-semibold text-charcoal/60">
                      <span>Bulk Items Subtotal</span>
                      <span className="font-mono text-charcoal tabular-nums">{formatPrice(subtotal)}</span>
                    </div>

                    {/* Tier Discount Display */}
                    <div className="flex justify-between items-center text-xs font-semibold text-charcoal/60">
                      <span>Volume Discount</span>
                      <span className="font-mono text-accent-teal tabular-nums">
                        {discountDetails.rate > 0 ? `-${formatPrice(discountDetails.value)}` : "₹0"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-semibold text-charcoal/60">
                      <span>Estimated Shipping</span>
                      <span className="font-mono text-charcoal tabular-nums">
                        {estShipping > 0 ? formatPrice(estShipping) : "Free (Bhubaneswar)"}
                      </span>
                    </div>
                  </div>

                  {/* B2B Dynamic Discount Progress Bar */}
                  <div className="bg-charcoal/[0.02] border border-charcoal/5 rounded-2xl p-4 mb-6">
                    <div className="flex justify-between text-[10px] font-bold text-charcoal/70 mb-2">
                      <span>{discountDetails.label}</span>
                      {discountDetails.nextTier && (
                        <span>Next Tier: {formatPrice(discountDetails.nextTier)}</span>
                      )}
                    </div>
                    
                    {/* Progress Track */}
                    <div className="w-full h-2.5 bg-charcoal/10 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-accent-teal transition-all duration-500"
                        style={{ width: `${discountDetails.progress}%` }}
                      />
                    </div>

                    {discountDetails.nextTier && (
                      <p className="text-[9px] text-charcoal/40 italic leading-none">
                        Add {formatPrice(discountDetails.remaining)} more to claim higher discount tier.
                      </p>
                    )}
                  </div>

                  {/* Grand Total */}
                  <div className="flex justify-between items-end border-t border-charcoal/5 pt-6 mb-8">
                    <span className="text-xs font-bold text-charcoal uppercase tracking-wider mb-0.5">Est. Total</span>
                    <span className="font-mono text-2xl font-extrabold text-charcoal tabular-nums leading-none">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleOrderSubmission}
                      disabled={items.length === 0}
                      className="w-full bg-charcoal text-cream font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-charcoal-light hover:shadow-warm-md hover:-translate-y-0.5 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
                    >
                      <Send className="w-4 h-4" /> Submit Order for Approval
                    </button>
                    
                    <button
                      onClick={() => showSuccessMessage("Wholesale order draft saved successfully.")}
                      disabled={items.length === 0}
                      className="w-full border border-charcoal/30 text-charcoal font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-charcoal hover:text-cream hover:-translate-y-0.5 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
                    >
                      <Save className="w-4 h-4" /> Save as Draft
                    </button>
                  </div>

                  <div className="text-[10px] text-charcoal/40 text-center leading-relaxed mt-4">
                    Orders require account manager validation in Bhubaneswar before GST invoice release.
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center max-w-xl mx-auto bg-cream-light border border-charcoal/10 rounded-[32px] p-8 md:p-12 shadow-warm-lg">
              <CheckCircle className="w-16 h-16 text-accent-teal mb-6 animate-bounce" />
              <h3 className="font-serif text-3xl font-bold text-charcoal mb-4">
                Bulk Order Submitted
              </h3>
              <p className="text-charcoal/60 text-sm leading-relaxed mb-8">
                Your bulk purchase order of <strong>{items.reduce((sum, i) => sum + i.quantity, 0)} items</strong> has been submitted. 
                Our account manager in Bhubaneswar will verify inventory levels and release the proforma GST invoice shortly.
              </p>
              
              <div className="w-full bg-cream border border-charcoal/10 rounded-2xl p-5 text-left text-xs text-charcoal/70 flex flex-col gap-2.5 mb-8 shadow-warm-sm">
                <p><strong>Subtotal:</strong> {formatPrice(subtotal)}</p>
                <p><strong>Volume Discount:</strong> -{formatPrice(discountDetails.value)}</p>
                <p><strong>Total Value:</strong> <span className="font-bold text-charcoal font-mono">{formatPrice(total)}</span></p>
                <p><strong>Order Status:</strong> <span className="font-bold text-accent-teal uppercase">PENDING APPROVAL</span></p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href="/wholesale/orders"
                  className="flex-1 bg-charcoal text-cream font-bold py-3.5 rounded-full text-center hover:bg-charcoal-light hover:shadow-warm-md transition-all"
                >
                  View Order History
                </a>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setItems([]);
                  }}
                  className="flex-1 border border-charcoal/30 text-charcoal font-bold py-3.5 rounded-full hover:bg-charcoal hover:text-cream transition-all"
                >
                  Create New Order
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
      <Footer />
    </div>
  );
}
