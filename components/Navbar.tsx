"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Phone,
  ArrowRight,
  Package,
  Home,
  Briefcase,
  Building,
  Sparkles,
  Tag,
  Boxes,
  Compass,
} from "lucide-react";
import { useStore } from "../lib/store";

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [spacesDropdownOpen, setSpacesDropdownOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const { cart, toggleCartDrawer, products, cmsSettings } = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
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

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.dispatchEvent(new Event("theme-change"));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter matching products and categories in real-time
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { products: [], categories: [] };
    const q = searchQuery.toLowerCase().trim();

    const matchedProds = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );

    const matchedCats = Array.from(
      new Set(
        products
          .map((p) => p.category)
          .filter((cat) => cat.toLowerCase().includes(q))
      )
    );

    return { products: matchedProds, categories: matchedCats };
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/spaces/home?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const shouldBeTransparent = transparent && !isScrolled;

  const textThemeClass = shouldBeTransparent
    ? (theme === "light" ? "text-charcoal/90 hover:text-charcoal font-bold" : "text-white/90 hover:text-white font-bold")
    : (theme === "light" ? "text-charcoal/90 hover:text-accent-teal font-bold" : "text-white/90 hover:text-emerald-400 font-bold");

  const iconThemeClass = shouldBeTransparent
    ? (theme === "light" ? "text-charcoal/90 hover:bg-charcoal/10 hover:text-charcoal" : "text-white/90 hover:bg-white/10 hover:text-white")
    : (theme === "light" ? "text-charcoal/90 hover:bg-charcoal/10 hover:text-charcoal" : "text-white/90 hover:bg-white/10 hover:text-white");

  return (
    <>
      {/* LIVE CMS ANNOUNCEMENT BAR BANNER WITH DISMISS BUTTON */}
      {cmsSettings?.showAnnouncementBar && cmsSettings?.announcementBarText && (
        <div className="fixed top-0 left-0 w-full z-50 bg-[#1F1B16] text-[#F7F3EC] py-1.5 px-4 text-center text-[10px] sm:text-xs font-bold tracking-wide flex items-center justify-between shadow-md">
          <div className="flex-1 text-center truncate max-w-4xl mx-auto">
            {cmsSettings.announcementBarText}
          </div>
          <button
            onClick={() => useStore.getState().updateCmsSettings({ showAnnouncementBar: false })}
            className="w-5 h-5 rounded-full hover:bg-white/20 text-[#F7F3EC] flex items-center justify-center transition-colors shrink-0"
            title="Dismiss Announcement"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <header className={`fixed ${cmsSettings?.showAnnouncementBar ? "top-8" : "top-3"} left-0 w-full z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between pointer-events-none transition-all duration-300`}>
      
      {/* BRAND LOGO */}
      <a
        href="/"
        className="pointer-events-auto shrink-0 flex items-center transition-all duration-300 hover:scale-105 translate-y-2 md:translate-y-3.5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Millennium Furniture Logo"
          className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-md"
          style={{ imageRendering: "-webkit-optimize-contrast" }}
        />
      </a>

      {/* FLOATING NAV PILL */}
      <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 pointer-events-auto relative">
        <nav
          className="transition-all duration-300 rounded-full border px-4 sm:px-8 py-2.5 flex items-center gap-3 sm:gap-6 relative"
          style={theme === "light" ? {
            background: "linear-gradient(180deg, rgba(250, 247, 242, 0.85) 0%, rgba(247, 243, 236, 0.95) 100%)",
            boxShadow: "0 14px 32px -4px rgba(31, 27, 22, 0.15), inset 0 1.5px 0 rgba(255, 255, 255, 0.6), inset 0 -2.5px 0 rgba(31, 27, 22, 0.1)",
            borderColor: "rgba(31, 27, 22, 0.15)",
          } : {
            background: "linear-gradient(180deg, #2D2721 0%, #1A1612 100%)",
            boxShadow: "0 14px 32px -4px rgba(0, 0, 0, 0.6), inset 0 1.5px 0 rgba(255, 255, 255, 0.25), inset 0 -2.5px 0 rgba(0, 0, 0, 0.5)",
            borderColor: "rgba(255,255,255,0.2)",
          }}
        >
          {/* Search Input field */}
          {searchActive ? (
            <motion.form
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "260px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 px-3 py-1 bg-white/90 dark:bg-[#1C1814]/90 border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 rounded-full shadow-inner relative"
            >
              <Search className="w-3.5 h-3.5 shrink-0 text-accent-teal" />
              <input
                type="text"
                placeholder="Search products or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold focus:outline-none text-[#1F1B16] dark:text-[#F7F3EC] placeholder:text-[#1F1B16]/60 dark:placeholder:text-[#F7F3EC]/60"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setSearchActive(false);
                  setSearchQuery("");
                }}
                className="p-0.5 rounded-full hover:bg-[#1F1B16]/10 dark:hover:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.form>
          ) : (
            /* Desktop Navigation Links */
            <div className="hidden lg:flex items-center gap-7">
              <a href="/" className={`text-xs font-bold tracking-wider uppercase transition-colors py-1 ${textThemeClass}`}>
                Home
              </a>

              {/* Spaces Dropdown Menu */}
              <div
                className="relative"
                onMouseEnter={() => setSpacesDropdownOpen(true)}
                onMouseLeave={() => setSpacesDropdownOpen(false)}
              >
                <button
                  className={`text-xs font-bold tracking-wider uppercase transition-colors py-1 flex items-center gap-1.5 ${textThemeClass}`}
                >
                  Spaces <ChevronDown className={`w-3.5 h-3.5 transition-transform ${spacesDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {spacesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 border rounded-3xl p-3 flex flex-col gap-1.5 z-50 overflow-hidden"
                      style={theme === "light" ? {
                        background: "linear-gradient(180deg, rgba(250, 247, 242, 0.95) 0%, rgba(247, 243, 236, 0.98) 100%)",
                        boxShadow: "0 20px 50px rgba(31, 27, 22, 0.15), inset 0 1.5px 0 rgba(255, 255, 255, 0.6)",
                        borderColor: "rgba(31, 27, 22, 0.15)",
                      } : {
                        background: "linear-gradient(180deg, #2D2721 0%, #1A1612 100%)",
                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1.5px 0 rgba(255, 255, 255, 0.25)",
                        borderColor: "rgba(255,255,255,0.2)",
                      }}
                    >
                      <a
                        href="/spaces/home"
                        className={`px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between group border border-transparent hover:border-[#2F6F62]/20 hover:bg-[#2F6F62]/5 ${
                          theme === "light" ? "text-charcoal hover:text-accent-teal" : "text-[#F7F3EC] hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2">🛋️ Home Spaces</span>
                        <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                      <a
                        href="/spaces/office"
                        className={`px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between group border border-transparent hover:border-[#2F6F62]/20 hover:bg-[#2F6F62]/5 ${
                          theme === "light" ? "text-charcoal hover:text-accent-teal" : "text-[#F7F3EC] hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2">💼 Office & Work</span>
                        <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                      <a
                        href="/spaces/commercial"
                        className={`px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between group border border-transparent hover:border-[#2F6F62]/20 hover:bg-[#2F6F62]/5 ${
                          theme === "light" ? "text-charcoal hover:text-accent-teal" : "text-[#F7F3EC] hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2">🏨 Commercial & Lobby</span>
                        <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                      <a
                        href="/spaces/outdoor"
                        className={`px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between group border border-transparent hover:border-[#2F6F62]/20 hover:bg-[#2F6F62]/5 ${
                          theme === "light" ? "text-charcoal hover:text-accent-teal" : "text-[#F7F3EC] hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2">🌿 Outdoor & Patio</span>
                        <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a href="/#lookbook" className={`text-xs font-bold tracking-wider uppercase transition-colors py-1 ${textThemeClass}`}>
                Lookbook
              </a>

              <a href="/#offer" className={`text-xs font-bold tracking-wider uppercase transition-colors py-1 ${textThemeClass}`}>
                Offer
              </a>

              <a href="/wholesale" className={`text-xs font-bold tracking-wider uppercase transition-colors py-1 ${textThemeClass}`}>
                Wholesale
              </a>

              <a href="/#contact" className={`text-xs font-bold tracking-wider uppercase transition-colors py-1 ${textThemeClass}`}>
                Contact
              </a>
            </div>
          )}

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              suppressHydrationWarning
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${iconThemeClass}`}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            
            <button
              suppressHydrationWarning
              onClick={() => setSearchActive(!searchActive)}
              aria-label="Toggle Search"
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                searchActive ? "bg-accent-teal text-white" : iconThemeClass
              }`}
            >
              {searchActive ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            <a
              href="/account"
              aria-label="Account"
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${iconThemeClass}`}
            >
              <User className="w-4 h-4" />
            </a>

            <button
              suppressHydrationWarning
              onClick={() => toggleCartDrawer(true)}
              aria-label="Cart"
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all relative ${iconThemeClass}`}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-teal text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              suppressHydrationWarning
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${iconThemeClass}`}
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5 text-accent-teal" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </nav>

        {/* LIVE SEARCH AUTO-SUGGESTION DROPDOWN */}
        <AnimatePresence>
          {searchActive && searchQuery.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute top-full left-0 right-0 mt-3 w-full min-w-[300px] sm:min-w-[380px] bg-white dark:bg-[#1C1814] border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 rounded-3xl shadow-2xl p-4 z-50 text-[#1F1B16] dark:text-[#F7F3EC] overflow-hidden"
            >
              {searchResults.products.length > 0 || searchResults.categories.length > 0 ? (
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                  {/* Category Suggestions */}
                  {searchResults.categories.length > 0 && (
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-teal block mb-1.5">
                        Categories
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {searchResults.categories.map((cat) => (
                          <a
                            key={cat}
                            href={`/spaces/home?category=${encodeURIComponent(cat)}`}
                            className="px-3 py-1 rounded-full bg-accent-teal/10 hover:bg-accent-teal text-accent-teal hover:text-white text-xs font-semibold transition-all"
                          >
                            {cat}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Product List */}
                  {searchResults.products.length > 0 && (
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-teal block mb-2">
                        Matching Products
                      </span>
                      <div className="space-y-2">
                        {searchResults.products.slice(0, 4).map((prod) => (
                          <a
                            key={prod.id}
                            href={`/product/${prod.slug}`}
                            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#1F1B16]/5 dark:hover:bg-[#F7F3EC]/5 transition-all group"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 rounded-xl object-cover border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-serif font-bold text-xs group-hover:text-accent-teal transition-colors truncate">
                                {prod.name}
                              </h5>
                              <span className="text-[10px] text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 block font-mono">
                                ₹{prod.price.toLocaleString("en-IN")} • {prod.category}
                              </span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-accent-teal shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* NO MATCHES FOUND -> CONTACT US DIRECT ASSISTANCE */
                <div className="text-center py-4 px-2 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-accent-teal/15 text-accent-teal flex items-center justify-center mx-auto">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-sm">Product Not Listed Yet</h5>
                    <p className="text-xs text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 mt-1 leading-relaxed">
                      We craft bespoke solid teak furniture to order. Speak to our studio advisor directly!
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <a
                      href="https://wa.me/919337721647?text=Hello%20Millennium%20Furniture,%20I%20am%20looking%20for%20a%20custom%20piece:"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                    >
                      Inquire on WhatsApp (+91 93377 21647)
                    </a>
                    <a
                      href="tel:+919337721647"
                      className="w-full py-2 bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/5 hover:bg-[#1F1B16]/10 dark:hover:bg-[#F7F3EC]/10 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-accent-teal" /> Call Studio Directly
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LUXURY FULL-WIDTH WARM CREAM MOBILE SIDEBAR MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Soft Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="pointer-events-auto fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            />

            {/* Compact Warm Cream Slide-In Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="pointer-events-auto fixed top-0 right-0 bottom-0 z-50 w-[68%] max-w-[240px] bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 lg:hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex items-center justify-between">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Millennium Furniture"
                  className="h-8 w-auto object-contain dark:brightness-0 dark:invert"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 flex items-center justify-center text-[#1F1B16] dark:text-[#F7F3EC] hover:bg-accent-teal hover:text-white transition-all"
                >
                  <X className="w-3.5 h-3.5 text-accent-teal" />
                </button>
              </div>

              {/* Compact Navigation Links */}
              <div className="p-4 space-y-1 flex-1">
                {[
                  { name: "Home", href: "/", icon: Home },
                  { name: "Home Spaces", href: "/spaces/home", icon: Home },
                  { name: "Office & Work", href: "/spaces/office", icon: Briefcase },
                  { name: "Commercial", href: "/spaces/commercial", icon: Building },
                  { name: "Outdoor Patio", href: "/spaces/outdoor", icon: Sparkles },
                  { name: "Lookbook", href: "/#lookbook", icon: Compass },
                  { name: "Offers", href: "/#offer", icon: Tag },
                  { name: "Wholesale Tier", href: "/wholesale", icon: Boxes },
                  { name: "Contact Studio", href: "/#contact", icon: Phone },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-accent-teal/10 hover:text-accent-teal font-serif text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC] transition-all group"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-accent-teal" />
                        {item.name}
                      </span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-accent-teal" />
                    </a>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-center bg-[#FAF7F2] dark:bg-[#12100E]">
                <p className="text-[10px] text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 font-semibold">
                  Millennium Furniture • Odisha
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}
