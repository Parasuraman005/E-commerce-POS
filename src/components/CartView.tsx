import React from "react";
import { Product, CartItem } from "../types";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  CreditCard,
  ChevronRight,
  PackageCheck
} from "lucide-react";
import { motion } from "motion/react";
import { BrandedImage } from "./BrandedImage";
import { Skeleton } from "./Skeleton";

interface CartViewProps {
  cart: CartItem[];
  products: Product[];
  isLoading?: boolean;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckout: () => void;
  onExplore: () => void;
}

export default function CartView({ 
  cart, 
  products,
  isLoading,
  onUpdateCartQty, 
  onRemoveFromCart, 
  onCheckout,
  onExplore 
}: CartViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-12 animate-fade-in pb-20 max-w-7xl mx-auto px-4">
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <Skeleton variant="text" width={250} height={40} />
            <Skeleton variant="text" width={150} />
          </div>
          <div className="space-y-4">
            <Skeleton height={120} className="rounded-[3rem]" />
            <Skeleton height={120} className="rounded-[3rem]" />
          </div>
        </div>
        <div className="w-full lg:w-[420px]">
          <Skeleton height={500} className="rounded-[3.5rem]" />
        </div>
      </div>
    );
  }
  // Map cart items to actual products for display
  const cartWithProducts = cart.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  })).filter(item => item.product !== undefined) as (CartItem & { product: Product })[];

  const totalItems = cartWithProducts.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartWithProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 10000 ? 0 : 499;
  const grandTotal = subtotal + tax + shipping;

  if (cartWithProducts.length === 0) {
    return (
      <div id="cart-empty" className="py-24 text-center space-y-10">
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-brand-primary/5 rounded-[3rem] animate-pulse" />
          <div className="absolute inset-4 bg-brand-white border border-brand-border rounded-[2.5rem] flex items-center justify-center shadow-sm">
            <ShoppingCart className="w-12 h-12 text-brand-text-secondary opacity-20" />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-bold font-outfit text-brand-text-primary tracking-tighter uppercase">Deployment Empty</h2>
          <p className="text-[11px] text-brand-text-secondary font-black uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">No hardware assets staged for procurement.</p>
        </div>
        <button 
          onClick={onExplore}
          className="px-12 py-5 bg-brand-text-primary text-brand-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:bg-brand-primary active:scale-95 shadow-2xl shadow-brand-text-primary/20"
        >
          Browse Inventory
        </button>
      </div>
    );
  }

  return (
    <div id="cart-page" className="text-left max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* 1. Staged Hardware Items (Left Column) */}
        <div className="flex-1 w-full space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between px-2 sm:px-4">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-3xl sm:text-5xl font-bold font-outfit text-brand-text-primary tracking-tighter uppercase">Staged Assets</h1>
              <p className="text-[9px] sm:text-[11px] font-black text-brand-text-secondary uppercase tracking-[0.2em] sm:tracking-[0.3em] flex items-center gap-1.5 sm:gap-2">
                <PackageCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-primary" /> {totalItems} Modules Ready
              </p>
            </div>
            <button 
              onClick={onExplore}
              className="hidden sm:flex items-center gap-3 text-[10px] font-black text-brand-primary hover:text-brand-text-primary uppercase tracking-[0.25em] transition-colors"
            >
              Continue Adding <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div id="cart-items-list" className="space-y-4 sm:space-y-5">
            {cartWithProducts.map((item, idx) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-brand-white border border-brand-border rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 shadow-sm hover:border-brand-primary/20 transition-all flex flex-col sm:flex-row items-center gap-5 sm:gap-8"
              >
                {/* Product Visualization */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-brand-bg border border-brand-border rounded-[1.5rem] sm:rounded-[2.5rem] flex items-center justify-center shrink-0 group-hover:bg-brand-white transition-colors relative overflow-hidden">
                  <BrandedImage 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    fallbackIcon={<span className="text-4xl sm:text-5xl">📦</span>}
                  />
                </div>

                {/* Product Metadata */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-1 sm:space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-brand-bg border border-brand-border rounded-lg sm:rounded-xl text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.2em] w-max mx-auto sm:mx-0">
                      {item.product.category}
                    </span>
                    <h3 className="text-base sm:text-xl font-bold text-brand-text-primary font-outfit uppercase truncate group-hover:text-brand-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-brand-text-secondary font-medium line-clamp-1 max-w-[400px] mx-auto sm:mx-0 opacity-70">
                    {item.product.description}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mt-2 sm:mt-4">
                    <p className="text-lg sm:text-xl font-black text-brand-text-primary font-outfit tracking-tighter">
                      ₹{item.product.price.toLocaleString()}
                    </p>
                    <span className="text-[8px] font-black text-brand-text-secondary/40 uppercase tracking-[0.2em]">/ UNIT COST</span>
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center gap-4 sm:gap-8 border-t sm:border-t-0 sm:border-l border-brand-border pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex items-center bg-brand-bg border border-brand-border rounded-xl sm:rounded-2xl p-1 shadow-inner">
                    <button 
                      onClick={() => onUpdateCartQty(item.product.id, Math.max(1, item.quantity - 1))}
                      className="p-1.5 sm:p-2 hover:bg-brand-white rounded-lg sm:rounded-xl text-brand-text-primary transition-all active:scale-90"
                    >
                      <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <span className="w-10 sm:w-12 text-center text-[10px] sm:text-xs font-black font-mono text-brand-text-primary">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1)}
                      className="p-1.5 sm:p-2 hover:bg-brand-white rounded-lg sm:rounded-xl text-brand-text-primary transition-all active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-[7px] font-black text-brand-text-secondary/40 uppercase tracking-[0.3em]">Extension</p>
                      <p className="text-base font-bold text-brand-text-primary font-outfit">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => onRemoveFromCart(item.product.id)}
                      className="p-3 sm:p-4 bg-brand-white border border-brand-border rounded-xl sm:rounded-2xl text-error/60 hover:text-error hover:bg-error/5 hover:border-error/10 transition-all shadow-sm group/del"
                      title="De-stage Component"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover/del:rotate-12 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. Procurement Summary (Right Column) */}
        <div id="cart-summary" className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-32 space-y-8">
          <div className="bg-brand-text-primary rounded-[3.5rem] p-10 md:p-12 text-brand-white shadow-2xl shadow-brand-text-primary/20 relative overflow-hidden group">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-brand-white shadow-lg shadow-brand-primary/20">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-outfit tracking-tighter uppercase">Verification</h2>
              </div>

              <div className="space-y-5 font-inter">
                <div className="flex justify-between text-[10px] text-brand-white/40 font-black uppercase tracking-[0.3em]">
                  <span>Subtotal Inventory</span>
                  <span className="text-brand-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-brand-white/40 font-black uppercase tracking-[0.3em]">
                  <span>GST Verification (18%)</span>
                  <span className="text-brand-white">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-brand-white/40 font-black uppercase tracking-[0.3em]">
                  <span>Priority Logistics</span>
                  <span className={shipping === 0 ? "text-success" : "text-brand-white"}>
                    {shipping === 0 ? "EXEMPT" : `₹${shipping}`}
                  </span>
                </div>
                
                <div className="pt-8 border-t border-brand-white/10 flex flex-col gap-2">
                  <p className="text-[10px] font-black text-brand-white/30 uppercase tracking-[0.4em]">Final Investment Total</p>
                  <p className="text-5xl font-bold font-outfit text-brand-primary tracking-tighter">₹{grandTotal.toLocaleString()}</p>
                </div>
              </div>

              <button
                id="btn-cart-checkout"
                onClick={onCheckout}
                className="w-full py-6 lg:py-8 bg-brand-primary hover:bg-brand-secondary text-brand-white rounded-[2.5rem] font-black text-[11px] lg:text-[13px] uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-4 group/chk"
              >
                <span>Authorize Procurement</span>
                <ChevronRight className="w-5 h-5 group-hover/chk:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          {/* Secure Badges Bento */}
          <div className="grid grid-cols-2 gap-6 px-4">
            <div className="bg-brand-white border border-brand-border p-6 rounded-[2.5rem] flex flex-col items-center text-center space-y-3 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-success/60" />
              <p className="text-[10px] font-black text-brand-text-primary uppercase tracking-[0.25em]">Bank Verified</p>
            </div>
            <div className="bg-brand-white border border-brand-border p-6 rounded-[2.5rem] flex flex-col items-center text-center space-y-3 shadow-sm">
              <Zap className="w-6 h-6 text-brand-primary/60" />
              <p className="text-[10px] font-black text-brand-text-primary uppercase tracking-[0.25em]">Express Flow</p>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.5em] opacity-40">developed and designed by parasu raman</p>
          </div>
        </div>
      </div>
    </div>

  );
}
