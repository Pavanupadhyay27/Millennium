"use client";

import React, { useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useStore } from "../../lib/store";
import {
  CreditCard,
  MapPin,
  FileCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Trash2,
  Banknote,
  Smartphone,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CheckoutPage() {
  const { cart, clearCart, updateCartQuantity, removeFromCart, addNotification, addOrder } = useStore();
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "card">("cod");
  const [isCompleted, setIsCompleted] = useState(false);

  // Form Fields
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "Bhubaneswar",
    state: "Odisha",
    postalCode: "751024",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardName: "",
    cardNumber: "4111 2222 3333 4444",
    cardExpiry: "12/29",
    cardCvc: "123",
  });

  // Calculate prices
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const gst = useMemo(() => {
    return Math.round(subtotal * 0.18);
  }, [subtotal]);

  const shipping = subtotal > 15000 ? 0 : 2500;
  const total = subtotal + gst + shipping;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    const orderId = `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          customerName: shippingForm.fullName,
          customerEmail: shippingForm.email,
          customerPhone: shippingForm.phone,
          address: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          postalCode: shippingForm.postalCode,
          items: cart,
          totalAmount: total,
        }),
      });
    } catch (err) {
      console.error(err);
    }

    // Push real order record into central Admin Orders state
    addOrder({
      id: orderId,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      customerName: shippingForm.fullName || "Valued Customer",
      email: shippingForm.email || "customer@domain.com",
      type: "Retail",
      total: total,
      status: "Pending",
      address: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} - ${shippingForm.postalCode}`,
      phone: shippingForm.phone || "+91 93343 09230",
      items: cart.map((i) => ({ name: i.name, color: i.color, quantity: i.quantity, price: i.price })),
    });

    // Push live notification for Admin HQ Navbar
    addNotification({
      orderId,
      customerName: shippingForm.fullName || "Valued Customer",
      type: "Retail",
      total: total,
    });

    setIsCompleted(true);
    clearCart();
  };

  const stepsList = [
    { id: "shipping", label: "Shipping Address", icon: MapPin },
    { id: "payment", label: "Payment Method", icon: CreditCard },
    { id: "review", label: "Review & Confirm", icon: FileCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F7F3EC] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] font-sans selection:bg-accent-teal/20 flex flex-col justify-between transition-colors duration-300">
      <div>
        <Navbar />

        <main className="max-w-[1240px] mx-auto px-4 md:px-8 pt-48 md:pt-52 mt-4 pb-20">
          {!isCompleted ? (
            <div>
              {/* Progress Indicator Header */}
              <div className="max-w-xl mx-auto mb-14">
                <div className="flex justify-between items-center relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1F1B16]/10 dark:bg-[#F7F3EC]/10 -translate-y-1/2 z-0" />
                  
                  <div
                    className="absolute top-1/2 left-0 h-0.5 bg-accent-teal -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                      width: step === "shipping" ? "0%" : step === "payment" ? "50%" : "100%",
                    }}
                  />

                  {stepsList.map((s, idx) => {
                    const StepIcon = s.icon;
                    const isActive = step === s.id;
                    const isPassed =
                      (step === "payment" && idx === 0) ||
                      (step === "review" && (idx === 0 || idx === 1));

                    return (
                      <div key={s.id} className="relative z-10 flex flex-col items-center gap-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                            isActive
                              ? "bg-accent-teal border-accent-teal text-white shadow-md scale-110"
                              : isPassed
                              ? "bg-accent-teal border-accent-teal text-white"
                              : "bg-white dark:bg-[#1C1814] border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 text-[#1F1B16]/40 dark:text-[#F7F3EC]/40"
                          }`}
                        >
                          <StepIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold tracking-wider uppercase text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main Checkout Layout */}
              {cart.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT: Multi-step Forms (7 cols) */}
                  <div className="lg:col-span-7">
                    <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 sm:p-8 shadow-xl">
                      
                      {/* STEP 1: SHIPPING FORM */}
                      {step === "shipping" && (
                        <form onSubmit={handleShippingSubmit} className="space-y-4">
                          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                            <h2 className="font-serif text-xl font-bold">1. Delivery Address</h2>
                            <span className="text-[10px] font-bold text-accent-teal uppercase tracking-wider bg-accent-teal/10 px-2.5 py-0.5 rounded-full">
                              Step 1 of 3
                            </span>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={shippingForm.fullName}
                              onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                              placeholder="First and last name"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#F7F3EC]/30 dark:bg-[#12100E]/50 text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                required
                                value={shippingForm.email}
                                onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                                placeholder="name@domain.com"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#F7F3EC]/30 dark:bg-[#12100E]/50 text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                Phone Number *
                              </label>
                              <input
                                type="tel"
                                required
                                value={shippingForm.phone}
                                onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                                placeholder="+91 XXXXX XXXXX"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#F7F3EC]/30 dark:bg-[#12100E]/50 text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                              Street Address *
                            </label>
                            <input
                              type="text"
                              required
                              value={shippingForm.address}
                              onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                              placeholder="Flat/House number, street, area"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#F7F3EC]/30 dark:bg-[#12100E]/50 text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                City *
                              </label>
                              <input
                                type="text"
                                required
                                value={shippingForm.city}
                                onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#F7F3EC]/30 dark:bg-[#12100E]/50 text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                State *
                              </label>
                              <input
                                type="text"
                                required
                                value={shippingForm.state}
                                onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#F7F3EC]/30 dark:bg-[#12100E]/50 text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                PIN Code *
                              </label>
                              <input
                                type="text"
                                required
                                value={shippingForm.postalCode}
                                onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#F7F3EC]/30 dark:bg-[#12100E]/50 text-xs focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC] font-mono"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-[#1F1B16] text-[#F7F3EC] dark:bg-[#F7F3EC] dark:text-[#1F1B16] hover:bg-accent-teal dark:hover:bg-accent-teal hover:text-white dark:hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                          >
                            Continue to Payment <ArrowRight className="w-4 h-4" />
                          </button>
                        </form>
                      )}

                      {/* STEP 2: PAYMENT METHOD SELECTION */}
                      {step === "payment" && (
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                            <h2 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">2. Select Payment Method</h2>
                            <span className="text-[10px] font-extrabold text-accent-teal uppercase tracking-wider bg-accent-teal/10 px-3 py-1 rounded-full flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> 100% Encrypted & Safe
                            </span>
                          </div>

                          <div className="space-y-3">
                            {/* Option 1: Cash on Delivery (COD) */}
                            <div
                              onClick={() => setPaymentMethod("cod")}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                                paymentMethod === "cod"
                                  ? "bg-accent-teal/10 dark:bg-accent-teal/20 border-accent-teal shadow-md"
                                  : "bg-[#F7F3EC]/30 dark:bg-[#12100E]/40 border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 hover:border-accent-teal/50"
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                                  paymentMethod === "cod" ? "bg-accent-teal text-white" : "bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC]"
                                }`}>
                                  <Banknote className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]">Cash on Delivery (COD)</h4>
                                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">Recommended</span>
                                  </div>
                                  <p className="text-[11px] text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 mt-0.5">
                                    Pay cash at doorstep after inspecting your handcrafted furniture delivery.
                                  </p>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === "cod" ? "border-accent-teal bg-accent-teal text-white" : "border-[#1F1B16]/30 dark:border-[#F7F3EC]/30"
                              }`}>
                                {paymentMethod === "cod" && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>

                            {/* Option 2: UPI / QR Code Direct */}
                            <div
                              onClick={() => setPaymentMethod("upi")}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                                paymentMethod === "upi"
                                  ? "bg-accent-teal/10 dark:bg-accent-teal/20 border-accent-teal shadow-md"
                                  : "bg-[#F7F3EC]/30 dark:bg-[#12100E]/40 border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 hover:border-accent-teal/50"
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                                  paymentMethod === "upi" ? "bg-accent-teal text-white" : "bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC]"
                                }`}>
                                  <Smartphone className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]">UPI Instant (GPay / PhonePe / Paytm)</h4>
                                  </div>
                                  <p className="text-[11px] text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 mt-0.5">
                                    Zero transaction fee via any Indian UPI app.
                                  </p>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === "upi" ? "border-accent-teal bg-accent-teal text-white" : "border-[#1F1B16]/30 dark:border-[#F7F3EC]/30"
                              }`}>
                                {paymentMethod === "upi" && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>

                            {/* Option 3: Credit / Debit Card */}
                            <div
                              onClick={() => setPaymentMethod("card")}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                                paymentMethod === "card"
                                  ? "bg-accent-teal/10 dark:bg-accent-teal/20 border-accent-teal shadow-md"
                                  : "bg-[#F7F3EC]/30 dark:bg-[#12100E]/40 border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 hover:border-accent-teal/50"
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                                  paymentMethod === "card" ? "bg-accent-teal text-white" : "bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC]"
                                }`}>
                                  <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]">Credit / Debit Card</h4>
                                  <p className="text-[11px] text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 mt-0.5">
                                    Visa, Mastercard, RuPay, and American Express accepted.
                                  </p>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === "card" ? "border-accent-teal bg-accent-teal text-white" : "border-[#1F1B16]/30 dark:border-[#F7F3EC]/30"
                              }`}>
                                {paymentMethod === "card" && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button
                              type="button"
                              onClick={() => setStep("shipping")}
                              className="border border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 text-xs font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-1 text-[#1F1B16] dark:text-[#F7F3EC]"
                            >
                              <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                              type="submit"
                              className="flex-1 bg-accent-teal hover:bg-accent-teal/90 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                            >
                              Proceed to Review <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </form>
                      )}

                      {/* STEP 3: REVIEW AND PLACE ORDER */}
                      {step === "review" && (
                        <div className="space-y-4">
                          <div className="pb-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                            <h2 className="font-serif text-xl font-bold">3. Confirm Order Details</h2>
                          </div>

                          <div className="bg-[#F7F3EC]/50 dark:bg-[#12100E]/50 rounded-2xl p-4 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-xs space-y-3">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-teal block mb-1">
                                Delivery Address
                              </span>
                              <p className="font-bold">{shippingForm.fullName}</p>
                              <p className="text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">{shippingForm.address}, {shippingForm.city}, {shippingForm.state} - {shippingForm.postalCode}</p>
                              <p className="text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">Phone: {shippingForm.phone}</p>
                            </div>
                            <div className="border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pt-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-teal block mb-1">
                                Payment Method
                              </span>
                              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                                {paymentMethod === "cod"
                                  ? "Cash on Delivery (Pay upon arrival)"
                                  : paymentMethod === "upi"
                                  ? "UPI Instant Transfer (GPay / PhonePe / Paytm)"
                                  : "Credit / Debit Card Payment"}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => setStep("payment")}
                              className="border border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 text-xs font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-1"
                            >
                              <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                              onClick={handlePlaceOrder}
                              className="flex-1 bg-accent-teal hover:bg-accent-teal/90 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                              Place Order ({formatPrice(total)}) <CheckCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* RIGHT: Order Items Summary Box (5 cols) */}
                  <div className="lg:col-span-5 bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 shadow-xl sticky top-24">
                    <h3 className="font-serif text-lg font-bold pb-3 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 mb-4">
                      Order Items ({cart.reduce((s, i) => s + i.quantity, 0)})
                    </h3>

                    {/* Items List */}
                    <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs pb-3 border-b border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-charcoal/5 shrink-0 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-bold truncate max-w-[130px] sm:max-w-[160px] text-[#1F1B16] dark:text-[#F7F3EC]">{item.name}</h4>
                              <p className="text-[10px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 mb-1">{item.color || "Natural"}</p>

                              {/* Interactive Stepper inside Checkout */}
                              <div className="flex items-center gap-2">
                                <div className="flex items-center bg-[#F7F3EC] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/20 rounded-full px-2 py-0.5">
                                  <button
                                    type="button"
                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-accent-teal hover:text-white transition-all text-[#1F1B16] dark:text-[#F7F3EC]"
                                  >
                                    <Minus className="w-2.5 h-2.5" />
                                  </button>
                                  <span className="w-5 text-center text-[11px] font-bold font-mono">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-accent-teal hover:text-white transition-all text-[#1F1B16] dark:text-[#F7F3EC]"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-1 rounded-full text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <span className="font-serif font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                        <span>Items Subtotal</span>
                        <span className="font-serif font-bold">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                        <span>GST Tax (18%)</span>
                        <span className="font-serif font-bold">{formatPrice(gst)}</span>
                      </div>
                      <div className="flex justify-between text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                        <span>Regional Transit</span>
                        <span className="font-bold text-accent-teal">{shipping > 0 ? formatPrice(shipping) : "FREE Transport"}</span>
                      </div>
                      <div className="pt-3 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex justify-between items-baseline font-bold text-sm">
                        <span>Total</span>
                        <span className="font-serif text-2xl font-bold text-accent-teal">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* EMPTY CHECKOUT VIEW */
                <div className="text-center py-16 bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-8 max-w-md mx-auto shadow-xl">
                  <div className="w-14 h-14 rounded-full bg-accent-teal/10 text-accent-teal flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2">Checkout Empty</h3>
                  <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mb-6 leading-relaxed">
                    Add handcrafted furniture products to your cart before proceeding to checkout.
                  </p>
                  <a
                    href="/spaces/home"
                    className="inline-flex items-center gap-2 bg-accent-teal text-white text-xs font-bold px-6 py-3 rounded-full shadow-md hover:bg-accent-teal/90 transition-all"
                  >
                    Browse Spaces Catalog
                  </a>
                </div>
              )}
            </div>
          ) : (
            /* ORDER SUCCESS SCREEN */
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="py-16 text-center max-w-lg mx-auto bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-[36px] p-8 md:p-12 shadow-2xl space-y-6 relative overflow-hidden"
            >
              {/* Glowing Background Radial */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-teal/10 rounded-full blur-3xl pointer-events-none" />

              {/* Premium Animated Success Checkmark Ring */}
              <div className="relative inline-flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-xl shadow-emerald-500/20"
                >
                  <div className="w-full h-full bg-white dark:bg-[#1C1814] rounded-full flex items-center justify-center text-emerald-500">
                    <CheckCircle className="w-12 h-12 stroke-[2.2]" />
                  </div>
                </motion.div>
                <span className="absolute -bottom-1 bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-md">
                  Confirmed
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
                  Order Successfully Placed!
                </h2>
                <p className="text-xs text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 leading-relaxed max-w-md mx-auto">
                  Thank you for choosing <strong className="text-[#1F1B16] dark:text-[#F7F3EC]">Millennium Furniture</strong>. Your order has been registered under <span className="font-bold text-emerald-600 dark:text-emerald-400">Cash on Delivery (COD)</span>.
                </p>
              </div>

              {/* Order Status Card */}
              <div className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 text-left text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-[#1F1B16]/5 dark:border-[#F7F3EC]/5">
                  <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-bold uppercase tracking-wider text-[10px]">Delivery Mode</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Doorstep Direct Transit
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-bold uppercase tracking-wider text-[10px]">Payment Status</span>
                  <span className="font-bold text-[#1F1B16] dark:text-[#F7F3EC]">Pay Cash Upon Arrival</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1F1B16] dark:bg-[#F7F3EC] text-[#F7F3EC] dark:text-[#1F1B16] hover:bg-accent-teal dark:hover:bg-accent-teal hover:text-white dark:hover:text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg transition-all"
                >
                  Continue Shopping <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
