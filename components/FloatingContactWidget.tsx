"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useStore } from "../lib/store";

export default function FloatingContactWidget() {
  const pathname = usePathname();
  const { cartDrawerOpen } = useStore();

  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <AnimatePresence>
      {!cartDrawerOpen && !isAdminPage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-40 pointer-events-auto font-sans"
        >
          <motion.a
            href="tel:+919337721647"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center gap-3 px-5 py-3 rounded-full text-[#1F1B16] dark:text-[#F7F3EC] transition-all duration-300 overflow-hidden border border-white/40 dark:border-white/20"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,238,233,0.95) 100%)",
              boxShadow: "0 12px 28px -4px rgba(0,0,0,0.3), inset 0 1.5px 0 rgba(255,255,255,1), inset 0 -2.5px 0 rgba(0,0,0,0.15)",
            }}
            aria-label="Call Us Directly"
          >
            {/* Specular Top Reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

            {/* 3D Skeuomorphic Emerald Phone Icon */}
            <div
              className="relative w-8 h-8 rounded-full text-white flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300 border border-emerald-300/40"
              style={{
                background: "linear-gradient(180deg, #34D399 0%, #10B981 50%, #059669 100%)",
                boxShadow: "0 4px 10px rgba(16,185,129,0.4), inset 0 1.5px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(0,0,0,0.3)",
              }}
            >
              <Phone className="w-3.5 h-3.5 relative z-10" />
            </div>

            {/* Call Label */}
            <span className="relative z-10 text-xs font-extrabold uppercase tracking-widest text-[#1F1B16]">
              Call Us
            </span>

            {/* Live Green Online Indicator */}
            <span className="relative z-10 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
