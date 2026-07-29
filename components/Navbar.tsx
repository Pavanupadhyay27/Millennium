"use client";

import React, { useState, useEffect } from "react";
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
  
  const { cart, toggleCartDrawer } = useStore();
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
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/collections?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const shouldBeTransparent = transparent && !isScrolled;

  const textThemeClass = shouldBeTransparent
    ? "text-white/90 hover:text-white"
    : "text-charcoal/85 hover:text-accent-teal dark:text-cream/85 dark:hover:text-accent-teal";

  const iconThemeClass = shouldBeTransparent
    ? "text-white/90 hover:bg-white/10 hover:text-white"
    : "text-charcoal/80 hover:bg-charcoal/5 hover:text-charcoal dark:text-cream/80 dark:hover:bg-cream/5 dark:hover:text-cream";

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* 
        Container with padding and layout:
        Mobile: Clean 1-row flexbox with Logo on left, Pill Actions on right.
        Desktop: Spacious layout with centered pill menu.
      */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-3 flex items-center justify-between gap-4">
        
        {/* LOGO: Clean sizing on mobile so it doesn't overlap */}
        <a
          href="/"
          className="shrink-0 flex items-center transition-all duration-300 hover:scale-105"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Millennium Furniture Logo"
            className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto object-contain drop-shadow-md"
          />
        </a>

        {/* FLOATING ACTION NAV PILL */}
        <div className="flex items-center">
          <nav
            className={`transition-all duration-300 rounded-full border px-3 sm:px-6 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-6 ${
              shouldBeTransparent
                ? "bg-black/40 dark:bg-black/60 backdrop-blur-md border-white/20 shadow-xl"
                : "bg-cream/95 dark:bg-charcoal/95 backdrop-blur-md border-charcoal/10 dark:border-cream/10 shadow-xl"
            }`}
          >
            {/* If Search is Active, expand input inside the navbar pill */}
            {searchActive ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "200px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 px-2.5 py-1 bg-white/90 dark:bg-charcoal/90 border border-charcoal/15 dark:border-cream/20 rounded-full shadow-inner"
              >
                <Search className="w-3.5 h-3.5 shrink-0 text-accent-teal" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold focus:outline-none text-charcoal dark:text-cream placeholder:text-charcoal/60 dark:placeholder:text-cream/60"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchActive(false)}
                  className="p-0.5 rounded-full hover:bg-charcoal/10 dark:hover:bg-cream/10 text-charcoal dark:text-cream"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.form>
            ) : (
              /* Standard Desktop Nav Links */
              <div className="hidden lg:flex items-center gap-6">
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-cream dark:bg-charcoal border border-charcoal/10 dark:border-cream/20 rounded-2xl shadow-2xl p-3 flex flex-col gap-1 backdrop-blur-lg z-50 text-charcoal dark:text-cream"
                      >
                        <a
                          href="/spaces/home"
                          className="px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-accent-teal hover:text-white dark:hover:bg-accent-teal dark:hover:text-white transition-all flex items-center justify-between"
                        >
                          Home Spaces <span>→</span>
                        </a>
                        <a
                          href="/spaces/office"
                          className="px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-accent-teal hover:text-white dark:hover:bg-accent-teal dark:hover:text-white transition-all flex items-center justify-between"
                        >
                          Office & Work <span>→</span>
                        </a>
                        <a
                          href="/spaces/commercial"
                          className="px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-accent-teal hover:text-white dark:hover:bg-accent-teal dark:hover:text-white transition-all flex items-center justify-between"
                        >
                          Commercial & Lobby <span>→</span>
                        </a>
                        <a
                          href="/spaces/outdoor"
                          className="px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-accent-teal hover:text-white dark:hover:bg-accent-teal dark:hover:text-white transition-all flex items-center justify-between"
                        >
                          Outdoor & Patio <span>→</span>
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
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${iconThemeClass}`}
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              
              <button
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

              {/* Mobile Hamburger Menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${iconThemeClass}`}
              >
                {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden max-w-[92%] mx-auto bg-cream/98 dark:bg-charcoal/98 border border-charcoal/10 dark:border-cream/15 backdrop-blur-xl rounded-3xl shadow-2xl py-6 px-6 flex flex-col gap-4 text-charcoal dark:text-cream"
          >
            {[
              { name: "Home", href: "/" },
              { name: "Home Spaces", href: "/spaces/home" },
              { name: "Office & Work", href: "/spaces/office" },
              { name: "Commercial & Hospitality", href: "/spaces/commercial" },
              { name: "Outdoor & Patio", href: "/spaces/outdoor" },
              { name: "Lookbook / Curated Spaces", href: "/#lookbook" },
              { name: "Special Offers", href: "/#offer" },
              { name: "Wholesale Supplies", href: "/wholesale" },
              { name: "Contact & Studio", href: "/#contact" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-base font-semibold hover:text-accent-teal transition-colors py-1 border-b border-charcoal/5 dark:border-cream/5 last:border-0"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
