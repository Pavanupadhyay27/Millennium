"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export default function FloatingContactWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto font-sans">
      <motion.a
        href="tel:+919337721647"
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#1C1917] dark:bg-[#FAF7F2] text-cream dark:text-[#1C1917] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-emerald-500/40 transition-all duration-300 border border-white/20 dark:border-black/20"
        aria-label="Call Us Directly"
      >
        {/* Animated Glow Halo */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-pulse pointer-events-none opacity-40 blur-sm" />

        {/* Phone Icon */}
        <div className="relative w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
          <Phone className="w-4 h-4" />
        </div>

        {/* Call Label */}
        <span className="relative text-xs font-extrabold uppercase tracking-widest">
          Call Us
        </span>

        {/* Live Green Online Indicator */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
      </motion.a>
    </div>
  );
}
