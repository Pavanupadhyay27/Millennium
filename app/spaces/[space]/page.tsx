"use client";

import React, { useState, useMemo } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import {
  SlidersHorizontal,
  RotateCcw,
  ShoppingBag,
  ChevronDown,
  Heart,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../../../lib/store";

interface SpaceConfig {
  title: string;
  subtitle: string;
  banner: string;
  tag: string;
}

const SPACE_DETAILS: Record<string, SpaceConfig> = {
  home: {
    title: "Home & Living Spaces",
    subtitle: "Curated sanctuaries designed for tranquility, warmth, and timeless comfort.",
    banner: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600",
    tag: "Residential Collection"
  },
  office: {
    title: "Office & Workspaces",
    subtitle: "Ergonomic executive desks, task chairs, and intelligent workstation solutions.",
    banner: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600",
    tag: "Workplace & Executive"
  },
  commercial: {
    title: "Commercial & Hospitality",
    subtitle: "High-durability solid timber and luxury lounge furniture for hotels, lobbies & venues.",
    banner: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&q=80&w=1600",
    tag: "Contract & Hospitality"
  },
  outdoor: {
    title: "Outdoor & Patio",
    subtitle: "Weather-resistant teak, handwoven rattan, and outdoor relaxation furniture.",
    banner: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1600",
    tag: "Patio & Al Fresco"
  }
};

const COLOR_PALETTES = [
  { id: "all", name: "All Colors", hex: "transparent" },
  { id: "emerald", name: "Emerald", hex: "#1c3c34" },
  { id: "cream", name: "Cream / Bouclé", hex: "#f4f0ea" },
  { id: "cognac", name: "Cognac / Warm Wood", hex: "#9b532d" },
  { id: "charcoal", name: "Charcoal Black", hex: "#2b2b2b" },
  { id: "natural", name: "Natural Teak", hex: "#a66838" },
];

const SPACE_PRODUCTS = [
  {
    id: "sp1",
    name: "Aura Curved Velvet Sofa",
    space: "home",
    category: "Sofas & Lounges",
    price: 84999,
    rating: 4.9,
    material: "Royal Velvet",
    colorId: "emerald",
    colorName: "Emerald Velvet",
    colorHex: "#1c3c34",
    inStock: true,
    customizable: true,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: "sp2",
    name: "Odisha Teak Lounge Chair",
    space: "home",
    category: "Seating",
    price: 24500,
    rating: 4.8,
    material: "Solid Teak Wood",
    colorId: "natural",
    colorName: "Natural Teak",
    colorHex: "#a66838",
    inStock: true,
    customizable: true,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800",
    isNew: false,
  },
  {
    id: "sp3",
    name: "Konark Rattan Easy Armchair",
    space: "home",
    category: "Seating",
    price: 15500,
    rating: 4.7,
    material: "Natural Rattan",
    colorId: "cream",
    colorName: "Cream Bouclé",
    colorHex: "#f4f0ea",
    inStock: true,
    customizable: false,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=800",
    isNew: false,
  },
  {
    id: "sp3b",
    name: "Kalinga Walnut Coffee Table",
    space: "home",
    category: "Tables",
    price: 18900,
    rating: 4.9,
    material: "Walnut Wood",
    colorId: "cognac",
    colorName: "Cognac Wood",
    colorHex: "#9b532d",
    inStock: true,
    customizable: true,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: "sp4",
    name: "Kalinga Teak Executive Desk",
    space: "office",
    category: "Desks",
    price: 62500,
    rating: 4.9,
    material: "Solid Teak Wood",
    colorId: "natural",
    colorName: "Natural Teak",
    colorHex: "#a66838",
    inStock: true,
    customizable: true,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: "sp5",
    name: "ErgoForm Leather Task Chair",
    space: "office",
    category: "Seating",
    price: 32000,
    rating: 4.8,
    material: "Top-Grain Leather",
    colorId: "charcoal",
    colorName: "Charcoal Black",
    colorHex: "#2b2b2b",
    inStock: true,
    customizable: false,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=800",
    isNew: false,
  },
  {
    id: "sp6",
    name: "Modular Studio Bookcase",
    space: "office",
    category: "Storage",
    price: 45000,
    rating: 4.7,
    material: "Walnut Wood",
    colorId: "cognac",
    colorName: "Cognac Wood",
    colorHex: "#9b532d",
    inStock: false,
    customizable: true,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: "sp7",
    name: "Zenith Boardroom Conference Table",
    space: "commercial",
    category: "Tables",
    price: 145000,
    rating: 5.0,
    material: "Solid Oak",
    colorId: "natural",
    colorName: "Natural Teak",
    colorHex: "#a66838",
    inStock: true,
    customizable: true,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: "sp8",
    name: "Lobby Modular Lounge System",
    space: "commercial",
    category: "Sofas & Lounges",
    price: 189000,
    rating: 4.9,
    material: "Royal Velvet",
    colorId: "emerald",
    colorName: "Emerald Velvet",
    colorHex: "#1c3c34",
    inStock: true,
    customizable: true,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
    isNew: false,
  },
  {
    id: "sp9",
    name: "Solstice Outdoor Teak Dining Set",
    space: "outdoor",
    category: "Dining",
    price: 112000,
    rating: 4.9,
    material: "Solid Teak Wood",
    colorId: "natural",
    colorName: "Natural Teak",
    colorHex: "#a66838",
    inStock: true,
    customizable: true,
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: "sp10",
    name: "Veranda Sun Reclining Lounger",
    space: "outdoor",
    category: "Seating",
    price: 29500,
    rating: 4.8,
    material: "Natural Rattan",
    colorId: "cream",
    colorName: "Cream Bouclé",
    colorHex: "#f4f0ea",
    inStock: true,
    customizable: false,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800",
    isNew: false,
  }
];

export default function SpacePage({ params }: { params: { space: string } }) {
  const rawSpace = params?.space?.toLowerCase() || "home";
  const currentSpaceKey = SPACE_DETAILS[rawSpace] ? rawSpace : "home";
  const spaceInfo = SPACE_DETAILS[currentSpaceKey];

  const { addToCart, toggleWishlist, wishlist, products: storeProducts } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const allCatalogProducts = useMemo(() => {
    const liveItems = storeProducts
      .filter((p) => p.status === "active")
      .map((p) => ({
        id: p.id,
        name: p.name,
        space: "home",
        category: p.category,
        price: p.price,
        rating: 5.0,
        material: p.materials?.[0] || "Solid Teak Wood",
        colorId: "natural",
        colorName: p.colors?.[0] || "Natural Teak",
        colorHex: "#a66838",
        inStock: p.stock > 0,
        customizable: true,
        image: p.image,
        isNew: true,
      }));
    return [...liveItems, ...SPACE_PRODUCTS];
  }, [storeProducts]);

  const categories = useMemo(() => {
    const spaceProds = allCatalogProducts.filter((p) => p.space === currentSpaceKey);
    return Array.from(new Set(spaceProds.map((p) => p.category)));
  }, [allCatalogProducts, currentSpaceKey]);

  const materials = useMemo(() => {
    const spaceProds = allCatalogProducts.filter((p) => p.space === currentSpaceKey);
    return Array.from(new Set(spaceProds.map((p) => p.material)));
  }, [allCatalogProducts, currentSpaceKey]);

  const filteredProducts = useMemo(() => {
    return allCatalogProducts.filter((p) => {
      if (p.space !== currentSpaceKey && currentSpaceKey !== "home") return false;
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (selectedColor !== "all" && p.colorId !== selectedColor) return false;
      if (selectedMaterial !== "all" && p.material !== selectedMaterial) return false;
      if (p.price > maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [allCatalogProducts, currentSpaceKey, selectedCategory, selectedColor, selectedMaterial, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedColor("all");
    setSelectedMaterial("all");
    setMaxPrice(200000);
    setSortBy("featured");
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.colorName || "Natural Wood",
      material: product.material || "Standard Timber",
      slug: product.id,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] flex flex-col justify-between transition-colors duration-300">
      <div>
        <Navbar />

        {/* Hero Banner */}
        <section className="relative h-[320px] md:h-[420px] flex items-end justify-start overflow-hidden pt-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={spaceInfo.banner}
            alt={spaceInfo.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/35" />
          
          <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 pb-8 w-full text-white">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="bg-accent-teal text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-2 shadow-md">
                {spaceInfo.tag}
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-1 drop-shadow-md">
                {spaceInfo.title}
              </h1>
              <p className="text-white/90 text-xs sm:text-sm max-w-xl font-medium drop-shadow-sm">
                {spaceInfo.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-[#1F1B16] text-white dark:bg-[#F7F3EC] dark:text-[#1F1B16] px-4 py-2 rounded-full text-xs font-bold shadow-md"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters ({filteredProducts.length})
            </button>
            
            <span className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 font-semibold hidden lg:inline">
              {filteredProducts.length} Handcrafted Pieces Available
            </span>

            {/* Sort Control */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 text-[#1F1B16] dark:text-[#F7F3EC] rounded-full px-4 py-2 text-xs font-bold focus:outline-none appearance-none pr-9 cursor-pointer shadow-sm hover:border-accent-teal transition-all"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated ★</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#1F1B16]/60 dark:text-[#F7F3EC]/60" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Filters */}
            <aside className={`lg:col-span-3 bg-white dark:bg-[#1A1612] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-5 sm:p-6 shadow-sm sticky top-20 ${
              mobileFilterOpen ? "block mb-6 lg:mb-0" : "hidden lg:block"
            }`}>
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                <h3 className="font-serif font-bold text-base flex items-center gap-2 text-[#1F1B16] dark:text-[#F7F3EC]">
                  <SlidersHorizontal className="w-4 h-4 text-accent-teal" /> Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-bold text-accent-teal hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <div className="space-y-6">

                {/* Color Swatches */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 mb-3">
                    Color Swatches
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_PALETTES.map((color) => {
                      const isSelected = selectedColor === color.id;
                      if (color.id === "all") {
                        return (
                          <button
                            key={color.id}
                            onClick={() => setSelectedColor("all")}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                              isSelected
                                ? "bg-accent-teal text-white border-accent-teal shadow-sm"
                                : "bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 border-[#1F1B16]/10 dark:border-[#F7F3EC]/20 text-[#1F1B16] dark:text-[#F7F3EC]"
                            }`}
                          >
                            All
                          </button>
                        );
                      }
                      return (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(isSelected ? "all" : color.id)}
                          className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center border-2 ${
                            isSelected ? "border-accent-teal ring-2 ring-accent-teal/30 scale-110" : "border-white/50 shadow-sm"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 mb-2">
                    Category
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedCategory === "all"
                          ? "bg-accent-teal text-white shadow-sm"
                          : "text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 hover:bg-[#1F1B16]/5 dark:hover:bg-[#F7F3EC]/10"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          selectedCategory === cat
                            ? "bg-accent-teal text-white shadow-sm"
                            : "text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 hover:bg-[#1F1B16]/5 dark:hover:bg-[#F7F3EC]/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price limit slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F1B16]/80 dark:text-[#F7F3EC]/80">
                      Price Limit
                    </label>
                    <span className="text-xs font-bold text-accent-teal">₹{maxPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="200000"
                    step="5000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-accent-teal cursor-pointer"
                  />
                </div>

              </div>
            </aside>

            {/* PRODUCT CARDS LIST - Horizontal E-commerce row on Mobile, Grid on Desktop */}
            <main className="lg:col-span-9">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#1A1612] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-8">
                  <h3 className="font-serif text-xl font-bold mb-2 text-[#1F1B16] dark:text-[#F7F3EC]">No matching pieces</h3>
                  <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mb-4">Try resetting your filters.</p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 bg-accent-teal text-white px-5 py-2 rounded-full text-xs font-bold shadow-md hover:bg-accent-teal/90 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl sm:rounded-3xl p-2.5 sm:p-0 flex flex-row sm:flex-col gap-3.5 sm:gap-0 shadow-sm hover:shadow-lg transition-all"
                    >
                      {/* Image Frame - Small horizontal square thumbnail on mobile (< sm), full aspect ratio on desktop */}
                      <a
                        href={`/product/${product.id}`}
                        className="w-28 h-28 shrink-0 sm:w-full sm:h-auto sm:aspect-[4/3] bg-[#FAF8F5] dark:bg-[#12100E] rounded-xl sm:rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist({
                              id: product.id,
                              slug: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              bg: "bg-cream"
                            });
                          }}
                          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all text-[#1F1B16] dark:text-[#F7F3EC] shadow-md"
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlist.some(w => w.id === product.id) ? "fill-accent-terracotta text-accent-terracotta" : "opacity-60"}`} />
                        </button>
                      </a>

                      {/* Card Info Content */}
                      <div className="flex-1 min-w-0 sm:p-5 flex flex-col justify-between">
                        <a href={`/product/${product.id}`} className="block">
                          <span className="text-[9px] font-bold text-accent-teal uppercase tracking-widest block mb-0.5">
                            {product.category}
                          </span>
                          <h3 className="font-serif font-bold text-sm sm:text-base text-[#1F1B16] dark:text-[#F7F3EC] group-hover:text-accent-teal transition-colors leading-snug line-clamp-2 sm:truncate">
                            {product.name}
                          </h3>
                        </a>

                        <div className="mt-2 sm:mt-4 flex items-end justify-between gap-2 border-t sm:pt-3 border-[#1F1B16]/5 dark:border-[#F7F3EC]/10">
                          <div>
                            <span className="font-mono text-xs sm:text-base font-extrabold text-[#1F1B16] dark:text-[#F7F3EC] block">
                              ₹{product.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-accent-teal hover:bg-accent-teal/90 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all shadow-sm active:scale-95"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
