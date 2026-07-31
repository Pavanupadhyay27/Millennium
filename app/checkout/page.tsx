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
  Zap,
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
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl text-sm glass-field";

// ─── State Autocomplete Component ─────────────────────────────────────────────
const StateAutocompleteInput = React.forwardRef<
  HTMLDivElement,
  { value: string; onChange: (val: string) => void }
>(function StateAutocompleteInput({ value, onChange }, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const internalRef = useRef<HTMLDivElement>(null);
  const wrapperRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
  const listRef = useRef<HTMLUListElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

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
          autoComplete="off"
        />
        <ChevronDown
          className={`w-4 h-4 text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
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
            className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-56 overflow-y-auto rounded-xl py-1.5 text-xs overflow-x-hidden scrollbar-thin"
            style={{
              background: theme === "light" ? "rgba(250,247,242,0.98)" : "rgba(26,22,18,0.97)",
              border: theme === "light" ? "1px solid rgba(31,27,22,0.12)" : "1px solid rgba(255,255,255,0.12)",
              boxShadow: theme === "light" ? "0 12px 32px rgba(31,27,22,0.15)" : "0 12px 32px rgba(0,0,0,0.5)",
              backdropFilter: "blur(24px)",
            }}
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
                  className={`px-4 py-2.5 cursor-pointer font-medium flex items-center justify-between ${
                    isSelected
                      ? "text-emerald-400 font-bold"
                      : isHighlighted
                      ? (theme === "light" ? "text-charcoal" : "text-white/90")
                      : (theme === "light" ? "text-charcoal/60" : "text-white/55")
                  }`}
                  style={isSelected ? { background: "rgba(16,185,129,0.15)" } : isHighlighted ? { background: theme === "light" ? "rgba(31,27,22,0.06)" : "rgba(255,255,255,0.06)" } : {}}
                >
                  <span>{st}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
});

// ─── Steps config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: "shipping", label: "Shipping", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "review", label: "Review", icon: FileCheck },
] as const;

type Step = (typeof STEPS)[number]["id"];

export default function CheckoutPage() {
  const { cart, clearCart, updateCartQuantity, removeFromCart, addNotification, addOrder, user, addresses, addSavedAddress } =
    useStore();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (currentTheme) setTheme(currentTheme);
    };
    window.addEventListener("theme-change", handleThemeChange);
    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
    };
  }, []);

  const [step, setStep] = useState<Step>("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState("");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedCartSnapshot, setCompletedCartSnapshot] = useState<typeof cart>([]);
  const [completedTotal, setCompletedTotal] = useState(0);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const isSavedAddressValid = useMemo(() => {
    return Boolean(
      shippingForm.fullName.trim() &&
      shippingForm.phone.trim() &&
      shippingForm.address.trim() &&
      shippingForm.city.trim() &&
      shippingForm.state.trim()
    );
  }, [shippingForm]);

  // Restore form data from localStorage or store saved profile addresses on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("millennium_checkout_form");
      const def = addresses && addresses.length > 0 ? (addresses.find((a) => a.isDefault) || addresses[0]) : null;

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.shippingForm && parsed.shippingForm.fullName && parsed.shippingForm.address) {
          setShippingForm((prev) => ({ ...prev, ...parsed.shippingForm }));
          if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
          if (parsed.step && parsed.step !== "review") setStep(parsed.step);
          return;
        }
      }

      if (def) {
        setShippingForm({
          fullName: def.name || user?.name || "Pawan",
          email: def.email || user?.email || "Pk@gmail.com",
          phone: def.phone || user?.phone || "+91 70081 29381",
          address: def.address || "Plot 412, Kharvel Nagar, Janpath Road",
          city: def.city || "Bhubaneswar",
          state: def.state || "Odisha",
          postalCode: def.postalCode || "751001",
        });
      } else {
        setShippingForm({
          fullName: user?.name || "Pawan",
          email: user?.email || "Pk@gmail.com",
          phone: user?.phone || "+91 70081 29381",
          address: "Plot 412, Kharvel Nagar, Janpath Road",
          city: "Bhubaneswar",
          state: "Odisha",
          postalCode: "751001",
        });
      }
    } catch (err) {
      console.error("Failed to restore checkout form state", err);
    }
  }, [user, addresses]);

  // Auto-save form data to localStorage on every change
  useEffect(() => {
    try {
      if (!isCompleted) {
        localStorage.setItem(
          "millennium_checkout_form",
          JSON.stringify({ shippingForm, paymentMethod, step })
        );
      }
    } catch (err) {}
  }, [shippingForm, paymentMethod, step, isCompleted]);

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart]
  );
  const gst = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const shipping = shippingForm.state === "Odisha" || subtotal > 15000 ? 0 : 2500;
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
    localStorage.removeItem("millennium_checkout_form");
    setIsCompleted(true);
    setIsProcessingPayment(false);
    clearCart();
  };

  const handlePlaceOrder = async () => {
    const orderId = `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    if (paymentMethod === "online") {
      setIsProcessingPayment(true);
      try {
        const phonepeRes = await fetch("/api/phonepe/initiate-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            customerPhone: shippingForm.phone,
            customerName: shippingForm.fullName,
            customerEmail: shippingForm.email,
            orderId,
          }),
        });
        const phonepeData = await phonepeRes.json();

        if (phonepeData.success && phonepeData.redirectUrl) {
          clearCart();
          localStorage.removeItem("millennium_checkout_form");
          window.location.href = phonepeData.redirectUrl;
          return;
        } else {
          alert(`Online Payment Error: ${phonepeData.error || "Failed to initiate online payment."}`);
          setIsProcessingPayment(false);
          return;
        }
      } catch (err: any) {
        alert(`Online Payment Error: ${err.message || "Failed to initiate online payment"}`);
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
      if (!res.ok) throw new Error("PDF generation failed");

      const rawBlob = await res.blob();
      const pdfBlob = new Blob([rawBlob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${completedOrderId || "Millennium"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("PDF download failed. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
        theme === "light" ? "bg-[#F7F3EC] text-charcoal" : "bg-[#12100e] text-white"
      }`}
      style={theme === "light" ? {} : { background: "linear-gradient(135deg, #0E0C0A 0%, #1A1612 60%, #0E0C0A 100%)" }}
    >
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
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                            style={done ? {
                              background: "linear-gradient(180deg, #34D399 0%, #059669 100%)",
                              boxShadow: "0 4px 12px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                            } : active ? {
                              background: theme === "light" ? "rgba(31,27,22,0.08)" : "rgba(255,255,255,0.12)",
                              border: theme === "light" ? "1px solid rgba(31,27,22,0.15)" : "1px solid rgba(255,255,255,0.25)",
                              boxShadow: theme === "light" ? "0 0 0 4px rgba(31,27,22,0.03)" : "0 0 0 4px rgba(255,255,255,0.06)",
                            } : {
                              background: theme === "light" ? "rgba(31,27,22,0.04)" : "rgba(255,255,255,0.05)",
                              border: theme === "light" ? "1px solid rgba(31,27,22,0.06)" : "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            {done ? (
                              <Check className="w-4 h-4 stroke-[2.5] text-white" />
                            ) : (
                              <s.icon className={`w-4 h-4 ${
                                active
                                  ? (theme === "light" ? "text-charcoal" : "text-white")
                                  : (theme === "light" ? "text-charcoal/30" : "text-white/30")
                              }`} />
                            )}
                          </div>
                          <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
                            active
                              ? (theme === "light" ? "text-charcoal font-extrabold" : "text-white")
                              : (theme === "light" ? "text-charcoal/40" : "text-white/30")
                          }`}>
                            {s.label}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className="w-16 sm:w-24 h-px mb-5 mx-1 transition-all duration-500"
                            style={{
                              background: i < stepIndex
                                ? "linear-gradient(90deg, #34D399, #059669)"
                                : (theme === "light" ? "rgba(31,27,22,0.1)" : "rgba(255,255,255,0.1)")
                            }}
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
                  <div
                    className="rounded-3xl overflow-hidden"
                    style={{
                      background: theme === "light" ? "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)" : "rgba(255,255,255,0.05)",
                      border: theme === "light" ? "1px solid rgba(31,27,22,0.12)" : "1px solid rgba(255,255,255,0.09)",
                      boxShadow: theme === "light" ? "inset 0 1px 0 #FFF, inset 0 -2px 0 rgba(0,0,0,0.03)" : "0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    <AnimatePresence mode="wait">

                      {step === "shipping" && (
                        <motion.form
                          key="shipping"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.22 }}
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (isEditingAddress) {
                              addSavedAddress({
                                label: "New Address",
                                name: shippingForm.fullName,
                                address: shippingForm.address,
                                city: shippingForm.city,
                                state: shippingForm.state,
                                postalCode: shippingForm.postalCode,
                                phone: shippingForm.phone,
                                email: shippingForm.email,
                              });
                            }
                            setIsEditingAddress(false);
                            setStep("payment");
                          }}
                          className="p-7 sm:p-9 space-y-6"
                        >
                          {isSavedAddressValid && !isEditingAddress ? (
                            <div className="space-y-5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h2 className={`font-serif text-2xl font-bold tracking-tight ${theme === "light" ? "text-charcoal" : "text-white"}`}>Delivery Address</h2>
                                  <p className={`text-xs mt-1 ${theme === "light" ? "text-charcoal/60" : "text-white/40"}`}>
                                    Fetched from your profile saved delivery destinations.
                                  </p>
                                </div>
                                <span
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400"
                                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
                                >
                                  <Check className="w-3.5 h-3.5" /> Profile Address Active
                                </span>
                              </div>

                              {/* Saved Addresses List */}
                              <div className="space-y-3">
                                {addresses && addresses.length > 0 ? (
                                  addresses.map((addr) => (
                                    <div
                                      key={addr.id}
                                      onClick={() => {
                                        setShippingForm({
                                          fullName: addr.name || user?.name || "Pawan",
                                          email: addr.email || user?.email || "Pk@gmail.com",
                                          phone: addr.phone || user?.phone || "+91 70081 29381",
                                          address: addr.address || "",
                                          city: addr.city || "Bhubaneswar",
                                          state: addr.state || "Odisha",
                                          postalCode: addr.postalCode || "751001",
                                        });
                                      }}
                                      className="p-4 rounded-2xl cursor-pointer relative space-y-2"
                                      style={shippingForm.address === addr.address ? {
                                        background: "rgba(16,185,129,0.1)",
                                        border: "2px solid rgba(52,211,153,0.4)",
                                        boxShadow: "0 0 0 1px rgba(52,211,153,0.1)",
                                      } : theme === "light" ? {
                                        background: "rgba(0,0,0,0.02)",
                                        border: "1px solid rgba(31,27,22,0.08)",
                                      } : {
                                        background: "rgba(0,0,0,0.25)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                      }}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <div className="flex items-center gap-2 mb-1">
                                            <span
                                              className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded text-emerald-400"
                                              style={{ background: "rgba(16,185,129,0.12)" }}
                                            >
                                              {addr.label || "PRIMARY RESIDENCE"}
                                            </span>
                                            {addr.isDefault && (
                                              <span
                                                className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded text-amber-400"
                                                style={{ background: "rgba(212,168,83,0.12)" }}
                                              >
                                                DEFAULT
                                              </span>
                                            )}
                                          </div>
                                          <h4 className={`font-bold text-sm ${theme === "light" ? "text-charcoal" : "text-white/90"}`}>
                                            {addr.name || shippingForm.fullName}
                                          </h4>
                                          <p className={`text-xs mt-1 leading-relaxed ${theme === "light" ? "text-charcoal/70" : "text-white/50"}`}>
                                            {addr.address}, {addr.city}, {addr.state} - {addr.postalCode}
                                          </p>
                                          <p className={`text-xs mt-1 font-mono ${theme === "light" ? "text-charcoal/50" : "text-white/35"}`}>
                                            Phone: {addr.phone || shippingForm.phone}
                                          </p>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditingAddress(true);
                                          }}
                                          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 p-1"
                                        >
                                          Edit
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div
                                    className="p-4 rounded-2xl relative space-y-2"
                                    style={{ background: "rgba(16,185,129,0.08)", border: "2px solid rgba(52,211,153,0.3)" }}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className={`font-bold text-sm ${theme === "light" ? "text-charcoal" : "text-white/90"}`}>
                                          {shippingForm.fullName}
                                        </h4>
                                        <p className={`text-xs mt-1 leading-relaxed ${theme === "light" ? "text-charcoal/70" : "text-white/55"}`}>
                                          {shippingForm.address}, {shippingForm.city}, {shippingForm.state} - {shippingForm.postalCode}
                                        </p>
                                        <p className={`text-xs mt-1 font-mono ${theme === "light" ? "text-charcoal/50" : "text-white/35"}`}>
                                          Phone: {shippingForm.phone}
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setIsEditingAddress(true)}
                                        className="text-xs font-semibold text-emerald-650 dark:text-emerald-400 shrink-0"
                                      >
                                        Edit Details
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => setStep("payment")}
                                className="w-full flex items-center justify-center gap-2 text-white text-xs font-bold tracking-[0.1em] uppercase py-4 rounded-xl border border-emerald-800/10"
                                style={{
                                  background: "linear-gradient(180deg, #34D399 0%, #10B981 100%)",
                                  boxShadow: "inset 0 1.5px 0 rgba(255, 255, 255, 0.4), inset 0 -1.5px 0 rgba(0, 0, 0, 0.2)",
                                }}
                              >
                                Deliver to Selected Address & Continue <ArrowRight className="w-4 h-4" />
                              </button>

                              <div className="text-center pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShippingForm({
                                      fullName: user?.name || "Pawan",
                                      email: user?.email || "Pk@gmail.com",
                                      phone: "+91 70081 29381",
                                      address: "",
                                      city: "Bhubaneswar",
                                      state: "Odisha",
                                      postalCode: "",
                                    });
                                    setIsEditingAddress(true);
                                  }}
                                  className={`text-xs font-medium underline underline-offset-4 ${theme === "light" ? "text-charcoal/60 hover:text-emerald-600" : "text-white/40 hover:text-emerald-400"}`}
                                >
                                  + Add New Delivery Address
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <h2 className={`font-serif text-2xl font-bold tracking-tight ${theme === "light" ? "text-charcoal" : "text-white"}`}>
                                  {shippingForm.address ? "Edit Delivery Address" : "Delivery Address"}
                                </h2>
                                <p className={`text-xs mt-1 ${theme === "light" ? "text-charcoal/50" : "text-white/40"}`}>
                                  Fill in shipping details for white-glove delivery.
                                </p>
                              </div>
                              <div className="space-y-4">
                                <Field label="Full Name *">
                                  <input type="text" required value={shippingForm.fullName} onChange={sf("fullName")} className={inputCls} />
                                </Field>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Field label="Email *">
                                    <input type="email" required value={shippingForm.email} onChange={sf("email")} className={inputCls} />
                                  </Field>
                                  <Field label="Phone *">
                                    <input type="tel" required value={shippingForm.phone} onChange={sf("phone")} className={inputCls} placeholder="+91 " />
                                  </Field>
                                </div>
                                <Field label="Street Address *">
                                  <input type="text" required value={shippingForm.address} onChange={sf("address")} className={inputCls} />
                                </Field>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <Field label="City *">
                                    <input type="text" required value={shippingForm.city} onChange={sf("city")} className={inputCls} />
                                  </Field>
                                  <Field label="State *">
                                    <StateAutocompleteInput
                                      value={shippingForm.state}
                                      onChange={(val) => setShippingForm((f) => ({ ...f, state: val }))}
                                    />
                                  </Field>
                                  <Field label="PIN Code *">
                                    <input type="text" required value={shippingForm.postalCode} onChange={sf("postalCode")} className={inputCls} maxLength={6} />
                                  </Field>
                                </div>
                              </div>
                              <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 text-white text-xs font-bold tracking-[0.1em] uppercase py-4 rounded-xl border border-emerald-800/10"
                                style={{
                                  background: "linear-gradient(180deg, #34D399 0%, #10B981 100%)",
                                  boxShadow: "inset 0 1.5px 0 rgba(255, 255, 255, 0.4), inset 0 -1.5px 0 rgba(0, 0, 0, 0.2)",
                                }}
                              >
                                Save & Continue to Payment <ArrowRight className="w-4 h-4" />
                              </button>
                            </>
                          )}
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
                            <h2 className={`font-serif text-2xl font-bold tracking-tight ${theme === "light" ? "text-charcoal" : "text-white"}`}>Payment Method</h2>
                            <p className={`text-xs mt-1 ${theme === "light" ? "text-charcoal/50" : "text-white/40"}`}>
                              All transactions are encrypted end-to-end.
                            </p>
                          </div>
                          <div className="space-y-3">
                            {[
                              {
                                id: "online" as const,
                                icon: CreditCard,
                                title: "Online Payment (UPI, Cards, NetBanking)",
                                desc: "Fast & secure payment via GPay, PhonePe, Paytm, Credit/Debit Cards & NetBanking.",
                                badge: "Fast & Secure",
                                badgeCls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                              },
                              {
                                id: "cod" as const,
                                icon: Banknote,
                                title: "Cash on Delivery (COD)",
                                desc: "Inspect your solid teak furniture at doorstep before paying.",
                                badge: "Pay on Delivery",
                                badgeCls: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                              },
                            ].map(({ id, icon: Icon, title, desc, badge, badgeCls }) => (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setPaymentMethod(id)}
                                className="w-full text-left flex items-center gap-4 p-4 rounded-2xl"
                                style={paymentMethod === id ? {
                                  background: id === "online" ? "rgba(16,185,129,0.1)" : "rgba(212,168,83,0.08)",
                                  border: id === "online" ? "2px solid rgba(52,211,153,0.35)" : "2px solid rgba(212,168,83,0.3)",
                                  boxShadow: theme === "light" ? "inset 0 1px 0 rgba(31,27,22,0.06)" : "inset 0 1px 0 rgba(255,255,255,0.06)",
                                } : theme === "light" ? {
                                  background: "rgba(0,0,0,0.02)",
                                  border: "1px solid rgba(31,27,22,0.08)",
                                } : {
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                }}
                              >
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                  style={paymentMethod === id ? {
                                    background: id === "online"
                                      ? "linear-gradient(180deg, #34D399 0%, #059669 100%)"
                                      : "linear-gradient(180deg, #FBBF24 0%, #B8892E 100%)",
                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
                                  } : theme === "light" ? {
                                    background: "rgba(0,0,0,0.04)",
                                    border: "1px solid rgba(31,27,22,0.08)",
                                  } : {
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                  }}
                                >
                                  <Icon className={`w-5 h-5 ${paymentMethod === id ? "text-white" : (theme === "light" ? "text-charcoal/40" : "text-white/35")}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className={`text-sm font-semibold ${theme === "light" ? "text-charcoal" : "text-white/90"}`}>{title}</span>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeCls}`}>
                                      {badge}
                                    </span>
                                  </div>
                                  <p className={`text-xs leading-relaxed ${theme === "light" ? "text-charcoal/60" : "text-white/40"}`}>{desc}</p>
                                </div>
                                <div
                                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                                  style={paymentMethod === id ? {
                                    background: id === "online" ? "#34D399" : "#D4A853",
                                    borderColor: id === "online" ? "#34D399" : "#D4A853",
                                  } : {
                                    borderColor: theme === "light" ? "rgba(31,27,22,0.25)" : "rgba(255,255,255,0.2)",
                                  }}
                                >
                                  {paymentMethod === id && (
                                    <Check className="w-3 h-3 text-white stroke-[3]" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                          <div className={`flex items-center gap-1.5 text-[11px] ${theme === "light" ? "text-charcoal/40" : "text-white/35"}`}>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                            Secured by 256-bit SSL encryption
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setStep("shipping")}
                              className={`flex items-center gap-1.5 px-5 py-3.5 rounded-xl text-xs font-semibold ${theme === "light" ? "text-charcoal/70 hover:text-charcoal" : "text-white/60 hover:text-white"}`}
                              style={theme === "light" ? { background: "rgba(0,0,0,0.04)", border: "1px solid rgba(31,27,22,0.12)" } : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                            >
                              <ArrowLeft className="w-3.5 h-3.5" /> Back
                            </button>
                            <button
                              type="submit"
                              disabled={isProcessingPayment}
                              className="flex-1 flex items-center justify-center gap-2 text-white text-xs font-bold tracking-[0.1em] uppercase py-4 rounded-xl disabled:opacity-40 border border-emerald-800/10"
                              style={{
                                background: "linear-gradient(180deg, #34D399 0%, #10B981 100%)",
                                boxShadow: "inset 0 1.5px 0 rgba(255, 255, 255, 0.4), inset 0 -1.5px 0 rgba(0, 0, 0, 0.2)",
                              }}
                            >
                              {isProcessingPayment ? (
                                "Processing Online Payment…"
                              ) : paymentMethod === "online" ? (
                                <><span>Pay {fmt(total)} Online</span><ArrowRight className="w-4 h-4" /></>
                              ) : (
                                <><span>Review & Confirm Order</span><ArrowRight className="w-4 h-4" /></>
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
                            <h2 className={`font-serif text-2xl font-bold tracking-tight ${theme === "light" ? "text-charcoal" : "text-white"}`}>Confirm Order</h2>
                            <p className={`text-xs mt-1 ${theme === "light" ? "text-charcoal/50" : "text-white/40"}`}>Review your details before placing.</p>
                          </div>
                          <div
                            className="rounded-2xl overflow-hidden"
                            style={theme === "light" ? {
                              background: "rgba(0,0,0,0.02)",
                              border: "1px solid rgba(31,27,22,0.08)",
                            } : {
                              background: "rgba(0,0,0,0.3)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            <div className="p-4 space-y-1" style={theme === "light" ? { borderBottom: "1px solid rgba(31,27,22,0.08)" } : { borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">Delivery To</p>
                              <p className={`text-sm font-semibold ${theme === "light" ? "text-charcoal" : "text-white/90"}`}>{shippingForm.fullName}</p>
                              <p className={`text-xs ${theme === "light" ? "text-charcoal/60" : "text-white/50"}`}>
                                {shippingForm.address}, {shippingForm.city}, {shippingForm.state} — {shippingForm.postalCode}
                              </p>
                              <p className={`text-xs ${theme === "light" ? "text-charcoal/40" : "text-white/35"}`}>
                                {shippingForm.phone} · {shippingForm.email}
                              </p>
                            </div>
                            <div className="p-4 flex items-center justify-between" style={theme === "light" ? { borderBottom: "1px solid rgba(31,27,22,0.08)" } : { borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">Payment</p>
                              <p className={`text-sm font-semibold flex items-center gap-1.5 ${theme === "light" ? "text-charcoal" : "text-white/90"}`}>
                                <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                {paymentMethod === "cod" ? "Cash on Delivery" : "Online via Razorpay"}
                              </p>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">Delivery</p>
                              <p className={`text-sm font-semibold flex items-center gap-1.5 ${theme === "light" ? "text-charcoal" : "text-white/90"}`}>
                                <Truck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Doorstep Direct Transit
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setStep("payment")}
                              className={`flex items-center gap-1.5 px-5 py-3.5 rounded-xl text-xs font-semibold ${theme === "light" ? "text-charcoal/70 hover:text-charcoal" : "text-white/60 hover:text-white"}`}
                              style={theme === "light" ? { background: "rgba(0,0,0,0.04)", border: "1px solid rgba(31,27,22,0.12)" } : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                            >
                              <ArrowLeft className="w-3.5 h-3.5" /> Back
                            </button>
                            <button
                              disabled={isProcessingPayment}
                              onClick={handlePlaceOrder}
                              className="flex-1 flex items-center justify-center gap-2 text-white text-xs font-bold tracking-[0.1em] uppercase py-4 rounded-xl disabled:opacity-40 border border-emerald-800/10"
                              style={{
                                background: "linear-gradient(180deg, #34D399 0%, #10B981 100%)",
                                boxShadow: "inset 0 1.5px 0 rgba(255, 255, 255, 0.4), inset 0 -1.5px 0 rgba(0, 0, 0, 0.2)",
                              }}
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
                  <div
                    className="rounded-3xl sticky top-28 overflow-hidden"
                    style={{
                      background: theme === "light" ? "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)" : "rgba(255,255,255,0.04)",
                      border: theme === "light" ? "1px solid rgba(31,27,22,0.12)" : "1px solid rgba(255,255,255,0.09)",
                      boxShadow: theme === "light" ? "inset 0 1px 0 #FFF, inset 0 -2px 0 rgba(0,0,0,0.03)" : "0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="px-6 pt-5 pb-4" style={theme === "light" ? { borderBottom: "1px solid rgba(31,27,22,0.08)" } : { borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <h3 className={`font-serif text-base font-bold flex items-center justify-between ${theme === "light" ? "text-charcoal" : "text-white"}`}>
                        <span>Your Order</span>
                        <span className={`text-xs font-sans font-medium ${theme === "light" ? "text-charcoal/40" : "text-white/35"}`}>
                          {cart.reduce((s, i) => s + i.quantity, 0)} {cart.reduce((s, i) => s + i.quantity, 0) === 1 ? "item" : "items"}
                        </span>
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto scrollbar-thin">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 px-5 py-3.5"
                          style={theme === "light" ? { borderBottom: "1px solid rgba(31,27,22,0.06)" } : { borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                        >
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0" style={{ boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold truncate ${theme === "light" ? "text-charcoal" : "text-white/90"}`}>{item.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <div
                                className="flex items-center gap-1.5 rounded-full px-2 py-0.5"
                                style={theme === "light" ? { background: "rgba(0,0,0,0.03)", border: "1px solid rgba(31,27,22,0.12)" } : { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
                              >
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className={`w-3.5 h-3.5 flex items-center justify-center rounded-full ${theme === "light" ? "text-charcoal/50 hover:text-charcoal" : "text-white/50 hover:text-white"}`}
                                >
                                  <Minus className="w-2 h-2" />
                                </button>
                                <span className={`text-[10px] font-mono font-bold w-3 text-center ${theme === "light" ? "text-charcoal" : "text-white/90"}`}>{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className={`w-3.5 h-3.5 flex items-center justify-center rounded-full ${theme === "light" ? "text-charcoal/50 hover:text-charcoal" : "text-white/50 hover:text-white"}`}
                                >
                                  <Plus className="w-2 h-2" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className={`hover:text-rose-450 ${theme === "light" ? "text-charcoal/30" : "text-white/20"}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <span className={`text-xs font-serif font-bold shrink-0 ${theme === "light" ? "text-accent-teal" : "text-emerald-400"}`}>{fmt(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 pt-4 pb-5 space-y-2" style={theme === "light" ? { borderTop: "1px solid rgba(31,27,22,0.08)" } : { borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                      {[
                        { label: "Subtotal", value: fmt(subtotal), highlight: false },
                        { label: "GST (18%)", value: fmt(gst), highlight: false },
                        { label: "Shipping", value: shipping > 0 ? fmt(shipping) : "Free", highlight: shipping === 0 },
                      ].map(({ label, value, highlight }) => (
                        <div key={label} className={`flex items-center justify-between text-xs ${theme === "light" ? "text-charcoal/60" : "text-white/40"}`}>
                          <span>{label}</span>
                          <span className={`font-semibold ${highlight ? (theme === "light" ? "text-accent-teal" : "text-emerald-400") : ""}`}>{value}</span>
                        </div>
                      ))}
                      <div className="pt-2.5 flex items-center justify-between" style={theme === "light" ? { borderTop: "1px solid rgba(31,27,22,0.08)" } : { borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                        <span className={`text-sm font-semibold ${theme === "light" ? "text-charcoal/80" : "text-white/80"}`}>Total</span>
                        <span className={`font-serif text-xl font-bold ${theme === "light" ? "text-accent-teal" : "text-emerald-400"}`}>{fmt(total)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: theme === "light" ? "rgba(31,27,22,0.04)" : "rgba(255,255,255,0.05)",
                      border: theme === "light" ? "1px solid rgba(31,27,22,0.12)" : "1px solid rgba(255,255,255,0.08)"
                    }}
                  >
                    <ShoppingBag className={`w-7 h-7 ${theme === "light" ? "text-charcoal/40" : "text-white/25"}`} />
                  </div>
                  <div>
                    <h3 className={`font-serif text-xl font-bold mb-1 ${theme === "light" ? "text-charcoal" : "text-white"}`}>Your cart is empty</h3>
                    <p className={`text-sm max-w-xs ${theme === "light" ? "text-charcoal/60" : "text-white/40"}`}>
                      Add handcrafted furniture to your cart before checking out.
                    </p>
                  </div>
                  <a
                    href="/spaces/home"
                    className="inline-flex items-center gap-2 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all"
                    style={{
                      background: "linear-gradient(180deg, #34D399 0%, #059669 100%)",
                      boxShadow: "0 6px 18px rgba(16,185,129,0.4)",
                    }}
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
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                    theme === "light"
                      ? "bg-[#0D9488]/10 border-[#0D9488]/20 text-[#0D9488]"
                      : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" /> Order Confirmed
                </span>
                <h2 className={`font-serif text-3xl font-bold tracking-tight mt-3 ${theme === "light" ? "text-charcoal" : "text-white"}`}>Your order is placed!</h2>
                <p className={`text-sm leading-relaxed ${theme === "light" ? "text-charcoal/60" : "text-white/50"}`}>
                  Thank you for choosing{" "}
                  <strong className={theme === "light" ? "text-charcoal font-bold" : "text-white/90"}>Millennium Furniture</strong>.
                  Your handcrafted piece is being registered for delivery.
                </p>
              </div>
              <div
                className={`rounded-2xl overflow-hidden text-left border ${
                  theme === "light"
                    ? "bg-white border-charcoal/10 shadow-sm"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {[
                  { key: "Order ID", val: <span className={`font-mono font-bold ${theme === "light" ? "text-charcoal" : "text-white/90"}`}>{completedOrderId}</span> },
                  { key: "Payment", val: <span className={`flex items-center gap-1 ${theme === "light" ? "text-accent-teal" : "text-emerald-400"}`}><ShieldCheck className="w-3.5 h-3.5" /> {paymentMethod === "cod" ? "Cash on Delivery" : "Paid via Razorpay"}</span> },
                  { key: "Delivery", val: <span className={`flex items-center gap-1 ${theme === "light" ? "text-charcoal/80" : "text-white/80"}`}><Truck className="w-3.5 h-3.5 text-emerald-400" /> Doorstep Transit</span> },
                  { key: "Amount", val: <span className={`font-serif font-bold ${theme === "light" ? "text-accent-teal" : "text-emerald-400"}`}>{fmt(completedTotal)}</span> },
                ].map(({ key, val }, i, arr) => (
                  <div
                    key={key}
                    className="px-5 py-3.5 flex items-center justify-between text-xs"
                    style={i < arr.length - 1 ? { borderBottom: theme === "light" ? "1px solid rgba(31,27,22,0.08)" : "1px solid rgba(255,255,255,0.07)" } : {}}
                  >
                    <span className={`font-bold uppercase tracking-widest ${theme === "light" ? "text-charcoal/40" : "text-white/35"}`}>{key}</span>
                    {val}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <button
                  onClick={downloadInvoicePdf}
                  disabled={isDownloadingPdf}
                  className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-wait border ${
                    theme === "light"
                      ? "bg-charcoal/5 border-charcoal/10 text-charcoal/70 hover:text-accent-teal"
                      : "bg-white/5 border-white/10 text-white/70 hover:text-emerald-400"
                  }`}
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
                  className="w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200"
                  style={{
                    background: "linear-gradient(180deg, #34D399 0%, #10B981 50%, #059669 100%)",
                    boxShadow: "0 8px 24px rgba(16,185,129,0.4), inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -2.5px 0 rgba(0,0,0,0.35)",
                  }}
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
