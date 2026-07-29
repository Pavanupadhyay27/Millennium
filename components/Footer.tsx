"use client";

import React from "react";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] pt-8 md:pt-16 pb-6 md:pb-12 transition-colors duration-300 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-12 grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-10 mb-6 md:mb-14">
        
        {/* Col 1: Brand Info & Logo */}
        <div className="col-span-2 md:col-span-4 flex flex-col items-start gap-2 md:gap-3">
          <a href="/" className="inline-block transition-transform hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Millennium Furniture"
              className="h-20 md:h-28 w-auto object-contain"
            />
          </a>
          <p className="text-[#1F1B16]/75 dark:text-[#F7F3EC]/75 text-[11px] md:text-sm leading-relaxed max-w-sm font-light">
            Handcrafting heirloom solid teak wood furniture in Bhubaneswar, Odisha since 2012.
          </p>
        </div>

        {/* Col 2: Spaces & Collections */}
        <div className="col-span-1 md:col-span-3">
          <h4 className="font-serif font-bold text-xs md:text-base mb-2 md:mb-4 text-[#1F1B16] dark:text-[#F7F3EC]">
            Collections
          </h4>
          <ul className="flex flex-col gap-1.5 md:gap-2 text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 text-[11px] md:text-xs font-semibold">
            <li><a href="/spaces/home" className="hover:text-accent-teal transition-colors flex items-center justify-between group">Home Spaces <ArrowUpRight className="w-3 h-3 hidden md:block" /></a></li>
            <li><a href="/spaces/office" className="hover:text-accent-teal transition-colors flex items-center justify-between group">Office Work</a></li>
            <li><a href="/spaces/commercial" className="hover:text-accent-teal transition-colors flex items-center justify-between group">Commercial</a></li>
            <li><a href="/wholesale" className="hover:text-accent-teal transition-colors flex items-center justify-between group">Wholesale</a></li>
          </ul>
        </div>

        {/* Col 3: Delivery & Support */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-serif font-bold text-xs md:text-base mb-2 md:mb-4 text-[#1F1B16] dark:text-[#F7F3EC]">
            Support
          </h4>
          <ul className="flex flex-col gap-1.5 md:gap-2 text-[#1F1B16]/75 dark:text-[#F7F3EC]/75 text-[11px] md:text-xs font-medium leading-relaxed">
            <li>• Free BBSR Delivery</li>
            <li>• Regional Logistics</li>
            <li>• White-Glove Setup</li>
            <li>• GST Invoicing</li>
          </ul>
        </div>

        {/* Col 4: Studio Location & Contact */}
        <div className="col-span-2 md:col-span-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#1F1B16]/5 dark:border-[#F7F3EC]/5">
          <h4 className="font-serif font-bold text-xs md:text-base mb-2 md:mb-4 text-[#1F1B16] dark:text-[#F7F3EC]">
            Bhubaneswar Studio
          </h4>
          <ul className="flex flex-col gap-1.5 md:gap-2.5 text-[#1F1B16]/80 dark:text-[#F7F3EC]/80 text-[11px] md:text-xs font-medium">
            <li className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent-teal shrink-0 mt-0.5" />
              <span>Janpath Road, Kharvel Nagar, Bhubaneswar - 751001</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-accent-teal shrink-0" />
              <a href="tel:+919337721647" className="hover:underline font-bold">+91 93377 21647</a>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom Strip */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-12 pt-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 text-[10px] md:text-xs font-medium text-center sm:text-left">
        <p>&copy; {new Date().getFullYear()} Millennium Furniture</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#" className="hover:text-accent-teal transition-colors">Privacy</a>
          <a href="#" className="hover:text-accent-teal transition-colors">Terms</a>
          <span className="text-accent-teal font-mono">GSTIN: 21AAAFM9283K1Z9</span>
        </div>
      </div>
    </footer>
  );
}
