"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
  ShoppingBag,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Trash2,
  Banknote,
  Check,
  FileDown,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const fmt = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

// ─── Reusable field wrapper ───────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 relative">
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[#1F1B16]/10 dark:border-[#F7F3EC]/12 bg-[#FAF8F5] dark:bg-[#12100E] text-sm text-[#1F1B16] dark:text-[#F7F3EC] placeholder:text-[#1F1B16]/30 dark:placeholder:text-[#F7F3EC]/30 focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/15 transition-all duration-200";

// ─── State Autocomplete Component ─────────────────────────────────────────────
function StateAutocompleteInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredStates = useMemo(() => {
    if (!value.trim()) return INDIAN_STATES;
    const query = value.toLowerCase().trim();
    return INDIAN_STATES.filter((s) => s.toLowerCase().includes(query));
  }, [value]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredStates]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredStates.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredStates.length) % filteredStates.length);
    } else if (e.key === "Enter" && filteredStates[highlightedIndex]) {
      e.preventDefault();
      onChange(filteredStates[highlightedIndex]);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative cursor-pointer" onClick={() => setIsOpen((prev) => !prev)}>
        <input
          type="text"
          required
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`${inputCls} pr-9`}
          placeholder="Select or type State"
          autoComplete="off"
        />
        <ChevronDown
          className={`w-4 h-4 text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 pointer-events-none ${
            isOpen ? "rotate-180 text-accent-teal" : ""
          }`}
        />
      </div>

      <AnimatePresence>
        {isOpen && filteredStates.length > 0 && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-56 overflow-y-auto bg-white/95 dark:bg-[#1A1714]/95 border border-[#1F1B16]/12 dark:border-[#F7F3EC]/15 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl py-1.5 text-xs overflow-x-hidden scrollbar-thin"
          >
            {filteredStates.map((st, index) => {
              const isSelected = value.toLowerCase() === st.toLowerCase();
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={st}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => {
                    onChange(st);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 cursor-pointer font-medium transition-all duration-150 flex items-center justify-between ${
                    isSelected
                      ? "bg-accent-teal/20 text-accent-teal font-bold"
                      : isHighlighted
                      ? "bg-[#1F1B16]/6 dark:bg-[#F7F3EC]/8 text-[#1F1B16] dark:text-[#F7F3EC]"
                      : "text-[#1F1B16]/80 dark:text-[#F7F3EC]/80"
                  }`}
                >
                  <span>{st}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-accent-teal shrink-0 stroke-[2.5]" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Steps config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: "shipping", label: "Shipping", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "review", label: "Review", icon: FileCheck },
] as const;

type Step = (typeof STEPS)[number]["id"];

export default function CheckoutPage() {
  const { cart, clearCart, updateCartQuantity, removeFromCart, addNotification, addOrder } =
    useStore();

  const [step, setStep] = useState<Step>("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState("");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedCartSnapshot, setCompletedCartSnapshot] = useState<typeof cart>([]);
  const [completedTotal, setCompletedTotal] = useState(0);

  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart]
  );
  const gst = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const shipping = subtotal > 15000 ? 0 : 2500;
  const total = subtotal + gst + shipping;

  const sf =
    (key: keyof typeof shippingForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setShippingForm((f) => ({ ...f, [key]: e.target.value }));

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

    addOrder({
      id: orderId,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      customerName: shippingForm.fullName || "Valued Customer",
      email: shippingForm.email || "customer@domain.com",
      type: "Retail",
      total,
      status: "Pending",
      address: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} - ${shippingForm.postalCode}`,
      phone: shippingForm.phone || "+91 93343 09230",
      items: cart.map((i) => ({
        name: i.name,
        color: i.color,
        quantity: i.quantity,
        price: i.price,
      })),
    });

    addNotification({
      orderId,
      customerName: shippingForm.fullName || "Valued Customer",
      type: "Retail",
      total,
    });

    setCompletedOrderId(orderId);
    setCompletedCartSnapshot([...cart]);
    setCompletedTotal(total);
    setIsCompleted(true);
    setIsProcessingPayment(false);
    clearCart();
  };

  const handlePlaceOrder = async () => {
    const orderId = `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    if (paymentMethod === "online") {
      setIsProcessingPayment(true);
      try {
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
          alert("Razorpay SDK is loading or blocked by adblocker. Please refresh and try again.");
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
            method: "upi",
          },
          theme: { color: "#0D5C53" },
          handler: async (response: any) => {
            try {
              await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
            } catch {}
            await finalizeOrderPlacement(orderId, "Online Payment (Razorpay)");
          },
          modal: { ondismiss: () => setIsProcessingPayment(false) },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      } catch (err: any) {
        alert(`Payment Launch Error: ${err.message || "Failed to open gateway"}`);
        setIsProcessingPayment(false);
        return;
      }
    }

    await finalizeOrderPlacement(orderId, "Cash on Delivery (COD)");
  };

  const downloadInvoicePdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const res = await fetch("/api/orders/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: completedOrderId,
          customerName: shippingForm.fullName,
          customerEmail: shippingForm.email || "customer@millenniumfurniture.in",
          customerPhone: shippingForm.phone,
          address: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          postalCode: shippingForm.postalCode,
          items: completedCartSnapshot,
          totalAmount: completedTotal,
          date: new Date().toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }),
      });
      const data = await res.json();
      if (data.success && data.pdfBase64) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${data.pdfBase64}`;
        link.download = `Invoice-${completedOrderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Failed to generate PDF. Please contact support.");
      }
    } catch {
      alert("PDF download failed. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-[#F7F3EC] dark:bg-[#0E0C0A] text-[#1F1B16] dark:text-[#F7F3EC] font-sans flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-[1160px] mx-auto w-full px-4 md:px-8 pt-44 pb-24">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* ── Step Indicator ── */}
              <div className="flex justify-center mb-12">
                <div className="flex items-center">
                  {STEPS.map((s, i) => {
                    const active = step === s.id;
                    const done = i < stepIndex;
                    return (
                      <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                              done
                                ? "bg-accent-teal text-white"
                                : active
                                ? "bg-[#1F1B16] dark:bg-[#F7F3EC] text-[#F7F3EC] dark:text-[#1F1B16] ring-4 ring-[#1F1B16]/10 dark:ring-[#F7F3EC]/10"
                                : "bg-[#1F1B16]/8 dark:bg-[#F7F3EC]/8 text-[#1F1B16]/30 dark:text-[#F7F3EC]/30"
                            }`}
                          >
                            {done ? (
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            ) : (
                              <s.icon className="w-4 h-4" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-semibold tracking-wide transition-colors ${
                              active
                                ? "text-[#1F1B16] dark:text-[#F7F3EC]"
                                : "text-[#1F1B16]/40 dark:text-[#F7F3EC]/40"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className={`w-16 sm:w-24 h-px mb-5 mx-1 transition-all duration-500 ${
                              i < stepIndex
                                ? "bg-accent-teal"
                                : "bg-[#1F1B16]/12 dark:bg-[#F7F3EC]/12"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {cart.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

                  {/* ── Left: Form Panel ── */}
                  <div className="bg-white dark:bg-[#1A1714] rounded-2xl border border-[#1F1B16]/8 dark:border-[#F7F3EC]/8 overflow-hidden shadow-warm-md">
                    <AnimatePresence mode="wait">

                      {step === "shipping" && (
                        <motion.form
                          key="shipping"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.22 }}
                          onSubmit={(e) => { e.preventDefault(); setStep("payment"); }}
                          className="p-7 sm:p-9 space-y-6"
                        >
                          <div>
                            <h2 className="font-serif text-2xl font-bold tracking-tight">Delivery Address</h2>
                            <p className="text-xs text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 mt-1">
                              Where should we deliver your furniture?
                            </p>
                          </div>
                          <div className="space-y-4">
                            <Field label="Full Name *">
                              <input type="text" required value={shippingForm.fullName} onChange={sf("fullName")} className={inputCls} placeholder="Rajan Mehta" />
                            </Field>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field label="Email *">
                                <input type="email" required value={shippingForm.email} onChange={sf("email")} className={inputCls} placeholder="you@email.com" />
                              </Field>
                              <Field label="Phone *">
                                <input type="tel" required value={shippingForm.phone} onChange={sf("phone")} className={inputCls} placeholder="+91 98765 43210" />
                              </Field>
                            </div>
                            <Field label="Street Address *">
                              <input type="text" required value={shippingForm.address} onChange={sf("address")} className={inputCls} placeholder="Flat 4B, Green Valley Apartments" />
                            </Field>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <Field label="City *">
                                <input type="text" required value={shippingForm.city} onChange={sf("city")} className={inputCls} placeholder="Bhubaneswar" />
                              </Field>
                              <Field label="State *">
                                <StateAutocompleteInput
                                  value={shippingForm.state}
                                  onChange={(val) => setShippingForm((f) => ({ ...f, state: val }))}
                                />
                              </Field>
                              <Field label="PIN Code *">
                                <input type="text" required value={shippingForm.postalCode} onChange={sf("postalCode")} className={inputCls} placeholder="751001" maxLength={6} />
                              </Field>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-[#1F1B16] dark:bg-[#F7F3EC] text-[#F7F3EC] dark:text-[#1F1B16] hover:bg-accent-teal dark:hover:bg-accent-teal hover:text-white dark:hover:text-white text-xs font-bold tracking-[0.1em] uppercase py-4 rounded-xl transition-all duration-200 shadow-md"
                          >
                            Continue to Payment <ArrowRight className="w-4 h-4" />
                          </button>
                        </motion.form>
                      )}

                      {step === "payment" && (
                        <motion.form
                          key="payment"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.22 }}
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (paymentMethod === "online") handlePlaceOrder();
                            else setStep("review");
                          }}
                          className="p-7 sm:p-9 space-y-6"
                        >
                          <div>
                            <h2 className="font-serif text-2xl font-bold tracking-tight">Payment Method</h2>
                            <p className="text-xs text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 mt-1">
                              All transactions are encrypted end-to-end.
                            </p>
                          </div>
                          <div className="space-y-3">
                            {[
                              {
                                id: "cod" as const,
                                icon: Banknote,
                                title: "Cash on Delivery",
                                desc: "Inspect your furniture at doorstep before paying.",
                                badge: "Recommended",
                                badgeCls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                              },
                              {
                                id: "online" as const,
                                icon: CreditCard,
                                title: "Pay Online",
                                desc: "UPI, GPay, PhonePe, Cards, Netbanking via Razorpay.",
                                badge: "Instant",
                                badgeCls: "bg-accent-teal/10 text-accent-teal",
                              },
                            ].map(({ id, icon: Icon, title, desc, badge, badgeCls }) => (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setPaymentMethod(id)}
                                className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                                  paymentMethod === id
                                    ? "border-[#1F1B16] dark:border-[#F7F3EC] bg-[#1F1B16]/4 dark:bg-[#F7F3EC]/4"
                                    : "border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 hover:border-[#1F1B16]/25 dark:hover:border-[#F7F3EC]/25"
                                }`}
                              >
                                <div
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                    paymentMethod === id
                                      ? "bg-[#1F1B16] dark:bg-[#F7F3EC] text-[#F7F3EC] dark:text-[#1F1B16]"
                                      : "bg-[#1F1B16]/6 dark:bg-[#F7F3EC]/6 text-[#1F1B16]/50 dark:text-[#F7F3EC]/50"
                                  }`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm font-semibold">{title}</span>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeCls}`}>
                                      {badge}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 leading-relaxed">{desc}</p>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                    paymentMethod === id
                                      ? "border-[#1F1B16] dark:border-[#F7F3EC] bg-[#1F1B16] dark:bg-[#F7F3EC]"
                                      : "border-[#1F1B16]/20 dark:border-[#F7F3EC]/20"
                                  }`}
                                >
                                  {paymentMethod === id && (
                                    <Check className="w-3 h-3 text-[#F7F3EC] dark:text-[#1F1B16] stroke-[3]" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">
                            <ShieldCheck className="w-3.5 h-3.5 text-accent-teal shrink-0" />
                            Secured by 256-bit SSL encryption
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setStep("shipping")}
                              className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl border border-[#1F1B16]/12 dark:border-[#F7F3EC]/12 text-xs font-semibold hover:bg-[#1F1B16]/4 dark:hover:bg-[#F7F3EC]/4 transition-all"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" /> Back
                            </button>
                            <button
                              type="submit"
                              disabled={isProcessingPayment}
                              className="flex-1 flex items-center justify-center gap-2 bg-[#1F1B16] dark:bg-[#F7F3EC] text-[#F7F3EC] dark:text-[#1F1B16] hover:bg-accent-teal dark:hover:bg-accent-teal hover:text-white dark:hover:text-white text-xs font-bold tracking-[0.1em] uppercase py-4 rounded-xl transition-all duration-200 disabled:opacity-40"
                            >
                              {isProcessingPayment ? (
                                "Processing…"
                              ) : paymentMethod === "cod" ? (
                                <><span>Review Order</span><ArrowRight className="w-4 h-4" /></>
                              ) : (
                                <><span>Pay {fmt(total)}</span><CheckCircle className="w-4 h-4" /></>
                              )}
                            </button>
                          </div>
                        </motion.form>
                      )}

                      {step === "review" && (
                        <motion.div
                          key="review"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.22 }}
                          className="p-7 sm:p-9 space-y-6"
                        >
                          <div>
                            <h2 className="font-serif text-2xl font-bold tracking-tight">Confirm Order</h2>
                            <p className="text-xs text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 mt-1">Review your details before placing.</p>
                          </div>
                          <div className="rounded-xl border border-[#1F1B16]/8 dark:border-[#F7F3EC]/8 overflow-hidden divide-y divide-[#1F1B16]/8 dark:divide-[#F7F3EC]/8">
                            <div className="p-4 space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-accent-teal">Delivery To</p>
                              <p className="text-sm font-semibold">{shippingForm.fullName}</p>
                              <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">
                                {shippingForm.address}, {shippingForm.city}, {shippingForm.state} — {shippingForm.postalCode}
                              </p>
                              <p className="text-xs text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
                                {shippingForm.phone} · {shippingForm.email}
                              </p>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-accent-teal">Payment</p>
                              <p className="text-sm font-semibold flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-accent-teal" />
                                {paymentMethod === "cod" ? "Cash on Delivery" : "Online via Razorpay"}
                              </p>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-accent-teal">Delivery</p>
                              <p className="text-sm font-semibold flex items-center gap-1.5">
                                <Truck className="w-4 h-4 text-accent-teal" /> Doorstep Direct Transit
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setStep("payment")}
                              className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl border border-[#1F1B16]/12 dark:border-[#F7F3EC]/12 text-xs font-semibold hover:bg-[#1F1B16]/4 dark:hover:bg-[#F7F3EC]/4 transition-all"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" /> Back
                            </button>
                            <button
                              disabled={isProcessingPayment}
                              onClick={handlePlaceOrder}
                              className="flex-1 flex items-center justify-center gap-2 bg-accent-teal hover:bg-accent-teal/90 text-white text-xs font-bold tracking-[0.1em] uppercase py-4 rounded-xl transition-all duration-200 disabled:opacity-40 shadow-lg shadow-accent-teal/20"
                            >
                              {isProcessingPayment ? (
                                "Placing Order…"
                              ) : (
                                <><span>Place Order · {fmt(total)}</span><CheckCircle className="w-4 h-4" /></>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>

                  {/* ── Right: Order Summary ── */}
                  <div className="bg-white dark:bg-[#1A1714] rounded-2xl border border-[#1F1B16]/8 dark:border-[#F7F3EC]/8 shadow-warm-md sticky top-28 overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-[#1F1B16]/8 dark:border-[#F7F3EC]/8">
                      <h3 className="font-serif text-base font-bold">
                        Your Order
                        <span className="ml-2 text-xs font-sans font-normal text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">
                          ({cart.reduce((s, i) => s + i.quantity, 0)} item{cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""})
                        </span>
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 px-6 py-4 border-b border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 last:border-0">
                          <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#F7F3EC] dark:bg-[#0E0C0A] shrink-0 border border-[#1F1B16]/8 dark:border-[#F7F3EC]/8">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{item.name}</p>
                            <p className="text-[10px] text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 mb-1.5">{item.color || "Natural"}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-full px-2 py-0.5">
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#1F1B16]/8 dark:hover:bg-[#F7F3EC]/8 transition-colors"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-[11px] font-mono font-bold w-4 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#1F1B16]/8 dark:hover:bg-[#F7F3EC]/8 transition-colors"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-[#1F1B16]/25 dark:text-[#F7F3EC]/25 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <span className="text-xs font-serif font-bold shrink-0">{fmt(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 pt-4 pb-6 space-y-2.5 border-t border-[#1F1B16]/8 dark:border-[#F7F3EC]/8">
                      {[
                        { label: "Subtotal", value: fmt(subtotal), highlight: false },
                        { label: "GST (18%)", value: fmt(gst), highlight: false },
                        { label: "Shipping", value: shipping > 0 ? fmt(shipping) : "Free", highlight: shipping === 0 },
                      ].map(({ label, value, highlight }) => (
                        <div key={label} className="flex items-center justify-between text-xs text-[#1F1B16]/55 dark:text-[#F7F3EC]/55">
                          <span>{label}</span>
                          <span className={`font-semibold ${highlight ? "text-accent-teal" : ""}`}>{value}</span>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex items-center justify-between">
                        <span className="text-sm font-semibold">Total</span>
                        <span className="font-serif text-xl font-bold text-accent-teal">{fmt(total)}</span>
                      </div>
                      {shipping === 0 && (
                        <p className="text-[10px] text-accent-teal/70 text-center pt-1">
                          🎉 Free shipping on orders above ₹15,000
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#1F1B16]/6 dark:bg-[#F7F3EC]/6 flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7 text-[#1F1B16]/30 dark:text-[#F7F3EC]/30" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-1">Your cart is empty</h3>
                    <p className="text-sm text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 max-w-xs">
                      Add handcrafted furniture to your cart before checking out.
                    </p>
                  </div>
                  <a
                    href="/spaces/home"
                    className="inline-flex items-center gap-2 bg-[#1F1B16] dark:bg-[#F7F3EC] text-[#F7F3EC] dark:text-[#1F1B16] text-xs font-bold px-6 py-3.5 rounded-xl hover:bg-accent-teal dark:hover:bg-accent-teal hover:text-white dark:hover:text-white transition-all"
                  >
                    Browse Collection <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </motion.div>
          ) : (
            /* ── Order Success ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="max-w-md mx-auto text-center space-y-8 py-10"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/25"
              >
                <CheckCircle className="w-10 h-10 text-white stroke-[2]" />
              </motion.div>
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full">
                  <Check className="w-3 h-3 stroke-[3]" /> Order Confirmed
                </span>
                <h2 className="font-serif text-3xl font-bold tracking-tight mt-3">Your order is placed!</h2>
                <p className="text-sm text-[#1F1B16]/55 dark:text-[#F7F3EC]/55 leading-relaxed">
                  Thank you for choosing{" "}
                  <strong className="text-[#1F1B16] dark:text-[#F7F3EC]">Millennium Furniture</strong>.
                  Your handcrafted piece is being registered for delivery.
                </p>
              </div>
              <div className="rounded-xl border border-[#1F1B16]/8 dark:border-[#F7F3EC]/8 overflow-hidden divide-y divide-[#1F1B16]/8 dark:divide-[#F7F3EC]/8 text-left bg-white dark:bg-[#1A1714]">
                <div className="px-5 py-3.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">Order ID</span>
                  <span className="text-xs font-mono font-bold">{completedOrderId}</span>
                </div>
                <div className="px-5 py-3.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">Payment</span>
                  <span className="text-xs font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {paymentMethod === "cod" ? "Cash on Delivery" : "Paid via Razorpay"}
                  </span>
                </div>
                <div className="px-5 py-3.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">Delivery</span>
                  <span className="text-xs font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-accent-teal" /> Doorstep Transit
                  </span>
                </div>
                <div className="px-5 py-3.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1F1B16]/40 dark:text-[#F7F3EC]/40">Amount</span>
                  <span className="font-serif font-bold text-accent-teal">{fmt(completedTotal)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={downloadInvoicePdf}
                  disabled={isDownloadingPdf}
                  className="w-full flex items-center justify-center gap-2 border border-[#1F1B16]/15 dark:border-[#F7F3EC]/15 hover:border-accent-teal hover:text-accent-teal text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-wait"
                >
                  {isDownloadingPdf ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating…
                    </>
                  ) : (
                    <><FileDown className="w-4 h-4" /> Download Invoice</>
                  )}
                </button>
                <a
                  href="/"
                  className="w-full flex items-center justify-center gap-2 bg-[#1F1B16] dark:bg-[#F7F3EC] text-[#F7F3EC] dark:text-[#1F1B16] hover:bg-accent-teal dark:hover:bg-accent-teal hover:text-white dark:hover:text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200"
                >
                  Continue Shopping <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
