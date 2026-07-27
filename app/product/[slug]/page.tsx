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
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

// Helper to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

interface ProductColor {
  name: string;
  value: string;
  priceDelta: number;
  imgIdx: number;
}

interface ProductMaterial {
  name: string;
  priceDelta: number;
}

interface DetailedProduct {
  name: string;
  price: number;
  wholesalePrice: number;
  category: string;
  description: string;
  images: string[];
  colors: ProductColor[];
  materials: ProductMaterial[];
  dimensions: string;
  woodType: string;
  weight: string;
}

// Detailed product mocks
const DETAILED_PRODUCTS: Record<string, DetailedProduct> = {
  "odisha-teak-lounge-chair": {
    name: "Odisha Teak Lounge Chair",
    price: 24500,
    wholesalePrice: 18500,
    category: "Seating",
    description:
      "Indulge in mid-century elegance with our signature lounge chair. Handcrafted by local artisans in Bhubaneswar using premium, sustainably harvested solid teak timber. The seat features high-density foam wrapped in a breathable linen-blend fabric, structured with double-mortise joinery to last for generations.",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=800",
    ],
    colors: [
      { name: "Natural Wood", value: "#D97B3F", priceDelta: 0, imgIdx: 0 },
      { name: "Charcoal Black", value: "#1F1B16", priceDelta: 1500, imgIdx: 1 },
      { name: "Sage Green", value: "#2F6F62", priceDelta: 2500, imgIdx: 2 },
    ],
    materials: [
      { name: "Standard Solid Teak", priceDelta: 0 },
      { name: "Premium Aged Walnut", priceDelta: 4500 },
    ],
    dimensions: "Width: 72cm | Depth: 80cm | Height: 85cm | Seat Height: 42cm",
    woodType: "A-Grade Kiln-dried Teak (Tectona grandis)",
    weight: "14 kg",
  },
  "kalinga-walnut-coffee-table": {
    name: "Kalinga Walnut Coffee Table",
    price: 18900,
    wholesalePrice: 14000,
    category: "Tables",
    description:
      "A minimalist centerpiece built for functional spaces. The Kalinga table showcases stunning natural walnut wood grains, detailed with a smooth lacquer finish. Features rounded kid-safe corners and a bottom shelf structure for magazines, books, and remote controls.",
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551215934-37d0573d6622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800",
    ],
    colors: [
      { name: "Natural Walnut", value: "#8B5A2B", priceDelta: 0, imgIdx: 0 },
      { name: "Ebonized Oak", value: "#1F1B16", priceDelta: 1200, imgIdx: 1 },
    ],
    materials: [
      { name: "Walnut Veneer + Solid Birch", priceDelta: 0 },
      { name: "100% Solid Indian Walnut", priceDelta: 6000 },
    ],
    dimensions: "Width: 110cm | Depth: 60cm | Height: 45cm",
    woodType: "Walnut (Juglans regia) & Birch wood legs",
    weight: "18 kg",
  },
};

// Generic Fallback builder if other slug clicked
const getFallbackProduct = (slug: string): DetailedProduct => {
  const cleanName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    name: cleanName,
    price: 32000,
    wholesalePrice: 24000,
    category: "Premium Collections",
    description:
      "A masterclass in furniture craft. This Millennium piece offers custom woodworking, locally sourced raw timber, and tailored finishes, designed to elevate your interior aesthetic.",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=800",
    ],
    colors: [
      { name: "Natural Wood", value: "#D97B3F", priceDelta: 0, imgIdx: 0 },
      { name: "Charcoal Black", value: "#1F1B16", priceDelta: 1800, imgIdx: 1 },
    ],
    materials: [
      { name: "Solid Wood", priceDelta: 0 },
    ],
    dimensions: "Standard living room layout dimensions apply.",
    woodType: "Sustainably harvested local wood",
    weight: "22 kg",
  };
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // Retrieve Mock Product details or fallback
  const product = useMemo(() => {
    return DETAILED_PRODUCTS[slug] || getFallbackProduct(slug);
  }, [slug]);

  // Gallery Active Image Index
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Variant States
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0]);
  const [quantity, setQuantity] = useState(1);

  // Simulation Role State (Dev Mode toggle to show Wholesale Price)
  const [simulatedRole, setSimulatedRole] = useState<"CUSTOMER" | "WHOLESALE">("CUSTOMER");

  // Tab State
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "shipping">("description");

  // Calculate dynamic price based on variants selection
  const calculatedPrice = useMemo(() => {
    const base = simulatedRole === "WHOLESALE" ? product.wholesalePrice : product.price;
    const delta = (selectedColor.priceDelta || 0) + (selectedMaterial.priceDelta || 0);
    return base + delta;
  }, [product, selectedColor, selectedMaterial, simulatedRole]);

  // Handle color change and auto-swap gallery image if color maps to one
  const handleColorChange = (color: ProductColor) => {
    setSelectedColor(color);
    if (color.imgIdx !== undefined && color.imgIdx < product.images.length) {
      setActiveImgIdx(color.imgIdx);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-sans selection:bg-accent-teal/20 selection:text-charcoal flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Product view area */}
        <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24">
          
          {/* Simulated role banner (For testing NextAuth WHOLESALE role requested) */}
          <div className="bg-pastel-lavender/60 border border-charcoal/5 rounded-[20px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 shadow-warm-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-teal"></span>
              </span>
              <p className="text-xs font-semibold text-charcoal/80">
                <span className="font-bold text-accent-teal">NextAuth Role Simulation:</span> Toggle the user role to preview wholesale pricing triggers on this page.
              </p>
            </div>
            <div className="flex bg-cream border border-charcoal/10 rounded-full p-1 text-[10px] font-bold">
              <button
                onClick={() => setSimulatedRole("CUSTOMER")}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  simulatedRole === "CUSTOMER" ? "bg-charcoal text-cream" : "text-charcoal/60"
                }`}
              >
                CUSTOMER
              </button>
              <button
                onClick={() => setSimulatedRole("WHOLESALE")}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  simulatedRole === "WHOLESALE" ? "bg-accent-teal text-white" : "text-charcoal/60"
                }`}
              >
                WHOLESALE
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* LEFT: Gallery (takes 7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Main Image on Pastel Tile with Hover-Zoom */}
              <div className="bg-pastel-mint rounded-[32px] p-6 md:p-8 aspect-[4/3] flex items-center justify-center overflow-hidden shadow-warm-md relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[activeImgIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-[1.04] cursor-zoom-in"
                />
              </div>

              {/* Thumbnails Strip */}
              <div className="flex gap-4">
                {product.images.map((img: string, idx: number) => {
                  const isActive = idx === activeImgIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIdx(idx)}
                      className={`w-20 h-20 rounded-2xl p-1.5 bg-pastel-mint overflow-hidden border-2 transition-all ${
                        isActive ? "border-accent-teal scale-102 shadow-warm-sm" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded-xl" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Product Details (takes 5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-start">
              
              <span className="text-accent-teal text-xs font-extrabold uppercase tracking-widest bg-accent-teal/5 border border-accent-teal/10 rounded-full px-4 py-1.5 mb-4">
                {product.category}
              </span>
              
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight mb-4">
                {product.name}
              </h1>

              {/* Pricing Display */}
              <div className="mb-6 flex flex-col gap-1">
                {simulatedRole === "WHOLESALE" ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-accent-teal">
                        {formatPrice(calculatedPrice)}
                      </span>
                      <span className="text-xs font-bold text-white bg-accent-teal px-2 py-0.5 rounded uppercase tracking-wider">
                        Wholesale Rate
                      </span>
                    </div>
                    <span className="text-xs text-charcoal/40 line-through">
                      Regular Retail: {formatPrice(product.price + (selectedColor.priceDelta || 0))}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-charcoal">
                    {formatPrice(calculatedPrice)}
                  </span>
                )}
                <p className="text-[10px] text-charcoal/50 leading-none">Prices inclusive of GST. Deliveries in Odisha.</p>
              </div>

              <div className="w-full border-t border-charcoal/5 pt-6 mb-6 flex flex-col gap-6">
                
                {/* Variant Selector: Colors */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-3">
                    Color: <span className="text-charcoal font-semibold">{selectedColor.name}</span>
                  </h4>
                  <div className="flex gap-3">
                    {product.colors.map((color: ProductColor) => {
                      const isActive = color.name === selectedColor.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => handleColorChange(color)}
                          title={`${color.name} ${color.priceDelta > 0 ? `(+${formatPrice(color.priceDelta)})` : ""}`}
                          className={`w-8 h-8 rounded-full border shadow-warm-sm flex items-center justify-center transition-all ${
                            isActive ? "ring-2 ring-accent-teal scale-105 border-transparent" : "border-charcoal/10"
                          }`}
                          style={{ backgroundColor: color.value }}
                        >
                          {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Variant Selector: Material */}
                {product.materials.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-3">
                      Material Choice
                    </h4>
                    <div className="relative w-full sm:w-64">
                      <select
                        value={selectedMaterial.name}
                        onChange={(e) => {
                          const matObj = product.materials.find((m: ProductMaterial) => m.name === e.target.value);
                          if (matObj) setSelectedMaterial(matObj);
                        }}
                        className="w-full border border-charcoal/10 rounded-full px-5 py-3 text-xs font-bold bg-cream text-charcoal appearance-none focus:outline-none focus:border-accent-teal cursor-pointer"
                      >
                        {product.materials.map((mat: ProductMaterial) => (
                          <option key={mat.name} value={mat.name}>
                            {mat.name} {mat.priceDelta > 0 ? `(+${formatPrice(mat.priceDelta)})` : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-charcoal/50" />
                    </div>
                  </div>
                )}

                {/* Quantity and Actions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-3">
                    Quantity
                  </h4>
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Stepper */}
                    <div className="flex items-center bg-charcoal/5 border border-charcoal/10 rounded-full p-1.5">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-charcoal/10 text-charcoal transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-charcoal">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-charcoal/10 text-charcoal transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Action buttons */}
                    <button className="flex-1 bg-charcoal text-cream font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-charcoal-light hover:shadow-warm-md hover:-translate-y-0.5 transition-all duration-300">
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>

                  {/* Bulk quote button */}
                  <button className="w-full mt-3 border border-charcoal/30 text-charcoal font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-charcoal hover:text-cream hover:-translate-y-0.5 transition-all duration-300">
                    Request Bulk Quote (B2B)
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* TABS: Description, Specs, Shipping */}
          <div className="mt-20 border-t border-charcoal/5 pt-12">
            
            {/* Tab Headers */}
            <div className="flex border-b border-charcoal/5 pb-4 gap-8">
              {([
                { id: "description", name: "Description", icon: FileText },
                { id: "specs", name: "Dimensions & Materials", icon: Shield },
                { id: "shipping", name: "Shipping & Returns", icon: Truck },
              ] as const).map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 text-sm font-bold pb-2 transition-all relative ${
                      isActive ? "text-accent-teal" : "text-charcoal/55 hover:text-charcoal"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-teal"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="py-8 min-h-[150px]">
              {activeTab === "description" && (
                <div className="max-w-3xl text-charcoal/70 text-sm md:text-base leading-relaxed flex flex-col gap-4">
                  <p>{product.description}</p>
                  <p>Each order is handcrafted individually to maintain joinery accuracy and quality. We apply premium food-safe wood wax oils to highlight the natural golden glow of teak timber.</p>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="max-w-2xl text-sm text-charcoal/80 flex flex-col gap-3">
                  <div className="flex justify-between py-2 border-b border-charcoal/5">
                    <span className="font-bold">Dimensions</span>
                    <span className="text-charcoal/60">{product.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-charcoal/5">
                    <span className="font-bold">Wood Type</span>
                    <span className="text-charcoal/60">{product.woodType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-charcoal/5">
                    <span className="font-bold">Weight</span>
                    <span className="text-charcoal/60">{product.weight}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-charcoal/5">
                    <span className="font-bold">Assembly</span>
                    <span className="text-charcoal/60">Fully assembled on delivery</span>
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="max-w-3xl text-charcoal/70 text-sm md:text-base leading-relaxed flex flex-col gap-4">
                  <p><strong>Bhubaneswar & Cuttack:</strong> Free delivery. Out of studio dispatch takes 3–5 working days.</p>
                  <p><strong>Rest of Odisha:</strong> Delivery charges apply based on shipping weight. Safe transit crates are handled by local freight carriers.</p>
                  <p><strong>Outside Odisha:</strong> B2B bulk logistics handled by national courier cargo networks. Quotations available on request.</p>
                  <p><strong>Returns:</strong> 7-day transit damage replacement. Lifetime structural warranty covers wood splitting or joint loosening.</p>
                </div>
              )}
            </div>

          </div>

          {/* Related products (You may also like) */}
          <div className="mt-24 border-t border-charcoal/5 pt-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
                You May Also Like
              </h2>
              <a href="/spaces/home" className="text-xs font-bold text-accent-teal hover:underline flex items-center gap-1">
                View Spaces <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  name: "Konark Rattan Easy Armchair",
                  slug: "konark-rattan-easy-armchair",
                  price: 15500,
                  bg: "bg-pastel-butter",
                  image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=600",
                },
                {
                  name: "Kalinga Walnut Coffee Table",
                  slug: "kalinga-walnut-coffee-table",
                  price: 18900,
                  bg: "bg-pastel-blush",
                  image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600",
                },
                {
                  name: "Dhauli Marble Nested Table",
                  slug: "dhauli-marble-nested-table",
                  price: 13500,
                  bg: "bg-pastel-mint",
                  image: "https://images.unsplash.com/photo-1551215934-37d0573d6622?auto=format&fit=crop&q=80&w=600",
                },
              ].map((prod) => (
                <div key={prod.slug} className="flex flex-col group cursor-pointer">
                  <a
                    href={`/product/${prod.slug}`}
                    className={`${prod.bg} rounded-[24px] aspect-[4/5] p-6 relative overflow-hidden flex items-center justify-center transition-all duration-500 hover:shadow-warm-lg`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-102 transition-transform duration-500"
                    />
                    <button className="absolute bottom-4 right-4 w-9 h-9 bg-charcoal text-cream rounded-full flex items-center justify-center shadow-warm-md hover:bg-accent-teal transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </a>
                  <div className="mt-4 flex justify-between items-start">
                    <a
                      href={`/product/${prod.slug}`}
                      className="font-serif font-bold text-base text-charcoal group-hover:text-accent-teal transition-colors leading-snug"
                    >
                      {prod.name}
                    </a>
                    <span className="font-semibold text-charcoal text-sm whitespace-nowrap pl-2">
                      {formatPrice(prod.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
}
