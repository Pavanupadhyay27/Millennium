"use client";

import React from "react";
import { useStore, CartItem } from "../lib/store";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CartDrawer() {
  const {
    cart,
    cartDrawerOpen,
    toggleCartDrawer,
    removeFromCart,
    updateCartQuantity,
  } = useStore();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCartDrawer(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Premium Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[460px] bg-[#F7F3EC] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] shadow-2xl z-50 flex flex-col justify-between transition-colors duration-300"
          >
            {/* Header */}
            <div className="h-20 px-6 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex items-center justify-between bg-white dark:bg-[#1C1814]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent-teal/10 text-accent-teal flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">
                    Your Shopping Cart
                  </h3>
                  <span className="text-[11px] font-bold text-accent-teal uppercase tracking-wider block -mt-0.5">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"} Selected
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleCartDrawer(false)}
                className="w-9 h-9 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 hover:bg-accent-teal hover:text-white dark:hover:bg-accent-teal text-[#1F1B16] dark:text-[#F7F3EC] flex items-center justify-center transition-all"
                title="Close Cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Delivery / Trust Header Banner */}
            <div className="bg-accent-teal/10 dark:bg-accent-teal/20 px-6 py-2.5 flex items-center justify-between text-xs border-b border-accent-teal/15">
              <span className="flex items-center gap-1.5 text-accent-teal font-bold text-[11px]">
                <Truck className="w-3.5 h-3.5" /> Free Insured Transport Across Odisha
              </span>
            </div>

            {/* Cart Items Scroll Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length > 0 ? (
                cart.map((item: CartItem) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-4 flex gap-4 shadow-warm-sm hover:shadow-md transition-all"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/5 shrink-0 border border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <a
                            href={`/spaces/home`}
                            onClick={() => toggleCartDrawer(false)}
                            className="font-serif font-bold text-sm text-[#1F1B16] dark:text-[#F7F3EC] hover:text-accent-teal transition-colors leading-snug line-clamp-1"
                          >
                            {item.name}
                          </a>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 rounded-full text-[#1F1B16]/30 dark:text-[#F7F3EC]/30 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-medium mt-0.5">
                          {item.material || "Solid Teak"} • {item.color || "Natural"}
                        </p>
                      </div>

                      {/* Stepper & Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-[#F7F3EC] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/20 rounded-full px-2 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-accent-teal hover:text-white transition-all text-[#1F1B16] dark:text-[#F7F3EC]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-accent-teal hover:text-white transition-all text-[#1F1B16] dark:text-[#F7F3EC]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-serif font-bold text-sm text-[#1F1B16] dark:text-[#F7F3EC]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent-teal/10 text-accent-teal flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold mb-1">Your cart is empty</h4>
                    <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 max-w-xs mx-auto">
                      Explore our handcrafted solid teak collection to start adding items.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCartDrawer(false)}
                    className="inline-flex items-center gap-2 bg-accent-teal text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-accent-teal/90 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Explore Collections
                  </button>
                </div>
              )}
            </div>

            {/* Summary Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 bg-white dark:bg-[#1C1814] space-y-4 shadow-xl">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 block">Subtotal</span>
                    <span className="text-[11px] text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">Includes all GST & taxes</span>
                  </div>
                  <span className="font-serif text-2xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="space-y-2">
                  <a
                    href="/checkout"
                    onClick={() => toggleCartDrawer(false)}
                    className="w-full bg-[#1F1B16] text-[#F7F3EC] dark:bg-[#F7F3EC] dark:text-[#1F1B16] hover:bg-accent-teal dark:hover:bg-accent-teal hover:text-white dark:hover:text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
