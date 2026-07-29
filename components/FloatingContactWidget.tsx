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
        className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-white/70 dark:bg-black/60 backdrop-blur-xl text-[#1F1B16] dark:text-[#F7F3EC] shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-white/40 dark:border-white/15 hover:border-accent-teal transition-all duration-300"
        aria-label="Call Us Directly"
      >
        {/* Soft Ambient Glow Halo */}
        <span className="absolute -inset-0.5 rounded-full bg-accent-teal/30 animate-pulse pointer-events-none opacity-40 blur-md" />

        {/* Phone Icon */}
        <div className="relative w-7 h-7 rounded-full bg-accent-teal text-white flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
          <Phone className="w-3.5 h-3.5" />
        </div>

        {/* Call Label */}
        <span className="relative text-xs font-extrabold uppercase tracking-widest text-[#1F1B16] dark:text-[#F7F3EC]">
          Call Us
        </span>

        {/* Live Green Online Indicator */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </motion.a>
    </div>
  );
}
