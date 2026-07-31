"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Copy,
  Check,
  FileDown,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "../../../lib/store";
import { motion } from "framer-motion";

function PhonePeStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, clearCart, user, addresses } = useStore();
  const hasExecutedRef = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Verifying payment status...");
  const [transactionId, setTransactionId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [copiedId, setCopiedId] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const [shippingDetails, setShippingDetails] = useState<{
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  }>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    const txId = searchParams.get("transactionId");
    const orderIdParam = searchParams.get("orderId");
    const mockSuccess = searchParams.get("mockSuccess");

    const savedForm = localStorage.getItem("millennium_checkout_form");
    const parsedForm = savedForm ? JSON.parse(savedForm) : null;
    const formFields = parsedForm?.shippingForm || {};

    const defAddress = addresses && addresses.length > 0 ? (addresses.find((a) => a.isDefault) || addresses[0]) : null;
    const name = formFields.fullName || user?.name || defAddress?.name || "Pawan";
    const email = formFields.email || user?.email || defAddress?.email || "Pk@gmail.com";
    const phone = formFields.phone || user?.phone || defAddress?.phone || "+91 70081 29381";
    const address = formFields.address || defAddress?.address || "Plot 412, Kharvel Nagar, Janpath Road";
    const city = formFields.city || defAddress?.city || "Bhubaneswar";
    const state = formFields.state || defAddress?.state || "Odisha";
    const postalCode = formFields.postalCode || defAddress?.postalCode || "751001";

    setShippingDetails({
      fullName: name,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
    });

    if (!txId) {
      setStatus("failed");
      setMessage("Transaction ID missing from payment response.");
      return;
    }

    setTransactionId(txId);
    const finalOrderId = orderIdParam || `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(finalOrderId);

    async function verify() {
      try {
        const res = await fetch(
          `/api/phonepe/check-status?transactionId=${txId}&mockSuccess=${mockSuccess || ""}`
        );
        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setMessage("Payment verified successfully.");
          if (data.amount) setAmountPaid(data.amount);

          try {
            await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: finalOrderId,
                customerName: formFields.fullName || "Customer",
                customerEmail: formFields.email || "",
                customerPhone: formFields.phone || "",
                address: formFields.address || "",
                city: formFields.city || "",
                state: formFields.state || "",
                postalCode: formFields.postalCode || "",
                items: cart,
                totalAmount: data.amount || 0,
                paymentMethod: "PhonePe Online Payment",
                transactionId: txId,
              }),
            });
          } catch (e) {}

          localStorage.removeItem("millennium_checkout_form");
          clearCart();
        } else {
          setStatus("failed");
          setMessage(data.error || "Payment transaction failed or was cancelled.");
        }
      } catch (err) {
        setStatus("failed");
        setMessage("Unable to verify payment status.");
      }
    }

    verify();
  }, [searchParams]);

  const handleCopyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadInvoice = async () => {
    setIsDownloadingPdf(true);
    try {
      const res = await fetch("/api/orders/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId || "RET-2026-8819",
          customerName: shippingDetails.fullName,
          customerEmail: shippingDetails.email,
          customerPhone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          postalCode: shippingDetails.postalCode,
          items: cart.length > 0 ? cart : [{ name: "Solid Teak Masterpiece Collection", quantity: 1, price: amountPaid || 35000 }],
          totalAmount: amountPaid || 35000,
          date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
        }),
      });

      if (!res.ok) throw new Error("Invoice generation failed");

      const rawBlob = await res.blob();
      const pdfBlob = new Blob([rawBlob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${orderId || "Millennium"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Unable to generate PDF invoice. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <div className="py-24 px-4 sm:px-6 max-w-xl mx-auto w-full">
      {status === "loading" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1A1714] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-10 shadow-xl text-center space-y-4"
        >
          <Loader2 className="w-10 h-10 text-accent-teal animate-spin mx-auto" />
          <h2 className="font-serif text-xl font-bold">Verifying Payment...</h2>
          <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">{message}</p>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-[#1A1714] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6"
        >
          {/* Animated 3D Skeuomorphic Circle Floating Success Icon */}
          <motion.div
            initial={{ scale: 0, y: -20 }}
            animate={{
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              scale: { type: "spring", stiffness: 260, damping: 18 },
              y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
            }}
            className="relative w-24 h-24 mx-auto flex items-center justify-center mb-2"
          >
            {/* Ambient Pulsing Shadow Glow underneath */}
            <motion.div
              animate={{
                scale: [0.85, 1.15, 0.85],
                opacity: [0.35, 0.65, 0.35],
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute -bottom-2 w-16 h-4 rounded-full blur-md"
              style={{ backgroundColor: "#10B981" }}
            />

            {/* Skeuomorphic 3D Circular Emerald Sphere */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center relative z-10 border-2 border-white/30 transform-gpu overflow-hidden"
              style={{
                background: "radial-gradient(circle at 35% 30%, #34D399 0%, #10B981 40%, #059669 75%, #047857 100%)",
                boxShadow: "0 16px 32px -4px rgba(16, 185, 129, 0.5), inset 0 3px 6px rgba(255, 255, 255, 0.6), inset 0 -4px 8px rgba(0, 0, 0, 0.4)",
              }}
            >
              {/* Skeuomorphic Specular Top Reflection Lens Effect */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-full" />

              <svg
                className="w-10 h-10 text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] relative z-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>

          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-1.5">
              Payment Successful!
            </h1>
            <p className="text-xs sm:text-sm text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">
              Thank you, <span className="font-semibold text-[#1F1B16] dark:text-[#F7F3EC]">{shippingDetails.fullName}</span>. Your teak furniture order is confirmed.
            </p>
          </div>

          {/* Minimal Key Details Box */}
          <div className="bg-[#FAF8F5] dark:bg-[#12100E] border border-[#1F1B16]/8 dark:border-[#F7F3EC]/8 rounded-2xl p-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-medium">Order Number:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-accent-teal">{orderId}</span>
                <button
                  onClick={handleCopyOrderId}
                  className="p-1 text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 hover:text-accent-teal"
                  title="Copy Order ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-medium">Amount Paid:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {amountPaid > 0 ? fmt(amountPaid) : "Paid Online"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-medium">Estimated Delivery:</span>
              <span className="font-medium">5 – 7 Business Days</span>
            </div>
          </div>

          {/* Skeuomorphic 3D Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleDownloadInvoice}
              disabled={isDownloadingPdf}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl text-white text-xs font-bold tracking-wider uppercase transition-all transform active:translate-y-0.5 disabled:opacity-50 border border-emerald-400/30 overflow-hidden relative"
              style={{
                background: "linear-gradient(180deg, #10B981 0%, #059669 50%, #047857 100%)",
                boxShadow: "0 8px 20px -2px rgba(16, 185, 129, 0.45), inset 0 1.5px 0 rgba(255, 255, 255, 0.45), inset 0 -3px 0 rgba(0, 0, 0, 0.35)",
              }}
            >
              {/* Specular gloss top highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin relative z-10" /> Generating GST Invoice...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 relative z-10" /> Download Official GST Invoice (PDF)
                </>
              )}
            </button>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl text-white text-xs font-bold tracking-wider uppercase transition-all transform active:translate-y-0.5 border border-amber-900/30 overflow-hidden relative"
              style={{
                background: "linear-gradient(180deg, #2B2620 0%, #1F1B16 50%, #14110E 100%)",
                boxShadow: "0 8px 18px -2px rgba(31, 27, 22, 0.4), inset 0 1.5px 0 rgba(255, 255, 255, 0.2), inset 0 -3px 0 rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* Specular gloss top highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

              <span className="relative z-10 flex items-center gap-2">
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </motion.div>
      )}

      {status === "failed" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white dark:bg-[#1A1714] border border-rose-500/20 rounded-3xl p-8 shadow-2xl text-center space-y-5"
        >
          <div className="w-14 h-14 bg-rose-500/10 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-9 h-9" />
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold mb-1">Payment Verification Failed</h2>
            <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">{message}</p>
          </div>

          <Link
            href="/checkout"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#1F1B16] dark:bg-[#F7F3EC] text-white dark:text-[#1F1B16] text-xs font-bold uppercase tracking-wider transition-all"
          >
            Return to Checkout
          </Link>
        </motion.div>
      )}
    </div>
  );
}

export default function PhonePeStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#0B0907] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent-teal animate-spin" />
        </div>
      }
    >
      <PhonePeStatusContent />
    </Suspense>
  );
}
