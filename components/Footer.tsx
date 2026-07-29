"use client";

import React from "react";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] pt-12 md:pt-16 pb-8 md:pb-12 transition-colors duration-300 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 mb-10 md:mb-14">
        
        {/* Col 1: Brand Info & Logo */}
        <div className="md:col-span-4 flex flex-col items-start gap-3">
          <a href="/" className="inline-block transition-transform hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Millennium Furniture"
              className="h-12 md:h-16 w-auto object-contain dark:brightness-0 dark:invert"
            />
          </a>
          <p className="text-[#1F1B16]/75 dark:text-[#F7F3EC]/75 text-xs md:text-sm leading-relaxed max-w-sm font-light">
            Handcrafting heirloom mid-century modern furniture using sustainably harvested solid teak timber in Bhubaneswar, Odisha since 2012.
          </p>
        </div>

        {/* Col 2: Quick Links & Spaces */}
        <div className="md:col-span-3">
          <h4 className="font-serif font-bold text-sm md:text-base mb-3 md:mb-4 text-[#1F1B16] dark:text-[#F7F3EC]">
            Spaces & Collections
          </h4>
          <ul className="flex flex-col gap-2 text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 text-xs font-semibold">
            <li><a href="/spaces/home" className="hover:text-accent-teal transition-colors flex items-center justify-between group py-0.5">Home Spaces <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" /></a></li>
            <li><a href="/spaces/office" className="hover:text-accent-teal transition-colors flex items-center justify-between group py-0.5">Office & Work <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" /></a></li>
            <li><a href="/spaces/commercial" className="hover:text-accent-teal transition-colors flex items-center justify-between group py-0.5">Commercial B2B <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" /></a></li>
            <li><a href="/spaces/outdoor" className="hover:text-accent-teal transition-colors flex items-center justify-between group py-0.5">Outdoor Patio <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" /></a></li>
            <li><a href="/wholesale" className="hover:text-accent-teal transition-colors flex items-center justify-between group py-0.5">Wholesale Supplies <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" /></a></li>
          </ul>
        </div>

        {/* Col 3: Delivery & Logistics */}
        <div className="md:col-span-2">
          <h4 className="font-serif font-bold text-sm md:text-base mb-3 md:mb-4 text-[#1F1B16] dark:text-[#F7F3EC]">
            Delivery & Support
          </h4>
          <ul className="flex flex-col gap-2 text-[#1F1B16]/75 dark:text-[#F7F3EC]/75 text-xs font-medium leading-relaxed">
            <li>• Free Delivery in BBSR & Cuttack</li>
            <li>• Express Regional Logistics</li>
            <li>• White-Glove Setup & Unboxing</li>
            <li>• GST Credit Tax Invoicing</li>
          </ul>
        </div>

        {/* Col 4: Studio Location & Contact */}
        <div className="md:col-span-3">
          <h4 className="font-serif font-bold text-sm md:text-base mb-3 md:mb-4 text-[#1F1B16] dark:text-[#F7F3EC]">
            Bhubaneswar Studio
          </h4>
          <ul className="flex flex-col gap-2.5 text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 text-xs font-medium">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-accent-teal shrink-0 mt-0.5" />
              <span>Janpath Road, Kharvel Nagar, Bhubaneswar, Odisha - 751001</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent-teal shrink-0" />
              <span>+91 674 2530190</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent-teal shrink-0" />
              <span>contact@millenniumfurniture.in</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom Strip */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-6 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 text-[11px] md:text-xs font-medium text-center sm:text-left">
        <p>&copy; {new Date().getFullYear()} Millennium Furniture. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:text-accent-teal transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-accent-teal transition-colors">Terms of Service</a>
          <span className="text-accent-teal font-mono">GSTIN: 21AAAFM9283K1Z9</span>
        </div>
      </div>
    </footer>
  );
}
