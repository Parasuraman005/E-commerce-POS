import React, { useState } from "react";
import { Product, CartItem } from "../types";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight,
  Plus,
  Heart
} from "lucide-react";
import { motion } from "motion/react";
import { Skeleton, ProductGridSkeleton } from "./Skeleton";
import { BrandedImage } from "./BrandedImage";

interface ProductsViewProps {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading?: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onUpdateCartQty: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  totalCartQty: number;
  onNavigateToCart: () => void;
}

export default function ProductsView({ 
  products, 
  wishlist,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  isLoading,
  onToggleWishlist,
  onAddToCart, 
  onSelectProduct,
  totalCartQty,
  onNavigateToCart 
}: ProductsViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-12 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-brand-white border border-brand-border rounded-[3.5rem] p-10 shadow-sm">
          <div className="space-y-2">
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={300} />
          </div>
          <Skeleton width={300} height={50} variant="pill" />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    );
  }
  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="products-page" className="space-y-6 sm:space-y-8 animate-fade-in relative font-inter">
      {/* 1. Dynamic Search & Category Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 bg-brand-white border border-brand-border p-5 rounded-[2rem] shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-secondary" />
          <input
            id="product-search-input"
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-brand-bg border border-brand-border rounded-2xl text-xs text-brand-text-primary focus:outline-hidden focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 transition-all font-inter"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 md:pb-0 px-1">
          <div className="p-2 bg-brand-bg border border-brand-border rounded-xl shrink-0">
            <Filter className="w-3.5 h-3.5 text-brand-text-secondary" />
          </div>
          {categories.map(cat => (
            <button
              id={`category-filter-${cat}`}
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all shrink-0 cursor-pointer border font-inter uppercase tracking-widest ${
                selectedCategory === cat
                  ? "bg-brand-primary border-brand-primary text-brand-white shadow-lg shadow-brand-primary/20"
                  : "bg-brand-white border-brand-border text-brand-text-secondary hover:border-brand-primary/30 hover:text-brand-text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Product Count & Context Stats */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-3xl font-bold font-outfit text-brand-text-primary tracking-tighter uppercase">Hardware Inventory</h2>
          <span className="px-3 py-1 bg-brand-bg border border-brand-border text-brand-text-secondary text-[10px] font-black rounded-full font-mono uppercase">
            {filteredProducts.length} ITEMS
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest font-inter">
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-brand-primary" /> High Endurance</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-success" /> Verified</span>
        </div>
      </div>

      {/* 3. High Fidelity Product Grid */}
      <div id="products-grid" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectProduct(product)}
            className="group bg-brand-white border border-brand-border rounded-2xl p-3 sm:p-4 hover:border-brand-primary/30 transition-all hover:shadow-xl hover:shadow-brand-primary/5 flex flex-col h-full cursor-pointer"
          >
            {/* Image Placeholder with Category Badge */}
            <div className="relative aspect-square mb-3 bg-brand-bg border border-brand-border rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-[1.02] duration-500 shadow-sm">
              <BrandedImage 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all group-hover:scale-110 duration-700" 
                fallbackIcon={<span className="text-3xl">📦</span>}
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-brand-white/90 backdrop-blur-md border border-brand-border text-[8px] font-black uppercase tracking-widest text-brand-text-secondary rounded-md shadow-sm font-inter">
                {product.category}
              </div>
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                  className={`p-2 bg-brand-white/90 backdrop-blur-md border border-brand-border rounded-lg shadow-sm transition-all hover:scale-110 ${wishlist.includes(product.id) ? 'text-brand-primary' : 'text-brand-text-primary hover:text-brand-primary'}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                </button>
                <div className="p-2 bg-brand-white/90 backdrop-blur-md border border-brand-border text-brand-text-primary rounded-lg shadow-sm hover:text-brand-primary">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-2 flex-1 text-left">
              <div className="flex items-start justify-between gap-1">
                <h3 className="text-sm font-bold text-brand-text-primary font-outfit leading-tight line-clamp-2 group-hover:text-brand-primary transition-colors uppercase">
                  {product.name}
                </h3>
              </div>
              
              <p className="text-[10px] text-brand-text-secondary font-inter line-clamp-2 leading-tight tracking-tight opacity-70">
                {product.description}
              </p>

              <div className="pt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold font-outfit text-brand-text-primary">₹{product.price.toLocaleString()}</span>
                <span className="text-[9px] text-brand-text-secondary/50 line-through font-inter">₹{(product.price * 1.2).toFixed(0)}</span>
              </div>
            </div>

            {/* Quick Action: Add to Cart */}
            <button
              id={`btn-add-to-cart-${product.id}`}
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="mt-4 w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-brand-white rounded-xl text-[10px] font-bold font-inter transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-brand-primary/10 cursor-pointer uppercase tracking-widest"
            >
              <Plus className="w-3 h-3 group-hover/btn:rotate-90 transition-transform" />
              <span>Purchase</span>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Empty Search State */}
      {filteredProducts.length === 0 && (
        <div className="py-24 text-center space-y-6 bg-brand-white border border-dashed border-brand-border rounded-[2.5rem]">
          <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto border border-brand-border shadow-sm">
            <Search className="w-8 h-8 text-brand-border" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-brand-text-primary font-outfit uppercase">No hardware located</h3>
            <p className="text-sm text-brand-text-secondary font-inter">Try refining your search parameters or selecting a different category.</p>
          </div>
          <button 
            onClick={() => { onSearchChange(""); onCategoryChange("All"); }}
            className="text-xs font-bold text-brand-primary hover:underline uppercase tracking-widest font-inter"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Floating Action Button - Minimized on Mobile */}
      <div className="fixed bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-45 w-auto max-w-sm px-4">
        <button
          onClick={onNavigateToCart}
          className="bg-brand-text-primary text-brand-white font-inter font-bold text-[10px] sm:text-xs uppercase py-3 sm:py-5 px-6 sm:px-10 rounded-full sm:rounded-3xl shadow-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-4 cursor-pointer group border border-white/10"
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="p-2 sm:p-2.5 bg-brand-white/10 rounded-full sm:rounded-2xl group-hover:bg-brand-white/20 transition-colors">
              <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-brand-primary" />
            </div>
            <span className="tracking-widest hidden sm:inline">Go to Checkout</span>
            <span className="tracking-widest sm:hidden">Checkout</span>
          </div>
          {totalCartQty > 0 && (
            <div className="bg-brand-primary text-brand-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full sm:rounded-2xl font-mono text-[10px] sm:text-xs font-black shadow-xl shadow-brand-primary/40">
              {totalCartQty}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
