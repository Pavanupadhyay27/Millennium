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
    city: "",
    state: "",
    postalCode: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
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
    if (paymentMethod === "upi" || paymentMethod === "card") {
      handlePlaceOrder();
    } else {
      setStep("review");
    }
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePlaceOrder = async () => {
    const orderId = `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    if (paymentMethod === "upi" || paymentMethod === "card") {
      setIsProcessingPayment(true);
      try {
        // 1. Create Razorpay Order via backend API
        const razorpayRes = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            currency: "INR",
            receipt: orderId,
            notes: {
              customerName: shippingForm.fullName,
              customerEmail: shippingForm.email,
              phone: shippingForm.phone,
            },
          }),
        });

        const razorpayData = await razorpayRes.json();

        if (!razorpayData.success) {
          alert(`Razorpay Order Error: ${razorpayData.error || "Failed to initialize order."}`);
          setIsProcessingPayment(false);
          return;
        }

        if (typeof window === "undefined" || !(window as any).Razorpay) {
          alert("Razorpay SDK is loading or blocked by adblocker. Please refresh the page and try again.");
          setIsProcessingPayment(false);
          return;
        }

        const options = {
          key: razorpayData.keyId,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
          name: "Millennium Furniture",
          description: "Handcrafted Teak & Organic Wood Furnishings",
          image: "/logo.png",
          order_id: razorpayData.orderId,
          prefill: {
            name: shippingForm.fullName,
            email: shippingForm.email,
            contact: shippingForm.phone,
          },
          theme: {
            color: "#0D5C53",
          },
          handler: async function (response: any) {
            try {
              // Verify Payment Signature
              await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });

              // Finalize Order Creation after successful payment
              await finalizeOrderPlacement(orderId, paymentMethod === "upi" ? "UPI Instant (Razorpay)" : "Credit/Debit Card (Razorpay)");
            } catch (vErr) {
              console.error("Payment verification error:", vErr);
              await finalizeOrderPlacement(orderId, "Razorpay (Online Payment)");
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessingPayment(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        // IMPORTANT: STOP HERE so it doesn't fall through to COD placement!
        return;
      } catch (err: any) {
        console.error("Razorpay Popup Launch Error:", err);
        alert(`Payment Launch Error: ${err.message || "Failed to open gateway"}`);
        setIsProcessingPayment(false);
        return;
      }
    }

    // Cash on Delivery (COD) flow
    await finalizeOrderPlacement(orderId, "Cash on Delivery (COD)");
  };

  const finalizeOrderPlacement = async (orderId: string, paymentTypeStr: string) => {
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
    setIsProcessingPayment(false);
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
                        <form onSubmit={handleShippingSubmit} className="space-y-5">
                          <div className="flex items-center justify-between pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                            <div>
                              <h2 className="font-serif text-2xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">Delivery Address</h2>
                              <p className="text-[11px] text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mt-0.5">Enter your shipping details for insured doorstep transit.</p>
                            </div>
                            <span className="text-[10px] font-extrabold text-accent-teal uppercase tracking-widest bg-accent-teal/10 border border-accent-teal/20 px-3 py-1 rounded-full">
                              Step 1 of 3
                            </span>
                          </div>

                          <div>
                            <label className="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={shippingForm.fullName}
                              onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                              className="w-full px-4 py-3 rounded-2xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-bold focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 text-[#1F1B16] dark:text-[#F7F3EC] transition-all"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                required
                                value={shippingForm.email}
                                onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-medium focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 text-[#1F1B16] dark:text-[#F7F3EC] transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                Phone Number *
                              </label>
                              <input
                                type="tel"
                                required
                                value={shippingForm.phone}
                                onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-mono font-bold focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 text-[#1F1B16] dark:text-[#F7F3EC] transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                              Street Address *
                            </label>
                            <input
                              type="text"
                              required
                              value={shippingForm.address}
                              onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                              className="w-full px-4 py-3 rounded-2xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-medium focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 text-[#1F1B16] dark:text-[#F7F3EC] transition-all"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                City *
                              </label>
                              <input
                                type="text"
                                required
                                value={shippingForm.city}
                                onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-bold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                State *
                              </label>
                              <input
                                type="text"
                                required
                                value={shippingForm.state}
                                onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-bold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                PIN Code *
                              </label>
                              <input
                                type="text"
                                required
                                value={shippingForm.postalCode}
                                onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-mono font-bold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-accent-teal hover:bg-accent-teal/90 text-white font-extrabold text-xs uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 mt-4"
                          >
                            Continue to Payment <ArrowRight className="w-4 h-4" />
                          </button>
                        </form>
                      )}

                      {/* STEP 2: PAYMENT METHOD SELECTION */}
                      {step === "payment" && (
                        <form onSubmit={handlePaymentSubmit} className="space-y-5">
                          <div className="flex items-center justify-between pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                            <div>
                              <h2 className="font-serif text-2xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">Payment Method</h2>
                              <p className="text-[11px] text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mt-0.5">Select how you would like to complete your order.</p>
                            </div>
                            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Encrypted & Verified
                            </span>
                          </div>

                          <div className="space-y-3.5">
                            {/* Option 1: Cash on Delivery (COD) */}
                            <div
                              onClick={() => setPaymentMethod("cod")}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                                paymentMethod === "cod"
                                  ? "bg-accent-teal/10 dark:bg-accent-teal/20 border-accent-teal shadow-md"
                                  : "bg-[#FAF7F2] dark:bg-[#12100E]/40 border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 hover:border-accent-teal/50"
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                                  paymentMethod === "cod" ? "bg-accent-teal text-white" : "bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC]"
                                }`}>
                                  <Banknote className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]">Cash on Delivery (COD)</h4>
                                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">Recommended</span>
                                  </div>
                                  <p className="text-[11px] text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 mt-0.5">
                                    Pay cash at doorstep after inspecting your handcrafted furniture.
                                  </p>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === "cod" ? "border-accent-teal bg-accent-teal text-white" : "border-[#1F1B16]/30 dark:border-[#F7F3EC]/30"
                              }`}>
                                {paymentMethod === "cod" && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>

                            {/* Option 2: UPI Instant Transfer */}
                            <div
                              onClick={() => setPaymentMethod("upi")}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                                paymentMethod === "upi"
                                  ? "bg-accent-teal/10 dark:bg-accent-teal/20 border-accent-teal shadow-md"
                                  : "bg-[#FAF7F2] dark:bg-[#12100E]/40 border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 hover:border-accent-teal/50"
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                                  paymentMethod === "upi" ? "bg-accent-teal text-white" : "bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC]"
                                }`}>
                                  <Smartphone className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]">UPI Instant (GPay / PhonePe / Paytm / Razorpay)</h4>
                                  <p className="text-[11px] text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 mt-0.5">
                                    Fast 1-click checkout via any UPI App or QR code scan.
                                  </p>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === "upi" ? "border-accent-teal bg-accent-teal text-white" : "border-[#1F1B16]/30 dark:border-[#F7F3EC]/30"
                              }`}>
                                {paymentMethod === "upi" && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>

                            {/* Option 3: Credit / Debit Card (WITH EXPANDABLE FORM FIELDS) */}
                            <div
                              onClick={() => setPaymentMethod("card")}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                paymentMethod === "card"
                                  ? "bg-accent-teal/10 dark:bg-accent-teal/20 border-accent-teal shadow-md"
                                  : "bg-[#FAF7F2] dark:bg-[#12100E]/40 border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 hover:border-accent-teal/50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3.5">
                                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                                    paymentMethod === "card" ? "bg-accent-teal text-white" : "bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC]"
                                  }`}>
                                    <CreditCard className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC]">Credit / Debit Card</h4>
                                    <p className="text-[11px] text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 mt-0.5">
                                      Visa, Mastercard, RuPay, and American Express.
                                    </p>
                                  </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  paymentMethod === "card" ? "border-accent-teal bg-accent-teal text-white" : "border-[#1F1B16]/30 dark:border-[#F7F3EC]/30"
                                }`}>
                                  {paymentMethod === "card" && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>

                              {/* EXPANDABLE CARD INPUT FIELDS */}
                              {paymentMethod === "card" && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-4 pt-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 space-y-3"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div>
                                    <label className="block text-[9px] font-extrabold uppercase tracking-widest mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                      Cardholder Name *
                                    </label>
                                    <input
                                      type="text"
                                      value={paymentForm.cardName}
                                      onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-white dark:bg-[#1C1814] text-xs font-bold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[9px] font-extrabold uppercase tracking-widest mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                      Card Number *
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={paymentForm.cardNumber}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-white dark:bg-[#1C1814] text-xs font-mono font-bold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                                      />
                                      <Lock className="w-3.5 h-3.5 text-accent-teal absolute right-3.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[9px] font-extrabold uppercase tracking-widest mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                        Expiry Date (MM/YY) *
                                      </label>
                                      <input
                                        type="text"
                                        value={paymentForm.cardExpiry}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, cardExpiry: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-white dark:bg-[#1C1814] text-xs font-mono font-bold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-extrabold uppercase tracking-widest mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                                        CVV Security Code *
                                      </label>
                                      <input
                                        type="password"
                                        maxLength={4}
                                        value={paymentForm.cardCvc}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, cardCvc: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-white dark:bg-[#1C1814] text-xs font-mono font-bold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                                      />
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button
                              type="button"
                              onClick={() => setStep("shipping")}
                              className="border border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 hover:bg-[#1F1B16]/5 dark:hover:bg-[#F7F3EC]/10 text-xs font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-1 text-[#1F1B16] dark:text-[#F7F3EC] transition-all"
                            >
                              <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                              type="submit"
                              disabled={isProcessingPayment}
                              className="flex-1 bg-accent-teal hover:bg-accent-teal/90 text-white font-extrabold text-xs uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {isProcessingPayment ? (
                                "Opening Razorpay..."
                              ) : paymentMethod === "cod" ? (
                                <>Proceed to Review <ArrowRight className="w-4 h-4" /></>
                              ) : (
                                <>Pay ₹{total.toLocaleString("en-IN")} via Razorpay <CheckCircle className="w-4 h-4" /></>
                              )}
                            </button>
                          </div>
                        </form>
                      )}

                      {/* STEP 3: REVIEW AND PLACE ORDER */}
                      {step === "review" && (
                        <div className="space-y-5">
                          <div className="pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                            <h2 className="font-serif text-2xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">Confirm Order Details</h2>
                            <p className="text-[11px] text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mt-0.5">Review your shipping address and payment summary before placing order.</p>
                          </div>

                          <div className="bg-[#FAF7F2] dark:bg-[#12100E] rounded-2xl p-5 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-xs space-y-4 shadow-inner">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-teal block mb-1">
                                Delivery Address
                              </span>
                              <p className="font-bold text-sm text-[#1F1B16] dark:text-[#F7F3EC]">{shippingForm.fullName}</p>
                              <p className="text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 mt-0.5">{shippingForm.address}, {shippingForm.city}, {shippingForm.state} - {shippingForm.postalCode}</p>
                              <p className="text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 font-mono mt-0.5">Phone: {shippingForm.phone} | Email: {shippingForm.email}</p>
                            </div>
                            <div className="border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pt-3">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-teal block mb-1">
                                Selected Payment Method
                              </span>
                              <p className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4" />
                                {paymentMethod === "cod"
                                  ? "Cash on Delivery (Pay upon arrival)"
                                  : paymentMethod === "upi"
                                  ? "UPI Instant Transfer (GPay / PhonePe / Razorpay)"
                                  : `Credit / Debit Card (${paymentForm.cardNumber ? `**** ${paymentForm.cardNumber.slice(-4)}` : "Online Card"})`}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => setStep("payment")}
                              className="border border-[#1F1B16]/20 dark:border-[#F7F3EC]/20 hover:bg-[#1F1B16]/5 dark:hover:bg-[#F7F3EC]/10 text-xs font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-1 text-[#1F1B16] dark:text-[#F7F3EC] transition-all"
                            >
                              <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                              disabled={isProcessingPayment}
                              onClick={handlePlaceOrder}
                              className="flex-1 bg-accent-teal hover:bg-accent-teal/90 text-white font-extrabold text-xs uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {isProcessingPayment ? "Launching Secure Gateway..." : `Place Order (${formatPrice(total)})`} <CheckCircle className="w-4 h-4" />
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
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="py-12 md:py-16 text-center max-w-lg mx-auto bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-[40px] p-8 md:p-12 shadow-2xl space-y-7 relative overflow-hidden"
            >
              {/* Glowing Background Radials */}
              <div className="absolute -top-20 -left-20 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-accent-teal/15 rounded-full blur-3xl pointer-events-none" />

              {/* Premium Animated Success Checkmark Ring with Continuous Slow Floating Bounce */}
              <div className="flex flex-col items-center justify-center space-y-4 pt-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 p-1.5 shadow-2xl shadow-emerald-500/30 flex items-center justify-center"
                  >
                    <div className="w-full h-full bg-emerald-50 dark:bg-[#12100E] rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                      <CheckCircle className="w-12 h-12 stroke-[2.5]" />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Ultra High-Contrast Confirmed Pill Badge */}
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-emerald-600 text-white font-mono font-extrabold text-[11px] uppercase tracking-widest px-5 py-1.5 rounded-full shadow-lg border border-emerald-400/40 inline-flex items-center gap-1.5 z-10"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> ORDER CONFIRMED
                </motion.span>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] tracking-tight">
                  Order Successfully Placed!
                </h2>
                <p className="text-xs md:text-sm text-[#1F1B16]/70 dark:text-[#F7F3EC]/70 leading-relaxed max-w-md mx-auto">
                  Thank you for choosing <strong className="text-[#1F1B16] dark:text-[#F7F3EC]">Millennium Furniture</strong>. Your handcrafted piece is now being registered for delivery.
                </p>
              </div>

              {/* Order Details & Logistics Card */}
              <div className="bg-[#FAF7F2] dark:bg-[#12100E] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-5 text-left text-xs space-y-3 shadow-inner">
                <div className="flex justify-between items-center pb-2.5 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                  <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-mono font-bold uppercase tracking-wider text-[10px]">Payment Method</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {paymentMethod === "cod"
                      ? "Cash on Delivery (COD)"
                      : paymentMethod === "upi"
                      ? "UPI Instant (Paid via Razorpay)"
                      : "Credit / Debit Card (Paid via Razorpay)"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                  <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-mono font-bold uppercase tracking-wider text-[10px]">Delivery Mode</span>
                  <span className="font-bold text-[#1F1B16] dark:text-[#F7F3EC] flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-accent-teal" /> Doorstep Direct Transit
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-mono font-bold uppercase tracking-wider text-[10px]">Logistics & Tax Invoice</span>
                  <span className="font-bold text-accent-teal">PDF Tax Invoice Emailed</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1F1B16] dark:bg-[#F7F3EC] text-[#F7F3EC] dark:text-[#1F1B16] hover:bg-accent-teal dark:hover:bg-accent-teal hover:text-white dark:hover:text-white font-extrabold text-xs uppercase tracking-widest px-9 py-4 rounded-full shadow-xl transition-all"
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
