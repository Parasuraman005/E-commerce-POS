import React from "react";
import { motion } from "motion/react";
import { Product } from "../types";
import { Heart, ShoppingCart, ArrowRight, Package } from "lucide-react";
import { BrandedImage } from "./BrandedImage";
import { ProductGridSkeleton, Skeleton } from "./Skeleton";

interface WishlistViewProps {
  wishlist: string[];
  products: Product[];
  isLoading?: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export default function WishlistView({ 
  wishlist, 
  products, 
  isLoading,
  onToggleWishlist, 
  onAddToCart,
  onSelectProduct 
}: WishlistViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-12 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-brand-white border border-brand-border rounded-[3.5rem] p-10 shadow-sm">
          <div className="space-y-2">
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={150} />
          </div>
          <Skeleton width={200} height={50} variant="pill" />
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    );
  }
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div id="wishlist-page" className="space-y-8 animate-fade-in font-inter max-w-7xl mx-auto px-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[9px] font-black text-brand-primary uppercase tracking-[0.3em]">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Curated Collection</span>
          </div>
          <h1 className="text-3xl font-bold font-outfit text-brand-text-primary tracking-tighter uppercase leading-none">Wish List</h1>
        </div>
        <div className="flex items-center gap-3 bg-brand-white border border-brand-border px-4 py-2 rounded-xl shadow-sm w-max">
          <Package className="w-3.5 h-3.5 text-brand-primary" />
          <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">{wishlistProducts.length} Saved Assets</span>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-brand-white border border-brand-border rounded-[3rem] shadow-sm">
          <div className="w-20 h-20 bg-brand-bg rounded-3xl flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-brand-text-secondary opacity-20" />
          </div>
          <h2 className="text-xl font-bold text-brand-text-primary uppercase tracking-tighter mb-2">No Saved Assets</h2>
          <p className="text-xs text-brand-text-secondary font-medium tracking-tight mb-8">Your procurement wishlist is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-brand-white border border-brand-border rounded-[1.5rem] sm:rounded-[2.5rem] p-3 sm:p-4 hover:border-brand-primary/20 transition-all shadow-sm hover:shadow-xl relative overflow-hidden"
            >
              {/* Product Image */}
              <div 
                className="aspect-square bg-brand-bg rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden mb-3 sm:mb-5 cursor-pointer relative"
                onClick={() => onSelectProduct(product)}
              >
                <BrandedImage 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  fallbackIcon={<span className="text-3xl sm:text-5xl">📦</span>}
                />
                <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Wishlist Toggle Button */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-brand-white/80 backdrop-blur-md border border-brand-border rounded-full flex items-center justify-center text-brand-primary shadow-sm hover:scale-110 transition-all z-10 cursor-pointer"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              {/* Product Info */}
              <div className="space-y-2 sm:space-y-4 px-1">
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-[7px] sm:text-[9px] font-black text-brand-primary uppercase tracking-widest">{product.category}</p>
                  <h3 className="text-[11px] sm:text-base font-bold text-brand-text-primary font-outfit uppercase truncate leading-tight">{product.name}</h3>
                </div>

                <div className="flex items-center justify-between pt-1 sm:pt-2">
                  <div className="space-y-0.5">
                    <p className="text-[7px] sm:text-[8px] font-black text-brand-text-secondary uppercase tracking-widest opacity-40">Valuation</p>
                    <p className="text-sm sm:text-xl font-black text-brand-text-primary tracking-tighter font-outfit">₹{product.price.toLocaleString()}</p>
                  </div>
                  
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-9 h-9 sm:w-12 sm:h-12 bg-brand-text-primary text-brand-white rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-brand-primary transition-all shadow-lg shadow-brand-text-primary/10 active:scale-90 cursor-pointer group/cart"
                  >
                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
