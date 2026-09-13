import React, { useState } from "react";
import { UserProfile, Order } from "../types";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  History, 
  ShieldCheck, 
  FileText, 
  Info, 
  Camera,
  ChevronRight,
  LogOut,
  Save,
  Truck,
  Zap,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "./Skeleton";

interface CustomerSettingsViewProps {
  currentUser: UserProfile | null;
  orders: Order[];
  isLoading?: boolean;
  activeSection: SettingsSection;
  onNavigate: (section: SettingsSection) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

type SettingsSection = "menu" | "profile" | "orders" | "terms" | "privacy" | "about";

export default function CustomerSettingsView({ 
  currentUser, 
  orders, 
  isLoading,
  activeSection: propActiveSection,
  onNavigate,
  onUpdateProfile, 
  onLogout 
}: CustomerSettingsViewProps) {
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in px-4 pb-20">
        <div className="space-y-4">
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} height={20} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton height={150} className="rounded-[2.5rem]" />
          <Skeleton height={150} className="rounded-[2.5rem]" />
          <Skeleton height={150} className="rounded-[2.5rem]" />
          <Skeleton height={150} className="rounded-[2.5rem]" />
        </div>
      </div>
    );
  }
  // Use prop if provided, default to menu
  const activeSection = propActiveSection || "menu";

  // Local state for profile form
  const [formData, setFormData] = useState<UserProfile>(currentUser || {
    name: "",
    email: "",
    phone: "",
    address: "",
    firstName: "",
    lastName: "",
    phone2: "",
    shippingAddress: "",
    profilePhoto: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...formData,
      name: `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || formData.name
    });
    alert("Profile updated successfully!");
  };

  const userOrders = orders.filter(o => o.customerEmail === currentUser?.email);

  const menuItems = [
    { id: "profile", label: "Profile Details", icon: User, desc: "Manage your identity and logistics endpoints" },
    { id: "orders", label: "Order History", icon: History, desc: "Review your past hardware acquisitions" },
    { id: "terms", label: "Terms & Conditions", icon: ShieldCheck, desc: "Operational agreements and service protocols" },
    { id: "privacy", label: "Privacy Policy", icon: FileText, desc: "Data protection and privacy guidelines" },
    { id: "about", label: "About Us", icon: Info, desc: "Our origin and engineering philosophy" },
  ];

  // 1. Settings Menu (Initial Page)
  if (activeSection === "menu") {
    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in px-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-outfit text-brand-text-primary uppercase tracking-tighter leading-tight">User Settings</h1>
          <p className="text-[11px] text-brand-text-secondary uppercase tracking-[0.3em] font-black">Configure your personalized environment parameters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className="flex items-center gap-6 p-8 bg-brand-white border border-brand-border rounded-[2.5rem] hover:border-brand-primary/20 transition-all shadow-sm hover:shadow-xl group text-left"
            >
              <div className="w-14 h-14 bg-brand-bg rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-brand-text-primary group-hover:text-brand-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-brand-text-primary uppercase tracking-tight">{item.label}</h3>
                <p className="text-[10px] text-brand-text-secondary font-medium uppercase tracking-widest leading-tight">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-text-secondary ml-auto opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>

        {currentUser && (
          <div className="pt-10">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-4 px-8 py-6 rounded-[2rem] bg-error/5 text-error font-black text-[10px] uppercase tracking-[0.3em] border border-error/10 hover:bg-error/10 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Terminate Active Session</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. Individual Pages Header
  const currentItem = menuItems.find(i => i.id === activeSection);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in px-4">
      {/* Back to Menu */}
      <button 
        onClick={() => onNavigate("menu")}
        className="inline-flex items-center gap-2 text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.3em] hover:text-brand-primary transition-colors group mb-4"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span>Return to Settings Index</span>
      </button>

      <div className="bg-brand-white border border-brand-border rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl shadow-brand-text-primary/5 min-h-[600px]">
        <main className="p-5 sm:p-12 lg:p-16">
          <AnimatePresence mode="wait">
          {activeSection === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 sm:space-y-12"
            >
              <div className="space-y-1 sm:space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-primary font-outfit uppercase tracking-tighter leading-tight">Identity Protocols</h2>
                <p className="text-[9px] sm:text-[11px] text-brand-text-secondary uppercase tracking-[0.3em] font-black">Configure your operational parameters.</p>
              </div>

              <form onSubmit={handleSave} className="space-y-8 sm:space-y-10">
                {/* Photo Upload Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 p-6 sm:p-10 bg-brand-bg border border-brand-border rounded-[2rem] sm:rounded-[3rem] shadow-inner">
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] sm:rounded-[2rem] bg-brand-white border border-brand-border flex items-center justify-center overflow-hidden shadow-sm">
                      {formData.profilePhoto ? (
                        <img src={formData.profilePhoto} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-brand-text-secondary opacity-30" />
                      )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-brand-text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-[1.5rem] sm:rounded-[2rem] backdrop-blur-sm">
                      <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-brand-white" />
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-brand-text-primary uppercase tracking-tight">Identity Visual Asset</h4>
                    <p className="text-[8px] sm:text-[10px] text-brand-text-secondary uppercase font-black tracking-[0.2em]">Update your account node.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[8px] sm:text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.3em] ml-2">Given Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 h-5 text-brand-text-secondary group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-12 sm:pl-16 pr-5 sm:pr-6 py-4 sm:py-5 bg-brand-bg border border-brand-border rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none transition-all" 
                        placeholder="GIVEN NAME"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] sm:text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.3em] ml-2">Surname</label>
                    <div className="relative group">
                      <User className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 h-5 text-brand-text-secondary group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-12 sm:pl-16 pr-5 sm:pr-6 py-4 sm:py-5 bg-brand-bg border border-brand-border rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none transition-all" 
                        placeholder="SURNAME"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[8px] sm:text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.3em] ml-2">Primary Phone</label>
                    <div className="relative group">
                      <Phone className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 h-5 text-brand-text-secondary group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 sm:pl-16 pr-5 sm:pr-6 py-4 sm:py-5 bg-brand-bg border border-brand-border rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none transition-all" 
                        placeholder="+91 00000 00000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] sm:text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.3em] ml-2">Secondary Phone</label>
                    <div className="relative group">
                      <Phone className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 h-5 text-brand-text-secondary group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        name="phone2"
                        value={formData.phone2}
                        onChange={handleInputChange}
                        className="w-full pl-12 sm:pl-16 pr-5 sm:pr-6 py-4 sm:py-5 bg-brand-bg border border-brand-border rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold text-brand-text-primary focus:ring-2 ring-brand-primary/10 outline-none transition-all" 
                        placeholder="+91 00000 00000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] sm:text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.3em] ml-2">Email Identity</label>
                  <div className="relative opacity-60">
                    <Mail className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 h-5 text-brand-text-secondary" />
                    <input 
                      value={formData.email}
                      readOnly
                      className="w-full pl-12 sm:pl-16 pr-5 sm:pr-6 py-4 sm:py-5 bg-brand-border/30 border border-brand-border rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold text-brand-text-primary cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] sm:text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.3em] ml-2">Base Headquarters</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 sm:left-6 top-5 sm:top-6 w-4 h-4 sm:w-5 h-5 text-brand-text-secondary group-focus-within:text-brand-primary transition-colors" />
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-12 sm:pl-16 pr-5 sm:pr-6 py-4 sm:py-6 bg-brand-bg border border-brand-border rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold text-brand-text-primary min-h-[80px] sm:min-h-[100px] focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all resize-none" 
                      placeholder="FULL ADDRESS"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] sm:text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.3em] ml-2">Logistical Endpoint</label>
                  <div className="relative group">
                    <Truck className="absolute left-5 sm:left-6 top-5 sm:top-6 w-4 h-4 sm:w-5 h-5 text-brand-text-secondary group-focus-within:text-brand-primary transition-colors" />
                    <textarea 
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      className="w-full pl-12 sm:pl-16 pr-5 sm:pr-6 py-4 sm:py-6 bg-brand-bg border border-brand-border rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold text-brand-text-primary min-h-[80px] sm:min-h-[100px] focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all resize-none" 
                      placeholder="SHIPPING TARGET"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 sm:py-6 bg-brand-text-primary text-brand-white rounded-[2rem] sm:rounded-[2.5rem] font-black text-[10px] sm:text-[11px] uppercase tracking-[0.4em] hover:bg-brand-primary transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand-text-primary/20 active:scale-95 group"
                >
                  <Save className="w-4 h-4 sm:w-5 h-5 group-hover:scale-110 transition-transform" />
                  Authorize Identity Update
                </button>
              </form>
            </motion.div>
          )}

          {activeSection === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-brand-text-primary font-outfit uppercase tracking-tighter leading-tight">Acquisition History</h2>
                <p className="text-[11px] text-brand-text-secondary uppercase tracking-[0.3em] font-black">Track and monitor your historical hardware acquisitions.</p>
              </div>

              {userOrders.length > 0 ? (
                <div className="space-y-6">
                  {userOrders.map((order) => (
                    <div key={order.orderNo} className="bg-brand-bg border border-brand-border rounded-[2.5rem] p-8 hover:border-brand-primary/20 transition-all group">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.25em]">PROTOCOL ID: {order.orderNo}</p>
                          <h4 className="text-xl font-bold text-brand-text-primary font-outfit uppercase tracking-tight group-hover:text-brand-primary transition-colors">{order.items.length} Modules Deployed</h4>
                          <div className="flex items-center gap-3">
                            <Clock className="w-3 h-3 text-brand-text-secondary" />
                            <p className="text-[10px] text-brand-text-secondary uppercase font-black tracking-widest">{order.date}</p>
                          </div>
                        </div>
                        <div className="flex flex-col md:items-end justify-between gap-4">
                          <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] inline-block shadow-sm ${
                            order.orderStatus === "Delivered" ? "bg-success/5 text-success border border-success/10" :
                            order.orderStatus === "Cancelled" || order.orderStatus === "Customer Cancelled" ? "bg-error/5 text-error border border-error/10" :
                            "bg-warning/5 text-warning border border-warning/10"
                          }`}>
                            {order.orderStatus}
                          </span>
                          <p className="text-2xl font-black text-brand-text-primary font-outfit tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center space-y-6 bg-brand-bg rounded-[4rem] border border-dashed border-brand-border shadow-inner">
                  <div className="w-20 h-20 bg-brand-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                    <History className="w-10 h-10 text-brand-text-secondary opacity-20" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-brand-text-primary uppercase tracking-tight">Zero Acquisitions Found</p>
                    <p className="text-[10px] text-brand-text-secondary uppercase font-black tracking-[0.2em]">Initiate a module acquisition to populate this protocol.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === "terms" && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-brand-text-primary font-outfit uppercase tracking-tighter leading-tight">Legal Framework</h2>
                <p className="text-[11px] text-brand-text-secondary uppercase tracking-[0.3em] font-black">Authorized operational agreements and service protocols.</p>
              </div>
              <div className="space-y-10">
                {[
                  { title: "1. Operational Consent", content: "By accessing or using our services, you agree to be bound by these protocols. If you do not agree to all terms, terminate your session immediately." },
                  { title: "2. Identity Integrity", content: "You are responsible for safeguarding your access credentials and for any activities or actions initiated under your identity node." },
                  { title: "3. Logistics Policy", content: "All module acquisitions are subject to availability and confirmation. We reserve the right to terminate any acquisition for operational reasons." }
                ].map((section, idx) => (
                  <div key={idx} className="space-y-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-[10px] font-black text-brand-primary uppercase">0{idx + 1}</div>
                      <h3 className="font-bold text-brand-text-primary uppercase text-sm tracking-tight">{section.title}</h3>
                    </div>
                    <p className="text-[12px] leading-relaxed text-brand-text-secondary font-medium pl-12 border-l-2 border-brand-bg group-hover:border-brand-primary/20 transition-all">{section.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "privacy" && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-brand-text-primary font-outfit uppercase tracking-tighter leading-tight">Data Protocols</h2>
                <p className="text-[11px] text-brand-text-secondary uppercase tracking-[0.3em] font-black">How we secure and process your operational data nodes.</p>
              </div>
              <div className="space-y-10">
                {[
                  { title: "Node Collection", content: "We collect information you provide directly when you create a profile, execute an acquisition, or establish communications." },
                  { title: "Protocol Usage", content: "We utilize collected data to maintain, secure, and optimize your experience, and to fulfill logistical acquisition targets." },
                  { title: "Security Matrix", content: "We implement advanced encryption measures to protect your data nodes from unauthorized access or protocol breaches." }
                ].map((section, idx) => (
                  <div key={idx} className="space-y-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-[10px] font-black text-brand-primary uppercase">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-brand-text-primary uppercase text-sm tracking-tight">{section.title}</h3>
                    </div>
                    <p className="text-[12px] leading-relaxed text-brand-text-secondary font-medium pl-12 border-l-2 border-brand-bg group-hover:border-brand-primary/20 transition-all">{section.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-brand-text-primary font-outfit uppercase tracking-tighter leading-tight">Brand Origin</h2>
                <p className="text-[11px] text-brand-text-secondary uppercase tracking-[0.3em] font-black">The vision behind our high-fidelity hardware marketplace.</p>
              </div>
              <div className="space-y-10">
                <div className="p-12 bg-brand-text-primary text-brand-white rounded-[3.5rem] shadow-2xl shadow-brand-text-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 -mr-32 -mt-32 rounded-full transition-transform duration-1000 group-hover:scale-150" />
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-bold font-outfit uppercase tracking-tight">ENGINEERING EXCELLENCE</h3>
                    <p className="text-sm font-inter leading-relaxed text-brand-white/70">
                      developed and designed by parasu raman is dedicated to providing high-performance cognitive environment gear. 
                      We believe that the tools you use directly impact the quality of your output. 
                      Every product in our catalog is hand-picked for its durability, design, and utility.
                    </p>
                    <div className="pt-6 border-t border-brand-white/10 flex items-center gap-6">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-text-primary bg-brand-bg overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">JOIN 10K+ OPERATORS</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-10 bg-brand-bg border border-brand-border rounded-[2.5rem] group hover:border-brand-primary/20 transition-all">
                    <Zap className="w-10 h-10 text-brand-primary mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-text-primary mb-2">High-Velocity Logistics</h4>
                    <p className="text-[10px] text-brand-text-secondary uppercase font-bold tracking-tight">Standard 3-5 days delivery matrix.</p>
                  </div>
                  <div className="p-10 bg-brand-bg border border-brand-border rounded-[2.5rem] group hover:border-brand-primary/20 transition-all">
                    <ShieldCheck className="w-10 h-10 text-brand-primary mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-text-primary mb-2">Encrypted Acquisition</h4>
                    <p className="text-[10px] text-brand-text-secondary uppercase font-bold tracking-tight">Secure checkout protocols enabled.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </div>
    </div>
  );
}

