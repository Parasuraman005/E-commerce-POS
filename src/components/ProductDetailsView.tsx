import React from "react";
import { Product } from "../types";
import { 
  ArrowLeft, 
  ShoppingCart, 
  ShieldCheck, 
  Zap, 
  Truck, 
  Share2,
  Heart,
  Plus,
  Minus,
  Star
} from "lucide-react";
import { motion } from "motion/react";
import { Skeleton } from "./Skeleton";

import { BrandedImage } from "./BrandedImage";

interface ProductDetailsViewProps {
  product: Product;
  wishlist: string[];
  isLoading?: boolean;
  onToggleWishlist: (productId: string) => void;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailsView({ 
  product, 
  wishlist,
  isLoading,
  onToggleWishlist,
  onBack, 
  onAddToCart 
}: ProductDetailsViewProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [isShared, setIsShared] = React.useState(false);

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-12 pb-20">
        <Skeleton width={150} height={40} variant="pill" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton height={500} className="rounded-[3rem]" />
          <div className="space-y-6">
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" />
            <Skeleton height={100} />
            <Skeleton height={60} variant="pill" />
          </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
  };

  return (
    <div id="product-details-page" className="animate-fade-in space-y-4 sm:space-y-6 pb-4 sm:pb-8 max-w-6xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-brand-white border border-brand-border rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-brand-text-secondary hover:text-brand-primary transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className={`p-2 bg-brand-white border border-brand-border rounded-xl transition-all shadow-sm cursor-pointer ${isShared ? 'text-success' : 'text-brand-text-secondary hover:text-brand-primary'}`}
            title="Share Product"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onToggleWishlist(product.id)}
            className={`p-2 bg-brand-white border border-brand-border rounded-xl transition-all shadow-sm cursor-pointer ${wishlist.includes(product.id) ? 'text-brand-primary' : 'text-brand-text-secondary hover:text-brand-primary'}`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Left: Media Showcase - 5 cols */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 space-y-4"
        >
          <div className="aspect-square w-full max-h-[500px] bg-brand-white border border-brand-border rounded-[2.5rem] overflow-hidden flex items-center justify-center relative shadow-sm group mx-auto">
            {product.image ? (
              <BrandedImage 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <span className="text-8xl">📦</span>
            )}
            <div className="absolute top-4 left-4 px-3 py-1 bg-brand-primary text-brand-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
              {product.category}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 px-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-brand-white border border-brand-border rounded-xl flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-lg">📦</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Intel & Actions - 7 cols */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-6 text-left lg:max-h-[600px] lg:overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-warning">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-2.5 h-2.5 fill-current" />)}
              </div>
              <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">(4.8 / 5 Rating)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-outfit text-brand-text-primary tracking-tighter uppercase leading-[1.1]">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-secondary font-medium leading-relaxed max-w-2xl opacity-80">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 bg-brand-white border border-brand-border p-6 rounded-[2rem] shadow-sm">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-black font-outfit text-brand-primary">₹{product.price.toLocaleString()}</span>
              <span className="text-sm font-bold line-through text-brand-text-secondary/30">₹{(product.price * 1.2).toFixed(0)}</span>
              <div className="px-2 py-0.5 bg-success/10 border border-success/20 rounded-md text-[8px] font-black text-success uppercase">Save 20%</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-4 bg-brand-bg border border-brand-border rounded-xl p-1 shadow-xs shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-brand-white border border-brand-border rounded-lg text-brand-text-primary hover:text-brand-primary transition-all cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-black text-brand-text-primary font-mono">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-brand-white border border-brand-border rounded-lg text-brand-text-primary hover:text-brand-primary transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button 
                onClick={() => {
                  for(let i=0; i<quantity; i++) onAddToCart(product);
                }}
                className="w-full py-4 bg-brand-text-primary hover:bg-brand-primary text-brand-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-text-primary/10 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Authorize Acquisition</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            {[
              { icon: Zap, label: "Performance Grade", desc: "Enterprise certified." },
              { icon: ShieldCheck, label: "Extended Warranty", desc: "24-month protection." },
              { icon: Truck, label: "Priority Logistics", desc: "Next-cycle deployment." },
              { icon: ShieldCheck, label: "Secure Payment", desc: "Encrypted protocols." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-3 p-3 bg-brand-bg/40 border border-brand-border rounded-2xl transition-all hover:border-brand-primary/20">
                <div className="w-8 h-8 bg-brand-white border border-brand-border rounded-lg flex items-center justify-center shrink-0">
                  <feature.icon className="w-3.5 h-3.5 text-brand-primary" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h4 className="text-[9px] font-black text-brand-text-primary uppercase tracking-widest leading-none">{feature.label}</h4>
                  <p className="text-[8px] text-brand-text-secondary font-medium leading-tight opacity-70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>

  );
}
