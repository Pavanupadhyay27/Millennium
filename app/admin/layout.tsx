"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Box,
  FolderTree,
  ShoppingCart,
  UserCheck,
  Users,
  FileEdit,
  Menu,
  Bell,
  LogOut,
  Lock,
  ArrowRight,
  Sun,
  Moon,
  CheckCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useStore } from "../../lib/store";

import { motion, AnimatePresence } from "framer-motion";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { notifications, markAllNotificationsRead } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    // Check local admin authentication state
    const authState = localStorage.getItem("millennium_admin_auth");
    if (authState === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Allow unrestricted rendering for the login page route itself
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading spinner while verifying auth state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#12100E] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent-teal border-t-transparent animate-spin" />
      </div>
    );
  }

  // Access Denied Screen (Redirect to Login)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-8 max-w-md shadow-2xl flex flex-col items-center">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">Admin Sign-In Required</h1>
          <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 leading-relaxed mb-6">
            You must be logged in as an administrator to access the Millennium Furniture HQ backend.
          </p>

          <a
            href="/admin/login"
            className="w-full bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
          >
            Go To Admin Login <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("millennium_admin_auth");
    localStorage.removeItem("millennium_admin_email");
    window.location.href = "/admin/login";
  };

  const navigationItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Wholesale Requests", href: "/admin/wholesale", icon: UserCheck },
    { name: "Products", href: "/admin/products", icon: Box },
    { name: "Offers & Promos", href: "/admin/offers", icon: FileEdit },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Homepage CMS", href: "/admin/cms", icon: FileEdit },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] font-sans selection:bg-accent-teal/20 flex transition-colors duration-300 relative">
      
      {/* MOBILE BACKDROP OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 1. SIDEBAR PANEL */}
      <aside
        className={`bg-white dark:bg-[#1C1814] border-r border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 lg:static ${
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        {/* Brand Header */}
        <div className="h-24 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 px-4 flex items-center justify-between">
          <a href="/admin" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Millennium Admin" className="h-16 md:h-20 w-auto object-contain dark:brightness-0 dark:invert drop-shadow-lg" />
          </a>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#1F1B16]/5 dark:hover:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC]"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Links list */}
        <nav className="p-3 flex flex-col gap-1.5 flex-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-accent-teal text-white shadow-sm"
                    : "text-[#1F1B16]/75 dark:text-[#F7F3EC]/75 hover:bg-accent-teal/10 hover:text-accent-teal"
                } ${sidebarOpen ? "justify-start" : "lg:justify-center"}`}
                title={item.name}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className={`${!sidebarOpen ? "lg:hidden" : "block"}`}>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-3 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 bg-[#FAF7F2] dark:bg-[#12100E]">
          <button
            onClick={handleLogout}
            className="w-full border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" /> <span className={`${!sidebarOpen ? "lg:hidden" : "block"}`}>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT PANEL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white dark:bg-[#1C1814] border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC] hover:bg-accent-teal hover:text-white transition-all lg:hidden"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-extrabold text-accent-teal uppercase tracking-widest bg-accent-teal/10 px-3 py-1 rounded-full">
              Millennium HQ Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="w-9 h-9 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 flex items-center justify-center hover:bg-accent-teal hover:text-white transition-all text-[#1F1B16] dark:text-[#F7F3EC]"
              title={`Switch to ${theme === "light" ? "Dark Mode" : "Light Mode"}`}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="View Order Notifications"
                className="w-9 h-9 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 flex items-center justify-center hover:bg-accent-teal hover:text-white transition-all text-[#1F1B16] dark:text-[#F7F3EC] relative"
                title="Order Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full text-[9px] font-mono font-extrabold w-4.5 h-4.5 flex items-center justify-center border-2 border-white dark:border-[#1C1814] shadow-sm animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl shadow-2xl p-4 z-50 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-2">
                      <span className="font-serif font-bold text-xs text-[#1F1B16] dark:text-[#F7F3EC] flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-accent-teal" /> Order Alerts
                      </span>
                      
                      {unreadCount > 0 ? (
                        <button
                          onClick={() => markAllNotificationsRead()}
                          className="text-[10px] font-bold text-accent-teal hover:underline flex items-center gap-1 bg-accent-teal/10 px-2 py-0.5 rounded-full"
                        >
                          <CheckCheck className="w-3 h-3" /> Mark All Read
                        </button>
                      ) : (
                        <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          All Caught Up
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <a
                            key={n.id}
                            href="/admin/orders"
                            onClick={() => setNotificationsOpen(false)}
                            className={`block p-2.5 rounded-xl border transition-all text-xs ${
                              !n.read
                                ? "bg-accent-teal/10 dark:bg-accent-teal/20 border-accent-teal/30"
                                : "bg-[#FAF7F2] dark:bg-[#12100E] border-[#1F1B16]/5 dark:border-[#F7F3EC]/5 opacity-70"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="font-mono font-bold text-accent-teal text-[11px]">{n.orderId}</span>
                              <span className="text-[9px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 font-mono">{n.timeAgo}</span>
                            </div>
                            <p className="font-bold text-[#1F1B16] dark:text-[#F7F3EC] text-[11px]">{n.customerName} ({n.type})</p>
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Total: {formatPrice(n.total)}</span>
                          </a>
                        ))
                      ) : (
                        <div className="py-6 text-center text-xs text-[#1F1B16]/50 dark:text-[#F7F3EC]/50">
                          No order alerts yet.
                        </div>
                      )}
                    </div>

                    <a
                      href="/admin/orders"
                      onClick={() => setNotificationsOpen(false)}
                      className="block text-center text-[10px] font-bold uppercase tracking-wider text-accent-teal hover:underline pt-1"
                    >
                      View Fulfillment Manager →
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Smooth Page Landing Transition Wrapper */}
        <main className="p-6 md:p-10 flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
