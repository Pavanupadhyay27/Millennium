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
  const { wishlist, toggleWishlist, products: storeProducts } = useStore();
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const [activeRoomTab, setActiveRoomTab] = useState<"Living Room" | "Study" | "Media Room" | "Dining Room">("Living Room");
  const [activeTestimonial, setActiveTestimonial] = useState(1);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
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

      {/* POPULAR PRODUCTS CATALOG */}
      <section
        id="collections"
        className="py-16 md:py-32 bg-[#FAF8F5] dark:bg-[#1A1612] border-y border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 transition-colors duration-300"
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-accent-teal text-xs font-bold tracking-widest uppercase mb-1.5 block">
                Handcrafted Catalog
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] transition-colors">
                Popular Collections
              </h2>
              <p className="text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 text-xs sm:text-sm mt-1.5 transition-colors">
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

          <div
            ref={productCarouselRef}
            className="flex sm:flex-row flex-col gap-3 sm:gap-6 overflow-x-auto pb-4 sm:pb-6 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {displayProducts.map((prod) => (
              <div
                key={prod.id}
                className="w-full sm:min-w-[320px] sm:max-w-[320px] snap-start flex flex-row sm:flex-col bg-white dark:bg-[#1C1814] rounded-2xl p-2.5 sm:p-0 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 group cursor-pointer shadow-sm hover:shadow-md transition-all gap-3.5 sm:gap-0"
              >
                {/* Image Frame - Small horizontal square thumbnail on mobile */}
                <div className="w-28 h-28 shrink-0 sm:w-full sm:h-auto sm:aspect-[4/5] bg-[#FAF8F5] dark:bg-[#1C1814] rounded-xl sm:rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5">
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
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all text-[#1F1B16] dark:text-[#F7F3EC] shadow-md"
                  >
                    <Heart
                      className={`w-3 h-3 ${
                        wishlist.some((w) => w.slug === prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
                          ? "fill-accent-terracotta text-accent-terracotta"
                          : "opacity-60"
                      }`}
                    />
                  </button>
                </div>

                {/* Info block - Right side on mobile, bottom on desktop */}
                <div className="flex-1 min-w-0 sm:mt-3 flex flex-col sm:flex-row justify-between sm:items-end p-1 sm:p-0">
                  <div className="flex-1 min-w-0 sm:pr-3">
                    <span className="text-[9px] font-bold text-accent-teal uppercase tracking-widest block mb-0.5">
                      {prod.category}
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#1F1B16] dark:text-[#F7F3EC] leading-snug group-hover:text-accent-teal transition-colors line-clamp-2 sm:truncate">
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
                    className="mt-2 sm:mt-0 flex-shrink-0 px-3 py-1.5 sm:px-3.5 border border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 text-[#1F1B16] dark:text-[#F7F3EC] hover:bg-accent-teal hover:text-white dark:hover:bg-accent-teal dark:hover:text-white rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors self-start sm:self-auto"
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
      <section id="lookbook" className="py-16 md:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <span className="text-accent-teal text-xs font-bold tracking-widest uppercase mb-1.5 block">
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

      {/* TESTIMONIALS */}
      <section id="about-us" className="py-16 md:py-32 bg-[#F7F3EC] dark:bg-[#12100e] transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-10 md:mb-16">
            <span className="text-accent-teal text-xs font-bold tracking-widest uppercase mb-1.5 block">
              Testimonials
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {TESTIMONIALS.map((test, index) => {
              const isMiddle = index === 1;
              return (
                <div
                  key={test.id}
                  onClick={() => setActiveTestimonial(index)}
                  className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between cursor-pointer border ${
                    isMiddle
                      ? "bg-accent-teal text-cream border-accent-teal shadow-xl"
                      : "bg-[#FAF8F5] dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 fill-current ${
                            isMiddle ? "text-[#FDF3D8]" : "text-accent-terracotta"
                          }`}
                        />
                      ))}
                    </div>

                    <p className={`font-serif italic text-sm sm:text-base leading-relaxed mb-6 ${isMiddle ? "text-cream" : "text-charcoal dark:text-cream"}`}>
                      &ldquo;{test.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={test.avatar}
                      alt={test.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm leading-tight">{test.name}</h4>
                      <p className={`text-[11px] mt-0.5 ${isMiddle ? "text-cream/80" : "text-charcoal/60 dark:text-cream/60"}`}>
                        {test.role}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SPECIAL OFFERS */}
      <section id="offer" className="py-16 md:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Promo Card 1 */}
            <div className="bg-pastel-mint rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[300px] sm:min-h-[380px] shadow-md group">
              <div className="max-w-[55%] sm:max-w-[50%] z-10">
                <span className="text-accent-teal text-[10px] font-extrabold uppercase tracking-widest bg-white/80 rounded-full px-2.5 py-1 inline-block mb-3">
                  Limited Offer
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold text-charcoal leading-none mb-2 sm:mb-3">
                  40% OFF
                </h3>
                <p className="font-serif text-sm sm:text-lg font-semibold text-charcoal/80 mb-5">
                  Odisha Teak Cabinets & Storage
                </p>
                <a
                  href="#collections"
                  className="bg-charcoal text-cream rounded-full px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-charcoal-light transition-all"
                >
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=700"
                alt="Teak Cabinet Promo"
                className="absolute right-0 bottom-0 w-[48%] sm:w-[55%] h-[85%] sm:h-[90%] object-cover object-left rounded-tl-3xl group-hover:scale-105 transition-transform duration-500 shadow-md"
              />
            </div>

            {/* Promo Card 2 */}
            <div className="bg-pastel-blush rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[300px] sm:min-h-[380px] shadow-md group">
              <div className="max-w-[55%] sm:max-w-[50%] z-10">
                <span className="text-accent-terracotta text-[10px] font-extrabold uppercase tracking-widest bg-white/80 rounded-full px-2.5 py-1 inline-block mb-3">
                  Exclusive Deal
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold text-charcoal leading-none mb-2 sm:mb-3">
                  25% OFF
                </h3>
                <p className="font-serif text-sm sm:text-lg font-semibold text-charcoal/80 mb-5">
                  Handcrafted Oak Lounge Seating
                </p>
                <a
                  href="#collections"
                  className="bg-charcoal text-cream rounded-full px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-charcoal-light transition-all"
                >
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=700"
                alt="Lounge Seat Promo"
                className="absolute right-0 bottom-0 w-[48%] sm:w-[55%] h-[85%] sm:h-[90%] object-cover object-left rounded-tl-3xl group-hover:scale-105 transition-transform duration-500 shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
