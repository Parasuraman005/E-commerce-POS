import React from "react";
import { Order } from "../types";
import { 
  Clock, 
  Package, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Truck,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { motion } from "motion/react";
import { Skeleton } from "./Skeleton";

interface OrdersViewProps {
  orders: Order[];
  isLoading?: boolean;
  onCancelOrder: (orderNo: string, reason: string, feedback: string) => void;
  onNavigateToProducts: () => void;
}

export default function OrdersView({ orders, onNavigateToProducts, isLoading }: OrdersViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in pb-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton variant="text" width={100} height={15} />
            <Skeleton variant="text" width={200} height={40} />
          </div>
          <Skeleton variant="text" width={150} height={40} />
        </div>
        <div className="space-y-4">
          <Skeleton height={100} className="rounded-3xl" />
          <Skeleton height={100} className="rounded-3xl" />
          <Skeleton height={100} className="rounded-3xl" />
        </div>
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <div id="orders-empty" className="py-16 text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-brand-primary/5 rounded-[2rem] animate-pulse" />
          <div className="absolute inset-3 bg-brand-white border border-brand-border rounded-[1.5rem] flex items-center justify-center shadow-sm">
            <Clock className="w-8 h-8 text-brand-text-secondary opacity-20" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-outfit text-brand-text-primary tracking-tighter uppercase">Deployment Empty</h2>
          <p className="text-[10px] text-brand-text-secondary font-black uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">Procurement history will appear post-verification.</p>
        </div>
        <button 
          onClick={onNavigateToProducts}
          className="px-10 py-4 bg-brand-text-primary text-brand-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-brand-primary active:scale-95 shadow-xl shadow-brand-text-primary/10"
        >
          Browse Inventory
        </button>
      </div>
    );
  }

  return (
    <div id="orders-page" className="space-y-4 sm:space-y-8 text-left max-w-7xl mx-auto px-2 sm:px-4">
      {/* 1. Header - Ultra Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 text-[7px] sm:text-[8px] font-black text-brand-primary uppercase tracking-[0.3em]">
            <Package className="w-2.5 h-2.5 sm:w-3 h-3" />
            <span>Deployment Analytics</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold font-outfit text-brand-text-primary tracking-tighter uppercase leading-tight">Order Logbook</h1>
        </div>
        <div className="flex items-center gap-2 bg-brand-white border border-brand-border px-3 py-1.5 rounded-lg shadow-sm w-max">
          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 h-3 text-success" />
          <span className="text-[7px] sm:text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">{orders.length} Verified Records</span>
        </div>
      </div>

      {/* 2. High-Density List of Orders */}
      <div id="orders-list" className="space-y-3 sm:space-y-4">
        {orders.map((order, idx) => (
          <motion.div
            key={order.orderNo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-brand-white border border-brand-border rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 hover:border-brand-primary/20 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
              {/* Left Side: Identity & Info */}
              <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-bg border border-brand-border rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-white transition-colors">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 text-brand-text-primary group-hover:text-brand-primary transition-transform group-hover:scale-110" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[8px] font-bold text-brand-text-primary font-mono tracking-tighter bg-brand-bg px-2 py-0.5 border border-brand-border rounded-md uppercase">#{order.orderNo.slice(-8).toUpperCase()}</span>
                    <span className={`text-[7px] font-black uppercase tracking-[0.1em] flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                      order.orderStatus === 'Delivered' ? 'bg-success/5 text-success border-success/10' : 
                      order.orderStatus === 'Cancelled' || order.orderStatus === 'Customer Cancelled' ? 'bg-error/5 text-error border-error/10' :
                      'bg-warning/5 text-warning border-warning/10'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${
                        order.orderStatus === 'Delivered' ? 'bg-success' : 
                        order.orderStatus === 'Cancelled' || order.orderStatus === 'Customer Cancelled' ? 'bg-error' : 'bg-warning'
                      }`} />
                      {order.orderStatus}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-brand-text-primary font-outfit uppercase truncate group-hover:text-brand-primary transition-colors leading-tight">
                    {order.items[0].name} {order.items.length > 1 && `(+${order.items.length - 1} Units)`}
                  </h3>
                  <div className="flex items-center gap-3 text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.15em]">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 opacity-40" /> {new Date(order.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3 opacity-40" /> {order.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Price & Actions */}
              <div className="flex flex-row items-center justify-between lg:justify-end gap-4 sm:gap-8 border-t lg:border-t-0 border-brand-border pt-3 lg:pt-0">
                <div className="text-left lg:text-right">
                  <p className="text-[7px] uppercase text-brand-text-secondary/50 tracking-[0.2em] font-black">Valuation</p>
                  <p className="text-xl sm:text-2xl font-black text-brand-text-primary tracking-tighter font-outfit">₹{order.totalAmount.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button className="p-2 sm:p-2.5 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary hover:bg-brand-primary hover:text-brand-white transition-all shadow-sm" title="View PDF">
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-brand-text-primary hover:bg-brand-primary text-brand-white rounded-lg sm:rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 group/build">
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3 group-hover/build:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Ultra-Dense Stats Panel */}
      <div id="order-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4">
        {[
          { label: "Active Nodes", val: "01", icon: Truck, color: "text-brand-primary" },
          { label: "Verified Logins", val: "04", icon: CheckCircle2, color: "text-success" },
          { label: "Hardware Units", val: orders.reduce((sum, o) => sum + o.items.length, 0), icon: Package, color: "text-brand-secondary" },
          { label: "Total Assets", val: "₹" + orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString(), icon: CreditCard, color: "text-brand-white", primary: true }
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border transition-all ${
            stat.primary 
            ? "bg-brand-text-primary border-brand-text-primary text-brand-white" 
            : "bg-brand-white border-brand-border text-brand-text-primary"
          }`}>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.primary ? "text-brand-primary" : stat.color}`} />
              <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] ${stat.primary ? "text-brand-white/40" : "text-brand-text-secondary"}`}>{stat.label}</span>
            </div>
            <p className="text-lg sm:text-xl font-black font-outfit tracking-tighter">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="text-center pt-6">
        <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.6em] opacity-30 italic">designed by parasu raman</p>
      </div>
    </div>
  );
}

// Support Icons not in initial imports
const CreditCard = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);
