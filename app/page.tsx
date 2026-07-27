"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ChevronLeft,
  ChevronRight,
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

// Format currency helper for Indian Rupees (INR)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Popular Products Mock Data
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

// Room Inspiration Mock Data
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

// Testimonials Mock Data
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
  const { wishlist, toggleWishlist } = useStore();
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const [activeRoomTab, setActiveRoomTab] = useState<"Living Room" | "Study" | "Media Room" | "Dining Room">("Living Room");
  const [activeTestimonial, setActiveTestimonial] = useState(1);

  const productCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const scrollCarousel = (direction: "left" | "right") => {
    if (productCarouselRef.current) {
      const { scrollLeft, clientWidth } = productCarouselRef.current;
      const amount = clientWidth * 0.7;
      const target = direction === "left" ? scrollLeft - amount : scrollLeft + amount;
      productCarouselRef.current.scrollTo({ left: target, behavior: "smooth" });
    }
  };

  const currentSlide = HERO_SLIDES[heroImageIdx];

  return (
    <div className="min-h-screen bg-[#F7F3EC] dark:bg-[#12100e] text-[#1F1B16] dark:text-[#F7F3EC] font-sans selection:bg-accent-teal/20 selection:text-[#1F1B16] relative transition-colors duration-300">
      {/* 1. NAVBAR */}
      <Navbar transparent />

      {/* 2. HERO SECTION */}
      <section
        id="home"
        className="relative h-screen w-full overflow-hidden flex items-center bg-[#1F1B16]"
      >
        {/* Full-size slideshow background with Ken-Burns fade/zoom transition */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
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
          {/* Crisp background imagery without heavy black shadow overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Text Overlay Content with Animated Smooth Fade/Slide */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full z-10 relative">
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
                <h1 className="font-serif text-4xl sm:text-5xl md:text-[58px] font-bold leading-[1.1] mb-4 text-white tracking-tight drop-shadow-lg">
                  {currentSlide.headline}
                </h1>
                <p className="text-white/95 text-sm md:text-base mb-8 font-medium tracking-wide max-w-md italic drop-shadow-md">
                  {currentSlide.quote}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="#collections"
                className="bg-accent-teal hover:bg-accent-teal/90 text-white rounded-full px-8 py-4 font-semibold text-center hover:scale-[1.02] hover:shadow-warm-lg transition-all duration-300 active:scale-95"
              >
                Shop Now
              </a>
              <a
                href="#inspiration"
                className="border border-white/30 text-white rounded-full px-8 py-4 font-semibold text-center hover:bg-white hover:text-charcoal transition-all duration-300 active:scale-95"
              >
                Explore Collection
              </a>
            </div>
          </div>
        </div>

        {/* Minimal Slider Dots at the bottom-right */}
        <div className="absolute bottom-8 right-12 z-20 flex gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroImageIdx(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                heroImageIdx === idx ? "w-8 bg-accent-teal" : "w-2 bg-white/40 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 3. POPULAR PRODUCTS & INTERACTIVE CATALOG */}
      <section
        id="collections"
        className="py-24 md:py-32 bg-[#FAF8F5] dark:bg-[#1A1612] border-y border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 transition-colors duration-300"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-accent-teal text-sm font-bold tracking-widest uppercase mb-2 block">
                Handcrafted Catalog
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] transition-colors">
                Popular Collections & Filter
              </h2>
              <p className="text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 text-sm mt-2 transition-colors">
                Filter by space category, material, and price range to find your ideal piece.
              </p>
            </div>
            <a
              href="/spaces/home"
              className="border border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 text-[#1F1B16] dark:text-[#F7F3EC] rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#1F1B16] hover:text-[#F7F3EC] dark:hover:bg-[#F7F3EC] dark:hover:text-[#1F1B16] transition-all self-start md:self-end"
            >
              Explore Spaces Catalog →
            </a>
          </div>

          {/* Carousel container */}
          <div
            ref={productCarouselRef}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {POPULAR_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="min-w-[280px] sm:min-w-[340px] max-w-[340px] snap-start flex flex-col group cursor-pointer"
              >
                {/* Image Frame */}
                <div
                  className="bg-[#FAF8F5] dark:bg-[#1C1814] rounded-2xl aspect-[4/5] relative overflow-hidden flex items-center justify-center border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Wishlist toggle */}
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
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-md hover:bg-white dark:hover:bg-black transition-all text-[#1F1B16] dark:text-[#F7F3EC] shadow-md"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist.some((w) => w.slug === prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
                          ? "fill-accent-terracotta text-accent-terracotta"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    />
                  </button>
                </div>

                {/* Info block */}
                <div className="mt-4 flex justify-between items-end">
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="text-[9px] font-bold text-accent-teal uppercase tracking-widest block mb-1">
                      {prod.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#1F1B16] dark:text-[#F7F3EC] leading-snug group-hover:text-accent-teal transition-colors truncate">
                      {prod.name}
                    </h3>
                    <span className="font-mono text-sm font-extrabold text-[#1F1B16] dark:text-[#F7F3EC] block mt-1.5">
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
                    className="flex-shrink-0 px-4 py-2 border border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 text-[#1F1B16] dark:text-[#F7F3EC] hover:bg-accent-teal hover:text-white dark:hover:bg-accent-teal dark:hover:text-white rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors"
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ROOM INSPIRATION */}
      <section id="lookbook" className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent-teal text-sm font-bold tracking-widest uppercase mb-2 block">
              Curated Spaces
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] leading-tight">
              Get Inspired By Our Room Setups
            </h2>
            <p className="text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mt-4 text-sm md:text-base">
              Explore how our handmade collection transforms functional areas into warm,
              aesthetic sanctuaries.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {(["Living Room", "Study", "Media Room", "Dining Room"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveRoomTab(tab)}
                    className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                      activeRoomTab === tab
                        ? "bg-charcoal text-cream shadow-warm-sm"
                        : "bg-charcoal/5 text-charcoal hover:bg-charcoal/10"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Asymmetric 2x2 Image gallery with crossfade */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRoomTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
              >
                {/* Large visual item (takes 7 cols) */}
                {ROOM_INSPIRATION[activeRoomTab]
                  .filter((item) => item.size === "large")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="md:col-span-7 relative h-[450px] md:h-[600px] rounded-[32px] overflow-hidden group shadow-warm-md"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent flex items-end p-8">
                        <div>
                          <h3 className="font-serif text-2xl md:text-3xl font-bold text-cream">
                            {item.title}
                          </h3>
                          <p className="text-cream/80 text-xs mt-2 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                            <Compass className="w-4 h-4" /> Millennium Showcase
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Sub grid items (takes 5 cols) */}
                <div className="md:col-span-5 flex flex-col gap-6">
                  {ROOM_INSPIRATION[activeRoomTab]
                    .filter((item) => item.size === "small")
                    .map((item, idx) => (
                      <div
                        key={item.id}
                        className={`relative h-[180px] md:h-[287px] rounded-[24px] overflow-hidden group shadow-warm-sm ${
                          idx === 2 ? "hidden md:block" : ""
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent flex items-end p-6">
                          <div>
                            <h3 className="font-serif text-lg font-bold text-cream">
                              {item.title}
                            </h3>
                            <p className="text-cream/70 text-[10px] mt-1 font-semibold uppercase tracking-wider">
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

      {/* 5. TESTIMONIALS */}
      <section id="about-us" className="py-24 md:py-32 bg-[#F7F3EC] dark:bg-[#12100e] transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-accent-teal text-sm font-bold tracking-widest uppercase mb-2 block">
              Testimonials
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
              What Our Customers Say
            </h2>
          </div>

          {/* Staggered Card Grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {TESTIMONIALS.map((test, index) => {
              const isMiddle = index === 1;
              return (
                <motion.div
                  key={test.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                  }}
                  onClick={() => setActiveTestimonial(index)}
                  className={`rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between cursor-pointer border ${
                    isMiddle
                      ? "bg-accent-teal text-cream border-accent-teal shadow-warm-lg scale-105 z-10"
                      : "bg-[#FAF8F5] dark:bg-[#1C1814] text-[#1F1B16] dark:text-[#F7F3EC] border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 hover:border-accent-teal shadow-warm-sm hover:-translate-y-1"
                  }`}
                >
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 fill-current ${
                            isMiddle ? "text-[#FDF3D8]" : "text-accent-terracotta"
                          }`}
                        />
                      ))}
                    </div>

                    <p className={`font-serif italic text-lg leading-relaxed mb-8 ${isMiddle ? "text-cream" : "text-charcoal"}`}>
                      &ldquo;{test.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={test.avatar}
                      alt={test.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
                    />
                    <div>
                      <h4 className="font-bold text-sm leading-tight">{test.name}</h4>
                      <p className={`text-xs mt-0.5 ${isMiddle ? "text-cream/80" : "text-charcoal/60"}`}>
                        {test.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-12">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === i
                    ? "bg-accent-teal w-6"
                    : "bg-charcoal/20"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. SPECIAL OFFERS */}
      <section id="offer" className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Promo Card 1 */}
            <div className="bg-pastel-mint rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between h-[380px] sm:h-[450px] shadow-warm-md group hover:shadow-warm-lg transition-all duration-300">
              <div className="max-w-[50%] z-10">
                <span className="text-accent-teal text-xs font-extrabold uppercase tracking-widest bg-white/70 rounded-full px-3 py-1 inline-block mb-4 shadow-warm-sm">
                  Limited Offer
                </span>
                <h3 className="font-serif text-3xl md:text-5xl font-extrabold text-charcoal leading-none mb-3">
                  40% OFF
                </h3>
                <p className="font-serif text-lg md:text-xl font-semibold text-charcoal/80 mb-6">
                  Odisha Teak Cabinets & Storage
                </p>
                <a
                  href="#collections"
                  className="bg-charcoal text-cream rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-charcoal-light hover:shadow-warm-md transition-all duration-300"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Background Cutout Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=700"
                alt="Teak Cabinet Promo"
                className="absolute right-0 bottom-0 w-[55%] h-[90%] object-cover object-left rounded-tl-[32px] group-hover:scale-105 transition-transform duration-500 shadow-warm-lg"
              />
            </div>

            {/* Promo Card 2 */}
            <div className="bg-pastel-blush rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between h-[380px] sm:h-[450px] shadow-warm-md group hover:shadow-warm-lg transition-all duration-300">
              <div className="max-w-[50%] z-10">
                <span className="text-accent-terracotta text-xs font-extrabold uppercase tracking-widest bg-white/70 rounded-full px-3 py-1 inline-block mb-4 shadow-warm-sm">
                  Exclusive Deal
                </span>
                <h3 className="font-serif text-3xl md:text-5xl font-extrabold text-charcoal leading-none mb-3">
                  25% OFF
                </h3>
                <p className="font-serif text-lg md:text-xl font-semibold text-charcoal/80 mb-6">
                  Handcrafted Oak Lounge Seating
                </p>
                <a
                  href="#collections"
                  className="bg-charcoal text-cream rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-charcoal-light hover:shadow-warm-md transition-all duration-300"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Background Cutout Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=700"
                alt="Lounge Seat Promo"
                className="absolute right-0 bottom-0 w-[55%] h-[90%] object-cover object-left rounded-tl-[32px] group-hover:scale-105 transition-transform duration-500 shadow-warm-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brief Brand Heritage Narrative (Just Above Footer) */}
      <section className="py-16 bg-cream/30 dark:bg-[#12100E]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-accent-teal text-xs font-bold uppercase tracking-widest block mb-2">Our Craftsmanship</span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold">Handmade Teak & Oak Furniture Built to Last a Lifetime</h3>
            <p className="text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 text-sm mt-3 leading-relaxed">
              At Millennium Furniture, every piece is handcrafted in Odisha using sustainably harvested solid timber, custom joinery, and non-toxic matte finishes. Delivered with white-glove assembly.
            </p>
          </div>
          <a
            href="/spaces/home"
            className="px-8 py-3.5 bg-accent-teal text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-accent-teal/90 transition-all flex-shrink-0 shadow-sm"
          >
            Explore Catalog
          </a>
        </div>
      </section>

      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
}
