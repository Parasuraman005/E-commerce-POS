import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ChevronRight, Sparkles, ShieldCheck, Stars, Lock } from "lucide-react";

interface SplashProps {
  shopName: string;
  shopLogo: string;
  shopTagline: string;
  onDismiss: () => void;
  onAdminLogin?: () => void;
}

export default function Splash({ shopName, shopLogo, shopTagline, onDismiss, onAdminLogin }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      onDismiss();
    }
  }, [progress, onDismiss]);

  return (
    <motion.div
      id="splash-container"
      onClick={onDismiss}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#0F172A] p-6 overflow-hidden select-none cursor-pointer"
    >
      {/* 1. Technical Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F97316]/20 to-transparent opacity-50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F97316]/20 to-transparent opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#F97316]/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[160px] animate-pulse delay-1000" />
      </div>

      {/* 2. Primary Core Container */}
      <div className="relative flex flex-col items-center w-full max-w-sm">
        
        {/* Animated Brand Totem */}
        <div className="relative mb-14">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 120 }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[#F1F5F9]" />
            <ShoppingBag className="w-10 sm:w-12 h-10 sm:h-12 text-[#0F172A] relative z-10" />
            
            {/* Subtle Industrial Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '4px 4px' }} />
          </motion.div>
          
          {/* Orbital Decal */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-6 border border-dashed border-[#F97316]/20 rounded-[2.5rem] opacity-40"
          />
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-[#F97316] animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
        </div>

        {/* Corporate Title Block */}
        <div className="text-center space-y-4 mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-2">
            <div className="w-1 h-1 rounded-full bg-[#F97316] animate-ping" />
            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] font-inter">System Initialization</span>
          </div>
          <div className="space-y-1">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl font-black font-outfit text-white tracking-tighter uppercase leading-none"
            >
              {shopName || "SMART STORE"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[9px] sm:text-[10px] font-black text-[#F97316] uppercase tracking-[0.5em] font-inter opacity-70"
            >
              {shopTagline || "PREMIUM HARDWARE SUITE"}
            </motion.p>
          </div>
        </div>

        {/* Minimalist Progress Indicator */}
        <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden relative mb-20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute inset-y-0 left-0 bg-[#F97316]"
          />
        </div>

        {/* Global Signature */}
        <div className="flex flex-col items-center space-y-3 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-4 text-[9px] font-black text-white uppercase tracking-[0.3em] font-mono">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" /> Encrypted</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Secure Node</span>
          </div>
          <p className="text-[8px] text-white/20 font-mono uppercase tracking-widest">Protocol v4.0.2 • Verified Environment</p>
        </div>
      </div>
    </motion.div>
  );
}
