"use client";

import React from "react";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
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

  const socialLinks = [
    {
      href: "#",
      label: "Instagram",
      svg: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    },
    {
      href: "#",
      label: "YouTube",
      svg: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
        </svg>
      )
    }
  ];

  return (
    <footer
      id="contact"
      className="relative overflow-hidden"
      style={theme === "light" ? {
        background: "linear-gradient(180deg, #FAF7F2 0%, #F7F3EC 100%)",
        borderTop: "1px solid rgba(31, 27, 22, 0.1)",
      } : {
        background: "linear-gradient(180deg, #0E0C0A 0%, #060504 100%)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Ambient top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={theme === "light" ? {
          background: "linear-gradient(90deg, transparent, rgba(47,111,98,0.3), transparent)"
        } : {
          background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.5), transparent)"
        }}
      />
      {/* Ambient radial bottom-center glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={theme === "light" ? {
          background: "radial-gradient(ellipse at 50% 100%, rgba(47,111,98,0.02) 0%, transparent 70%)"
        } : {
          background: "radial-gradient(ellipse at 50% 100%, rgba(212,168,83,0.04) 0%, transparent 70%)"
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-5 md:px-12 pt-12 md:pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-10 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-4 flex flex-col items-start gap-4">
            <a href="/" className="inline-block transition-transform hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Millennium Furniture"
                className={`h-20 md:h-24 w-auto object-contain transition-all ${
                  theme === "light" ? "" : "brightness-95"
                }`}
              />
            </a>
            <p className={`text-xs leading-relaxed max-w-xs ${theme === "light" ? "text-charcoal/60" : "text-white/40"}`}>
              Handcrafting heirloom solid teak in Bhubaneswar, Odisha since 2012.
            </p>
            <div className="flex gap-3 mt-1">
              {socialLinks.map(({ svg, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 hover:scale-110 group ${
                    theme === "light" ? "text-charcoal/60 hover:text-accent-teal" : "text-white/60 hover:text-amber-400"
                  }`}
                  style={theme === "light" ? {
                    background: "rgba(31, 27, 22, 0.05)",
                    border: "1px solid rgba(31, 27, 22, 0.1)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                  } : {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    if (theme === "light") {
                      (e.currentTarget as HTMLElement).style.background = "rgba(47,111,98,0.1)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(47,111,98,0.25)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(47,111,98,0.1), inset 0 1px 0 rgba(255,255,255,0.8)";
                    } else {
                      (e.currentTarget as HTMLElement).style.background = "rgba(212,168,83,0.12)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,83,0.25)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(212,168,83,0.2), inset 0 1px 0 rgba(255,255,255,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (theme === "light") {
                      (e.currentTarget as HTMLElement).style.background = "rgba(31, 27, 22, 0.05)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(31, 27, 22, 0.1)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.6)";
                    } else {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.1)";
                    }
                  }}
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div className="col-span-1 md:col-span-2">
            <h4 className={`text-[10px] font-extrabold uppercase tracking-[0.18em] mb-4 ${
              theme === "light" ? "text-accent-teal" : "text-amber-400"
            }`}>Collections</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Home Spaces", href: "/spaces/home" },
                { label: "Office & Work", href: "/spaces/office" },
                { label: "Commercial", href: "/spaces/commercial" },
                { label: "Wholesale B2B", href: "/wholesale" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`text-xs font-medium transition-colors flex items-center justify-between group ${
                      theme === "light" ? "text-charcoal/60 hover:text-accent-teal" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery */}
          <div className="col-span-1 md:col-span-2">
            <h4 className={`text-[10px] font-extrabold uppercase tracking-[0.18em] mb-4 ${
              theme === "light" ? "text-accent-teal" : "text-amber-400"
            }`}>Delivery</h4>
            <ul className={`flex flex-col gap-2.5 text-xs font-medium ${
              theme === "light" ? "text-charcoal/60" : "text-white/50"
            }`}>
              <li>Free BBSR Delivery</li>
              <li>Regional Logistics</li>
              <li>White-Glove Setup</li>
              <li>GST Invoicing</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-4">
            <h4 className={`text-[10px] font-extrabold uppercase tracking-[0.18em] mb-4 ${
              theme === "light" ? "text-accent-teal" : "text-amber-400"
            }`}>Studio</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://maps.google.com/?q=F,+2G/49,+15,+Indradhanu+Market,+IRC+Village,+Complex,+Bhubaneswar,+Odisha+751015"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 group"
              >
                <MapPin className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${theme === "light" ? "text-accent-teal" : "text-amber-400"}`} />
                <span className={`text-xs leading-relaxed transition-colors ${
                  theme === "light" ? "text-charcoal/60 group-hover:text-charcoal" : "text-white/50 group-hover:text-white/80"
                }`}>
                  F, 2G/49, 15, Indradhanu Market, IRC Village, Bhubaneswar 751015
                </span>
              </a>
              <a href="tel:+919337721647" className="flex items-center gap-2.5 group">
                <Phone className={`w-3.5 h-3.5 shrink-0 ${theme === "light" ? "text-accent-teal" : "text-emerald-400"}`} />
                <span className={`text-xs font-bold transition-colors ${
                  theme === "light" ? "text-charcoal/60 group-hover:text-charcoal" : "text-white/50 group-hover:text-white/80"
                }`}>
                  +91 93377 21647
                </span>
              </a>
              <div className="flex items-center gap-2.5">
                <Mail className={`w-3.5 h-3.5 shrink-0 ${theme === "light" ? "text-accent-teal" : "text-emerald-400"}`} />
                <span className={`text-xs ${theme === "light" ? "text-charcoal/60" : "text-white/50"}`}>hello@millenniumfurniture.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={theme === "light" ? { borderTop: "1px solid rgba(31, 27, 22, 0.1)" } : { borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className={`text-[10px] ${theme === "light" ? "text-charcoal/40" : "text-white/25"}`}>© {new Date().getFullYear()} Millennium Furniture. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className={`text-[10px] transition-colors ${
              theme === "light" ? "text-charcoal/40 hover:text-charcoal" : "text-white/25 hover:text-white/50"
            }`}>Privacy</a>
            <a href="#" className={`text-[10px] transition-colors ${
              theme === "light" ? "text-charcoal/40 hover:text-charcoal" : "text-white/25 hover:text-white/50"
            }`}>Terms</a>
            <span className={`font-mono text-[10px] ${theme === "light" ? "text-accent-teal" : "text-amber-400/60"}`}>GSTIN: 21AAAFM9283K1Z9</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
