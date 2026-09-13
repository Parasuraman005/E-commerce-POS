import React from "react";
import { Product, Offer, HomeContent } from "../types";
import { ArrowRight, Sparkles, ShieldCheck, FileDown, Gift, Award, Zap, Heart } from "lucide-react";
import { Skeleton } from "./Skeleton";
import { BrandedImage } from "./BrandedImage";

interface HomeViewProps {
  products: Product[];
  offers: Offer[];
  homeContent: HomeContent;
  wishlist: string[];
  isLoading?: boolean;
  onToggleWishlist: (productId: string) => void;
  onNavigateTo: (tab: "products" | "offers" | "orders") => void;
  onSelectProduct: (product: Product) => void;
}

export default function HomeView({ products, offers, homeContent, wishlist, isLoading, onToggleWishlist, onNavigateTo, onSelectProduct }: HomeViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-12 md:space-y-20 animate-fade-in font-inter max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden bg-brand-bg border border-brand-border rounded-[3.5rem] h-[520px]">
          <div className="p-16 space-y-8 w-1/2">
            <Skeleton variant="pill" width="40%" />
            <Skeleton height={80} width="90%" />
            <Skeleton height={20} width="70%" />
            <div className="flex gap-4">
              <Skeleton width={160} height={50} variant="pill" />
              <Skeleton width={160} height={50} variant="pill" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton height={200} className="rounded-[3rem]" />
          <Skeleton height={200} className="rounded-[3rem]" />
          <Skeleton height={200} className="rounded-[3rem]" />
        </div>
      </div>
    );
  }
  // Take selected featured items or fallback to first 4 for better desktop grid filling
  const spotlightProducts = homeContent.featuredProductIds && homeContent.featuredProductIds.length > 0
    ? products.filter(p => homeContent.featuredProductIds?.includes(p.id))
    : products.slice(0, 4);
    
  const spotlightOffer = offers[0];

  return (
    <div id="home-page" className="space-y-12 md:space-y-20 animate-fade-in font-inter max-w-7xl mx-auto">
      {/* 1. Hero Section - Responsive Split Layout */}
      <div className="relative overflow-hidden bg-brand-bg border border-brand-border rounded-[3.5rem] shadow-sm min-h-[400px] md:min-h-[520px] flex items-center">
        {/* Background Decorative Layer */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 rounded-l-[10rem] blur-[120px] hidden lg:block" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-secondary/5 rounded-full blur-[100px]" />
        
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-16 lg:p-20">
          {/* Hero Content Area */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-brand-white border border-brand-border rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-text-secondary">
                {homeContent.promotionalBanner || "High-End Logistics Framework"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold font-outfit tracking-tighter text-brand-text-primary leading-[1] uppercase">
              {homeContent.featuredHeading.split(" ").map((word, i, arr) => (
                <span key={i} className={i >= arr.length - 2 ? "text-brand-primary" : ""}>
                  {word}{" "}
                  {i === Math.floor(arr.length / 2) && <br className="hidden md:block" />}
                </span>
              ))}
            </h1>

            <p className="text-base md:text-lg text-brand-text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium tracking-tight">
              {homeContent.featuredSubheading}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => onNavigateTo("products")}
                className="w-full sm:w-auto px-12 py-5 bg-brand-text-primary hover:bg-brand-primary text-brand-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-brand-text-primary/20 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Authorize Gear</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTo("offers")}
                className="w-full sm:w-auto px-12 py-5 bg-brand-white hover:bg-brand-bg text-brand-text-primary font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl transition-all border border-brand-border cursor-pointer shadow-sm text-center"
              >
                Seasonal Packs
              </button>
            </div>
          </div>

          {/* Hero Visual Area - Hidden on small mobile, prominent on desktop */}
          <div className="hidden lg:flex justify-center relative">
            <div className="relative w-full max-w-md aspect-square bg-brand-white border border-brand-border rounded-[4rem] shadow-2xl flex items-center justify-center overflow-hidden group rotate-3 hover:rotate-0 transition-transform duration-700">
              {homeContent.bannerImage ? (
                <BrandedImage 
                  src={homeContent.bannerImage} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt="Spotlight Asset"
                  fallbackIcon={<Zap className="w-20 h-20 text-brand-primary opacity-20" />}
                />
              ) : (
                <div className="flex flex-col items-center gap-4 opacity-20">
                  <Zap className="w-20 h-20 text-brand-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Intel Asset</span>
                </div>
              )}
              {/* Overlay Glass Badge */}
              <div className="absolute bottom-10 left-10 right-10 p-6 bg-brand-white/80 backdrop-blur-xl border border-brand-white/20 rounded-3xl shadow-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-primary">Enterprise Ready</span>
                </div>
                <p className="text-[11px] font-bold text-brand-text-secondary leading-tight">Verified hardware ecosystems for professional grade performance.</p>
              </div>
            </div>
            {/* Secondary Floating Card */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary text-brand-white rounded-[2rem] p-6 shadow-2xl flex flex-col justify-between -rotate-12 hover:rotate-0 transition-transform cursor-default">
              <Gift className="w-8 h-8" />
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Status</p>
                <p className="text-xs font-black uppercase tracking-widest leading-none">In Stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tactical Core Features - Bento Grid */}
      <div id="highlights-container" className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {[
          { icon: Zap, label: "Instant Auth", desc: "Experience dynamic Google OAuth verification and custom account privileges instantly.", color: "bg-brand-primary/5 text-brand-primary" },
          { icon: FileDown, label: "Typed Invoices", desc: "Generate and download beautifully typed invoice statements in high fidelity PDF format.", color: "bg-brand-secondary/5 text-brand-secondary" },
          { icon: Award, label: "Gear Shield", desc: "Access the most durable and professional hardware sets verified for long-term endurance.", color: "bg-success/5 text-success" }
        ].map((feat, i) => (
          <div key={i} className="bg-brand-white border border-brand-border rounded-[3rem] p-10 shadow-sm flex flex-col gap-6 group hover:border-brand-primary/20 transition-all">
            <div className={`w-14 h-14 rounded-2xl ${feat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <feat.icon className="w-7 h-7" />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-black text-brand-text-primary font-outfit uppercase tracking-[0.2em]">{feat.label}</h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed font-medium">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Integrated Showcase - Inventory Matrix */}
      <div id="featured-showcase" className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* Spotlight Products Matrix */}
        <div className="lg:col-span-8 bg-brand-white border border-brand-border rounded-[3.5rem] p-10 md:p-14 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-10 mb-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-black font-outfit tracking-tighter text-brand-text-primary uppercase leading-none">Inventory Matrix</h2>
              <p className="text-[11px] text-brand-text-secondary font-black uppercase tracking-[0.3em]">Handpicked hardware components for elite workstations.</p>
            </div>
            <button 
              onClick={() => onNavigateTo("products")}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary hover:tracking-[0.6em] transition-all flex items-center gap-2 group"
            >
              View Full Index
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {spotlightProducts.map(p => (
              <div key={p.id} className="group cursor-pointer space-y-4" onClick={() => onSelectProduct(p)}>
                <div className="aspect-square bg-brand-bg rounded-[2rem] flex items-center justify-center border border-brand-border group-hover:border-brand-primary/40 transition-all overflow-hidden shadow-sm relative">
                  <BrandedImage 
                    src={p.image} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all group-hover:scale-110 duration-700" 
                    alt={p.name}
                  />
                  <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Wishlist Toggle Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(p.id); }}
                    className={`absolute top-4 right-4 w-8 h-8 bg-brand-white/80 backdrop-blur-md border border-brand-border rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all z-10 cursor-pointer ${wishlist.includes(p.id) ? 'text-brand-primary' : 'text-brand-text-secondary hover:text-brand-primary'}`}
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-brand-text-primary uppercase tracking-tight truncate group-hover:text-brand-primary transition-colors">{p.name}</p>
                  <p className="text-xs text-brand-primary font-black">₹{p.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusive Seasonal Offer */}
        <div className="lg:col-span-4 bg-brand-text-primary rounded-[3.5rem] p-10 md:p-12 shadow-2xl flex flex-col justify-between relative overflow-hidden group border border-brand-text-primary shadow-brand-text-primary/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-brand-white/10 border border-brand-white/20 text-brand-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full backdrop-blur-md">
              <Gift className="w-4 h-4 text-brand-primary" />
              <span>{homeContent.promotionalBanner || "Active Pack"}</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold font-outfit tracking-tighter text-brand-white uppercase leading-tight">
                {homeContent.promotionalText ? "Exclusive Protocol" : (spotlightOffer?.title || "Special Bundle")}
              </h2>
              <p className="text-sm text-brand-white/60 leading-relaxed font-medium">
                {homeContent.promotionalText || spotlightOffer?.description || "High-performance gear curated for precision environments."}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-10 border-t border-brand-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[9px] uppercase text-brand-white/40 tracking-[0.4em] font-black leading-none">Starting At</p>
              <p className="text-4xl font-black text-brand-primary font-outfit tracking-tighter">₹{spotlightOffer?.offerPrice || 499}</p>
            </div>
            <button
              onClick={() => onNavigateTo("offers")}
              className="w-16 h-16 bg-brand-primary text-brand-white rounded-[1.5rem] flex items-center justify-center hover:bg-brand-white hover:text-brand-primary transition-all shadow-xl shadow-brand-primary/40 active:scale-95 cursor-pointer group/offer-btn"
            >
              <ArrowRight className="w-7 h-7 group-hover/offer-btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branded Attribution */}
      <div className="pt-20 pb-12 text-center opacity-30">
        <p className="text-[11px] font-black text-brand-text-secondary uppercase tracking-[0.6em]">developed and designed by parasu raman</p>
      </div>
    </div>
  );
}
