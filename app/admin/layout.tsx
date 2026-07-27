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
  Search,
  Bell,
  LogOut,
  Lock,
  User,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" });
  };

  const navigationItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Box },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Wholesale Requests", href: "/admin/wholesale", icon: UserCheck },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Homepage CMS", href: "/admin/cms", icon: FileEdit },
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white border border-[#1F1B16]/10 rounded-[32px] p-8 md:p-12 max-w-md shadow-warm-lg flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] mb-4">
            Access Denied
          </h1>
          <p className="text-[#1F1B16]/60 text-sm leading-relaxed mb-8">
            You do not have the required <strong>ADMIN</strong> permissions to view the store
            management backend. Return to the shop storefront.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => setIsAdmin(true)}
              className="bg-accent-teal text-white font-bold py-3.5 rounded-full hover:bg-accent-teal/90 transition-all text-xs"
            >
              Simulate ADMIN Login (Gain Access)
            </button>
            <a
              href="/"
              className="border border-[#1F1B16]/20 text-[#1F1B16] font-bold py-3.5 rounded-full hover:bg-[#1F1B16] hover:text-[#F7F3EC] transition-all text-xs text-center"
            >
              Return to Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans selection:bg-accent-teal/20 selection:text-[#1F1B16] flex">
      {/* 1. SIDEBAR PANEL */}
      <aside
        className={`bg-white border-r border-[#1F1B16]/5 fixed inset-y-0 left-0 z-40 lg:static flex flex-col ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Brand header */}
        <div className="h-20 border-b border-[#1F1B16]/5 px-4 flex items-center justify-between">
          <a href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#1F1B16] text-[#F7F3EC] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 19V5L12 14L21 5V19" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="18" r="1.5" fill="currentColor" />
              </svg>
            </div>
            {sidebarOpen && (
              <span className="font-serif text-lg font-bold tracking-tight text-[#1F1B16] whitespace-nowrap">
                Millennium HQ
              </span>
            )}
          </a>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#1F1B16]/5"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Live Date, Day, and Time Widget moved to header bar */}

        {/* Links list */}
        <nav className="p-4 flex flex-col gap-1 flex-1">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.name === "Dashboard" ? "/admin" : item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded text-xs font-bold text-[#1F1B16]/75 hover:bg-accent-teal/10 hover:text-accent-teal ${
                sidebarOpen ? "justify-start" : "justify-center"
              }`}
              title={item.name}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>{item.name}</span>}
            </a>
          ))}
        </nav>

        {/* Sidebar Footer Role toggler */}
        <div className="p-4 border-t border-[#1F1B16]/5 bg-white">
          {sidebarOpen ? (
            <>
              <div className="bg-[#F7F3EC] rounded p-3 border border-[#1F1B16]/5 text-[10px] font-semibold text-[#1F1B16]/70 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span>Admin:</span>
                  <span className="font-bold text-accent-teal uppercase">ACTIVE</span>
                </div>
              </div>
              <button
                onClick={() => setIsAdmin(false)}
                className="w-full border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-bold py-2.5 rounded text-[10px] flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Simulate Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAdmin(false)}
              className="w-full border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-bold py-2.5 rounded text-[10px] flex items-center justify-center"
              title="Simulate Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN HUB WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-[#1F1B16]/5 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">

            {/* Quick search */}
            <div className="hidden sm:flex items-center bg-[#F7F3EC] border border-[#1F1B16]/10 rounded-full px-4 py-2 w-72">
              <Search className="w-3.5 h-3.5 text-[#1F1B16]/40 mr-2" />
              <input
                type="text"
                placeholder="Search orders, clients, or products..."
                className="bg-transparent text-[11px] font-semibold focus:outline-none w-full text-[#1F1B16]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Live Date, Day, and Time Widget beside notifications */}
            {currentTime && (
              <div className="hidden sm:flex flex-col items-end font-mono text-[9px] text-[#1F1B16]/65 leading-tight select-none">
                <span className="font-bold text-[#1F1B16]/80">{formatDate(currentTime)}</span>
                <span className="font-extrabold text-accent-teal tracking-wider text-[10px] mt-0.5">{formatTime(currentTime)}</span>
              </div>
            )}

            {/* Notifications */}
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#1F1B16]/80 hover:bg-[#1F1B16]/5 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-terracotta rounded-full"></span>
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-3 pl-4 border-l border-[#1F1B16]/5">
              <div className="w-9 h-9 rounded-full bg-accent-teal text-white font-bold flex items-center justify-center shadow-warm-sm">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden md:block">
                <h4 className="text-xs font-bold text-[#1F1B16] leading-none mb-0.5">Admin Studio</h4>
                <p className="text-[9px] text-[#1F1B16]/50 font-semibold leading-none">Global Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Layout Children Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
