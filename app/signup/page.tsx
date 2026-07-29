"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate database customer account creation
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white border border-[#1F1B16]/10 rounded-[32px] overflow-hidden shadow-warm-xl min-h-[600px]">
            
            {/* LEFT COLUMN: Lifestyle Image (takes 6 cols) */}
            <div className="hidden lg:block lg:col-span-6 relative bg-pastel-butter">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800"
                alt="Millennium Crafts"
                className="w-full h-full object-cover absolute inset-0 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-terracotta mb-3 block">
                  Fine Timber Joinery
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-4">
                  Built to Last for Generations
                </h2>
                <p className="text-white/70 text-xs max-w-sm leading-relaxed">
                  Every piece of furniture starts from sustainable timber in Odisha. Create an account to trace origins and manage purchase logs.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Form (takes 6 cols) */}
            <div className="lg:col-span-6 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
              <div className="max-w-md w-full mx-auto">
                
                <span className="text-accent-teal text-xs font-bold uppercase tracking-widest block mb-2">
                  Create Account
                </span>
                <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">
                  Register with Millennium
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-[#1F1B16]/10 rounded-full pl-5 pr-12 py-3.5 text-xs bg-[#F7F3EC] text-charcoal focus:outline-none focus:border-accent-teal w-full"
                      />
                      <User className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-[#1F1B16]/10 rounded-full pl-5 pr-12 py-3.5 text-xs bg-[#F7F3EC] text-charcoal focus:outline-none focus:border-accent-teal w-full"
                      />
                      <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-[#1F1B16]/10 rounded-full pl-5 pr-12 py-3.5 text-xs bg-[#F7F3EC] text-charcoal focus:outline-none focus:border-accent-teal w-full"
                      />
                      <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-charcoal text-cream font-bold py-4 rounded-full mt-4 flex items-center justify-center gap-2 hover:bg-charcoal-light hover:shadow-warm-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Register Account <ArrowRight className="w-4 h-4" />
                  </button>

                </form>

                <p className="text-xs text-charcoal/50 text-center mt-8">
                  Already have an account?{" "}
                  <a href="/login" className="font-bold text-accent-teal hover:underline">Sign In</a>
                </p>

              </div>
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
