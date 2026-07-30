"use client";

import React, { useEffect } from "react";
import { useStore } from "../lib/store";
import { CheckCircle, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddedToCartToast() {
  const { lastAddedItem, dismissToast, toggleCartDrawer, cart } = useStore();

  useEffect(() => {
    if (lastAddedItem) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, dismissToast]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {lastAddedItem && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: 50, x: "-50%", scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-[360px] bg-[#1F1B16] text-[#F7F3EC] border border-white/20 rounded-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl flex items-center justify-between gap-3"
        >
          {/* Left Item Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/15 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lastAddedItem.image} alt={lastAddedItem.name} className="w-full h-full object-cover" />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Added To Cart
              </span>
              <h4 className="font-serif font-bold text-xs truncate leading-snug text-white">
                {lastAddedItem.name}
              </h4>
              <p className="text-[10px] text-white/70 font-mono">
                ₹{lastAddedItem.price.toLocaleString("en-IN")} • Qty: {lastAddedItem.quantity}
              </p>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                dismissToast();
                toggleCartDrawer(true);
              }}
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> View ({totalCartCount})
            </button>

            <button
              onClick={dismissToast}
              className="p-1 rounded-full text-white/40 hover:text-white transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
