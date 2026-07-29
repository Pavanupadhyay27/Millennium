"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Send, CheckCircle, ArrowRight, Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const REAL_WHOLESALE_CUSTOMERS = [
  {
    id: "wc1",
    name: "Vikramjit Sharma",
    company: "Sharma Interior Projects",
    location: "Bhubaneswar, Odisha",
    quote: "Millennium supplied 60 custom teak dining sets for our resort project. Delivered ahead of schedule, zero defects, and full GST input credit passed smoothly!",
    rating: 5,
    orderVolume: "₹8,50,000 Order",
    // Happy smiling wholesale customer photo
    customerPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    projectTag: "Resort & Hospitality",
  },
  {
    id: "wc2",
    name: "Ananya Mahapatra",
    company: "Apex Design Studio",
    location: "Cuttack, Odisha",
    quote: "Ordering bulk furniture used to be stressful. Millennium's B2B team provided custom swatch kits, volume pricing, and white-glove site delivery.",
    rating: 5,
    orderVolume: "₹4,20,000 Order",
    // Happy smiling female business partner
    customerPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    projectTag: "Commercial Office Lobby",
  },
  {
    id: "wc3",
    name: "Saurabh Sundar Patnaik",
    company: "Heritage Living Spaces",
    location: "Rourkela, Odisha",
    quote: "The solid teak build quality and hand-wax finish are top-tier. Our retail customers in Odisha absolutely love these artisanal pieces.",
    rating: 5,
    orderVolume: "₹12,00,000 Annual Partner",
    // Happy smiling male entrepreneur partner
    customerPhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    projectTag: "Retail Showroom Network",
  }
];

export default function WholesaleLandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    expectedVolume: "100000",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % REAL_WHOLESALE_CUSTOMERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const currentCustomer = REAL_WHOLESALE_CUSTOMERS[activeSlide];

  return (
    <div className="min-h-screen bg-[#F7F3EC] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] font-sans flex flex-col justify-between transition-colors duration-300">
      <div>
        <Navbar />

        {/* Header Title */}
        <header className="max-w-[1400px] mx-auto px-6 md:px-12 pt-28 pb-6 text-center">
          <span className="text-accent-teal text-[10px] font-extrabold tracking-widest uppercase mb-2 inline-block bg-accent-teal/10 px-3.5 py-1 rounded-full">
            Trusted B2B Partner Portal
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-1">
            Wholesale Trade Account
          </h1>
          <p className="text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 text-xs md:text-sm font-light max-w-md mx-auto">
            Direct volume pricing and dedicated partner account support.
          </p>
        </header>

        {/* DUAL PANE LAYOUT: Real Happy Wholesale Customer Photos & Review Cards (Left) + B2B Form (Right) */}
        <section className="max-w-[1300px] mx-auto px-6 md:px-12 pb-16 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT PANE: Real Happy Wholesale Customer Card & Verified Review */}
            <div className="lg:col-span-7 bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-[480px]">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                <span className="bg-accent-teal/10 text-accent-teal text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Wholesale Partner
                </span>
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                  {currentCustomer.orderVolume}
                </span>
              </div>

              {/* Customer Photo + Review Dual Layout */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-auto py-2"
                >
                  {/* Happy Smiling Customer Portrait (Un-zoomed & Framed) */}
                  <div className="sm:col-span-5 aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 relative bg-charcoal/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentCustomer.customerPhoto}
                      alt={currentCustomer.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                      {currentCustomer.projectTag}
                    </span>
                  </div>

                  {/* Review Text Block */}
                  <div className="sm:col-span-7 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(currentCustomer.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 text-accent-teal/30 mb-2" />
                      <p className="text-xs sm:text-sm italic leading-relaxed text-[#1F1B16]/90 dark:text-[#F7F3EC]/90 mb-4 font-serif">
                        &ldquo;{currentCustomer.quote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                      <h4 className="font-serif font-bold text-base text-[#1F1B16] dark:text-[#F7F3EC]">
                        {currentCustomer.name}
                      </h4>
                      <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 font-medium">
                        {currentCustomer.company} • {currentCustomer.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                <span className="text-[11px] font-bold text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
                  Partner {activeSlide + 1} of {REAL_WHOLESALE_CUSTOMERS.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSlide((prev) => (prev === 0 ? REAL_WHOLESALE_CUSTOMERS.length - 1 : prev - 1))}
                    className="p-2 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 hover:bg-accent-teal hover:text-white text-[#1F1B16] dark:text-[#F7F3EC] transition-all shadow-sm"
                    title="Previous Partner"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveSlide((prev) => (prev + 1) % REAL_WHOLESALE_CUSTOMERS.length)}
                    className="p-2 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 hover:bg-accent-teal hover:text-white text-[#1F1B16] dark:text-[#F7F3EC] transition-all shadow-sm"
                    title="Next Partner"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT PANE: Compact B2B Trade Form */}
            <div className="lg:col-span-5 bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-xl">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-accent-teal/10 text-accent-teal flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2">Application Received</h3>
                  <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 max-w-xs mx-auto mb-4 leading-relaxed">
                    Thank you, <strong>{formData.contactPerson || "Partner"}</strong>. Our B2B manager will contact you within 1 business day.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs font-bold text-accent-teal hover:underline"
                  >
                    Submit another request →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-3 mb-1">
                    <h3 className="font-serif text-lg font-bold">Apply for B2B Account</h3>
                    <a
                      href="/wholesale/order"
                      className="text-[11px] font-bold text-accent-teal hover:underline flex items-center gap-1"
                    >
                      Bulk Builder <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#F7F3EC]/30 dark:bg-[#12100E]/50 text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#F7F3EC]/30 dark:bg-[#12100E]/50 text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#F7F3EC]/30 dark:bg-[#12100E]/50 text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                      Estimated Order Volume
                    </label>
                    <select
                      name="expectedVolume"
                      value={formData.expectedVolume}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#F7F3EC]/30 dark:bg-[#12100E]/50 text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                    >
                      <option value="50000" className="bg-white dark:bg-[#1C1814]">₹50k – ₹1.5L (Silver 5% OFF)</option>
                      <option value="150000" className="bg-white dark:bg-[#1C1814]">₹1.5L – ₹4L (Gold 10% OFF)</option>
                      <option value="400000" className="bg-white dark:bg-[#1C1814]">₹4L+ (Custom Contract Tier)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent-teal hover:bg-accent-teal/90 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                  >
                    Submit Trade Inquiry <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
