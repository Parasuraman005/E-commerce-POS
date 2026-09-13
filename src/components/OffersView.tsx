import React from "react";
import { Offer, Product } from "../types";
import { 
  Gift, 
  ArrowRight, 
  ChevronRight, 
  Zap, 
  Timer, 
  CreditCard,
  Percent
} from "lucide-react";
import { motion } from "motion/react";
import { Skeleton } from "./Skeleton";

interface OffersViewProps {
  offers: Offer[];
  products: Product[];
  isLoading?: boolean;
  onAddToCart: (product: Product) => void;
  onExploreProducts: () => void;
  onNavigateToProducts: () => void;
}

export default function OffersView({ offers, onExploreProducts, isLoading }: OffersViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-16 animate-fade-in pb-20 max-w-7xl mx-auto px-4">
        <div className="space-y-6 max-w-3xl">
          <Skeleton variant="pill" width={250} height={40} />
          <Skeleton variant="text" width="90%" height={80} />
          <Skeleton variant="text" width="60%" height={30} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton height={440} className="rounded-[3.5rem]" />
          <Skeleton height={440} className="rounded-[3.5rem]" />
        </div>
      </div>
    );
  }
  return (
    <div id="offers-page" className="space-y-12 sm:space-y-16 text-left max-w-7xl mx-auto">
      {/* 1. Curated Headline */}
      <div className="space-y-4 sm:space-y-6 max-w-3xl px-4">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary/5 border border-brand-primary/10 rounded-full text-brand-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">
          <Percent className="w-4 h-4" />
          <span>Exclusive Hardware Benefits</span>
        </div>
        <h1 className="text-4xl sm:text-7xl font-bold font-outfit text-brand-text-primary leading-[1.05] tracking-tighter uppercase">
          Operator <span className="text-brand-primary">Privileges</span> & Seasonal Packs.
        </h1>
        <p className="text-base sm:text-lg text-brand-text-secondary leading-relaxed tracking-tight max-w-xl font-medium">
          Unlock high-performance hardware bundles curated for professional grade workstations. Limited time availability on primary components.
        </p>
      </div>

      {/* 2. Bento Style Offers Grid */}
      <div id="offers-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 px-4">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-[3.5rem] p-10 md:p-12 border transition-all hover:shadow-2xl flex flex-col justify-between min-h-[440px] group ${
              index === 0 
                ? "bg-brand-text-primary border-brand-text-primary text-brand-white shadow-2xl shadow-brand-text-primary/20" 
                : "bg-brand-white border-brand-border text-brand-text-primary shadow-sm hover:border-brand-primary/20"
            }`}
          >
            {/* Background Accent Blobs */}
            <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-20 transition-transform group-hover:scale-125 duration-1000 ${
              index === 0 ? "bg-brand-primary" : "bg-brand-primary/30"
            }`} />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className={`p-4 rounded-2xl border transition-colors ${
                  index === 0 ? "bg-brand-primary border-brand-primary text-brand-white" : "bg-brand-bg border-brand-border text-brand-primary group-hover:bg-brand-white"
                }`}>
                  <Gift className="w-7 h-7" />
                </div>
                <div className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                  index === 0 ? "bg-brand-white/10 border-brand-white/20 text-brand-white" : "bg-brand-bg border-brand-border text-brand-text-secondary"
                }`}>
                  <Timer className="w-4 h-4 opacity-50" />
                  <span>Ends in 48h</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold font-outfit tracking-tighter leading-tight uppercase group-hover:text-brand-primary transition-colors">{offer.title}</h2>
                <p className={`text-base md:text-lg leading-relaxed max-w-sm font-medium ${index === 0 ? "text-brand-white/60" : "text-brand-text-secondary"}`}>
                  {offer.description}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-end justify-between pt-10 border-t border-brand-white/10">
              <div className="space-y-2">
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${index === 0 ? "text-brand-white/40" : "text-brand-text-secondary/50"}`}>
                  Hardware Pack Starts At
                </p>
                <div className="flex items-baseline gap-3">
                  <span className={`text-3xl md:text-5xl font-black font-outfit tracking-tighter ${index === 0 ? "text-brand-primary" : "text-brand-text-primary"}`}>
                    ₹{offer.offerPrice}
                  </span>
                  <span className={`text-sm font-bold line-through opacity-30 ${index === 0 ? "text-brand-white" : "text-brand-text-primary"}`}>
                    ₹{(offer.offerPrice || 0) + 5000}
                  </span>
                </div>
              </div>

              <button
                onClick={onExploreProducts}
                className={`flex items-center gap-3 px-8 py-5 rounded-[2rem] font-black text-[11px] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xl uppercase tracking-[0.3em] ${
                  index === 0 
                    ? "bg-brand-white text-brand-text-primary hover:bg-brand-primary hover:text-brand-white shadow-brand-white/10" 
                    : "bg-brand-text-primary text-brand-white hover:bg-brand-primary shadow-brand-text-primary/10"
                }`}
              >
                <span>Grab Deal</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Global Promotional Features */}
      <div id="promotional-features" className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {[
          { icon: Zap, label: "Flash Advantage", desc: "Priority shipping on all high-performance hardware bundles.", color: "text-brand-primary" },
          { icon: CreditCard, label: "Operator Credit", desc: "Unlock 10% credit back on your first three hardware kit purchases.", color: "text-success" },
          { icon: Gift, label: "Loyalty Tier", desc: "Earn exclusive access to pre-market hardware beta test programs.", color: "text-brand-secondary" }
        ].map((feat, i) => (
          <div key={i} className="p-10 bg-brand-white border border-brand-border rounded-[3rem] shadow-sm space-y-6 group hover:border-brand-primary/20 transition-all">
            <div className="w-16 h-16 bg-brand-bg rounded-[1.5rem] flex items-center justify-center border border-brand-border group-hover:bg-brand-white transition-colors">
              <feat.icon className={`w-8 h-8 ${feat.color} group-hover:scale-110 transition-transform`} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-brand-text-primary font-outfit uppercase tracking-[0.2em]">{feat.label}</h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed font-medium">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary CTA */}
      <div className="py-20 md:py-32 flex flex-col items-center text-center space-y-10 px-4">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-outfit text-brand-text-primary tracking-tighter uppercase leading-tight">Looking for custom builds?</h2>
          <p className="text-[11px] text-brand-text-secondary font-black uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">Contact our professional assembly team for enterprise-grade hardware configuration and volume discounts.</p>
        </div>
        <button className="px-12 py-5 bg-brand-white border border-brand-text-primary text-brand-text-primary hover:bg-brand-text-primary hover:text-brand-white rounded-[2.5rem] font-black text-[11px] transition-all flex items-center gap-4 cursor-pointer uppercase tracking-[0.4em] shadow-xl shadow-brand-text-primary/5 active:scale-95 group/ent">
          <span>Inquire Enterprise Bundle</span>
          <ArrowRight className="w-5 h-5 group-hover/ent:translate-x-2 transition-transform" />
        </button>
        <div className="pt-10">
          <p className="text-[11px] font-black text-brand-text-secondary uppercase tracking-[0.6em] opacity-30">developed and designed by parasu raman</p>
        </div>
      </div>
    </div>

  );
}
