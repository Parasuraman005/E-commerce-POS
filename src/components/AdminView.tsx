import React, { useState, useMemo } from "react";
import { Product, Offer, Order, UserProfile, HomeContent } from "../types";
import { 
  Plus, 
  Settings, 
  Trash2, 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  Package, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Search,
  Download,
  ArrowUpRight,
  MoreVertical,
  ChevronRight,
  Zap,
  Edit2,
  Calendar,
  Layers,
  ArrowRight,
  X,
  LogOut,
  Home,
  User,
  BarChart3,
  Globe,
  Wallet,
  Store,
  Instagram,
  MessageCircle,
  FileText,
  ChevronDown,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Menu,
  Box,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import OfferForm from "./OfferForm";
import OrdersView from "./OrdersView";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  offers: Offer[];
  categories: string[];
  adminsList: { name: string; email: string; status: "Active" | "Pending Approval" }[];
  allUsers: UserProfile[];
  shopDetails: {
    name: string;
    logo: string;
    tagline: string;
    phone: string;
    address: string;
    gstin: string;
    contact1?: string;
    contact2?: string;
  };
  paymentDetails: {
    upiNumber: string;
    upiHolderName: string;
    upiId: string;
    upiQrCode: string;
  };
  socialLinks: {
    instagram: string;
    whatsapp: string;
  };
  homeContent: HomeContent;
  currentUser: UserProfile | null;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddOffer: (offer: Omit<Offer, "id">) => void;
  onUpdateOffer: (offer: Offer) => void;
  onDeleteOffer: (id: string) => void;
  onUpdateOrderStatus: (orderNo: string, status: Order["orderStatus"]) => void;
  onUpdatePaymentStatus: (orderNo: string, status: Order["paymentStatus"]) => void;
  onUpdateShopDetails: (name: string, logo: string, phone: string, address: string, gstin: string, tagline: string, contact1?: string, contact2?: string) => void;
  onUpdateSocials: (instagram: string, whatsapp: string) => void;
  onUpdatePayment: (number: string, holder: string, upi: string, qr: string) => void;
  onAddAdmin: (name: string, email: string) => void;
  onApproveAdmin: (email: string) => void;
  onDeleteAdmin: (email: string) => void;
  onAddCategory: (cat: string) => void;
  onUpdateHomeContent: (content: any) => void;
  onLogout: () => void;
  onNavigateToHome: () => void;
}

export default function AdminView({
  products,
  orders,
  offers,
  categories,
  adminsList,
  allUsers,
  shopDetails,
  paymentDetails,
  socialLinks,
  homeContent,
  currentUser,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddOffer,
  onUpdateOffer,
  onDeleteOffer,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onUpdateShopDetails,
  onUpdateSocials,
  onUpdatePayment,
  onAddAdmin,
  onApproveAdmin,
  onDeleteAdmin,
  onAddCategory,
  onUpdateHomeContent,
  onLogout,
  onNavigateToHome,
}: AdminViewProps) {
  const [activePane, setActivePane] = useState<"dashboard" | "inventory" | "offers" | "orders" | "reports" | "profile" | "settings" | "shop" | "customers">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [localFeaturedIds, setLocalFeaturedIds] = useState<string[]>(homeContent.featuredProductIds || []);

  // Filters for Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Stats Calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthOrders = orders.filter(o => {
    const d = new Date(o.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter(o => o.orderStatus === "Processing").length;
  const completedOrdersCount = orders.filter(o => o.orderStatus === "Delivered").length;

  const revenueData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTotal = orders
        .filter(o => o.date === date)
        .reduce((sum, o) => sum + o.totalAmount, 0);
      return { name: date.slice(5), revenue: dayTotal };
    });
  }, [orders]);

  const topSellingProducts = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        if (!counts[item.productId]) {
          counts[item.productId] = { name: item.name, count: 0 };
        }
        counts[item.productId].count += item.quantity;
      });
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  const COLORS = ["#F97316", "#0F172A", "#64748B", "#94A3B8", "#CBD5E1"];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = orderStatusFilter === "All" || o.orderStatus === orderStatusFilter;
    const matchesDate = (!dateFrom || o.date >= dateFrom) && (!dateTo || o.date <= dateTo);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const menuItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "shop", icon: Store, label: "Shop" },
    { id: "inventory", icon: ShoppingBag, label: "Products" },
    { id: "offers", icon: Tag, label: "Offers" },
    { id: "orders", icon: Package, label: "Orders" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "reports", icon: BarChart3, label: "Reports" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);

  const handleMenuItemClick = (id: string) => {
    if (id === "home") {
      onNavigateToHome();
      return;
    }
    setActivePane(id as any);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex text-left font-inter w-full overflow-x-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-[70] bg-brand-text-primary text-brand-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-white/5 shadow-[25px_0_50px_-12px_rgba(0,0,0,0.5)] 
          ${isSidebarOpen ? "translate-x-0 w-72 sm:w-80" : "-translate-x-full lg:translate-x-0 lg:w-20 lg:sticky lg:h-screen"}
          ${!isSidebarOpen && "lg:hover:w-72 sm:lg:hover:w-80 lg:group"}
        `}
        onMouseEnter={() => !window.matchMedia("(max-width: 1024px)").matches && setIsSidebarOpen(true)}
        onMouseLeave={() => !window.matchMedia("(max-width: 1024px)").matches && setIsSidebarOpen(false)}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0 overflow-hidden">
            <div className="flex items-center gap-4 min-w-max">
              {shopDetails.logo ? (
                <div className="w-10 h-10 rounded-xl bg-brand-white p-1.5 shadow-sm shrink-0">
                  <img src={shopDetails.logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center font-bold shrink-0 shadow-lg shadow-brand-primary/20 text-sm">
                  {shopDetails.name.charAt(0)}
                </div>
              )}
              <div className={`transition-all duration-300 ${isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 lg:hidden"}`}>
                <span className="font-outfit font-black tracking-tighter truncate text-xl uppercase block leading-none">
                  {shopDetails.name}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mt-1.5 block">Operator Console</span>
              </div>
            </div>
            
            {/* Close Button for Mobile */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-none">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleMenuItemClick(item.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center h-14 px-4 rounded-2xl transition-all duration-300 border ${
                  !isSidebarOpen ? "lg:justify-center" : ""
                } ${
                  activePane === item.id 
                    ? "bg-brand-primary text-brand-white shadow-xl shadow-brand-primary/30 border-brand-primary" 
                    : "text-white/40 border-transparent hover:bg-white/5 hover:text-brand-white"
                } group`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${activePane === item.id ? "scale-110" : "group-hover:scale-110"} transition-transform`} />
                <div className={`ml-4 flex-1 text-left transition-all duration-300 ${isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 lg:hidden"}`}>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-white/10 space-y-3">
            <button 
              onClick={onLogout}
              className={`w-full flex items-center px-4 py-4 rounded-2xl text-white/40 hover:text-rose-400 hover:bg-rose-400/5 transition-all ${
                !isSidebarOpen ? "lg:justify-center" : ""
              }`}
            >
              <LogOut className="w-6 h-6 shrink-0" />
              <span className={`ml-4 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 lg:hidden"}`}>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 sm:h-20 bg-brand-white border-b border-brand-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={handleSidebarToggle}
              className="p-2 sm:p-2.5 bg-brand-bg text-brand-text-secondary hover:text-brand-text-primary rounded-lg transition-all cursor-pointer border border-brand-border"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl font-bold font-outfit text-brand-text-primary uppercase tracking-tighter leading-none">
                {activePane}
              </h2>
              <span className="hidden sm:block text-[8px] font-black uppercase tracking-[0.3em] text-brand-text-secondary mt-1">{shopDetails.name} System Control</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-bg border border-brand-border rounded-xl shadow-sm">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-[9px] font-black text-brand-text-primary leading-tight uppercase tracking-widest">{currentUser?.name || "Admin"}</span>
                <span className="text-[8px] text-brand-text-secondary font-mono leading-none truncate max-w-[120px]">{currentUser?.email}</span>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-text-primary text-brand-white rounded-lg flex items-center justify-center font-bold text-xs shadow-lg shadow-brand-text-primary/10 ring-2 ring-brand-white overflow-hidden">
                {currentUser?.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePane}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Dashboard Overview */}
              {activePane === "dashboard" && (
                <div className="space-y-8 sm:space-y-10">
                  <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-bold font-outfit text-brand-text-primary tracking-tighter uppercase">Welcome, {currentUser?.name?.split(' ')[0] || 'Admin'}!</h1>
                    <p className="text-brand-text-secondary text-xs font-medium">Global operational overview for your hardware enterprise.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-brand-white border border-brand-border p-6 sm:p-8 rounded-2xl shadow-sm flex items-center gap-5 group hover:border-brand-primary/20 transition-all">
                      <div className="w-12 h-12 bg-success/5 text-success rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em] mb-1">Month's Revenue</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-brand-text-primary font-outfit tracking-tight">₹{thisMonthRevenue.toLocaleString()}</h3>
                      </div>
                    </div>
                    <div className="bg-brand-white border border-brand-border p-6 sm:p-8 rounded-2xl shadow-sm flex items-center gap-5 group hover:border-warning/20 transition-all">
                      <div className="w-12 h-12 bg-warning/5 text-warning rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em] mb-1">Pending Orders</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-brand-text-primary font-outfit tracking-tight">{pendingOrdersCount}</h3>
                      </div>
                    </div>
                    <div className="bg-brand-white border border-brand-border p-6 sm:p-8 rounded-2xl shadow-sm flex items-center gap-5 group hover:border-brand-primary/20 transition-all sm:col-span-2 lg:col-span-1">
                      <div className="w-12 h-12 bg-brand-primary/5 text-brand-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em] mb-1">Completed Orders</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-brand-text-primary font-outfit tracking-tight">{completedOrdersCount}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-brand-white border border-brand-border p-6 sm:p-8 rounded-3xl shadow-sm">
                      <h3 className="text-sm font-bold text-brand-text-primary font-outfit uppercase mb-8 tracking-widest border-l-4 border-brand-primary pl-4">Revenue Analysis</h3>
                      <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueData}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3368A0" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#3368A0" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E5E8" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#5B6570'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#5B6570'}} />
                            <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #E2E5E8', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#3368A0" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-brand-white border border-brand-border p-6 sm:p-8 rounded-3xl shadow-sm">
                      <h3 className="text-sm font-bold text-brand-text-primary font-outfit uppercase mb-8 tracking-widest border-l-4 border-brand-secondary pl-4">Asset Spotlight</h3>
                      <div className="space-y-4 sm:space-y-5">
                        {topSellingProducts.map((p, i) => (
                          <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center font-black text-[10px] text-brand-text-secondary group-hover:bg-brand-primary group-hover:text-brand-white transition-all shadow-sm">
                                {i + 1}
                              </div>
                              <span className="text-xs font-bold text-brand-text-primary uppercase tracking-tight group-hover:text-brand-primary transition-colors line-clamp-1">{p.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="px-3 py-1 bg-brand-primary/5 text-brand-primary rounded-lg text-[9px] font-black font-mono tracking-widest">{p.count} UNITS</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Inventory */}
              {activePane === "inventory" && (
                <div className="space-y-8 sm:space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-brand-text-primary uppercase tracking-tighter leading-tight">Hardware Inventory</h1>
                      <p className="text-brand-text-secondary text-[9px] font-black uppercase tracking-[0.2em]">Lifecycle management for your product catalog and global hardware assets.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-secondary" />
                        <input 
                          type="text" 
                          placeholder="SEARCH ASSETS..." 
                          className="w-full sm:w-60 pl-11 pr-6 py-3 bg-brand-white border border-brand-border rounded-xl text-[9px] font-black uppercase tracking-[0.15em] focus:ring-2 ring-brand-primary/10 outline-none transition-all shadow-xs"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-white border border-brand-border rounded-2xl overflow-hidden shadow-sm">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-brand-bg border-b border-brand-border">
                            <th className="px-6 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Asset Specification</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Domain</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Purchase Price</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Selling Rate</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">In-Stock</th>
                            <th className="px-6 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em] text-right">Ops</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                          {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (
                            <tr key={p.id} className="hover:bg-brand-bg/50 transition-all group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-brand-border bg-brand-white p-1 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                    <img src={p.image} className="w-full h-full object-cover rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-brand-text-primary tracking-tight leading-tight uppercase line-clamp-1">{p.name}</p>
                                    <p className="text-[9px] text-brand-text-secondary font-mono uppercase mt-0.5 tracking-widest">#{p.id.slice(-8)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <span className="px-3 py-1 bg-brand-white border border-brand-border rounded-lg text-[8px] font-black text-brand-text-primary uppercase tracking-[0.1em] shadow-xs">
                                  {p.category}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-xs font-black text-brand-text-secondary font-mono opacity-60">₹{p.purchasePrice?.toLocaleString() || '0'}</td>
                              <td className="px-5 py-4 text-xs font-black text-brand-text-primary font-mono">₹{p.price.toLocaleString()}</td>
                              <td className="px-5 py-4">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] border ${
                                  (p.qty || 0) < 5 ? "bg-error/5 text-error border-error/10" : "bg-success/5 text-success border-success/10"
                                }`}>
                                  <Box className="w-3 h-3" />
                                  {p.qty || 0} UNITS
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                  <button 
                                    onClick={() => { setEditingProduct(p); setShowAddProductModal(true); }}
                                    className="p-2.5 bg-brand-white border border-brand-border text-brand-text-secondary hover:text-brand-primary hover:border-brand-primary/20 rounded-xl transition-all shadow-sm cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (confirm(`Delete ${p.name}?`)) onDeleteProduct(p.id);
                                    }}
                                    className="p-2.5 bg-brand-white border border-brand-border text-brand-text-secondary hover:text-error hover:border-error/20 rounded-xl transition-all shadow-sm cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden divide-y divide-brand-border">
                      {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (
                        <div key={p.id} className="p-4 space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-brand-border bg-brand-white p-1 shadow-sm shrink-0">
                              <img src={p.image} className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-brand-text-primary tracking-tight leading-tight uppercase truncate">{p.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-widest">#{p.id.slice(-8)}</span>
                                <span className="px-2 py-0.5 bg-brand-bg border border-brand-border rounded text-[8px] font-black text-brand-text-primary uppercase tracking-tighter">
                                  {p.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/50">
                              <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Selling Rate</p>
                              <p className="text-sm font-black text-brand-text-primary font-mono">₹{p.price.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/50">
                              <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Inventory</p>
                              <div className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase ${
                                (p.qty || 0) < 5 ? "text-error" : "text-success"
                              }`}>
                                <Box className="w-3.5 h-3.5" />
                                {p.qty || 0} UNITS
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button 
                              onClick={() => { setEditingProduct(p); setShowAddProductModal(true); }}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-white border border-brand-border text-brand-text-primary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm(`Delete ${p.name}?`)) onDeleteProduct(p.id);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-white border border-brand-border text-error rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 flex items-center justify-center gap-4 border-t border-brand-border">
                    <button 
                      onClick={() => setShowCategoryModal(true)}
                      className="px-8 py-4 bg-brand-white border border-brand-border text-brand-text-primary rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all hover:bg-brand-bg cursor-pointer shadow-lg shadow-brand-text-primary/5 flex items-center gap-2.5 group"
                    >
                      <Plus className="w-4 h-4 text-brand-primary group-hover:rotate-90 transition-transform" /> Add Category
                    </button>
                    <button 
                      onClick={() => { setEditingProduct(null); setShowAddProductModal(true); }}
                      className="px-8 py-4 bg-brand-text-primary text-brand-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all hover:bg-brand-primary/90 shadow-lg shadow-brand-text-primary/10 cursor-pointer flex items-center gap-2.5 group"
                    >
                      <Plus className="w-4 h-4 text-brand-white group-hover:scale-125 transition-transform" /> Add Product
                    </button>
                  </div>
                </div>
              )}

              {/* Offers Page */}
              {activePane === "offers" && (
                <div className="space-y-8 sm:space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-brand-text-primary uppercase tracking-tighter leading-tight">Strategic Marketing</h1>
                      <p className="text-brand-text-secondary text-[9px] font-black uppercase tracking-[0.2em]">Configure seasonal campaigns and high-velocity promotional deals.</p>
                    </div>
                    <button 
                      onClick={() => { setEditingOffer(null); setShowOfferForm(true); }}
                      className="px-6 py-3.5 bg-brand-text-primary text-brand-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all hover:bg-brand-primary shadow-xl shadow-brand-text-primary/10 cursor-pointer flex items-center gap-2.5 group"
                    >
                      <Plus className="w-4 h-4 text-brand-white group-hover:scale-125 transition-transform" /> Add Offer
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                    {offers.map((offer) => (
                      <div key={offer.id} className="bg-brand-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm hover:border-brand-primary/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-bg -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
                        
                        <div className="flex items-center justify-between mb-8 relative z-10">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border ${
                            offer.type === "combo" ? "bg-brand-primary/5 border-brand-primary/10 text-brand-primary" : 
                            offer.type === "limited" ? "bg-warning/5 border-warning/10 text-warning" :
                            offer.type === "clearance" ? "bg-error/5 border-error/10 text-error" :
                            "bg-brand-bg border-brand-border text-brand-text-secondary"
                          }`}>
                            {offer.type === "combo" ? <Layers className="w-6 h-6" /> : <Tag className="w-6 h-6" />}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setEditingOffer(offer); setShowOfferForm(true); }}
                              className="p-2.5 bg-brand-white border border-brand-border text-brand-text-secondary hover:text-brand-primary hover:border-brand-primary/20 rounded-xl transition-all shadow-sm"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => { if(confirm('Delete offer?')) onDeleteOffer(offer.id); }}
                              className="p-2.5 bg-brand-white border border-brand-border text-brand-text-secondary hover:text-error hover:border-error/20 rounded-xl transition-all shadow-sm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-brand-text-primary text-brand-white text-[8px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg shadow-brand-text-primary/10">
                              {offer.type === "limited" ? "Time-Sensitive" : offer.type === "combo" ? "Bundle Deal" : offer.type === "clearance" ? "Final Sale" : "Custom"}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-brand-text-primary font-outfit uppercase tracking-tight group-hover:text-brand-primary transition-colors leading-tight mb-1">{offer.title}</h3>
                            <p className="text-[11px] text-brand-text-secondary font-medium leading-relaxed line-clamp-3 h-[3.5rem]">{offer.description}</p>
                          </div>
                          <div className="pt-6 border-t border-brand-border flex items-end justify-between">
                            <div>
                              <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.15em] mb-1 opacity-60">PROMO VALUATION</p>
                              <p className="text-2xl font-black text-brand-text-primary font-outfit tracking-tighter">₹{offer.offerPrice.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-black text-brand-primary bg-brand-primary/5 px-3 py-1 rounded-lg border border-brand-primary/10 uppercase tracking-widest font-mono">
                                SAVE ₹{(offer.basePrice - offer.offerPrice).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                  {showOfferForm && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-10 bg-[#0F172A]/60 backdrop-blur-md overflow-y-auto">
                      <div className="bg-white rounded-[3rem] w-full max-w-4xl p-8 sm:p-12 relative shadow-2xl">
                        <button 
                          onClick={() => { setShowOfferForm(false); setEditingOffer(null); }}
                          className="absolute top-8 right-8 p-3 bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] rounded-2xl border border-[#E2E8F0] transition-all cursor-pointer"
                        >
                          <X className="w-6 h-6" />
                        </button>
                        <div className="mb-10 text-left">
                          <h2 className="text-3xl font-bold font-outfit text-[#0F172A] uppercase tracking-tighter">
                            {editingOffer ? "Modify Offer" : "Define New Offer"}
                          </h2>
                          <p className="text-sm text-[#64748B] font-inter">Select offer type and configure promotional rules.</p>
                        </div>
                        <OfferForm 
                          products={products}
                          onSave={(o) => {
                            if (editingOffer) onUpdateOffer({ ...o, id: editingOffer.id } as Offer);
                            else onAddOffer(o);
                            setShowOfferForm(false);
                            setEditingOffer(null);
                          }}
                          onCancel={() => { setShowOfferForm(false); setEditingOffer(null); }}
                        />
                      </div>
                    </div>
                  )}

              {/* Orders Dashboard */}
              {activePane === "orders" && (
                <div className="space-y-8 sm:space-y-10">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-brand-text-primary uppercase tracking-tighter leading-tight">Order Logistics</h1>
                      <p className="text-brand-text-secondary text-[9px] font-black uppercase tracking-[0.2em]">Real-time operational tracking and fulfillment control.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-secondary" />
                        <input 
                          type="text" 
                          placeholder="SEARCH TRANSACTION ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-11 pr-5 py-3.5 bg-brand-white border border-brand-border rounded-xl text-[9px] font-black uppercase tracking-[0.15em] text-brand-text-primary focus:outline-none focus:ring-2 ring-brand-primary/10 transition-all w-full sm:w-60 shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6 bg-brand-white p-4 rounded-2xl border border-brand-border shadow-sm">
                    <div className="flex items-center gap-3 border-r border-brand-border pr-6">
                      <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em] whitespace-nowrap">Status:</span>
                      <select 
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="bg-brand-bg border border-brand-border px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none cursor-pointer min-w-[180px]"
                      >
                        <option value="All">Global Overview</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Transit</option>
                        <option value="Delivered">Resolved</option>
                        <option value="Cancelled">Voided</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Start:</span>
                        <input 
                          type="date" 
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="bg-brand-bg border border-brand-border px-3 py-2 rounded-lg text-[10px] font-black text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">End:</span>
                        <input 
                          type="date" 
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="bg-brand-bg border border-brand-border px-3 py-2 rounded-lg text-[10px] font-black text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-white border border-brand-border rounded-2xl overflow-hidden shadow-sm">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-brand-bg border-b border-brand-border">
                            <th className="px-6 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">ID</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Temporal</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Client Entity</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Valuation</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Payment</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Phase</th>
                            <th className="px-6 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em] text-right">Ops</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                          {filteredOrders.map((order) => (
                            <React.Fragment key={order.orderNo}>
                              <tr className="hover:bg-brand-bg/50 transition-all group">
                                <td className="px-6 py-4">
                                  <span className="text-[10px] font-black text-brand-text-primary font-mono bg-brand-white border border-brand-border px-3 py-1.5 rounded-lg shadow-xs">#{order.orderNo.slice(-8)}</span>
                                </td>
                                <td className="px-5 py-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-tight">
                                  {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold text-brand-text-primary uppercase tracking-tight leading-none truncate max-w-[120px]">{order.customerName}</span>
                                    <span className="text-[8px] text-brand-text-secondary font-mono mt-0.5 opacity-60 truncate max-w-[120px]">{order.customerEmail}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <p className="text-xs font-black text-brand-text-primary">₹{order.totalAmount.toLocaleString()}</p>
                                </td>
                                <td className="px-5 py-4">
                                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border ${
                                    order.paymentStatus === "Paid" ? "bg-success/5 text-success border-success/10" : "bg-warning/5 text-warning border-warning/10"
                                  }`}>
                                    {order.paymentStatus}
                                  </span>
                                </td>
                                <td className="px-5 py-4">
                                  <select 
                                    value={order.orderStatus}
                                    onChange={(e) => onUpdateOrderStatus(order.orderNo, e.target.value as any)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border border-brand-border bg-brand-white cursor-pointer focus:ring-2 ring-brand-primary/10 transition-all ${
                                      order.orderStatus === "Delivered" ? "text-success" :
                                      order.orderStatus === "Processing" ? "text-warning" :
                                      order.orderStatus === "Shipped" ? "text-brand-primary" :
                                      "text-error"
                                    }`}
                                  >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={() => setExpandedOrderId(expandedOrderId === order.orderNo ? null : order.orderNo)}
                                    className="p-2.5 bg-brand-white border border-brand-border text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-primary/30 rounded-xl transition-all cursor-pointer shadow-xs"
                                  >
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${expandedOrderId === order.orderNo ? "rotate-180" : ""}`} />
                                  </button>
                                </td>
                              </tr>
                              {expandedOrderId === order.orderNo && (
                                <tr className="bg-brand-bg/30">
                                  <td colSpan={7} className="px-6 py-8 sm:px-8 sm:py-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest border-b border-brand-border pb-2">Manifest Items</h4>
                                        <div className="space-y-3">
                                          {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                              <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-brand-white border border-brand-border flex items-center justify-center font-bold text-[10px] text-brand-text-secondary">
                                                  {item.quantity}x
                                                </div>
                                                <span className="text-[11px] font-bold text-brand-text-primary uppercase tracking-tight">{item.name}</span>
                                              </div>
                                              <span className="text-[11px] font-black text-brand-text-secondary font-mono">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest border-b border-brand-border pb-2">Logistics Profile</h4>
                                        <div className="space-y-2">
                                          <div className="flex items-start gap-3">
                                            <Truck className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                                            <div>
                                              <p className="text-[11px] font-bold text-brand-text-primary leading-tight uppercase">{order.customerName}</p>
                                              <p className="text-[10px] text-brand-text-secondary mt-1 leading-relaxed">{order.customerAddress}</p>
                                              <p className="text-[10px] text-brand-text-secondary mt-0.5 font-bold uppercase tracking-tighter">Contact: {order.customerPhone}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden divide-y divide-brand-border">
                      {filteredOrders.map((order) => (
                        <div key={order.orderNo} className="p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-brand-text-primary font-mono bg-brand-white border border-brand-border px-3 py-1.5 rounded-lg shadow-xs">#{order.orderNo.slice(-8)}</span>
                            <span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-tight">
                              {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-brand-text-primary uppercase tracking-tight leading-none truncate">{order.customerName}</p>
                            <p className="text-[10px] text-brand-text-secondary font-mono truncate">{order.customerEmail}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/50">
                              <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Valuation</p>
                              <p className="text-sm font-black text-brand-text-primary font-mono">₹{order.totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/50">
                              <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Payment</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border ${
                                order.paymentStatus === "Paid" ? "bg-success/5 text-success border-success/10" : "bg-warning/5 text-warning border-warning/10"
                              }`}>
                                {order.paymentStatus}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <select 
                              value={order.orderStatus}
                              onChange={(e) => onUpdateOrderStatus(order.orderNo, e.target.value as any)}
                              className={`flex-1 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border border-brand-border bg-brand-white cursor-pointer focus:ring-2 ring-brand-primary/10 transition-all ${
                                order.orderStatus === "Delivered" ? "text-success" :
                                order.orderStatus === "Processing" ? "text-warning" :
                                order.orderStatus === "Shipped" ? "text-brand-primary" :
                                "text-error"
                              }`}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button 
                              onClick={() => setExpandedOrderId(expandedOrderId === order.orderNo ? null : order.orderNo)}
                              className="p-2.5 bg-brand-white border border-brand-border text-brand-text-secondary rounded-xl shadow-xs"
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${expandedOrderId === order.orderNo ? "rotate-180" : ""}`} />
                            </button>
                          </div>

                          <AnimatePresence>
                            {expandedOrderId === order.orderNo && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pt-4 border-t border-brand-border space-y-4"
                              >
                                <div className="space-y-2">
                                  <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">Manifest Items</p>
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                      <span className="text-[11px] font-bold text-brand-text-primary uppercase tracking-tight">{item.quantity}x {item.name}</span>
                                      <span className="text-[11px] font-black text-brand-text-secondary font-mono">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="space-y-2">
                                  <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">Logistics</p>
                                  <p className="text-[10px] text-brand-text-secondary leading-relaxed">{order.customerAddress}</p>
                                  <p className="text-[10px] font-bold text-brand-text-primary uppercase tracking-tighter">{order.customerPhone}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Customers/Users Management */}
              {activePane === "customers" && (
                <div className="space-y-8 sm:space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-brand-text-primary uppercase tracking-tighter leading-tight">Customer Network</h1>
                      <p className="text-brand-text-secondary text-[9px] font-black uppercase tracking-[0.2em]">Lifecycle management for your global client entity database.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-secondary" />
                        <input 
                          type="text" 
                          placeholder="SEARCH ENTITIES..." 
                          className="w-full sm:w-60 pl-11 pr-6 py-3 bg-brand-white border border-brand-border rounded-xl text-[9px] font-black uppercase tracking-[0.15em] focus:ring-2 ring-brand-primary/10 outline-none transition-all shadow-xs"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-white border border-brand-border rounded-2xl overflow-hidden shadow-sm">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-brand-bg border-b border-brand-border">
                            <th className="px-6 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Entity Identity</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Comms</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Status</th>
                            <th className="px-5 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Investment</th>
                            <th className="px-6 py-4 text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em] text-right">Ops</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                          {allUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((u) => {
                            const userOrders = orders.filter(o => o.customerEmail === u.email);
                            const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                            
                            return (
                              <tr key={u.email} className="hover:bg-brand-bg/50 transition-all group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-text-primary text-brand-white flex items-center justify-center font-bold shadow-sm shrink-0">
                                      {u.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-brand-text-primary tracking-tight leading-tight uppercase line-clamp-1">{u.name}</p>
                                      <p className="text-[9px] text-brand-text-secondary font-mono uppercase mt-0.5 tracking-widest">{u.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <span className="text-[9px] font-black text-brand-text-primary uppercase flex items-center gap-2">
                                    <Phone className="w-3 h-3 opacity-40 text-brand-primary" /> {u.phone || "N/A"}
                                  </span>
                                </td>
                                <td className="px-5 py-4">
                                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] border ${
                                    userOrders.length > 0 ? "bg-success/5 text-success border-success/10" : "bg-brand-bg text-brand-text-secondary border-brand-border"
                                  }`}>
                                    {userOrders.length > 0 ? "Active" : "Idle"}
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <p className="text-xs font-black text-brand-text-primary font-mono">₹{totalSpent.toLocaleString()}</p>
                                  <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest opacity-60">{userOrders.length} Orders</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={() => alert(`Communication link initialized for ${u.name}`)}
                                    className="p-2.5 bg-brand-white border border-brand-border text-brand-text-secondary hover:text-brand-primary hover:border-brand-primary/20 rounded-xl transition-all shadow-sm cursor-pointer"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden divide-y divide-brand-border">
                      {allUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((u) => {
                        const userOrders = orders.filter(o => o.customerEmail === u.email);
                        const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                        
                        return (
                          <div key={u.email} className="p-4 space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-brand-text-primary text-brand-white flex items-center justify-center font-bold shadow-sm shrink-0">
                                {u.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-brand-text-primary tracking-tight leading-tight uppercase truncate">{u.name}</p>
                                <p className="text-[10px] text-brand-text-secondary font-mono truncate">{u.email}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/50">
                                <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Investment</p>
                                <p className="text-sm font-black text-brand-text-primary font-mono">₹{totalSpent.toLocaleString()}</p>
                                <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest opacity-60">{userOrders.length} Orders</p>
                              </div>
                              <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/50">
                                <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Status</p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] border ${
                                  userOrders.length > 0 ? "bg-success/5 text-success border-success/10" : "bg-brand-white text-brand-text-secondary border-brand-border"
                                }`}>
                                  {userOrders.length > 0 ? "Active" : "Idle"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl">
                                <Phone className="w-3.5 h-3.5 text-brand-primary" />
                                <span className="text-[10px] font-black text-brand-text-primary uppercase tracking-widest">{u.phone || "NO COMMS"}</span>
                              </div>
                              <button 
                                onClick={() => alert(`Communication link initialized for ${u.name}`)}
                                className="p-3 bg-brand-white border border-brand-border text-brand-primary rounded-xl shadow-sm"
                              >
                                <MessageCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Reports Section */}
              {activePane === "reports" && (
                <div className="space-y-8 sm:space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-brand-text-primary uppercase tracking-tighter leading-tight">Intelligence Analytics</h1>
                      <p className="text-brand-text-secondary text-[9px] font-black uppercase tracking-[0.2em]">Performance metrics and operational insights for global asset movement.</p>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 bg-brand-white border border-brand-border rounded-xl shadow-sm">
                      {["Today", "Week", "Month", "Year"].map(t => (
                        <button key={t} className="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-bg transition-all cursor-pointer">{t}</button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-brand-text-primary text-brand-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
                      <div className="relative z-10">
                        <p className="text-[9px] font-black text-brand-white/40 uppercase tracking-[0.3em] mb-2">Gross Turnover</p>
                        <h3 className="text-2xl sm:text-3xl font-bold font-outfit mb-2">₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}</h3>
                        <p className="text-[9px] font-black text-success flex items-center gap-1.5">
                          <ArrowUpRight className="w-3.5 h-3.5" /> +12.4% DELTA
                        </p>
                      </div>
                      <Globe className="absolute -bottom-6 -right-6 w-32 h-32 text-brand-white/5 group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                    {[
                      { label: "Aggregate Orders", value: orders.length, icon: Package, color: "text-brand-primary", bg: "bg-brand-primary/5" },
                      { label: "Active Clients", value: new Set(orders.map(o => o.customerEmail)).size, icon: Users, color: "text-warning", bg: "bg-warning/5" },
                      { label: "Delivery Velocity", value: "98.4%", icon: Truck, color: "text-success", bg: "bg-success/5" },
                    ].map((card, i) => (
                      <div key={i} className="bg-brand-white border border-brand-border p-8 rounded-2xl shadow-sm flex flex-col justify-between group hover:border-brand-primary/20 transition-all">
                        <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <card.icon className="w-6 h-6" />
                        </div>
                        <div className="mt-6">
                          <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em] mb-1">{card.label}</p>
                          <h3 className="text-2xl font-bold text-brand-text-primary font-outfit">{card.value}</h3>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
                    <div className="lg:col-span-2 bg-brand-white border border-brand-border p-6 sm:p-8 rounded-3xl shadow-sm">
                      <h3 className="text-base font-bold text-brand-text-primary font-outfit uppercase mb-10 tracking-tight flex items-center gap-3">
                        <div className="w-1 h-6 bg-brand-primary rounded-full" />
                        Operational Velocity
                      </h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E5E8" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#5B6570'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#5B6570'}} />
                            <Tooltip cursor={{fill: '#F2EFE7'}} contentStyle={{ borderRadius: '1rem', border: '1px solid #E2E5E8', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="revenue" fill="#3368A0" radius={[8, 8, 0, 0]} barSize={30} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-brand-white border border-brand-border p-6 sm:p-8 rounded-3xl shadow-sm">
                      <h3 className="text-base font-bold text-brand-text-primary font-outfit uppercase mb-10 tracking-tight flex items-center gap-3">
                        <div className="w-1 h-6 bg-brand-secondary rounded-full" />
                        Segmentation
                      </h3>
                      <div className="h-[240px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={topSellingProducts}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={85}
                              paddingAngle={8}
                              dataKey="count"
                            >
                              {topSellingProducts.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3 pt-8 border-t border-brand-border">
                        {topSellingProducts.map((p, i) => (
                          <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                              <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.15em] group-hover:text-brand-text-primary transition-colors truncate max-w-[120px]">{p.name}</span>
                            </div>
                            <span className="text-[10px] font-black text-brand-text-primary font-mono bg-brand-bg px-2 py-0.5 rounded-md">VOL: {p.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile/Shop Page - Basic Info */}
              {(activePane === "profile" || activePane === "shop") && (
                <div className="max-w-3xl space-y-8 sm:space-y-10">
                  <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-brand-text-primary uppercase tracking-tighter leading-tight">Master Shop Profile</h1>
                    <p className="text-brand-text-secondary text-[9px] font-black uppercase tracking-[0.2em]">Authorize core identifiers and logistical endpoints.</p>
                  </div>

                  <form className="bg-brand-white border border-brand-border p-6 sm:p-10 rounded-2xl shadow-sm space-y-8" 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      onUpdateShopDetails(
                        formData.get("name") as string,
                        formData.get("logo") as string,
                        formData.get("phone") as string,
                        formData.get("address") as string,
                        formData.get("gstin") as string,
                        formData.get("tagline") as string,
                        shopDetails.contact1,
                        shopDetails.contact2
                      );
                      alert("Shop Profile Updated Successfully!");
                    }}>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mb-8 pb-8 border-b border-brand-border">
                      <div className="relative group">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-brand-bg border border-dashed border-brand-border rounded-2xl flex items-center justify-center overflow-hidden transition-all group-hover:border-brand-primary/40 shadow-inner">
                          {shopDetails.logo ? (
                            <img src={shopDetails.logo} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          ) : (
                            <ShoppingBag className="w-10 h-10 text-brand-text-secondary opacity-20" />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-2 bg-brand-primary text-brand-white rounded-lg shadow-xl cursor-pointer hover:scale-110 transition-transform">
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 w-full text-left">
                        <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Logo Asset URL</label>
                        <input name="logo" defaultValue={shopDetails.logo} className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold font-mono text-brand-text-primary focus:ring-2 ring-brand-primary/10 transition-all outline-none" placeholder="URL..." />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Corporate Name</label>
                        <input name="name" defaultValue={shopDetails.name} required className="w-full px-5 py-3.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">GSTIN</label>
                        <input name="gstin" defaultValue={shopDetails.gstin} className="w-full px-5 py-3.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none transition-all" />
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Tagline</label>
                      <input name="tagline" defaultValue={shopDetails.tagline} className="w-full px-5 py-3.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none transition-all" />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Headquarters Address</label>
                      <textarea name="address" defaultValue={shopDetails.address} required className="w-full px-5 py-3.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none transition-all h-24 resize-none" />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Terminal Link (Phone)</label>
                      <input name="phone" defaultValue={shopDetails.phone} required className="w-full px-5 py-3.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none transition-all" />
                    </div>

                    <button type="submit" className="w-full py-4.5 bg-brand-text-primary text-brand-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-brand-primary shadow-2xl shadow-brand-text-primary/10 cursor-pointer">
                      Authorize Profile Update
                    </button>
                  </form>
                </div>
              )}

              {/* Comprehensive Settings Management */}
              {activePane === "settings" && (
                <div className="space-y-8 sm:space-y-10">
                  <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-brand-text-primary uppercase tracking-tighter leading-tight">System Configuration</h1>
                    <p className="text-brand-text-secondary text-[9px] font-black uppercase tracking-[0.2em]">Manage detailed profile, administrators, and storefront experience settings.</p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                    {/* 1. General Profile Section */}
                    <div className="bg-brand-white border border-brand-border p-6 sm:p-8 rounded-2xl shadow-sm space-y-8">
                      <h3 className="text-base font-bold text-brand-text-primary font-outfit uppercase flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-primary/5 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-brand-primary" />
                        </div>
                        General Profile
                      </h3>
                      <form className="space-y-6 text-left" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        onUpdateShopDetails(
                          formData.get("name") as string,
                          formData.get("logo") as string,
                          formData.get("phone") as string,
                          formData.get("address") as string,
                          shopDetails.gstin,
                          shopDetails.tagline,
                          formData.get("contact1") as string,
                          formData.get("contact2") as string
                        );
                        onUpdateSocials(
                          formData.get("instagram") as string,
                          formData.get("whatsapp") as string
                        );
                        alert("General Profile Updated Successfully!");
                      }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Shop Identifier</label>
                            <input name="name" defaultValue={shopDetails.name} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Asset Logo URL</label>
                            <input name="logo" defaultValue={shopDetails.logo} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary font-mono focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Logistics Address</label>
                          <textarea name="address" defaultValue={shopDetails.address} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary h-20 resize-none focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">WhatsApp Bridge</label>
                            <input name="whatsapp" defaultValue={socialLinks.whatsapp} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Instagram Node</label>
                            <input name="instagram" defaultValue={socialLinks.instagram} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Line 1</label>
                            <input name="contact1" defaultValue={shopDetails.contact1} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Line 2</label>
                            <input name="contact2" defaultValue={shopDetails.contact2} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Master Terminal</label>
                            <input name="phone" defaultValue={shopDetails.phone} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5 opacity-60">
                          <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Auth Email (Global)</label>
                          <input defaultValue={currentUser?.email || ""} readOnly className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary cursor-not-allowed" />
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-brand-text-primary text-brand-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-brand-primary transition-all cursor-pointer shadow-xl shadow-brand-text-primary/10">Synchronize Profile</button>
                      </form>
                    </div>

                    {/* 2. Admin Profile Section */}
                    <div className="bg-brand-white border border-brand-border p-6 sm:p-8 rounded-2xl shadow-sm space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-brand-text-primary font-outfit uppercase flex items-center gap-3">
                          <div className="w-8 h-8 bg-success/5 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-success" />
                          </div>
                          Command Access
                        </h3>
                        <button 
                          onClick={() => {
                            const name = prompt("Enter Admin Name:");
                            const email = prompt("Enter Admin Gmail:");
                            if (name && email) onAddAdmin(name, email);
                          }}
                          className="px-4 py-2 bg-brand-primary text-brand-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em] hover:bg-brand-primary/90 cursor-pointer shadow-sm"
                        >
                          + New Admin
                        </button>
                      </div>
                      <div className="space-y-4">
                        {adminsList.map((admin, i) => (
                          <div key={i} className="flex items-center justify-between p-4 sm:p-5 bg-brand-bg border border-brand-border rounded-xl group transition-all hover:border-brand-primary/20">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-brand-white border border-brand-border rounded-lg flex items-center justify-center font-black text-xs text-brand-text-primary shadow-xs">
                                {admin.name.charAt(0)}
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-bold text-brand-text-primary tracking-tight">{admin.name}</p>
                                <p className="text-[9px] text-brand-text-secondary font-mono tracking-widest uppercase mt-0.5 leading-none">{admin.email}</p>
                                <div className="mt-2">
                                  <span className={`px-3 py-0.5 rounded-full text-[7px] font-black uppercase tracking-[0.15em] border ${
                                    admin.status === "Active" ? "bg-success/5 text-success border-success/10" : "bg-warning/5 text-warning border-warning/10"
                                  }`}>
                                    {admin.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {admin.status === "Pending Approval" && (
                                <button 
                                  onClick={() => onApproveAdmin(admin.email)}
                                  className="px-3 py-1.5 bg-success text-brand-white rounded-lg text-[8px] font-black uppercase tracking-[0.15em] hover:bg-success/90 transition-all cursor-pointer shadow-sm"
                                >
                                  Authorize
                                </button>
                              )}
                              {admin.email !== "ironman30771@gmail.com" && (
                                <button 
                                  onClick={() => {
                                    if (confirm(`Remove access for ${admin.name}?`)) onDeleteAdmin(admin.email);
                                  }}
                                  className="p-2 text-brand-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. Home Page Settings Section */}
                  <div className="bg-brand-white border border-brand-border p-6 sm:p-10 rounded-2xl shadow-sm space-y-10 sm:space-y-12">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-brand-text-primary font-outfit uppercase flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-primary/5 rounded-xl flex items-center justify-center">
                          <Home className="w-5 h-5 text-brand-primary" />
                        </div>
                        Storefront Aesthetics
                      </h3>
                      <p className="text-[9px] text-brand-text-secondary font-black uppercase tracking-[0.2em]">Configure hero assets, promotional messaging and priority product grids.</p>
                    </div>
                    
                    <div className="space-y-10 sm:space-y-12">
                      {/* Sub-Section 1: Hero Configuration */}
                      <form className="space-y-6 sm:space-y-8" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        onUpdateHomeContent({
                          ...homeContent,
                          bannerImage: formData.get("bannerImage") as string,
                          featuredHeading: formData.get("featuredHeading") as string,
                          featuredSubheading: formData.get("featuredSubheading") as string,
                        });
                        alert("Hero Configuration Updated!");
                      }}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                          <div className="space-y-6 text-left">
                            <h4 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] border-b border-brand-border pb-2">Hero Asset</h4>
                            <div className="aspect-[21/9] w-full bg-brand-bg border border-brand-border rounded-2xl overflow-hidden relative group shadow-sm">
                              <img src={homeContent.bannerImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Banner Source URL</label>
                              <input name="bannerImage" defaultValue={homeContent.bannerImage} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold font-mono text-brand-text-primary focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                            </div>
                          </div>

                          <div className="space-y-6 text-left">
                            <h4 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] border-b border-brand-border pb-2">Hero Content</h4>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Primary Display Heading</label>
                                <input name="featuredHeading" defaultValue={homeContent.featuredHeading} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Sub-Caption Narrative</label>
                                <textarea name="featuredSubheading" defaultValue={homeContent.featuredSubheading} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary h-24 resize-none focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button type="submit" className="px-6 py-3 bg-brand-text-primary text-brand-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-brand-primary transition-all cursor-pointer shadow-lg">Update Hero</button>
                        </div>
                      </form>

                      {/* Sub-Section 2: Promotional Messaging */}
                      <form className="space-y-6 pt-10 border-t border-brand-border" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        onUpdateHomeContent({
                          ...homeContent,
                          promotionalBanner: formData.get("promotionalBanner") as string,
                          promotionalText: formData.get("promotionalText") as string,
                        });
                        alert("Promotional Messaging Updated!");
                      }}>
                        <div className="space-y-6 text-left">
                          <h4 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] border-b border-brand-border pb-2">Operational Messaging</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Promotion Tag</label>
                              <input name="promotionalBanner" defaultValue={homeContent.promotionalBanner} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Narrative</label>
                              <textarea name="promotionalText" defaultValue={homeContent.promotionalText} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold text-brand-text-primary h-20 resize-none focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button type="submit" className="px-6 py-3 bg-brand-text-primary text-brand-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-brand-primary transition-all cursor-pointer shadow-lg">Update Promotions</button>
                        </div>
                      </form>

                      {/* Sub-Section 3: Featured Matrix */}
                      <div className="pt-10 border-t border-brand-border space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Top Tier Showcase Matrix</h4>
                            <p className="text-[9px] text-brand-text-secondary opacity-50 uppercase font-black">Select 3 priority assets for the global spotlight.</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-[9px] font-black text-brand-primary uppercase tracking-[0.2em]">
                              {localFeaturedIds.length}/3
                            </div>
                            <button 
                              onClick={() => {
                                onUpdateHomeContent({
                                  ...homeContent,
                                  featuredProductIds: localFeaturedIds
                                });
                                alert("Featured Matrix Updated!");
                              }}
                              className="px-6 py-2.5 bg-brand-primary text-brand-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-brand-primary/90 transition-all cursor-pointer shadow-lg"
                            >
                              Save Matrix
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {products.map((p) => {
                            const isSelected = localFeaturedIds.includes(p.id);
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setLocalFeaturedIds(localFeaturedIds.filter(id => id !== p.id));
                                  } else if (localFeaturedIds.length < 3) {
                                    setLocalFeaturedIds([...localFeaturedIds, p.id]);
                                  }
                                }}
                                className={`p-4 border rounded-xl flex items-center gap-3 transition-all text-left group relative ${
                                  isSelected 
                                    ? "bg-brand-text-primary border-brand-text-primary text-brand-white shadow-lg" 
                                    : "bg-brand-bg border-brand-border text-brand-text-primary hover:border-brand-primary/40 shadow-xs"
                                }`}
                              >
                                <div className="relative shrink-0">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-brand-border bg-brand-white p-0.5">
                                    <img src={p.image} className="w-full h-full object-cover rounded-md" />
                                  </div>
                                  {isSelected && (
                                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-primary text-brand-white rounded-full flex items-center justify-center shadow-lg">
                                      <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold uppercase truncate leading-tight mb-0.5">{p.name}</p>
                                  <p className={`text-[8px] font-black uppercase tracking-[0.1em] leading-none ${isSelected ? "text-brand-white/50" : "text-brand-primary"}`}>
                                    {p.category}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer Area */}
        <footer className="h-12 sm:h-14 bg-brand-white border-t border-brand-border flex items-center justify-between px-6 sm:px-10 shrink-0">
          <div className="text-[8px] font-bold text-brand-text-secondary uppercase tracking-[0.15em]">
            Global Operations Portal &copy; {new Date().getFullYear()}
          </div>
          <div className="hidden sm:flex text-[8px] font-black text-brand-text-primary uppercase tracking-[0.15em] items-center gap-2">
            Designed by <span className="text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded-lg">parasu raman</span>
          </div>
        </footer>
      </div>

      {/* Modals Overlay (Common Layer) */}
      <AnimatePresence>
        {/* Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-brand-text-primary/60 backdrop-blur-lg overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-brand-white rounded-3xl w-full max-w-2xl p-6 sm:p-10 relative shadow-2xl my-8 border border-brand-border"
            >
              <button 
                onClick={() => { setShowAddProductModal(false); setEditingProduct(null); }}
                className="absolute top-6 right-6 p-2.5 bg-brand-bg text-brand-text-secondary hover:text-brand-text-primary rounded-xl border border-brand-border transition-all cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="mb-8 text-left space-y-1">
                <h2 className="text-2xl sm:text-3xl font-bold font-outfit text-brand-text-primary uppercase tracking-tighter leading-tight">{editingProduct ? "Modify Asset" : "Register New Asset"}</h2>
                <p className="text-[9px] text-brand-text-secondary font-black uppercase tracking-[0.2em]">Configure specifications and operational logistics.</p>
              </div>
              <form className="space-y-6 text-left" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const product: Product = {
                  id: editingProduct?.id || `PROD-${Date.now().toString().slice(-6)}`,
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  category: formData.get("category") as string,
                  price: parseFloat(formData.get("price") as string),
                  purchasePrice: parseFloat(formData.get("purchasePrice") as string),
                  gst: parseFloat(formData.get("gst") as string),
                  qty: parseInt(formData.get("qty") as string),
                  image: formData.get("image") as string || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
                };
                if (editingProduct) onUpdateProduct(product);
                else onAddProduct(product);
                setShowAddProductModal(false);
                setEditingProduct(null);
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5 opacity-60">
                    <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Unique Descriptor (Locked)</label>
                    <input readOnly value={editingProduct?.id || `PROD-${Date.now().toString().slice(-6)}`} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold font-mono cursor-not-allowed text-brand-text-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Domain (Category)</label>
                    <select name="category" defaultValue={editingProduct?.category} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-bold cursor-pointer focus:ring-2 ring-brand-primary/10 outline-none text-brand-text-primary">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Hardware Designation (Name)</label>
                  <input name="name" defaultValue={editingProduct?.name} required className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Asset Source (Image URL)</label>
                  <input name="image" defaultValue={editingProduct?.image} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold font-mono text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Buy In</label>
                    <input name="purchasePrice" type="number" defaultValue={editingProduct?.purchasePrice} required className="w-full px-3 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-black font-mono text-brand-text-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Tax (%)</label>
                    <input name="gst" type="number" defaultValue={editingProduct?.gst || 18} required className="w-full px-3 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-black font-mono text-brand-text-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Sell Out</label>
                    <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full px-3 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-black font-mono text-brand-text-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Vol</label>
                    <input name="qty" type="number" defaultValue={editingProduct?.qty} required className="w-full px-3 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-black font-mono text-brand-text-primary" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Narrative (Description)</label>
                  <textarea name="description" defaultValue={editingProduct?.description} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs font-bold text-brand-text-primary h-20 resize-none focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="submit" className="flex-1 py-4 bg-brand-text-primary text-brand-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-brand-primary shadow-xl shadow-brand-text-primary/10 cursor-pointer">Authorize</button>
                  <button type="button" onClick={() => { setShowAddProductModal(false); setEditingProduct(null); }} className="px-8 py-4 bg-brand-bg text-brand-text-secondary rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-border transition-all cursor-pointer">Discard</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-brand-text-primary/60 backdrop-blur-lg">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-brand-white rounded-2xl w-full max-w-sm p-8 relative shadow-2xl border border-brand-border"
            >
              <h2 className="text-xl font-bold font-outfit text-brand-text-primary uppercase tracking-tighter mb-8 leading-tight">Define Logistics Domain</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const name = (e.currentTarget.elements.namedItem("catName") as HTMLInputElement).value;
                onAddCategory(name);
                setShowCategoryModal(false);
              }}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Category Specification</label>
                    <input name="catName" required className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 transition-all outline-none" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 py-3.5 bg-brand-primary text-brand-white rounded-lg font-black text-[9px] uppercase tracking-[0.2em] hover:bg-brand-primary/90 transition-all cursor-pointer shadow-lg">Authorize</button>
                    <button type="button" onClick={() => setShowCategoryModal(false)} className="px-5 py-3.5 bg-brand-bg text-brand-text-secondary rounded-lg font-black text-[9px] uppercase tracking-[0.2em] hover:bg-brand-border transition-all cursor-pointer">Discard</button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
