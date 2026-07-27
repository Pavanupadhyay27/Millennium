"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HomeFallback() {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // 400ms delay as requested for the reveal timing
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-[450px] md:h-[650px] rounded-3xl overflow-hidden shadow-warm-lg bg-gradient-to-tr from-[#EFE7F7] via-[#F7F3EC] to-[#DFF4EE]">
      {/* Veil fabric simulator */}
      <motion.div
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={{
          clipPath: isRevealed ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)",
        }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 z-15 bg-accent-teal/90 mix-blend-multiply flex items-center justify-center pointer-events-none"
        style={{
          // Procedural fabric texture simulation using CSS radial gradients
          backgroundImage: `
            radial-gradient(circle, transparent 20%, #F7F3EC 20%, #F7F3EC 80%, transparent 80%, transparent),
            radial-gradient(circle, transparent 20%, #F7F3EC 20%, #F7F3EC 80%, transparent 80%, transparent)
          `,
          backgroundSize: "4px 4px",
          backgroundPosition: "0 0, 2px 2px",
          opacity: 0.85,
        }}
      />

      {/* Styled Lifestyle Sofa Image */}
      <motion.div
        initial={{ scale: 1.1, filter: "blur(8px)" }}
        animate={{
          scale: isRevealed ? 1 : 1.1,
          filter: isRevealed ? "blur(0px)" : "blur(8px)",
        }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="w-full h-full relative"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200"
          alt="Premium Millennium Sofa - Styled Room setup"
          className="w-full h-full object-cover"
        />
        {/* Soft radial overlay shadow to mimic catalog lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* Branded loading state over fallback */}
      {!isRevealed && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-cream gap-4">
          <div className="w-10 h-10 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-charcoal font-medium text-base tracking-wide">
            Millennium Studio
          </p>
        </div>
      )}
    </div>
  );
}
