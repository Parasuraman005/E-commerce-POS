import React, { useState } from "react";
import { motion } from "motion/react";
import { UserProfile } from "../types";
import { X, Mail, KeyRound, User, ShieldCheck } from "lucide-react";

interface CustomerLoginModalProps {
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
}

export default function CustomerLoginModal({ onClose, onLoginSuccess }: CustomerLoginModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const validateAndLogin = (e: string, n: string) => {
    if (!e.includes("@") || !e.includes(".")) {
      setError("Please enter a valid identity address.");
      return;
    }
    onLoginSuccess({
      email: e,
      name: n || e.split("@")[0],
      phone: "",
      address: ""
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndLogin(email, name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F172A]/60 backdrop-blur-sm p-0 sm:p-4">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md overflow-hidden bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl border-t sm:border border-[#E2E8F0] max-h-[95vh] overflow-y-auto"
      >
        {/* Header Block with Google Identity */}
        <div className="relative p-8 sm:p-7 text-center border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <button
            id="btn-close-unified-login"
            onClick={onClose}
            className="absolute top-6 right-6 sm:top-5 sm:right-5 p-2 text-[#475569] hover:text-[#0F172A] rounded-full hover:bg-[#E2E8F0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="text-3xl sm:text-2xl font-black tracking-tighter select-none font-outfit">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-lg font-bold text-[#0F172A] tracking-tighter font-outfit uppercase">Unified Sign In</h2>
          <p className="text-[11px] sm:text-xs text-[#475569] mt-1 font-inter tracking-tight">Access your professional commerce environment safely</p>
        </div>

        {/* Form area */}
        <div className="p-8 sm:p-7">
          {error && (
            <div className="flex gap-2.5 p-4 mb-6 text-xs bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl">
              <ShieldCheck className="shrink-0 text-rose-500 w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Dynamic Role Selector Accounts */}
          <div className="mb-8 sm:mb-6">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#475569] mb-4 sm:mb-3 font-inter">
              DEMO PROFILES • SELECT ACCESS ROLE
            </label>
            <div className="space-y-3 sm:space-y-2.5 text-left">
              {/* Option 1: Admin */}
              <button
                id="btn-login-quick-admin"
                type="button"
                onClick={() => validateAndLogin("ironman30771@gmail.com", "Tony Stark")}
                className="flex items-center justify-between p-4 sm:p-3.5 bg-white hover:bg-rose-50/40 text-[#0F172A] border border-[#E2E8F0] hover:border-rose-300 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer w-full group"
              >
                <div className="flex items-center gap-4 sm:gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-black shadow-lg shadow-rose-200 shrink-0">
                    A
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-xs font-bold text-[#0F172A] truncate flex items-center gap-2 font-outfit tracking-tight uppercase">
                      Administrator
                      <span className="bg-rose-100 text-rose-700 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">ROOT</span>
                    </p>
                    <p className="text-[10px] sm:text-[9px] text-[#475569]/50 font-mono truncate tracking-tight">ironman30771@gmail.com</p>
                  </div>
                </div>
                <KeyRound className="w-5 h-5 sm:w-4 sm:h-4 text-rose-500 mr-1 shrink-0 group-hover:rotate-12 transition-transform" />
              </button>

              {/* Option 2: Customer */}
              <button
                id="btn-login-quick-customer"
                type="button"
                onClick={() => validateAndLogin("customer@gmail.com", "Bruce Wayne")}
                className="flex items-center justify-between p-4 sm:p-3.5 bg-white hover:bg-blue-50/40 text-[#0F172A] border border-[#E2E8F0] hover:border-blue-300 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer w-full group"
              >
                <div className="flex items-center gap-4 sm:gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-200 shrink-0">
                    C
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-xs font-bold text-[#0F172A] truncate flex items-center gap-2 font-outfit tracking-tight uppercase">
                      Customer
                      <span className="bg-blue-100 text-blue-700 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">GUEST</span>
                    </p>
                    <p className="text-[10px] sm:text-[9px] text-[#475569]/50 font-mono truncate tracking-tight">customer@gmail.com</p>
                  </div>
                </div>
                <User className="w-5 h-5 sm:w-4 sm:h-4 text-blue-500 mr-1 shrink-0 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-7 sm:my-6">
            <div className="absolute inset-0 border-t border-[#E2E8F0]" />
            <span className="relative px-4 text-[9px] uppercase text-[#475569] tracking-widest bg-white font-black font-inter">OR IDENTITY AUTHENTICATION</span>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleFormSubmit} className="space-y-5 sm:space-y-4 text-left">
            <div>
              <label htmlFor="unified-name-field" className="block text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-1.5 font-inter">
                Profile Name <span className="text-[#475569]/40 font-normal">(Optional)</span>
              </label>
              <input
                id="unified-name-field"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tony Stark"
                className="w-full px-4 py-3 sm:py-2.5 bg-[#F8FAFC] hover:bg-[#E2E8F0]/30 focus:bg-white text-[#0F172A] border border-[#E2E8F0] focus:border-[#F97316] rounded-2xl outline-none transition-all text-sm sm:text-xs font-inter font-medium tracking-tight"
              />
            </div>

            <div>
              <label htmlFor="unified-email-field" className="block text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-1.5 font-inter">
                Gmail Address <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  id="unified-email-field"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="name@gmail.com"
                  className="w-full pl-11 pr-4 py-3 sm:py-2.5 bg-[#F8FAFC] hover:bg-[#E2E8F0]/30 focus:bg-white text-[#0F172A] border border-[#E2E8F0] focus:border-[#F97316] rounded-2xl outline-none transition-all text-sm sm:text-xs font-mono font-bold tracking-tight"
                />
                <Mail className="absolute left-4 top-3.5 sm:top-3 w-4.5 h-4.5 sm:w-4 sm:h-4 text-[#475569]/40" />
              </div>
              <p className="text-[10px] sm:text-[9px] text-[#475569]/60 mt-2 font-inter leading-relaxed tracking-tight">Note: Administrator privileges are unlocked automatically if the email identity matches the system operator pool.</p>
            </div>

            <button
              type="submit"
              className="w-full py-4 sm:py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-inter text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] rounded-2xl shadow-xl shadow-[#F97316]/20 active:scale-[0.98] cursor-pointer transition-all mt-4"
            >
              Secure Portal Entrance
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
