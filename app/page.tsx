"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ArrowRight,
  Compass,
  Heart,
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

export default function HomePage() {
  const { wishlist, toggleWishlist, products: storeProducts, customerTestimonials, addCustomerTestimonial, orders, brandPartners } = useStore();
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const [activeRoomTab, setActiveRoomTab] = useState<"Living Room" | "Study" | "Media Room" | "Dining Room">("Living Room");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    role: "Verified Customer",
    quote: "",
    rating: 5,
  });
  const [reviewSuccess, setReviewSuccess] = useState(false);

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

            <div className="flex flex-row gap-2.5 w-full sm:w-auto justify-start">
              <a
                href="#collections"
                className="bg-accent-teal hover:bg-accent-teal/90 text-white rounded-full px-5 py-2.5 sm:px-8 sm:py-4 text-[11px] sm:text-sm font-semibold text-center hover:scale-[1.02] shadow-md transition-all duration-300 active:scale-95"
              >
                Shop Now
              </a>
              <a
                href="#lookbook"
                className="border border-white/40 text-white backdrop-blur-sm rounded-full px-5 py-2.5 sm:px-8 sm:py-4 text-[11px] sm:text-sm font-semibold text-center hover:bg-white hover:text-charcoal transition-all duration-300 active:scale-95"
              >
                Explore Collection
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

      {/* AUTO-MOVING BRAND PARTNERS & MATERIALS CAROUSEL WITH REAL LOGOS & BRAND NAMES */}
      <section className="bg-white dark:bg-[#1C1814] py-8 relative z-20 overflow-hidden shadow-sm">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 mb-4 text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center justify-center gap-2 bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 px-4 py-1.5 rounded-full shadow-sm mb-1.5">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-black shrink-0">
              ✓
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#1F1B16] dark:text-[#F7F3EC]">
              Verified Brand Partners & Materials
            </span>
          </div>
          <span className="text-[10px] font-mono text-accent-teal font-bold uppercase tracking-wider">
            Authentic Factory Sourcing Guarantee • Hover to Pause
          </span>
        </div>

        {/* Continuous Auto-Moving Marquee Track with Hover-Pause */}
        <div className="relative w-full overflow-hidden flex py-2 group">
          {/* Soft ambient gradient blur on left & right edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-[#1C1814] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-[#1C1814] to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex items-center gap-6 sm:gap-10 shrink-0 whitespace-nowrap group-hover:[animation-play-state:paused]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25,
            }}
          >
            {(brandPartners && brandPartners.length > 0 ? brandPartners : [
              {
                id: "1",
                name: "Sleepwell",
                tag: "Mattress Tech Partner",
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sleepwell_Logo.png/640px-Sleepwell_Logo.png",
                fallbackLogo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=120",
              },
              {
                id: "2",
                name: "CenturyPly",
                tag: "Marine Teak Grade",
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/CenturyPly_logo.svg/640px-CenturyPly_logo.svg.png",
                fallbackLogo: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=120",
              },
              {
                id: "3",
                name: "Featherlite",
                tag: "Ergonomic Hardware",
                logo: "https://featherlitefurniture.com/wp-content/uploads/2021/04/Featherlite-Logo-1.png",
                fallbackLogo: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=120",
              },
              {
                id: "4",
                name: "Godrej Interio",
                tag: "Steel Joinery",
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Godrej_Logo.svg/512px-Godrej_Logo.svg.png",
                fallbackLogo: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=120",
              },
              {
                id: "5",
                name: "Pepperfry",
                tag: "Verified Merchant",
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Pepperfry_Logo.png/640px-Pepperfry_Logo.png",
                fallbackLogo: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=120",
              },
            ])
              .concat(
                brandPartners && brandPartners.length > 0 ? brandPartners : [
                  {
                    id: "1b",
                    name: "Sleepwell",
                    tag: "Mattress Tech Partner",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sleepwell_Logo.png/640px-Sleepwell_Logo.png",
                    fallbackLogo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=120",
                  },
                  {
                    id: "2b",
                    name: "CenturyPly",
                    tag: "Marine Teak Grade",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/CenturyPly_logo.svg/640px-CenturyPly_logo.svg.png",
                    fallbackLogo: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=120",
                  },
                  {
                    id: "3b",
                    name: "Featherlite",
                    tag: "Ergonomic Hardware",
                    logo: "https://featherlitefurniture.com/wp-content/uploads/2021/04/Featherlite-Logo-1.png",
                    fallbackLogo: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=120",
                  },
                  {
                    id: "4b",
                    name: "Godrej Interio",
                    tag: "Steel Joinery",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Godrej_Logo.svg/512px-Godrej_Logo.svg.png",
                    fallbackLogo: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=120",
                  },
                  {
                    id: "5b",
                    name: "Pepperfry",
                    tag: "Verified Merchant",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Pepperfry_Logo.png/640px-Pepperfry_Logo.png",
                    fallbackLogo: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=120",
                  },
                ]
              )
              .map((brand, idx) => (
                <div
                  key={`${brand.id}-${idx}`}
                  className="flex items-center gap-3.5 bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl px-4.5 py-2.5 shrink-0 shadow-sm hover:border-accent-teal hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        if (brand.fallbackLogo) {
                          (e.target as HTMLImageElement).src = brand.fallbackLogo;
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] font-black shrink-0 shadow-sm">
                        ✓
                      </span>
                      <span className="font-serif text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] group-hover:text-accent-teal transition-colors">
                        {brand.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">
                      • {brand.tag}
                    </span>
                  </div>
                </div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* POPULAR PRODUCTS CATALOG */}
      <section
        id="collections"
        className="py-8 md:py-12 bg-[#FAF8F5] dark:bg-[#1A1612] border-y border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 transition-colors duration-300"
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
                className="min-w-[260px] max-w-[280px] sm:min-w-[340px] sm:max-w-[340px] snap-start flex flex-col bg-white dark:bg-[#1C1814] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 group cursor-pointer shadow-sm hover:shadow-lg transition-all shrink-0"
              >
                {/* Image Frame */}
                <div className="w-full aspect-[4/3] sm:aspect-[4/3] bg-[#FAF8F5] dark:bg-[#1C1814] rounded-xl sm:rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all text-[#1F1B16] dark:text-[#F7F3EC] shadow-md"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        wishlist.some((w) => w.slug === prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
                          ? "fill-accent-terracotta text-accent-terracotta"
                          : "opacity-60"
                      }`}
                    />
                  </button>
                </div>

                {/* Info block */}
                <div className="mt-3 flex justify-between items-end flex-1">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="text-[9px] font-bold text-accent-teal uppercase tracking-widest block mb-0.5">
                      {prod.category}
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#1F1B16] dark:text-[#F7F3EC] leading-snug group-hover:text-accent-teal transition-colors truncate">
                      {prod.name}
                    </h3>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-[#1F1B16] dark:text-[#F7F3EC] block mt-1">
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
                    className="flex-shrink-0 px-3.5 py-1.5 border border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 text-[#1F1B16] dark:text-[#F7F3EC] hover:bg-accent-teal hover:text-white dark:hover:bg-accent-teal dark:hover:text-white rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors"
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
                        : "bg-charcoal/5 text-charcoal dark:bg-cream/10 dark:text-cream"
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
                      className="md:col-span-7 relative h-[320px] sm:h-[450px] md:h-[600px] rounded-3xl overflow-hidden group shadow-md"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent flex items-end p-6 sm:p-8">
                        <div>
                          <h3 className="font-serif text-xl sm:text-3xl font-bold text-cream">
                            {item.title}
                          </h3>
                          <p className="text-cream/80 text-[10px] sm:text-xs mt-1 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                            <Compass className="w-3.5 h-3.5" /> Millennium Showcase
                          </p>
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
                        className={`relative h-[160px] sm:h-[200px] md:h-[287px] rounded-2xl overflow-hidden group shadow-sm ${
                          idx === 2 ? "hidden md:block" : ""
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent flex items-end p-4 sm:p-6">
                          <div>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-cream">
                              {item.title}
                            </h3>
                            <p className="text-cream/70 text-[9px] uppercase tracking-wider mt-0.5">
                              Handcrafted Detail
                            </p>
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
              className="inline-flex items-center gap-2.5 bg-accent-teal hover:bg-accent-teal/90 text-white rounded-full px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 active:scale-95 border border-accent-teal self-start sm:self-auto"
            >
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              <span>+ Write a Review</span>
            </button>
          </div>

          {/* Auto-sliding Horizontal Track when items exceed 3 */}
          <div
            ref={testimonialCarouselRef}
            className="flex flex-row gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {(customerTestimonials && customerTestimonials.length > 0 ? customerTestimonials : TESTIMONIALS).map((test, index) => {
              const isActive = index === activeTestimonial;
              return (
                <div
                  key={test.id}
                  onClick={() => setActiveTestimonial(index)}
                  className={`min-w-[280px] sm:min-w-[340px] md:min-w-[380px] max-w-[400px] snap-start rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between cursor-pointer border shrink-0 ${
                    isActive
                      ? "bg-white dark:bg-[#1C1814] border-accent-teal ring-2 ring-accent-teal/40 shadow-md scale-[1.02]"
                      : "bg-white/80 dark:bg-[#1C1814]/80 text-[#1F1B16] dark:text-[#F7F3EC] border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 shadow-sm opacity-90 hover:opacity-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        ✓ Verified Buyer
                      </span>
                    </div>

                    <p className="font-serif italic text-xs sm:text-sm leading-relaxed text-[#1F1B16]/90 dark:text-[#F7F3EC]/90 mb-6 line-clamp-4">
                      &ldquo;{test.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3.5 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={test.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"}
                      alt={test.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-accent-teal/40 shrink-0 shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm leading-tight truncate text-[#1F1B16] dark:text-[#F7F3EC]">{test.name}</h4>
                      <p className="text-[10px] sm:text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 truncate mt-0.5 font-medium">
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
              className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-2xl z-10 text-[#1F1B16] dark:text-[#F7F3EC] scrollbar-thin"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 mb-4 sticky top-0 bg-white dark:bg-[#1C1814] z-10">
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
                    if (!newReview.name || !newReview.quote) return;
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
                      className="w-full px-4 py-3 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-bold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
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
                      className="w-full px-4 py-3 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-medium focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1.5 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                      Rating *
                    </label>
                    <div className="flex gap-2 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 transition-all ${
                              star <= newReview.rating
                                ? "fill-amber-400 text-amber-400 scale-110"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        </button>
                      ))}
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
                      className="w-full px-4 py-3 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-medium focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent-teal text-white font-extrabold py-3.5 rounded-full text-xs uppercase tracking-wider hover:bg-accent-teal/90 transition-all shadow-md mt-2"
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
            <div className="bg-[#E6F4F1] dark:bg-[#1A2624] rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex flex-row sm:flex-col items-center sm:items-start justify-between gap-4 shadow-md group">
              <div className="flex-1 min-w-0 z-10">
                <span className="text-accent-teal text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest bg-white/90 dark:bg-black/60 rounded-full px-2.5 py-1 inline-block mb-2 sm:mb-3">
                  Limited Offer
                </span>
                <h3 className="font-serif text-xl sm:text-4xl md:text-5xl font-extrabold text-[#1F1B16] dark:text-[#F7F3EC] leading-none mb-1 sm:mb-3">
                  40% OFF
                </h3>
                <p className="font-serif text-xs sm:text-lg font-semibold text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 mb-3 sm:mb-5 line-clamp-2">
                  Odisha Teak Cabinets & Storage
                </p>
                <a
                  href="#collections"
                  className="bg-[#1F1B16] text-[#F7F3EC] dark:bg-[#F7F3EC] dark:text-[#1F1B16] hover:bg-accent-teal rounded-full px-4 py-2 sm:px-6 sm:py-3 text-[11px] sm:text-xs font-bold inline-flex items-center gap-1.5 transition-all active:scale-95"
                >
                  Shop Deal <ArrowRight className="w-3.5 h-3.5 text-accent-teal" />
                </a>
              </div>

              <div className="w-28 h-28 sm:w-full sm:h-auto sm:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden shrink-0 relative border border-[#1F1B16]/5 dark:border-[#F7F3EC]/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=700"
                  alt="Teak Cabinet Promo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="bg-[#FBF0EA] dark:bg-[#281F1A] rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex flex-row sm:flex-col items-center sm:items-start justify-between gap-4 shadow-md group">
              <div className="flex-1 min-w-0 z-10">
                <span className="text-amber-600 dark:text-amber-400 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest bg-white/90 dark:bg-black/60 rounded-full px-2.5 py-1 inline-block mb-2 sm:mb-3">
                  Exclusive Deal
                </span>
                <h3 className="font-serif text-xl sm:text-4xl md:text-5xl font-extrabold text-[#1F1B16] dark:text-[#F7F3EC] leading-none mb-1 sm:mb-3">
                  25% OFF
                </h3>
                <p className="font-serif text-xs sm:text-lg font-semibold text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 mb-3 sm:mb-5 line-clamp-2">
                  Handcrafted Oak Lounge Seating
                </p>
                <a
                  href="#collections"
                  className="bg-[#1F1B16] text-[#F7F3EC] dark:bg-[#F7F3EC] dark:text-[#1F1B16] hover:bg-accent-teal rounded-full px-4 py-2 sm:px-6 sm:py-3 text-[11px] sm:text-xs font-bold inline-flex items-center gap-1.5 transition-all active:scale-95"
                >
                  Shop Deal <ArrowRight className="w-3.5 h-3.5 text-accent-teal" />
                </a>
              </div>

              <div className="w-28 h-28 sm:w-full sm:h-auto sm:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden shrink-0 relative border border-[#1F1B16]/5 dark:border-[#F7F3EC]/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=700"
                  alt="Lounge Seat Promo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
