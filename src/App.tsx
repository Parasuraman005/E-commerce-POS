import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  ShoppingBag, 
  LogIn, 
  LogOut, 
  ShoppingCart, 
  User, 
  Sparkles, 
  Layers, 
  Tag, 
  Clock, 
  LayoutDashboard,
  ShieldCheck,
  Lock,
  Home,
  Settings,
  Heart
} from "lucide-react";

import { Product, CartItem, Order, UserProfile, Offer, HomeContent } from "./types";
import { INITIAL_PRODUCTS, INITIAL_OFFERS } from "./data";

// Subpages
import Splash from "./components/Splash";
import CustomerLoginModal from "./components/CustomerLoginModal";
import HomeView from "./components/HomeView";
import ProductsView from "./components/ProductsView";
import OffersView from "./components/OffersView";
import OrdersView from "./components/OrdersView";
import CartView from "./components/CartView";
import WishlistView from "./components/WishlistView";
import AdminView from "./components/AdminView";
import PrintView from "./components/PrintView";
import CustomerSettingsView from "./components/CustomerSettingsView";
import ProductDetailsView from "./components/ProductDetailsView";
import { NotFoundView, OfflineView } from "./components/ErrorViews";
import SEO from "./components/SEO";

export default function App() {
  // 1. Core States
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<"home" | "products" | "offers" | "orders" | "cart" | "admin" | "settings" | "profile" | "terms" | "privacy" | "about" | "details" | "wishlist" | "error404">("home");
  const [prevTab, setPrevTab] = useState<string>("home");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigate = (tab: any) => {
    setIsNavigating(true);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setIsNavigating(false), 600);
  };
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCustomerLogin, setShowCustomerLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Print Desk States
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [printOrdersList, setPrintOrdersList] = useState<Order[]>([]);
  const [printType, setPrintType] = useState<"label" | "both" | "invoice">("both");
  
  // Storage synced states
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("pa_categories");
    return saved ? JSON.parse(saved) : ["Electronics", "Fashion", "Home", "Accessories"];
  });

  const [homeContent, setHomeContent] = useState<HomeContent>(() => {
    const saved = localStorage.getItem("pa_home_content");
    return saved ? JSON.parse(saved) : {
      bannerImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
      featuredHeading: "PREMIUM SELECTION",
      featuredSubheading: "Curated hardware for high-performance cognitive environments.",
      promotionalBanner: "",
      promotionalText: "",
      featuredProductIds: []
    };
  });

  // Shop Brand and Profile Custom States
  const [shopName, setShopName] = useState<string>(() => {
    return localStorage.getItem("p_shop_name") || "SHOPHUB";
  });
  const [shopLogo, setShopLogo] = useState<string>(() => {
    return localStorage.getItem("p_shop_logo") || "";
  });
  const [shopTagline, setShopTagline] = useState<string>(() => {
    return localStorage.getItem("p_shop_tagline") || "CURATED ARCHITECTURE • MAXIMUM COGNITION";
  });
  const [gstNum, setGstNum] = useState<string>(() => {
    return localStorage.getItem("p_shop_gstin") || "22AAAAA0000A1Z5";
  });
  const [shopPhone, setShopPhone] = useState<string>(() => {
    return localStorage.getItem("p_shop_phone") || "+91 9876543210";
  });
  const [shopContact1, setShopContact1] = useState<string>(() => {
    return localStorage.getItem("p_shop_contact1") || "";
  });
  const [shopContact2, setShopContact2] = useState<string>(() => {
    return localStorage.getItem("p_shop_contact2") || "";
  });
  const [shopAddress, setShopAddress] = useState<string>(() => {
    return localStorage.getItem("p_shop_address") || "123, Dynamic Commerce Plaza, Mumbai";
  });
  const [socialInstagram, setSocialInstagram] = useState<string>(() => {
    return localStorage.getItem("p_social_instagram") || "https://instagram.com";
  });
  const [socialWhatsapp, setSocialWhatsapp] = useState<string>(() => {
    return localStorage.getItem("p_social_whatsapp") || "+919876543210";
  });

  // UPI Payment Details
  const [upiNumber, setUpiNumber] = useState<string>(() => {
    return localStorage.getItem("p_upi_number") || "9876543210";
  });
  const [upiHolderName, setUpiHolderName] = useState<string>(() => {
    return localStorage.getItem("p_upi_holder_name") || "Tony Stark";
  });
  const [upiId, setUpiId] = useState<string>(() => {
    return localStorage.getItem("p_upi_id") || "tonystark@okaxis";
  });
  const [upiQrCode, setUpiQrCode] = useState<string>(() => {
    return localStorage.getItem("p_upi_qr_code") || "";
  });

  // Admin access lists
  const [adminsList, setAdminsList] = useState<{ name: string; email: string; status: "Active" | "Pending Approval" }[]>(() => {
    const saved = localStorage.getItem("pa_admins");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default fallback
      }
    }
    return [
      { name: "Tony Stark", email: "ironman30771@gmail.com", status: "Active" }
    ];
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  // 2. Initialize from localStorage
  useEffect(() => {
    // Helper to sync from local storage
    const syncState = () => {
      // Products Catalyst Load
      const storedProds = localStorage.getItem("pa_products");
      if (storedProds) {
        setProducts(JSON.parse(storedProds));
      } else {
        const initial = INITIAL_PRODUCTS.map(p => ({
          ...p,
          purchasePrice: p.purchasePrice || Math.round(p.price * 0.6 * 100) / 100,
          qty: 15,
          gst: 18
        }));
        setProducts(initial);
        localStorage.setItem("pa_products", JSON.stringify(initial));
      }

      // Offers Catalyst Load
      const storedOffers = localStorage.getItem("pa_offers_catalog");
      if (storedOffers) {
        setOffers(JSON.parse(storedOffers));
      } else {
        setOffers(INITIAL_OFFERS);
        localStorage.setItem("pa_offers_catalog", JSON.stringify(INITIAL_OFFERS));
      }

      // Cart Load
      const storedCart = localStorage.getItem("pa_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      // Wishlist Load
      const storedWishlist = localStorage.getItem("pa_wishlist");
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }

      // User Profile Load
      const storedUser = localStorage.getItem("pa_current_user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      // All Users Load
      const storedAllUsers = localStorage.getItem("pa_all_users");
      if (storedAllUsers) {
        setAllUsers(JSON.parse(storedAllUsers));
      }

      // Orders Load
      const storedOrders = localStorage.getItem("pa_orders");
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      // Home Content Load
      const savedHome = localStorage.getItem("pa_home_content");
      if (savedHome) {
        setHomeContent(JSON.parse(savedHome));
      }
    };

    syncState();

    // Multi-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("pa_") || e.key?.startsWith("p_")) {
        syncState();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Track tab history
    const prev = localStorage.getItem("pa_prev_tab");
    if (prev) setPrevTab(prev);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "error404") {
      localStorage.setItem("pa_prev_tab", activeTab);
      setPrevTab(activeTab);
    }
  }, [activeTab]);

  // 3. User & Authentication Logic
  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    localStorage.setItem("pa_current_user", JSON.stringify(profile));
    
    // Track all registered users for Admin interconnection
    const storedAllUsers = localStorage.getItem("pa_all_users");
    let usersList: UserProfile[] = storedAllUsers ? JSON.parse(storedAllUsers) : [];
    
    const existingIndex = usersList.findIndex(u => u.email === profile.email);
    if (existingIndex > -1) {
      usersList[existingIndex] = profile;
    } else {
      usersList.push(profile);
    }
    
    setAllUsers(usersList);
    localStorage.setItem("pa_all_users", JSON.stringify(usersList));

    // Route logged in session to products and hide home
    handleNavigate("products");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("pa_current_user");
    if (activeTab === "admin" || activeTab === "error404") {
      handleNavigate("products");
    }
  };

  const handleGoBack = () => {
    handleNavigate(prevTab as any);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setCurrentUser(newProfile);
    localStorage.setItem("pa_current_user", JSON.stringify(newProfile));
  };

  // 4. Cart State operations
  const handleAddToCart = (product: Product) => {
    const existingIndex = cart.findIndex((item) => item.productId === product.id);
    let updatedCart: CartItem[] = [];

    if (existingIndex > -1) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { id: `${Date.now()}-${product.id}`, productId: product.id, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("pa_cart", JSON.stringify(updatedCart));
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("pa_cart", JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem("pa_cart", JSON.stringify(updatedCart));
  };

  // Wishlist Actions
  const handleToggleWishlist = (productId: string) => {
    let updatedWishlist: string[] = [];
    if (wishlist.includes(productId)) {
      updatedWishlist = wishlist.filter(id => id !== productId);
    } else {
      updatedWishlist = [...wishlist, productId];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("pa_wishlist", JSON.stringify(updatedWishlist));
  };

  // 5. Order Actions & Checkouts
  const handleCancelOrder = (orderNo: string, reason: string, feedback: string) => {
    const updatedOrders = orders.map((o) =>
      o.orderNo === orderNo ? { ...o, orderStatus: "Customer Cancelled" as const, cancellationReason: reason, cancellationFeedback: feedback } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem("pa_orders", JSON.stringify(updatedOrders));
  };

  const handleCompleteCheckout = (paymentStatus: "Paid" | "Pending" | "Unpaid" = "Paid") => {
    if (!currentUser) return;

    // Build historical snapshots
    const orderItems = cart.map((cartItem) => {
      let prod = products.find((p) => p.id === cartItem.productId);
      if (!prod && cartItem.productId.startsWith("offer-bundle-")) {
        const offerId = cartItem.productId.replace("offer-bundle-", "");
        const offer = offers.find(o => o.id === offerId);
        if (offer) {
          const offerProds = products.filter(p => offer.productIds?.includes(p.id));
          const overallAmount = offer.offerPrice || offerProds.reduce((sum, p) => sum + p.price, 0);
          prod = {
            id: cartItem.productId,
            name: `🎁 [Bundle] ${offer.title}`,
            description: offer.description,
            price: overallAmount,
            image: offerProds[0]?.image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=500&q=80",
            category: "Offer Bundles",
            qty: 1
          };
        }
      }
      if (!prod) {
        prod = {
          id: cartItem.productId,
          name: "Unknown Item Bundle",
          description: "",
          price: 99,
          image: "",
          category: ""
        };
      }
      return {
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: cartItem.quantity,
        image: prod.image
      };
    });

    const subtotal = orderItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

    const newOrder: Order = {
      orderNo: `ORD-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 90) + 10}`,
      customerName: currentUser.name || "Stark Guest",
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone || "+1 (555) 000-0000",
      customerAddress: currentUser.address || "Malibu Gate, CA",
      items: orderItems,
      totalAmount: subtotal,
      paymentStatus: paymentStatus,
      orderStatus: "Processing",
      date: new Date().toISOString().split("T")[0]
    };

    // Save & Clear
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("pa_orders", JSON.stringify(updatedOrders));

    setCart([]);
    localStorage.removeItem("pa_cart");

    // Route to Order Page immediately
    handleNavigate("orders");
  };

  // 6. Admin Actions (Requires email = ironman30771@gmail.com or listed in custom admins)
  const isAdmin = currentUser && (
    currentUser.email.toLowerCase().trim() === "ironman30771@gmail.com" || 
    currentUser.email.toLowerCase().trim() === "ironman30771@gmail" ||
    adminsList.some(admin => admin.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
  );

  const handleUpdateShopDetails = (name: string, logo: string, phone: string, address: string, gstin: string, tagline: string, contact1?: string, contact2?: string) => {
    setShopName(name);
    setShopLogo(logo);
    setShopPhone(phone);
    setShopAddress(address);
    setGstNum(gstin);
    setShopTagline(tagline);
    if (contact1 !== undefined) setShopContact1(contact1);
    if (contact2 !== undefined) setShopContact2(contact2);

    localStorage.setItem("p_shop_name", name);
    localStorage.setItem("p_shop_logo", logo);
    localStorage.setItem("p_shop_phone", phone);
    localStorage.setItem("p_shop_address", address);
    localStorage.setItem("p_shop_gstin", gstin);
    localStorage.setItem("p_shop_tagline", tagline);
    if (contact1 !== undefined) localStorage.setItem("p_shop_contact1", contact1);
    if (contact2 !== undefined) localStorage.setItem("p_shop_contact2", contact2);
  };

  const handleUpdateSocials = (instagram: string, whatsapp: string) => {
    setSocialInstagram(instagram);
    setSocialWhatsapp(whatsapp);
    localStorage.setItem("p_social_instagram", instagram);
    localStorage.setItem("p_social_whatsapp", whatsapp);
  };

  const handleUpdatePayment = (number: string, holder: string, upi: string, qr: string) => {
    setUpiNumber(number);
    setUpiHolderName(holder);
    setUpiId(upi);
    setUpiQrCode(qr);
    localStorage.setItem("p_upi_number", number);
    localStorage.setItem("p_upi_holder_name", holder);
    localStorage.setItem("p_upi_id", upi);
    localStorage.setItem("p_upi_qr_code", qr);
  };

  const handleAddAdmin = (name: string, email: string) => {
    const emailLower = email.toLowerCase().trim();
    if (adminsList.some(a => a.email.toLowerCase().trim() === emailLower)) {
      return;
    }
    const updated = [...adminsList, { name, email: emailLower, status: "Pending Approval" as const }];
    setAdminsList(updated);
    localStorage.setItem("pa_admins", JSON.stringify(updated));
  };

  const handleApproveAdmin = (email: string) => {
    const updated = adminsList.map(a => a.email.toLowerCase().trim() === email.toLowerCase().trim() ? { ...a, status: "Active" as const } : a);
    setAdminsList(updated);
    localStorage.setItem("pa_admins", JSON.stringify(updated));
  };

  const handleDeleteAdmin = (email: string) => {
    const emailLower = email.toLowerCase().trim();
    if (emailLower === "ironman30771@gmail.com" || emailLower === "ironman30771@gmail") {
      return; // prevent deleting root operator
    }
    const updated = adminsList.filter(a => a.email.toLowerCase().trim() !== emailLower);
    setAdminsList(updated);
    localStorage.setItem("pa_admins", JSON.stringify(updated));
  };

  const handleAdminAddProduct = (newProd: Product) => {
    const updatedProds = [newProd, ...products];
    setProducts(updatedProds);
    localStorage.setItem("pa_products", JSON.stringify(updatedProds));
  };

  const handleAdminDeleteProduct = (id: string) => {
    const updatedProds = products.filter((p) => p.id !== id);
    setProducts(updatedProds);
    localStorage.setItem("pa_products", JSON.stringify(updatedProds));
  };

  const handleAdminUpdateProduct = (updatedProd: Product) => {
    const updated = products.map((p) => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    localStorage.setItem("pa_products", JSON.stringify(updated));
  };

  const handleAdminUpdateOffers = (updatedOffers: Offer[]) => {
    setOffers(updatedOffers);
    localStorage.setItem("pa_offers_catalog", JSON.stringify(updatedOffers));
  };

  const handleAdminUpdateOrderStatus = (orderNo: string, newStatus: Order["orderStatus"]) => {
    const updatedOrders = orders.map((order) =>
      order.orderNo === orderNo ? { ...order, orderStatus: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("pa_orders", JSON.stringify(updatedOrders));
  };

  const handleAdminUpdatePaymentStatus = (orderNo: string, newStatus: Order["paymentStatus"]) => {
    const updatedOrders = orders.map((order) =>
      order.orderNo === orderNo ? { ...order, paymentStatus: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("pa_orders", JSON.stringify(updatedOrders));
  };

  const handleUpdateHomeContent = (content: any) => {
    const updated = { ...homeContent, ...content };
    setHomeContent(updated);
    localStorage.setItem("pa_home_content", JSON.stringify(updated));
  };

  const handleAddCategory = (cat: string) => {
    if (categories.includes(cat)) return;
    const updated = [...categories, cat];
    setCategories(updated);
    localStorage.setItem("pa_categories", JSON.stringify(updated));
  };

  const handleUpdateOffer = (updatedOffer: Offer) => {
    const updated = offers.map(o => o.id === updatedOffer.id ? updatedOffer : o);
    setOffers(updated);
    localStorage.setItem("pa_offers_catalog", JSON.stringify(updated));
  };

  const totalCartQty = cart.reduce((accum, curr) => accum + curr.quantity, 0);

  // Render Print Desk Page
  if (printOrder || printOrdersList.length > 0) {
    return (
      <PrintView
        order={printOrder}
        ordersToPrint={printOrdersList}
        type={printType}
        onBack={() => {
          setPrintOrder(null);
          setPrintOrdersList([]);
        }}
        shopName={shopName}
        shopAddress={shopAddress}
        shopPhone={shopPhone}
        gstNum={gstNum}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] font-sans antialiased flex flex-col justify-between">
      
      {/* 1. Splash Screen Overlay */}
      <AnimatePresence>
        {showSplash && (
          <Splash 
            shopName={shopName}
            shopLogo={shopLogo}
            shopTagline={shopTagline}
            onDismiss={() => setShowSplash(false)} 
            onAdminLogin={() => {
              setShowSplash(false);
              setShowCustomerLogin(true);
            }}
          />
        )}
      </AnimatePresence>

      {!showSplash && (
        <>
          <SEO 
            activeTab={activeTab} 
            shopName={shopName} 
            shopLogo={shopLogo}
            selectedProduct={selectedProduct} 
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
          <AnimatePresence>
            {!isOnline && (
              <OfflineView 
                onReturnHome={() => {
                  handleNavigate("home");
                  setIsOnline(true);
                }} 
              />
            )}
          </AnimatePresence>

          {activeTab === "admin" && isAdmin ? (
            <AdminView
              products={products}
              orders={orders}
              offers={offers}
              categories={categories}
              adminsList={adminsList}
              allUsers={allUsers}
              shopDetails={{
                name: shopName,
                logo: shopLogo,
                tagline: shopTagline,
                phone: shopPhone,
                address: shopAddress,
                gstin: gstNum,
                contact1: shopContact1,
                contact2: shopContact2
              }}
              paymentDetails={{
                upiNumber,
                upiHolderName,
                upiId,
                upiQrCode
              }}
              socialLinks={{
                instagram: socialInstagram,
                whatsapp: socialWhatsapp
              }}
              homeContent={homeContent}
              currentUser={currentUser}
              onAddProduct={handleAdminAddProduct}
              onUpdateProduct={handleAdminUpdateProduct}
              onDeleteProduct={handleAdminDeleteProduct}
              onAddOffer={(o) => {
                const newOffer = { ...o, id: `OFFER-${Date.now()}` } as Offer;
                setOffers([...offers, newOffer]);
                localStorage.setItem("pa_offers_catalog", JSON.stringify([...offers, newOffer]));
              }}
              onUpdateOffer={handleUpdateOffer}
              onDeleteOffer={(id) => {
                const updated = offers.filter(o => o.id !== id);
                setOffers(updated);
                localStorage.setItem("pa_offers_catalog", JSON.stringify(updated));
              }}
              onUpdateOrderStatus={handleAdminUpdateOrderStatus}
              onUpdatePaymentStatus={handleAdminUpdatePaymentStatus}
              onUpdateShopDetails={handleUpdateShopDetails}
              onUpdateSocials={handleUpdateSocials}
              onUpdatePayment={handleUpdatePayment}
              onAddAdmin={handleAddAdmin}
              onApproveAdmin={handleApproveAdmin}
              onDeleteAdmin={handleDeleteAdmin}
              onAddCategory={handleAddCategory}
              onUpdateHomeContent={handleUpdateHomeContent}
              onLogout={handleLogout}
              onNavigateToHome={() => handleNavigate("home")}
            />
          ) : (
            <>
              {/* Main Content Layout Wrapper */}
              <div className="flex-1 flex flex-col">
                
                {/* Header Area */}
                <header id="main-app-header" className="sticky top-0 z-50 bg-[#FFFFFF]/80 backdrop-blur-xl border-b border-[#E2E8F0] shadow-sm transition-all duration-300">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
                      
                      {/* Logo Section */}
                      <div 
                        id="header-left" 
                        className="flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer group" 
                        onClick={() => handleNavigate("home")}
                      >
                        {shopLogo ? (
                          <div className="relative shrink-0 w-8 h-8 sm:w-10 sm:h-10 shadow-sm group-hover:scale-105 transition-transform duration-200">
                            <img 
                              src={shopLogo} 
                              alt={shopName} 
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg border border-brand-border bg-brand-white"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-primary text-brand-white rounded-lg flex items-center justify-center font-bold text-base sm:text-lg shadow-lg shadow-brand-primary/10 group-hover:scale-105 transition-transform duration-200 uppercase shrink-0 font-outfit">
                            {shopName ? shopName.charAt(0) : "S"}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span id="shop-name-logo" className="text-[10px] sm:text-sm font-bold tracking-tight text-brand-text-primary leading-none uppercase font-outfit truncate max-w-[80px] sm:max-w-none">
                            {shopName}
                          </span>
                          <span className="text-[7px] sm:text-[9px] font-semibold text-brand-text-secondary mt-0.5 uppercase tracking-widest leading-none font-inter">
                            Marketplace
                          </span>
                        </div>
                      </div>

                      {/* Right Header Section: Actions */}
                      <div id="header-right" className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                        {currentUser ? (
                          <div className="flex items-center gap-1.5 sm:gap-3 bg-brand-white border border-brand-border px-1.5 sm:px-2.5 py-1 rounded-xl shadow-sm">
                            <div className="hidden sm:flex flex-col items-end text-right font-inter">
                              <span className="text-[9px] font-bold text-brand-text-primary leading-tight truncate max-w-[80px]">
                                {currentUser.name}
                              </span>
                              <span className="text-[7px] text-brand-text-secondary font-mono leading-none truncate max-w-[80px]">
                                {currentUser.email}
                              </span>
                            </div>
                            
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-bold text-[9px] sm:text-[10px] text-brand-white flex items-center justify-center shrink-0 shadow-sm ${isAdmin ? 'bg-warning' : 'bg-brand-primary'}`}>
                              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "G"}
                            </div>

                            <button
                              onClick={handleLogout}
                              className="p-1 sm:p-1.5 hover:bg-brand-bg rounded-md text-brand-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
                              title="Sign Out"
                            >
                              <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowCustomerLogin(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-white font-bold text-[9px] sm:text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-95 shrink-0 font-inter"
                          >
                            <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="inline">Sign In</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </header>

                {/* Navigation Router Bar - Detached Floating Pill on Mobile, Sticky on Desktop */}
                <nav 
                  id="navbar-bar" 
                  className="z-50 transition-all duration-500
                             fixed bottom-4 left-1/2 -translate-x-1/2 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:translate-x-0
                             sm:sticky sm:top-[64px] sm:bg-brand-primary sm:border-b sm:border-brand-primary/20 sm:shadow-md
                             max-sm:w-[calc(100%-1.5rem)] max-sm:max-w-md max-sm:bg-brand-primary/95 max-sm:backdrop-blur-2xl max-sm:border max-sm:border-white/20 max-sm:rounded-[2rem] max-sm:shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-sm:px-1 max-sm:py-1"
                >
                  <div className="max-w-7xl mx-auto px-1 sm:px-6 h-12 sm:h-12 flex justify-between items-center gap-0.5 sm:gap-2 overflow-x-auto scrollbar-none">
                    <div className="flex items-center gap-0.5 sm:gap-1.5 h-full shrink-0">
                      {[
                        { name: "Home", icon: Home, id: "home", show: true },
                        { name: "Shop", icon: Layers, id: "products", show: true },
                        { name: "Offers", icon: Tag, id: "offers", show: true },
                        { name: "Loved", icon: Heart, id: "wishlist", show: true },
                        { name: "Track", icon: Clock, id: "orders", show: true },
                        { name: "Profile", icon: Settings, id: "settings", show: true },
                        { name: "Admin", icon: LayoutDashboard, id: "admin", show: isAdmin },
                      ].filter(i => i.show).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleNavigate(item.id as any);
                          }}
                          className={`h-9 sm:h-9 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-full text-[9px] sm:text-[11px] font-bold transition-all shrink-0 cursor-pointer font-inter ${
                            activeTab === item.id 
                              ? "bg-brand-white text-brand-primary shadow-sm scale-105" 
                              : "text-brand-white/70 hover:text-brand-white hover:bg-brand-white/5"
                          }`}
                        >
                          <item.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === item.id ? "text-brand-primary" : "text-brand-white/60"}`} />
                          <span className={`${activeTab === item.id ? "block" : "hidden sm:block"}`}>{item.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Right side helper link: Shopping Cart Page Anchor */}
                    <div className="flex items-center h-full shrink-0 ml-1">
                      <button
                        id="nav-link-cart"
                        onClick={() => {
                          handleNavigate("cart");
                        }}
                        className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 h-9 sm:h-9 px-3.5 sm:px-5 rounded-full font-bold text-[9px] sm:text-[11px] transition-all shadow-sm cursor-pointer border font-inter ${
                          activeTab === "cart"
                            ? "bg-brand-secondary border-brand-secondary text-brand-white shadow-brand-secondary/40 scale-105"
                            : "bg-white/10 border-white/20 text-brand-white hover:bg-white/20"
                        }`}
                      >
                        <div className="relative">
                          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          {totalCartQty > 0 && (
                            <span className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 flex items-center justify-center rounded-full text-[7px] font-black sm:hidden ${activeTab === 'cart' ? 'bg-brand-white text-brand-secondary' : 'bg-brand-secondary text-brand-white'}`}>
                              {totalCartQty}
                            </span>
                          )}
                        </div>
                        <span className={`${activeTab === "cart" ? "block" : "hidden sm:block"}`}>Cart</span>
                        {totalCartQty > 0 && (
                          <span className={`hidden sm:inline-flex ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === 'cart' ? 'bg-brand-white text-brand-secondary' : 'bg-brand-secondary text-brand-white'}`}>
                            {totalCartQty}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </nav>

                {/* Main view container where panels render dynamically with scroll buffer for fixed footer */}
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 pt-4 md:pt-8 pb-32 sm:pb-36">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {(activeTab === "home" || showCustomerLogin) && (
                        <HomeView
                          products={products}
                          offers={offers}
                          homeContent={homeContent}
                          wishlist={wishlist}
                          isLoading={isNavigating}
                          onToggleWishlist={handleToggleWishlist}
                          onNavigateTo={handleNavigate}
                          onSelectProduct={(p) => {
                            setSelectedProduct(p);
                            handleNavigate("details");
                          }}
                        />
                      )}

                      {activeTab === "error404" && (
                        <NotFoundView 
                          onGoHome={() => handleNavigate("home")}
                          onGoBack={handleGoBack}
                        />
                      )}

                      {activeTab === "products" && !showCustomerLogin && (
                        <ProductsView
                          products={products}
                          cart={cart}
                          wishlist={wishlist}
                          onToggleWishlist={handleToggleWishlist}
                          onAddToCart={handleAddToCart}
                          onUpdateCartQty={handleUpdateCartQty}
                          onRemoveFromCart={handleRemoveFromCart}
                          totalCartQty={cart.reduce((sum, item) => sum + item.quantity, 0)}
                          searchQuery={searchQuery}
                          onSearchChange={setSearchQuery}
                          selectedCategory={selectedCategory}
                          onCategoryChange={setSelectedCategory}
                          isLoading={isNavigating}
                          onSelectProduct={(p) => {
                            setSelectedProduct(p);
                            handleNavigate("details");
                          }}
                          onNavigateToCart={() => handleNavigate("cart")}
                        />
                      )}

                      {activeTab === "details" && selectedProduct && !showCustomerLogin && (
                        <ProductDetailsView
                          product={selectedProduct}
                          wishlist={wishlist}
                          isLoading={isNavigating}
                          onToggleWishlist={handleToggleWishlist}
                          onBack={() => handleNavigate("products")}
                          onAddToCart={handleAddToCart}
                        />
                      )}

                      {activeTab === "wishlist" && !showCustomerLogin && (
                        <WishlistView
                          wishlist={wishlist}
                          products={products}
                          isLoading={isNavigating}
                          onToggleWishlist={handleToggleWishlist}
                          onAddToCart={handleAddToCart}
                          onSelectProduct={(p) => {
                            setSelectedProduct(p);
                            handleNavigate("details");
                          }}
                        />
                      )}

                      {activeTab === "offers" && !showCustomerLogin && (
                        <OffersView
                          offers={offers}
                          products={products}
                          isLoading={isNavigating}
                          onAddToCart={handleAddToCart}
                          onExploreProducts={() => handleNavigate("products")}
                          onNavigateToProducts={() => handleNavigate("products")}
                        />
                      )}

                      {activeTab === "orders" && !showCustomerLogin && (
                        <OrdersView
                          orders={orders.filter(o => o.customerEmail === currentUser?.email)}
                          isLoading={isNavigating}
                          onCancelOrder={handleCancelOrder}
                          onNavigateToProducts={() => handleNavigate("products")}
                        />
                      )}

                      {activeTab === "cart" && !showCustomerLogin && (
                        <CartView
                          cart={cart}
                          products={products}
                          isLoading={isNavigating}
                          onUpdateCartQty={handleUpdateCartQty}
                          onRemoveFromCart={handleRemoveFromCart}
                          onCheckout={() => {
                            handleCompleteCheckout();
                            handleNavigate("orders");
                          }}
                          onExplore={() => handleNavigate("products")}
                        />
                      )}

                      {(activeTab === "settings" || activeTab === "profile" || activeTab === "terms" || activeTab === "privacy" || activeTab === "about") && !showCustomerLogin && (
                        <CustomerSettingsView
                          currentUser={currentUser}
                          orders={orders}
                          isLoading={isNavigating}
                          activeSection={activeTab === "settings" ? "menu" : activeTab as any}
                          onNavigate={(section) => {
                            if (section === "orders") {
                              handleNavigate("orders");
                            } else if (section === "menu") {
                              handleNavigate("settings");
                            } else {
                              handleNavigate(section as any);
                            }
                          }}
                          onUpdateProfile={handleUpdateProfile}
                          onLogout={handleLogout}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </main>

              </div>

              {/* Persistent Sticky / Fixed Footer Component (All Pages - COMPACT ON MOBILE) */}
              <footer id="footer-bar" className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-[#E2E8F0] shadow-sm py-1.5 sm:py-2 px-3 sm:px-6 animate-fade-in">
                <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-1.5 font-sans">
                  
                  {/* Admin Entrance (Mobile Only) */}
                  <button
                    id="mobile-admin-access"
                    onClick={() => setShowCustomerLogin(true)}
                    className="flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[#64748B] hover:text-[#FF7A1A] transition-all cursor-pointer group"
                  >
                    <Lock className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Operator</span>
                  </button>

                  {/* Copyright */}
                  <div id="footer-left" className="hidden sm:block text-slate-500 font-bold tracking-tight select-none truncate text-[10px]">
                    &copy; {new Date().getFullYear()} developed and designed by parasu raman. All rights received.
                  </div>

                  {/* Socials */}
                  <div id="footer-middle" className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                    <a
                      href={socialInstagram || "https://instagram.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-full bg-white hover:bg-rose-50 border border-slate-100 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-2xs group"
                      title="Follow us on Instagram"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E1306C] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.003.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051c-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </a>
                    <a
                      href={socialWhatsapp ? (socialWhatsapp.startsWith("http") ? socialWhatsapp : `https://wa.me/${socialWhatsapp.replace(/[^0-9]/g, "")}`) : "https://wa.me"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-full bg-white hover:bg-emerald-50 border border-slate-100 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-2xs group"
                      title="Contact on WhatsApp"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#25D366] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.012 2C6.48 2 2 6.482 2 12.011c0 1.765.459 3.484 1.33 5.008L2 22l5.122-1.343c1.472.802 3.125 1.226 4.885 1.226 5.534 0 10.013-4.48 10.013-10.012C22.02 6.482 17.545 2 12.012 2zm6.136 14.191c-.252.712-1.461 1.302-2.014 1.386-.497.075-1.15.138-3.328-.762-2.784-1.152-4.577-3.993-4.716-4.18-.139-.186-1.139-1.516-1.139-2.89 0-1.375.72-2.049.976-2.316.255-.268.558-.335.742-.335.185 0 .371.002.533.01.169.008.397-.064.62.474.227.548.778 1.901.846 2.039.068.138.114.3.023.483-.09.183-.136.297-.272.456-.136.16-.285.358-.407.48-.137.137-.282.288-.121.564.161.276.715 1.182 1.536 1.914.822.732 1.514.957 1.79.1.275.276.138.455.046.548-.09.092-.411.48-.58.718-.169.239-.338.497-.046.79.292.292 1.58.1.1 1.488.983 1.83 1.121 2.062 1.258.232.138.39.068.482-.023.09-.09.412-.482.527-.723.116-.242.23-.207.394-.147.164.06.1.488.524 2.213.91 2.505.91zm0 0" />
                      </svg>
                    </a>
                  </div>

                  {/* Credits */}
                  <div id="footer-right" className="text-slate-500 font-bold uppercase tracking-wider transition-colors duration-155 cursor-pointer truncate text-[8.5px] sm:text-[10px] max-w-[80px] sm:max-w-none text-right">
                    developed and designed by parasu raman
                  </div>

                </div>
              </footer>
            </>
          )}
        </>
      )}

      {/* Login Modals overlays */}
      <AnimatePresence>
        {showCustomerLogin && (
          <CustomerLoginModal
            onClose={() => setShowCustomerLogin(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
