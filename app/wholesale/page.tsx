"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Send, CheckCircle, ArrowRight, Star, ChevronLeft, ChevronRight, Quote, ShieldCheck, Building2, User, Mail, TrendingUp, Truck, Award, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../../lib/store";

const FALLBACK_CUSTOMERS = [
  {
    id: "wc1",
    name: "Vikramjit Sharma",
    company: "Sharma Interior Projects",
    role: "Interior Designer, Bhubaneswar",
    quote: "Millennium supplied 60 custom teak dining sets for our resort. Delivered ahead of schedule, zero defects.",
    rating: 5,
    orderVolume: "₹8,50,000",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    projectTag: "Resort & Hospitality",
  },
  {
    id: "wc2",
    name: "Ananya Mahapatra",
    company: "Apex Design Studio",
    role: "Principal Architect, Cuttack",
    quote: "Custom swatch kits, volume pricing, and white-glove site delivery. Effortless B2B experience.",
    rating: 5,
    orderVolume: "₹4,20,000",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    projectTag: "Commercial Office",
  },
  {
    id: "wc3",
    name: "Saurabh Sundar Patnaik",
    company: "Heritage Living Spaces",
    role: "Showroom Director, Rourkela",
    quote: "Solid teak build quality and hand-wax finish are top-tier. Our retail customers love these pieces.",
    rating: 5,
    orderVolume: "₹12,00,000",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    projectTag: "Retail Showroom",
  },
];

export default function WholesaleLandingPage() {
  const { customerTestimonials } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    expectedVolume: "100000",
  });

  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) setTheme(savedTheme);
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (currentTheme) setTheme(currentTheme);
    };
    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  // Admin-managed slides: use store testimonials that have a photo (set via CMS)
  const slides = (() => {
    const storeSlides = (customerTestimonials || [])
      .filter((t) => t.photo && t.company)
      .map((t) => ({
        id: t.id,
        name: t.name,
        company: t.company ?? "",
        role: t.role,
        quote: t.quote,
        rating: t.rating,
        orderVolume: t.orderVolume ?? "",
        photo: t.photo ?? "",
        projectTag: t.projectTag ?? "",
      }));
    return storeSlides.length > 0 ? storeSlides : FALLBACK_CUSTOMERS;
  })();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/wholesale/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.businessName,
          name: formData.contactPerson,
          email: formData.email,
          expectedVolume: formData.expectedVolume,
        }),
      });
    } catch (err) {
      console.error(err);
    }
    setFormSubmitted(true);
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "rgba(16,185,129,0.6)";
    (e.currentTarget as HTMLElement).style.boxShadow = theme === "light"
      ? "inset 0 1px 3px rgba(0,0,0,0.06), 0 0 0 3px rgba(16,185,129,0.15)"
      : "inset 0 3px 8px rgba(0,0,0,0.45), 0 0 0 3px rgba(16,185,129,0.1)";
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = theme === "light" ? "rgba(31,27,22,0.15)" : "rgba(255,255,255,0.1)";
  };

  const currentCustomer = slides[activeSlide];

  const glassCard = theme === "light"
    ? {
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
        boxShadow: "0 20px 40px rgba(31,27,22,0.04), 0 1px 3px rgba(31,27,22,0.02)",
      }
    : {
        background: "rgba(255,255,255,0.03)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.35), inset 0 1.5px 0 rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)" as const,
      };

  const fieldStyle = theme === "light"
    ? {
        background: "rgba(31,27,22,0.02)",
        border: "1px solid rgba(31,27,22,0.07)",
        boxShadow: "none",
      }
    : {
        background: "rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "none",
      };

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
        theme === "light" ? "bg-[#FAF7F2] text-[#1F1B16]" : "bg-[#12100E] text-[#F7F3EC]"
      }`}
      style={theme === "dark" ? { background: "linear-gradient(135deg, #0E0C0A 0%, #1A1612 60%, #0E0C0A 100%)" } : {}}
    >
      <Navbar />

      <main className="flex-1">
        {/* Hero Header */}
        <header className="max-w-[1300px] mx-auto px-6 md:px-12 pt-32 pb-10 text-center">
          <span
            className={`inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] mb-4 px-4 py-1.5 rounded-full ${
              theme === "light"
                ? "bg-[#0D9488]/10 text-[#0D9488]"
                : "bg-amber-400/10 text-amber-400"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Trusted B2B Partner Portal
          </span>
          <h1 className={`font-serif text-4xl md:text-5xl font-bold mb-3 leading-tight ${theme === "light" ? "text-charcoal" : "text-white"}`}>
            Wholesale Trade
          </h1>
          <p className={`text-xs max-w-sm mx-auto tracking-wide ${theme === "light" ? "text-charcoal/50" : "text-white/40"}`}>
            Volume pricing · Dedicated B2B account · GST invoicing
          </p>
        </header>

        {/* ── Advertising Perks Strip ── */}
        <section className="max-w-[1300px] mx-auto px-6 md:px-12 pb-10">
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: theme === "light"
                ? "linear-gradient(120deg, rgba(13,148,136,0.03) 0%, rgba(212,168,83,0.02) 100%)"
                : "linear-gradient(120deg, rgba(13,148,136,0.06) 0%, rgba(212,168,83,0.03) 100%)",
            }}
          >
            <div className={`grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x ${theme === "light" ? "divide-charcoal/5" : "divide-white/5"}`}>
              {[
                { icon: Zap, color: "#F59E0B", headline: "Priority Production", sub: "Bulk orders jump the queue — guaranteed lead times." },
                { icon: Truck, color: "#0D9488", headline: "Free Site Delivery", sub: "White-glove transit straight to your project location." },
                { icon: Award, color: "#8B5CF6", headline: "Volume Discounts up to 20%", sub: "Custom contracts available above ₹4L+ orders." },
              ].map(({ icon: Icon, color, headline, sub }) => (
                <div key={headline} className="flex items-start gap-4 px-8 py-6">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${color}10` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color }} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold leading-tight ${theme === "light" ? "text-charcoal" : "text-white"}`}>{headline}</p>
                    <p className={`text-[11px] mt-1 leading-relaxed ${theme === "light" ? "text-charcoal/50" : "text-white/35"}`}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Section */}
        <section className="max-w-[1300px] mx-auto px-6 md:px-12 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT: Testimonial Carousel — admin-managed via CMS */}
            <div className="lg:col-span-7 rounded-3xl p-8 flex flex-col gap-6" style={glassCard}>
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-extrabold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 ${theme === "light" ? "bg-[#0D9488]/10 text-[#0D9488]" : "bg-emerald-500/10 text-emerald-400"}`}>
                  <ShieldCheck className="w-3 h-3" /> Verified Partner
                </span>
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${theme === "light" ? "bg-amber-500/10 text-amber-700" : "bg-amber-400/10 text-amber-400"}`}>
                  {currentCustomer.orderVolume}
                </span>
              </div>

              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28 }}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center"
                  >
                    <div className="sm:col-span-5 aspect-[4/5] rounded-2xl overflow-hidden relative">
                      <img src={currentCustomer.photo} alt={currentCustomer.name} className="w-full h-full object-cover object-top" />
                      <span className="absolute bottom-2.5 left-2.5 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}>
                        {currentCustomer.projectTag}
                      </span>
                    </div>

                    <div className="sm:col-span-7 flex flex-col gap-4">
                      <div className="flex gap-0.5">
                        {[...Array(currentCustomer.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-500" fill="#F59E0B" />
                        ))}
                      </div>
                      <Quote className={`w-8 h-8 ${theme === "light" ? "text-[#0D9488]/15" : "text-amber-400/15"}`} />
                      <p className={`text-sm italic leading-relaxed font-serif ${theme === "light" ? "text-charcoal/80" : "text-white/70"}`}>
                        &ldquo;{currentCustomer.quote}&rdquo;
                      </p>
                      <div className="pt-2">
                        <h4 className={`font-serif font-bold text-sm ${theme === "light" ? "text-charcoal" : "text-white"}`}>{currentCustomer.name}</h4>
                        <p className={`text-xs mt-0.5 ${theme === "light" ? "text-charcoal/40" : "text-white/35"}`}>{currentCustomer.company}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className={`text-[10px] font-bold ${theme === "light" ? "text-charcoal/30" : "text-white/25"}`}>{activeSlide + 1} / {slides.length}</span>
                <div className="flex gap-2">
                  <button onClick={() => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))} className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all active:scale-95 ${theme === "light" ? "bg-charcoal/5 hover:bg-charcoal/8 text-charcoal/60" : "bg-white/5 hover:bg-white/8 text-white/60"}`}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)} className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all active:scale-95 ${theme === "light" ? "bg-charcoal/5 hover:bg-charcoal/8 text-charcoal/60" : "bg-white/5 hover:bg-white/8 text-white/60"}`}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: B2B Inquiry Form */}
            <div className="lg:col-span-5 rounded-3xl p-8 flex flex-col gap-6" style={glassCard}>
              {formSubmitted ? (
                <div className="text-center flex flex-col items-center gap-5 py-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "radial-gradient(circle at 35% 35%, #34D399, #059669)", boxShadow: "0 8px 24px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-serif text-xl font-bold mb-1 ${theme === "light" ? "text-charcoal" : "text-white"}`}>Application Received</h3>
                    <p className={`text-xs max-w-xs mx-auto ${theme === "light" ? "text-charcoal/50" : "text-white/40"}`}>
                      Our B2B manager will contact <strong className={theme === "light" ? "text-charcoal" : "text-white/70"}>{formData.contactPerson || "you"}</strong> within 1 business day.
                    </p>
                  </div>
                  <button onClick={() => setFormSubmitted(false)} className={`text-xs font-bold transition-colors ${theme === "light" ? "text-accent-teal hover:underline" : "text-emerald-400 hover:text-emerald-300"}`}>
                    Submit another →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-serif text-base font-bold ${theme === "light" ? "text-charcoal" : "text-white"}`}>Apply for B2B Account</h3>
                    <a href="/wholesale/order" className={`text-[10px] font-bold transition-colors flex items-center gap-1 ${theme === "light" ? "text-accent-teal hover:underline" : "text-amber-400 hover:text-amber-300"}`}>
                      Bulk Builder <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { label: "Company Name", name: "businessName", type: "text", icon: Building2, placeholder: "Sharma Interior Projects" },
                      { label: "Contact Person", name: "contactPerson", type: "text", icon: User, placeholder: "Vikramjit Sharma" },
                      { label: "Corporate Email", name: "email", type: "email", icon: Mail, placeholder: "contact@company.in" },
                    ].map(({ label, name, type, icon: Icon, placeholder }) => (
                      <div key={name} className="flex flex-col gap-1.5">
                        <label className={`text-[9px] font-extrabold uppercase tracking-[0.15em] ${theme === "light" ? "text-charcoal/40" : "text-white/35"}`}>{label}</label>
                        <div className="relative">
                          <input
                            type={type} name={name} required placeholder={placeholder}
                            value={formData[name as keyof typeof formData]}
                            onChange={handleInputChange}
                            className={`w-full pl-4 pr-10 py-3.5 rounded-xl text-sm outline-none transition-all ${theme === "light" ? "text-charcoal placeholder:text-charcoal/30" : "text-white/90 placeholder:text-white/20"}`}
                            style={fieldStyle} onFocus={onFocus} onBlur={onBlur}
                          />
                          <Icon className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === "light" ? "text-charcoal/30" : "text-white/25"}`} />
                        </div>
                      </div>
                    ))}

                    <div className="flex flex-col gap-1.5">
                      <label className={`text-[9px] font-extrabold uppercase tracking-[0.15em] flex items-center gap-1.5 ${theme === "light" ? "text-charcoal/40" : "text-white/35"}`}>
                        <TrendingUp className="w-3.5 h-3.5" /> Order Volume
                      </label>
                      <select
                        name="expectedVolume" value={formData.expectedVolume} onChange={handleInputChange}
                        className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer border ${theme === "light" ? "text-charcoal" : "text-white/90"}`}
                        style={fieldStyle} onFocus={onFocus} onBlur={onBlur}
                      >
                        <option value="50000" style={{ background: theme === "light" ? "#FAF7F2" : "#1A1612", color: theme === "light" ? "#1F1B16" : "#F7F3EC" }}>₹50k – ₹1.5L · Silver 5% OFF</option>
                        <option value="150000" style={{ background: theme === "light" ? "#FAF7F2" : "#1A1612", color: theme === "light" ? "#1F1B16" : "#F7F3EC" }}>₹1.5L – ₹4L · Gold 10% OFF</option>
                        <option value="400000" style={{ background: theme === "light" ? "#FAF7F2" : "#1A1612", color: theme === "light" ? "#1F1B16" : "#F7F3EC" }}>₹4L+ · Custom Contract</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="flex items-center gap-2 text-white font-extrabold text-[11px] uppercase tracking-[0.12em] px-6 py-3.5 rounded-xl transition-all active:translate-y-0.5 relative overflow-hidden mt-3"
                      style={{
                        background: theme === "light"
                          ? "linear-gradient(180deg, #0D9488 0%, #0F766E 100%)"
                          : "linear-gradient(180deg, #FBBF24 0%, #D4A853 50%, #B8892E 100%)",
                        boxShadow: theme === "light"
                          ? "0 5px 14px rgba(15,118,110,0.3), inset 0 1.5px 0 rgba(255,255,255,0.3)"
                          : "0 5px 14px rgba(212,168,83,0.4), inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -2px 0 rgba(0,0,0,0.3)",
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                      <span className="relative z-10 flex items-center gap-1.5">
                        Submit Inquiry <Send className="w-3 h-3" />
                      </span>
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}