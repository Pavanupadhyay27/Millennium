"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ArrowRight,
  Compass,
  Heart,
  ShoppingBag,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useStore } from "../lib/store";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600",
    headline: "Refine Your Living Space",
    quote: "“Artisanal teak joinery, sculpted for timeless comfort.”",
  },
  {
    image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1600",
    headline: "Pure Natural Elegance",
    quote: "“Organic grain textures meets precision craftsmanship.”",
  },
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1600",
    headline: "Crafted For Generations",
    quote: "“Sustainably sourced solid wood made for modern sanctuaries.”",
  },
  {
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=1600",
    headline: "Minimalist Luxury Interiors",
    quote: "“Where functional architecture transforms every room.”",
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const POPULAR_PRODUCTS = [
  {
    id: "p1",
    name: "Odisha Teak Lounge Chair",
    price: 24500,
    category: "Chairs",
    bg: "bg-pastel-mint",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "p2",
    name: "Kalinga Walnut Coffee Table",
    price: 18900,
    category: "Tables",
    bg: "bg-pastel-blush",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "p3",
    name: "Bhubaneswar Oak Sideboard",
    price: 48000,
    category: "Cabinets",
    bg: "bg-pastel-lavender",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "p4",
    name: "Konark Rattan Easy Armchair",
    price: 15500,
    category: "Chairs",
    bg: "bg-pastel-butter",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "p5",
    name: "Mahanadi Teak Bench",
    price: 21000,
    category: "Seating",
    bg: "bg-pastel-mint",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "p6",
    name: "Dhauli Marble Nested Table",
    price: 13500,
    category: "Tables",
    bg: "bg-pastel-blush",
    image: "https://images.unsplash.com/photo-1551215934-37d0573d6622?auto=format&fit=crop&q=80&w=600",
  },
];

const ROOM_INSPIRATION = {
  "Living Room": [
    {
      id: "lr1",
      title: "Elegant Lounge Setup",
      size: "large",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "lr2",
      title: "Teak Nesting Details",
      size: "small",
      image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "lr3",
      title: "Cozy Corner Accent",
      size: "small",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "lr4",
      title: "Minimalist Bookshelf",
      size: "small",
      image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=600",
    },
  ],
  Study: [
    {
      id: "st1",
      title: "Focus-Ready Desk space",
      size: "large",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "st2",
      title: "Ergonomic Oak Seating",
      size: "small",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "st3",
      title: "Workspace Task Light",
      size: "small",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "st4",
      title: "Modular Storage Units",
      size: "small",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600",
    },
  ],
  "Media Room": [
    {
      id: "mr1",
      title: "Surround Sound Lounge",
      size: "large",
      image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "mr2",
      title: "Floating Lowboard",
      size: "small",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "mr3",
      title: "Acoustic Wall Panels",
      size: "small",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "mr4",
      title: "Soft Mood Ambient lighting",
      size: "small",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600",
    },
  ],
  "Dining Room": [
    {
      id: "dr1",
      title: "Solid Wood Table Setup",
      size: "large",
      image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "dr2",
      title: "Handmade Ceramic Plateware",
      size: "small",
      image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "dr3",
      title: "Woven Pendant Shade",
      size: "small",
      image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "dr4",
      title: "Teak Dining Bench",
      size: "small",
      image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600",
    },
  ],
};

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Aarav Mohapatra",
    role: "Architect, Bhubaneswar",
    quote:
      "Millennium's attention to teak joinery and finish is exceptional. The dining set we customized fits our contemporary project flawlessly. Delivery inside Bhubaneswar was prompt and seamless.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "t2",
    name: "Priyanka Patnaik",
    role: "Homeowner, Cuttack",
    quote:
      "I was skeptical about ordering furniture online, but visiting their local studio in Bhubaneswar and customizing our fabrics convinced me. The blush pastel accent armchair is now the absolute highlight of our living room!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "t3",
    name: "Ranjan Dash",
    role: "Wholesale Partner, Rourkela",
    quote:
      "Excellent commercial terms and reliable logistics for wholesale buyers outside Khorda. The build quality of their solid wood frames is highly appreciated by our retailers.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
  },
];

const getBrandLogo = (name: string) => {
  switch (name.toLowerCase()) {
    case "sleepwell":
      return (
        <div className="w-5 h-5 rounded bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-serif font-black text-[9px] tracking-tight shrink-0 border border-blue-500/20">
          S
        </div>
      );
    case "centuryply":
      return (
        <div className="w-5 h-5 rounded bg-rose-600/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-sans font-black text-[9px] tracking-tight shrink-0 border border-rose-500/20">
          CP
        </div>
      );
    case "featherlite":
      return (
        <div className="w-5 h-5 rounded bg-slate-600/15 text-slate-500 dark:text-slate-400 flex items-center justify-center font-sans font-bold text-[9px] shrink-0 border border-slate-500/20">
          F
        </div>
      );
    case "godrej interio":
    case "godrej":
      return (
        <div className="w-5 h-5 rounded bg-teal-600/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-serif italic font-extrabold text-[9px] shrink-0 border border-teal-500/20">
          G
        </div>
      );
    case "pepperfry":
      return (
        <div className="w-5 h-5 rounded bg-orange-600/15 text-orange-600 dark:text-orange-400 flex items-center justify-center font-sans font-black text-[7px] tracking-tighter shrink-0 border border-orange-500/20">
          pf
        </div>
      );
    default:
      return (
        <div className="w-5 h-5 rounded bg-stone-600/15 text-stone-600 dark:text-stone-400 flex items-center justify-center font-extrabold text-[9px] shrink-0 border border-stone-500/20">
          {name.substring(0, 2).toUpperCase()}
        </div>
      );
  }
};

export default function HomePage() {
  const { wishlist, toggleWishlist, products: storeProducts, customerTestimonials, addCustomerTestimonial, orders, brandPartners } = useStore();
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const [activeRoomTab, setActiveRoomTab] = useState<"Living Room" | "Study" | "Media Room" | "Dining Room">("Living Room");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (currentTheme) setTheme(currentTheme);
    };
    window.addEventListener("theme-change", handleThemeChange);
    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
    };
  }, []);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    role: "Verified Customer",
    quote: "",
    rating: 0,
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Marquee hover state
  const [isPartnersHovered, setIsPartnersHovered] = useState(false);

  const displayProducts = useMemo(() => {
    const activeStoreItems = storeProducts
      .filter((p) => p.status === "active")
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        bg: "bg-[#FAF8F5]",
        image: p.image,
      }));
    return activeStoreItems.length > 0 ? activeStoreItems : POPULAR_PRODUCTS;
  }, [storeProducts]);

  const productCarouselRef = useRef<HTMLDivElement>(null);
  const testimonialCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => {
        const listLength = (customerTestimonials && customerTestimonials.length > 0) ? customerTestimonials.length : TESTIMONIALS.length;
        const nextIdx = (prev + 1) % listLength;
        if (testimonialCarouselRef.current) {
          const container = testimonialCarouselRef.current;
          const cardWidth = container.scrollWidth / listLength;
          container.scrollTo({
            left: cardWidth * nextIdx,
            behavior: "smooth",
          });
        }
        return nextIdx;
      });
    }, 4500);

    return () => {
      clearInterval(heroInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const currentSlide = HERO_SLIDES[heroImageIdx];

  return (
    <div className="min-h-screen bg-[#F7F3EC] dark:bg-[#12100e] text-[#1F1B16] dark:text-[#F7F3EC] font-sans selection:bg-accent-teal/20 selection:text-[#1F1B16] relative transition-colors duration-300">
      {/* NAVBAR */}
      <Navbar transparent />

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative h-[92vh] sm:h-screen w-full overflow-hidden flex items-center bg-[#FAF7F2] dark:bg-[#12100E] pt-20 sm:pt-0"
      >
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            <motion.div
              key={heroImageIdx}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentSlide.image})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/30 md:bg-black/20" />
        </div>

        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 w-full z-10 relative">
          <div className="max-w-2xl flex flex-col items-start text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroImageIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex flex-col items-start"
              >
                <h1 className="font-serif text-3xl sm:text-5xl md:text-[58px] font-bold leading-[1.15] mb-3 sm:mb-4 text-white tracking-tight drop-shadow-lg">
                  {currentSlide.headline}
                </h1>
                <p className="text-white/90 text-xs sm:text-base mb-6 sm:mb-8 font-medium tracking-wide max-w-md italic drop-shadow-md">
                  {currentSlide.quote}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-row gap-3 w-full sm:w-auto justify-start">
              <a
                href="#collections"
                className="bg-gradient-to-b from-[#14b8a6] to-[#0d9488] hover:from-[#2dd4bf] hover:to-[#0f766e] text-white rounded-full px-5 py-2.5 sm:px-8 sm:py-4 text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.15em] text-center shadow-[0_6px_18px_rgba(13,148,136,0.3),inset_0_1.5px_2.5px_rgba(255,255,255,0.4)] active:shadow-[inset_2.5px_2.5px_6px_rgba(0,0,0,0.45)] border border-teal-900 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Shop Now
              </a>
              <a
                href="#lookbook"
                className="bg-gradient-to-b from-white/12 to-white/3 backdrop-blur-md hover:from-white/20 hover:to-white/10 text-white rounded-full px-5 py-2.5 sm:px-8 sm:py-4 text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.15em] text-center shadow-[0_6px_18px_rgba(0,0,0,0.15),inset_0_1.5px_2px_rgba(255,255,255,0.25)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] border border-white/20 hover:border-white/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} /> Explore Collection
              </a>
            </div>
          </div>
        </div>

        {/* Minimal Slider Dots */}
        <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroImageIdx(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                heroImageIdx === idx ? "w-7 bg-accent-teal" : "w-2 bg-white/40 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* AUTO-MOVING BRAND PARTNERS CAROUSEL WITH HOVER PAUSE & REAL LOGOS */}
      <section className="bg-white dark:bg-[#1C1814] py-2 relative z-20 overflow-hidden">
        {/* Continuous Auto-Moving Marquee Track with Working Hover Pause */}
        <div className="relative w-full overflow-hidden flex py-0.5">
          {/* Soft ambient gradient blur on left & right edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-[#1C1814] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-[#1C1814] to-transparent z-10 pointer-events-none" />

          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap animate-marquee">
            {(brandPartners && brandPartners.length > 0 ? brandPartners : [
              { id: "1", name: "Sleepwell", tag: "Mattress Tech Partner", logo: "" },
              { id: "2", name: "CenturyPly", tag: "Marine Teak Grade", logo: "" },
              { id: "3", name: "Featherlite", tag: "Ergonomic Hardware", logo: "" },
              { id: "4", name: "Godrej Interio", tag: "Steel Joinery", logo: "" },
              { id: "5", name: "Pepperfry", tag: "Verified Merchant", logo: "" },
            ])
              .concat(
                brandPartners && brandPartners.length > 0 ? brandPartners : [
                  { id: "1b", name: "Sleepwell", tag: "Mattress Tech Partner", logo: "" },
                  { id: "2b", name: "CenturyPly", tag: "Marine Teak Grade", logo: "" },
                  { id: "3b", name: "Featherlite", tag: "Ergonomic Hardware", logo: "" },
                  { id: "4b", name: "Godrej Interio", tag: "Steel Joinery", logo: "" },
                  { id: "5b", name: "Pepperfry", tag: "Verified Merchant", logo: "" },
                ]
              )
              .map((brand, idx) => (
                <div
                  key={`${brand.id}-${idx}`}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 shrink-0 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                  style={theme === "light" ? {
                    background: "rgba(31,27,22,0.02)",
                    border: "1px solid rgba(31, 27, 22, 0.06)",
                  } : {
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {getBrandLogo(brand.name)}
                  <div className="flex flex-col">
                    <span className="font-serif text-[10px] font-bold text-[#1F1B16] dark:text-[#F7F3EC] leading-none mb-0.5">
                      {brand.name}
                    </span>
                    <span className="text-[8px] font-medium text-[#1F1B16]/40 dark:text-[#F7F3EC]/30 leading-none">
                      {brand.tag}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      {/* POPULAR PRODUCTS CATALOG */}
      <section
        id="collections"
        className="py-8 md:py-12 bg-[#FAF8F5] dark:bg-[#1A1612] border-b border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 transition-colors duration-300"
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-accent-teal text-xs font-bold tracking-widest uppercase mb-1 block">
                Handcrafted Catalog
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] transition-colors">
                Popular Collections
              </h2>
              <p className="text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 text-xs sm:text-sm mt-1 transition-colors">
                Discover sustainably harvested teak wood designs crafted in Bhubaneswar.
              </p>
            </div>
            <a
              href="/spaces/home"
              className="border border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 text-[#1F1B16] dark:text-[#F7F3EC] rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-wider hover:bg-[#1F1B16] hover:text-[#F7F3EC] dark:hover:bg-[#F7F3EC] dark:hover:text-[#1F1B16] transition-all self-start md:self-end"
            >
              Explore Full Catalog &rarr;
            </a>
          </div>

          {/* HORIZONTAL SCROLL CAROUSEL FOR BOTH MOBILE & DESKTOP (2 to 3 products visible per view) */}
          <div
            ref={productCarouselRef}
            className="flex flex-row gap-3.5 sm:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {displayProducts.map((prod) => (
              <div
                key={prod.id}
                className="min-w-[260px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px] snap-start flex flex-col rounded-3xl p-3 sm:p-4 group cursor-pointer shrink-0"
                style={theme === "light" ? {
                  background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
                  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.9), inset 0 -3px 0 rgba(31,27,22,0.05)",
                  border: "1px solid rgba(31,27,22,0.1)",
                } : {
                  background: "linear-gradient(180deg, #25201A 0%, #161310 100%)",
                  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.15), inset 0 -3px 0 rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {/* Image Frame */}
                <div
                  className={`w-full aspect-[4/3] sm:aspect-[4/3] rounded-2xl relative overflow-hidden flex items-center justify-center border ${
                    theme === "light" ? "bg-[#FAF7F2] border-charcoal/10" : "bg-[#12100E] border-white/10"
                  }`}
                  style={{
                    boxShadow: "inset 0 4px 14px rgba(0, 0, 0, 0.6)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist({
                        id: prod.id,
                        slug: prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        name: prod.name,
                        price: prod.price,
                        image: prod.image,
                        bg: "bg-[#FAF8F5]",
                      });
                    }}
                    className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full active:scale-90 border"
                    style={theme === "light" ? {
                      background: "linear-gradient(180deg, rgba(250,247,242,0.9) 0%, rgba(247,243,236,0.95) 100%)",
                      boxShadow: "0 6px 14px rgba(31,27,22,0.1), inset 0 1.5px 0 rgba(255,255,255,0.8)",
                      borderColor: "rgba(31,27,22,0.15)",
                    } : {
                      background: "linear-gradient(180deg, rgba(30,24,18,0.85) 0%, rgba(15,12,9,0.95) 100%)",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.4), inset 0 1.5px 0 rgba(255,255,255,0.3)",
                      borderColor: "rgba(255,255,255,0.3)",
                    }}
                    title={wishlist.some((w) => w.slug === prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")) ? "Remove from Wishlist" : "Save to Wishlist"}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-all duration-300 ${
                        wishlist.some((w) => w.slug === prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
                          ? "fill-rose-500 text-rose-500"
                          : "text-rose-400 stroke-[2.5] hover:text-rose-500"
                      }`}
                    />
                  </button>
                </div>

                {/* Info block */}
                <div className="mt-3 flex justify-between items-end flex-1">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest block mb-0.5 ${
                      theme === "light" ? "text-accent-teal" : "text-amber-400"
                    }`}>
                      {prod.category}
                    </span>
                    <h3 className={`font-serif font-bold text-sm sm:text-base leading-snug group-hover:text-emerald-400 transition-colors truncate ${
                      theme === "light" ? "text-charcoal" : "text-[#F7F3EC]"
                    }`}>
                      {prod.name}
                    </h3>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-emerald-400 block mt-1">
                      {formatPrice(prod.price)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      useStore.getState().addToCart({
                        productId: prod.id,
                        name: prod.name,
                        price: prod.price,
                        color: "Natural Wood",
                        material: "Solid Teak",
                        image: prod.image,
                        slug: prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        bg: "bg-[#FAF8F5]",
                      });
                    }}
                    className="flex-shrink-0 px-4 py-2 text-white rounded-xl text-[10px] font-extrabold tracking-wider uppercase border border-emerald-800/10 active:scale-95 transition-all"
                    style={{
                      background: "linear-gradient(180deg, #34D399 0%, #10B981 100%)",
                      boxShadow: "inset 0 1.5px 0 rgba(255, 255, 255, 0.4), inset 0 -1.5px 0 rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROOM INSPIRATION */}
      <section id="lookbook" className="py-8 md:py-14">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-6 md:mb-10">
            <span className="text-accent-teal text-xs font-bold tracking-widest uppercase mb-1 block">
              Curated Spaces
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] leading-tight">
              Get Inspired By Our Room Setups
            </h2>
            <p className="text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mt-2 text-xs sm:text-base">
              Explore how our handmade collection transforms functional areas into warm sanctuaries.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 md:mt-8">
              {(["Living Room", "Study", "Media Room", "Dining Room"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveRoomTab(tab)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                      activeRoomTab === tab
                        ? "bg-charcoal text-cream shadow-sm"
                        : "bg-charcoal/5 hover:bg-charcoal/10 text-charcoal"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRoomTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6"
              >
                {ROOM_INSPIRATION[activeRoomTab]
                  .filter((item) => item.size === "large")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="md:col-span-7 relative h-[320px] sm:h-[450px] md:h-[600px] rounded-3xl group transition-all duration-500 hover:-translate-y-1 p-3.5"
                      style={theme === "light" ? {
                        background: "linear-gradient(135deg, #FAF7F2 0%, #DED6C9 100%)",
                        boxShadow: "0 14px 32px -4px rgba(31, 27, 22, 0.1), inset 0 1.5px 0 #FFF, inset 0 -3px 0 rgba(31, 27, 22, 0.05)",
                        border: "1px solid rgba(31, 27, 22, 0.12)",
                      } : {
                        background: "linear-gradient(135deg, #2C2620 0%, #161310 100%)",
                        boxShadow: "0 18px 40px -6px rgba(0, 0, 0, 0.65), inset 0 1.5px 0 rgba(255, 255, 255, 0.12), inset 0 -3px 0 rgba(0, 0, 0, 0.4)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      {/* Image Frame */}
                      <div
                        className={`w-full h-full rounded-2xl relative overflow-hidden flex items-center justify-center border ${
                          theme === "light" ? "border-charcoal/10" : "border-white/10"
                        }`}
                        style={{
                          boxShadow: "inset 0 4px 14px rgba(0, 0, 0, 0.6)",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Glossy diagonal sheen reflection layer */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
                        
                        {/* Ambient bottom shadow overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Beveled Museum Plate */}
                        <div
                          className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl backdrop-blur-md border flex items-center justify-between z-20"
                          style={theme === "light" ? {
                            background: "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(250,247,242,0.85) 100%)",
                            borderColor: "rgba(255,255,255,0.7)",
                            boxShadow: "0 8px 24px rgba(31,27,22,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                          } : {
                            background: "linear-gradient(135deg, rgba(37,32,26,0.92) 0%, rgba(22,19,16,0.85) 100%)",
                            borderColor: "rgba(212,168,83,0.25)",
                            boxShadow: "0 10px 28px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                          }}
                        >
                          <div>
                            <h3 className={`font-serif text-base sm:text-lg md:text-xl font-bold leading-tight ${
                              theme === "light" ? "text-charcoal" : "text-white"
                            }`}>
                              {item.title}
                            </h3>
                            <p className={`text-[9px] uppercase tracking-wider mt-0.5 font-extrabold flex items-center gap-1 ${
                              theme === "light" ? "text-accent-teal" : "text-amber-400"
                            }`}>
                              <Compass className="w-3 h-3" /> Millennium Showcase
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                <div className="md:col-span-5 flex flex-col gap-4 sm:gap-6">
                  {ROOM_INSPIRATION[activeRoomTab]
                    .filter((item) => item.size === "small")
                    .map((item, idx) => (
                      <div
                        key={item.id}
                        className={`relative h-[160px] sm:h-[200px] md:h-[287px] rounded-2xl group transition-all duration-500 hover:-translate-y-1 p-2.5 ${
                          idx === 2 ? "hidden md:block" : ""
                        }`}
                        style={theme === "light" ? {
                          background: "linear-gradient(135deg, #FAF7F2 0%, #DED6C9 100%)",
                          boxShadow: "0 10px 24px -4px rgba(31, 27, 22, 0.08), inset 0 1px 0 #FFF, inset 0 -2px 0 rgba(31, 27, 22, 0.04)",
                          border: "1px solid rgba(31, 27, 22, 0.1)",
                        } : {
                          background: "linear-gradient(135deg, #2C2620 0%, #161310 100%)",
                          boxShadow: "0 12px 30px -6px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -2px 0 rgba(0, 0, 0, 0.35)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                        }}
                      >
                        {/* Image Frame */}
                        <div
                          className={`w-full h-full rounded-xl relative overflow-hidden flex items-center justify-center border ${
                            theme === "light" ? "border-charcoal/10" : "border-white/10"
                          }`}
                          style={{
                            boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {/* Glossy diagonal sheen reflection layer */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

                          {/* Ambient bottom shadow overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                          {/* Beveled Museum Plate */}
                          <div
                            className="absolute bottom-3 left-3 right-3 p-3 rounded-xl backdrop-blur-md border flex items-center justify-between z-20"
                            style={theme === "light" ? {
                              background: "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(250,247,242,0.85) 100%)",
                              borderColor: "rgba(255,255,255,0.7)",
                              boxShadow: "0 6px 18px rgba(31,27,22,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                            } : {
                              background: "linear-gradient(135deg, rgba(37,32,26,0.92) 0%, rgba(22,19,16,0.85) 100%)",
                              borderColor: "rgba(212,168,83,0.25)",
                              boxShadow: "0 8px 22px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
                            }}
                          >
                            <div>
                              <h3 className={`font-serif text-sm sm:text-base font-bold leading-tight ${
                                theme === "light" ? "text-charcoal" : "text-white"
                              }`}>
                                {item.title}
                              </h3>
                              <p className={`text-[8px] uppercase tracking-wider mt-0.5 font-extrabold ${
                                theme === "light" ? "text-accent-teal" : "text-amber-400"
                              }`}>
                                Handcrafted Detail
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS & CUSTOMER REVIEWS */}
      <section id="about-us" className="py-10 md:py-16 bg-[#F7F3EC] dark:bg-[#12100e] transition-colors duration-300 relative">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
            <div>
              <span className="text-accent-teal text-xs font-extrabold tracking-widest uppercase mb-1 block">
                Customer Voices & Reviews
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
                What Our Buyers Say
              </h2>
            </div>
            
            <button
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-2.5 text-white rounded-full px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 active:scale-95 border hover:scale-[1.02]"
              style={{
                background: "linear-gradient(180deg, #34D399 0%, #10B981 50%, #059669 100%)",
                borderColor: "rgba(52,211,153,0.4)",
                boxShadow: "0 6px 14px -2px rgba(16, 185, 129, 0.4), inset 0 1.5px 0 rgba(255, 255, 255, 0.45), inset 0 -2.5px 0 rgba(0, 0, 0, 0.35)",
              }}
            >
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              <span>+ Write a Review</span>
            </button>
          </div>

          {/* Auto-sliding Horizontal Track when items exceed 3 */}
          <div
            ref={testimonialCarouselRef}
            className="flex flex-row gap-4 sm:gap-6 overflow-x-auto py-6 px-2 scrollbar-none snap-x snap-mandatory -my-4 -mx-2"
            style={{ scrollbarWidth: "none" }}
          >
            {(customerTestimonials && customerTestimonials.length > 0 ? customerTestimonials : TESTIMONIALS).map((test, index) => {
              const isActive = index === activeTestimonial;
              return (
                <div
                  key={test.id}
                  onClick={() => setActiveTestimonial(index)}
                  className={`min-w-[300px] sm:min-w-[350px] md:min-w-[400px] max-w-[420px] snap-start rounded-3xl p-6 md:p-7 transition-all duration-500 flex flex-col justify-between cursor-pointer border shrink-0 relative overflow-hidden ${
                    isActive ? "scale-[1.02] z-10" : "hover:scale-[1.005]"
                  }`}
                  style={theme === "light" ? (
                    isActive ? {
                      background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
                      borderColor: "#2F6F62",
                      boxShadow: "0 20px 48px -8px rgba(47, 111, 98, 0.15), inset 0 1.5px 0 #FFF, inset 0 -3px 0 rgba(31, 27, 22, 0.05)",
                    } : {
                      background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
                      borderColor: "rgba(31, 27, 22, 0.12)",
                      boxShadow: "0 10px 28px -4px rgba(31, 27, 22, 0.05), inset 0 1px 0 #FFF, inset 0 -2px 0 rgba(0,0,0,0.03)",
                    }
                  ) : (
                    isActive ? {
                      background: "linear-gradient(180deg, #2D2721 0%, #1D1915 100%)",
                      borderColor: "rgba(212, 168, 83, 0.65)",
                      boxShadow: "0 22px 50px -8px rgba(0,0,0,0.7), inset 0 1.5px 0 rgba(255,255,255,0.15), inset 0 -3.5px 0 rgba(0,0,0,0.45)",
                    } : {
                      background: "linear-gradient(180deg, #25201A 0%, #171411 100%)",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 12px 32px -6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.3)",
                    }
                  )}
                >
                  {/* Glossy sheen reflection overlay for active card */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />
                  )}

                  {/* Decorative background quote mark watermark */}
                  <span className="absolute top-2 right-4 text-7xl font-serif font-black opacity-[0.06] text-[#1F1B16] dark:text-[#F7F3EC] select-none pointer-events-none">
                    &ldquo;
                  </span>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full shadow-inner">
                        {[...Array(test.rating || 5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5"
                            style={{ fill: "#F59E0B", color: "#F59E0B" }}
                          />
                        ))}
                      </div>
                      <span className={`text-[10px] font-mono font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border ${
                        theme === "light" ? "text-[#2F6F62] bg-[#2F6F62]/10 border-[#2F6F62]/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Verified Buyer
                      </span>
                    </div>

                    <p className="font-serif italic text-sm sm:text-base leading-relaxed text-[#1F1B16]/95 dark:text-[#F7F3EC]/95 mb-6 line-clamp-4 font-medium">
                      &ldquo;{test.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3.5 pt-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={test.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"}
                      alt={test.name}
                      className="w-11 h-11 rounded-full object-cover shrink-0 shadow-md border-2"
                      style={theme === "light" ? {
                        borderColor: "#FFFFFF",
                        boxShadow: "0 4px 10px rgba(31,27,22,0.12)"
                      } : {
                        borderColor: "rgba(212,168,83,0.4)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-sm leading-tight truncate text-[#1F1B16] dark:text-[#F7F3EC]">{test.name}</h4>
                      <p className="text-[11px] text-accent-teal font-medium truncate mt-0.5">
                        {test.role}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {(customerTestimonials && customerTestimonials.length > 0 ? customerTestimonials : TESTIMONIALS).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === idx ? "w-6 bg-accent-teal" : "w-1.5 bg-[#1F1B16]/20 dark:bg-[#F7F3EC]/20"
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEW SUBMISSION MODAL (CENTERED VIEWPORT CONTAINER) */}
      <AnimatePresence>
        {reviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl p-6 z-10 text-[#1F1B16] dark:text-[#F7F3EC] scrollbar-thin backdrop-blur-xl border"
              style={theme === "light" ? {
                background: "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(247,243,236,0.88) 100%)",
                borderColor: "rgba(255,255,255,0.7)",
                boxShadow: "0 24px 64px rgba(31,27,22,0.15), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -3px 0 rgba(0,0,0,0.03)",
              } : {
                background: "linear-gradient(135deg, rgba(35,30,25,0.96) 0%, rgba(18,15,13,0.92) 100%)",
                borderColor: "rgba(212,168,83,0.2)",
                boxShadow: "0 28px 72px rgba(0,0,0,0.65), inset 0 1.5px 0 rgba(255,255,255,0.15), inset 0 -4px 0 rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 mb-4 sticky top-0 bg-white/20 dark:bg-black/10 backdrop-blur-md z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-accent-teal/10 text-accent-teal flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 fill-accent-teal text-accent-teal" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">Write a Review</h3>
                    <p className="text-[10px] text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 font-medium">Share your experience with Millennium Furniture</p>
                  </div>
                </div>
                <button
                  onClick={() => setReviewModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 hover:bg-accent-teal hover:text-white flex items-center justify-center transition-all text-xs font-bold shrink-0"
                >
                  ✕
                </button>
              </div>

              {reviewSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-black">
                    ✓
                  </div>
                  <h4 className="font-serif font-bold text-lg">Thank You for Your Review!</h4>
                  <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Your review has been verified and published to the customer showcase.</p>
                  <button
                    onClick={() => {
                      setReviewSuccess(false);
                      setReviewModalOpen(false);
                    }}
                    className="bg-accent-teal text-white font-bold rounded-full px-8 py-2.5 text-xs uppercase tracking-wider shadow-md hover:bg-accent-teal/90 transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newReview.name || !newReview.quote || newReview.rating === 0) return;
                    addCustomerTestimonial({
                      name: newReview.name,
                      role: newReview.role || "Verified Customer, Odisha",
                      quote: newReview.quote,
                      rating: newReview.rating,
                      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
                    });
                    setReviewSuccess(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="e.g. Sweta Mishra"
                      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-accent-teal text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] border transition-all duration-300 focus:ring-2 focus:ring-accent-teal/10"
                      style={theme === "light" ? {
                        background: "rgba(0, 0, 0, 0.03)",
                        borderColor: "rgba(31, 27, 22, 0.12)",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
                      } : {
                        background: "rgba(0, 0, 0, 0.25)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.3)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                      City & Occupation
                    </label>
                    <input
                      type="text"
                      value={newReview.role}
                      onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                      placeholder="e.g. Homeowner, Bhubaneswar"
                      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-accent-teal text-xs font-medium text-[#1F1B16] dark:text-[#F7F3EC] border transition-all duration-300 focus:ring-2 focus:ring-accent-teal/10"
                      style={theme === "light" ? {
                        background: "rgba(0, 0, 0, 0.03)",
                        borderColor: "rgba(31, 27, 22, 0.12)",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
                      } : {
                        background: "rgba(0, 0, 0, 0.25)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.3)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-2 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                      Rating *
                    </label>
                    <div
                      className="flex gap-3.5 items-center p-3 rounded-2xl border transition-colors duration-300"
                      style={theme === "light" ? {
                        background: "rgba(0, 0, 0, 0.03)",
                        borderColor: "rgba(31, 27, 22, 0.1)",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
                      } : {
                        background: "rgba(0, 0, 0, 0.25)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.3)",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= (hoveredRating || newReview.rating);
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="p-1 hover:scale-120 active:scale-95 transition-all duration-200"
                          >
                            <Star
                              className="w-7 h-7 scale-110"
                              style={{
                                fill: isFilled ? "#F59E0B" : "transparent",
                                color: isFilled ? "#F59E0B" : (theme === "light" ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.15)"),
                                filter: isFilled ? "drop-shadow(0 0 5px rgba(245,158,11,0.65))" : "none",
                                transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                              }}
                            />
                          </button>
                        );
                      })}
                      <span className="text-xs font-bold font-mono text-amber-500 ml-auto">
                        {newReview.rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReview.quote}
                      onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                      placeholder="Tell us about the teak wood quality, custom joinery, or delivery..."
                      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-accent-teal text-xs font-medium text-[#1F1B16] dark:text-[#F7F3EC] border transition-all duration-300 focus:ring-2 focus:ring-accent-teal/10 resize-none"
                      style={theme === "light" ? {
                        background: "rgba(0, 0, 0, 0.03)",
                        borderColor: "rgba(31, 27, 22, 0.12)",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
                      } : {
                        background: "rgba(0, 0, 0, 0.25)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.3)",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white font-extrabold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md mt-2 border hover:scale-[1.01]"
                    style={{
                      background: "linear-gradient(180deg, #34D399 0%, #10B981 50%, #059669 100%)",
                      borderColor: "rgba(52,211,153,0.3)",
                      boxShadow: "0 4px 10px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 0 rgba(0,0,0,0.25)",
                    }}
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SPECIAL OFFERS */}
      <section id="offer" className="py-10 md:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
          <div className="mb-6 md:mb-12">
            <span className="text-accent-teal text-xs font-bold tracking-widest uppercase mb-1.5 block">
              Exclusive Deals
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
              Seasonal Special Offers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Promo Card 1 */}
            <div
              className="rounded-3xl p-5 sm:p-10 flex flex-col sm:flex-col items-center sm:items-start justify-between gap-6 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group border"
              style={theme === "light" ? {
                background: "linear-gradient(135deg, #EBF8F6 0%, #D4EAE5 100%)",
                borderColor: "rgba(47, 111, 98, 0.2)",
                boxShadow: "0 14px 36px -6px rgba(31, 27, 22, 0.08), inset 0 1.5px 0 #FFF, inset 0 -3px 0 rgba(31, 27, 22, 0.04)",
              } : {
                background: "linear-gradient(135deg, #1E2E2B 0%, #111B19 100%)",
                borderColor: "rgba(52, 211, 153, 0.2)",
                boxShadow: "0 18px 40px -8px rgba(0, 0, 0, 0.55), inset 0 1.5px 0 rgba(255, 255, 255, 0.1), inset 0 -3.5px 0 rgba(0, 0, 0, 0.4)",
              }}
            >
              {/* Glossy gloss sheen overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />

              <div className="w-full flex-1 min-w-0 z-10">
                <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest rounded-full px-3 py-1 inline-block mb-3 border shadow-sm ${
                  theme === "light" ? "text-accent-teal bg-white/95 border-accent-teal/20" : "text-emerald-400 bg-black/40 border-emerald-500/20"
                }`}>
                  Limited Offer
                </span>
                <h3 className="font-serif text-3xl sm:text-5xl font-black text-[#1F1B16] dark:text-[#F7F3EC] leading-none mb-2 sm:mb-4">
                  40% OFF
                </h3>
                <p className="font-serif text-sm sm:text-lg font-bold text-[#1F1B16]/85 dark:text-[#F7F3EC]/85 mb-4 sm:mb-6 leading-snug">
                  Odisha Teak Cabinets & Storage
                </p>
                <a
                  href="#collections"
                  className="inline-flex items-center gap-2 text-white rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-all duration-300 active:scale-95 border hover:scale-[1.02] shadow-md"
                  style={{
                    background: "linear-gradient(180deg, #34D399 0%, #10B981 50%, #059669 100%)",
                    borderColor: "rgba(52,211,153,0.3)",
                    boxShadow: "0 4px 10px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 0 rgba(0,0,0,0.25)",
                  }}
                >
                  <span>Shop Deal</span> <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Inset Photo Frame */}
              <div
                className={`w-full h-auto aspect-[16/9] rounded-2xl overflow-hidden shrink-0 relative border p-2 ${
                  theme === "light" ? "bg-black/5 border-charcoal/10" : "bg-black/35 border-white/10"
                }`}
                style={{
                  boxShadow: "inset 0 3px 8px rgba(0,0,0,0.25)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=700"
                  alt="Teak Cabinet Promo"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

            {/* Promo Card 2 */}
            <div
              className="rounded-3xl p-5 sm:p-10 flex flex-col sm:flex-col items-center sm:items-start justify-between gap-6 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group border"
              style={theme === "light" ? {
                background: "linear-gradient(135deg, #FCF5F1 0%, #F3DFD3 100%)",
                borderColor: "rgba(217, 119, 6, 0.2)",
                boxShadow: "0 14px 36px -6px rgba(31, 27, 22, 0.08), inset 0 1.5px 0 #FFF, inset 0 -3px 0 rgba(31, 27, 22, 0.04)",
              } : {
                background: "linear-gradient(135deg, #2D231E 0%, #1A1411 100%)",
                borderColor: "rgba(251, 191, 36, 0.2)",
                boxShadow: "0 18px 40px -8px rgba(0, 0, 0, 0.55), inset 0 1.5px 0 rgba(255, 255, 255, 0.1), inset 0 -3.5px 0 rgba(0, 0, 0, 0.4)",
              }}
            >
              {/* Glossy gloss sheen overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />

              <div className="w-full flex-1 min-w-0 z-10">
                <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest rounded-full px-3 py-1 inline-block mb-3 border shadow-sm ${
                  theme === "light" ? "text-amber-700 bg-white/95 border-amber-500/20" : "text-amber-400 bg-black/40 border-amber-500/20"
                }`}>
                  Exclusive Deal
                </span>
                <h3 className="font-serif text-3xl sm:text-5xl font-black text-[#1F1B16] dark:text-[#F7F3EC] leading-none mb-2 sm:mb-4">
                  25% OFF
                </h3>
                <p className="font-serif text-sm sm:text-lg font-bold text-[#1F1B16]/85 dark:text-[#F7F3EC]/85 mb-4 sm:mb-6 leading-snug">
                  Handcrafted Oak Lounge Seating
                </p>
                <a
                  href="#collections"
                  className="inline-flex items-center gap-2 text-white rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-all duration-300 active:scale-95 border hover:scale-[1.02] shadow-md"
                  style={{
                    background: "linear-gradient(180deg, #34D399 0%, #10B981 50%, #059669 100%)",
                    borderColor: "rgba(52,211,153,0.3)",
                    boxShadow: "0 4px 10px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 0 rgba(0,0,0,0.25)",
                  }}
                >
                  <span>Shop Deal</span> <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Inset Photo Frame */}
              <div
                className={`w-full h-auto aspect-[16/9] rounded-2xl overflow-hidden shrink-0 relative border p-2 ${
                  theme === "light" ? "bg-black/5 border-charcoal/10" : "bg-black/35 border-white/10"
                }`}
                style={{
                  boxShadow: "inset 0 3px 8px rgba(0,0,0,0.25)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=700"
                  alt="Lounge Seat Promo"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
