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
  ArrowRight
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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
    { name: "Products", href: "/admin/products", icon: Box },
    { name: "Offers & Promos", href: "/admin/offers", icon: FileEdit },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Wholesale Requests", href: "/admin/wholesale", icon: UserCheck },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Homepage CMS", href: "/admin/cms", icon: FileEdit },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] font-sans selection:bg-accent-teal/20 flex transition-colors duration-300">
      {/* 1. SIDEBAR PANEL */}
      <aside
        className={`bg-white dark:bg-[#1C1814] border-r border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 fixed inset-y-0 left-0 z-40 lg:static flex flex-col transition-all ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 px-5 flex items-center justify-between">
          <a href="/admin" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Millennium Admin" className="h-10 w-auto object-contain dark:brightness-0 dark:invert" />
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
        <nav className="p-4 flex flex-col gap-1.5 flex-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-accent-teal text-white shadow-sm"
                    : "text-[#1F1B16]/75 dark:text-[#F7F3EC]/75 hover:bg-accent-teal/10 hover:text-accent-teal"
                } ${sidebarOpen ? "justify-start" : "justify-center"}`}
                title={item.name}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </a>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 bg-white dark:bg-[#1C1814]">
          <button
            onClick={handleLogout}
            className="w-full border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" /> {sidebarOpen && "Sign Out Admin"}
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT PANEL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white dark:bg-[#1C1814] border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-extrabold text-accent-teal uppercase tracking-widest bg-accent-teal/10 px-3 py-1 rounded-full">
              Millennium HQ Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-[#1F1B16]/5 dark:bg-[#F7F3EC]/10 flex items-center justify-center hover:bg-accent-teal hover:text-white transition-all text-[#1F1B16] dark:text-[#F7F3EC] relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Child Pages Container */}
        <main className="p-6 md:p-10 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
