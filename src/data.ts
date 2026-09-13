import { Product, Offer } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "PROD-001",
    name: "AeroPro Wireless Headphones",
    description: "Premium studio sound, hybrid active noise cancellation, and a sleek physical posture for 40 hours of active playback.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
    category: "Electronics",
    purchasePrice: 120.00,
    qty: 18,
    gst: 18
  },
  {
    id: "PROD-002",
    name: "NovaWatch Active Smartwatch",
    description: "Sophisticated AMOLED dial tracking wellness, GPS routes, and displaying instantaneous phone notifications.",
    price: 149.50,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
    category: "Electronics",
    purchasePrice: 90.00,
    qty: 24,
    gst: 18
  },
  {
    id: "PROD-003",
    name: "Vanguard Leather Backpack",
    description: "Handcrafted from full-grain vegetable-tanned leather, featuring dedicated compartments for a 16-inch laptop.",
    price: 249.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80",
    category: "Accessories",
    purchasePrice: 150.00,
    qty: 12,
    gst: 18
  },
  {
    id: "PROD-004",
    name: "Minimalist Mechanical Keyboard",
    description: "Compact 75% mechanical setup fitted with double-shot keycaps and rich maple-wood housing. Tactile switches.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
    category: "Electronics",
    purchasePrice: 78.00,
    qty: 15,
    gst: 18
  },
  {
    id: "PROD-005",
    name: "Prism Glass Gym Bottle",
    description: "Borosilicate high-durability glass wrapped in a premium dark slate silicone grip structure.",
    price: 34.00,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500&q=80",
    category: "Lifestyle",
    purchasePrice: 20.00,
    qty: 45,
    gst: 18
  },
  {
    id: "PROD-006",
    name: "Aura Ambient Desk Light",
    description: "Minimalist tubular LED desk light featuring dynamic color temperatures, gesture control, and subtle matte-black metal.",
    price: 89.00,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80",
    category: "Furniture",
    purchasePrice: 53.00,
    qty: 20,
    gst: 18
  },
  {
    id: "PROD-007",
    name: "Monolith Vacuum Flask",
    description: "Double-walled vacuum insulated container keeping drinks ice-cold for 24 hours or steaming hot for 12 hours.",
    price: 42.00,
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=500&q=80",
    category: "Lifestyle",
    purchasePrice: 25.00,
    qty: 35,
    gst: 18
  },
  {
    id: "PROD-008",
    name: "Summit Merino Wool Beanie",
    description: "Ultra-soft and insulating beanie made from sustainably sourced 100% organic extrafine Merino wood yarns.",
    price: 28.00,
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=500&q=80",
    category: "Accessories",
    purchasePrice: 16.00,
    qty: 50,
    gst: 18
  },
  {
    id: "PROD-009",
    name: "Apex Ergonomic Office Chair",
    description: "Comprehensive lumbar protection, fully adjustable premium armrests, and premium breathable polymer mesh backing.",
    price: 389.00,
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=500&q=80",
    category: "Furniture",
    purchasePrice: 240.00,
    qty: 8,
    gst: 18
  },
  {
    id: "PROD-010",
    name: "Solar Charge Power Pack",
    description: "High-yield monocrystalline solar panels with 20,000mAh backup storage and dual ports for remote productivity.",
    price: 75.00,
    image: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?auto=format&fit=crop&w=500&q=80",
    category: "Electronics",
    purchasePrice: 45.00,
    qty: 30,
    gst: 18
  },
  {
    id: "PROD-011",
    name: "Zen Leather Desktop Pad",
    description: "Sleek and spill-resistant micro-texture vegan leather pad with non-slip base for optimal mouse tracking and writing comfort.",
    price: 49.00,
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=500&q=80",
    category: "Accessories",
    purchasePrice: 28.00,
    qty: 25,
    gst: 18
  },
  {
    id: "PROD-012",
    name: "Lumina RGB Accent Rod",
    description: "Chords of elegant ambient color strips with smartphone integration, sync features, and reactive sound matching modes.",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=80",
    category: "Furniture",
    purchasePrice: 38.00,
    qty: 40,
    gst: 18
  },
  {
    id: "PROD-013",
    name: "Titanium Multi-tool Keyring",
    description: "Heavy-duty grade-5 aerospace titanium framework bundling 12 essential tools into an ultra-slim 25g payload.",
    price: 39.50,
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=500&q=80",
    category: "Lifestyle",
    purchasePrice: 22.00,
    qty: 60,
    gst: 18
  },
  {
    id: "PROD-014",
    name: "Helix Curved Ergonomic Mouse",
    description: "Vertical 57-degree natural handshake posture layout reduces muscle strain. Features silent glides and 4000 DPI sensor.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80",
    category: "Electronics",
    purchasePrice: 46.00,
    qty: 22,
    gst: 18
  },
  {
    id: "PROD-015",
    name: "Alabaster Coffee Mug Warmer",
    description: "Induction hot-plate heating set paired with custom fine bone china mug. Auto shutdown and 3 temperature layers.",
    price: 54.00,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80",
    category: "Lifestyle",
    purchasePrice: 32.00,
    qty: 15,
    gst: 18
  },
  {
    id: "PROD-016",
    name: "Slate Merino Felt Coasters",
    description: "Pack of 6 dense circular felt coasters sustainably pressed from water-resistant natural sheep wool.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80",
    category: "Accessories",
    purchasePrice: 10.00,
    qty: 80,
    gst: 18
  },
  {
    id: "PROD-017",
    name: "Voyager Passport Folio",
    description: "Premium calfskin leather zipper folio with RFID protection shields, boarding pass folders, and micro pen slot.",
    price: 95.00,
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=500&q=80",
    category: "Accessories",
    purchasePrice: 55.00,
    qty: 18,
    gst: 18
  },
  {
    id: "PROD-018",
    name: "Boreal Organic Desk Plant",
    description: "Humble, oxygen-rich live succulent nestled inside a concrete geometric custom handcrafted minimalist drainage pot.",
    price: 24.50,
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=500&q=80",
    category: "Lifestyle",
    purchasePrice: 14.00,
    qty: 50,
    gst: 18
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: "OFFER-001",
    title: "Master Studio Keyboard & Light Set",
    description: "The ultimate deck duo: Combine our flagship Minimalist Mechanical Keyboard and Aura Ambient Desk Light for pristine acoustic keystrokes under perfect high-contrast dynamic lighting.",
    discountCode: "DECKWORKSPACESET",
    discountPercentage: 15,
    bannerImage: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
    colorTheme: "from-blue-600 to-indigo-750",
    type: "combo",
    productIds: ["PROD-004", "PROD-006"],
    offerPrice: 185.00,
    qty: 10
  },
  {
    id: "OFFER-002",
    title: "Dual Core Desk Optimization Pack",
    description: "Bring rich visual harmony to your setup with the Zen Leather Desktop Pad paired with our gorgeous Lumina RGB Accent Rod.",
    discountCode: "ZENAMBIANCE",
    discountPercentage: 20,
    bannerImage: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=500&q=80",
    colorTheme: "from-amber-500 to-orange-600",
    type: "combo",
    productIds: ["PROD-011", "PROD-012"],
    offerPrice: 91.00,
    qty: 15
  },
  {
    id: "OFFER-003",
    title: "Daily Hydration & Travel Combo",
    description: "Stay perfectly hydrated on regular trails. Combines the high-durability Prism Glass Gym Bottle with our double-walled vacuum Monolith Flask.",
    discountCode: "HYDRAFLUX",
    discountPercentage: 25,
    bannerImage: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=500&q=80",
    colorTheme: "from-emerald-600 to-teal-800",
    type: "combo",
    productIds: ["PROD-005", "PROD-007"],
    offerPrice: 57.00,
    qty: 25
  },
  {
    id: "OFFER-004",
    title: "Premium Executive Tech Deck",
    description: "For professionals who value absolute wrist wellness and fine sound quality. Bundles our AeroPro Wireless Headphones and Helix Curved mouse.",
    discountCode: "EXECUTIVEPLUS",
    discountPercentage: 18,
    bannerImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
    colorTheme: "from-indigo-600 to-violet-850",
    type: "combo",
    productIds: ["PROD-001", "PROD-014"],
    offerPrice: 229.00,
    qty: 8
  }
];
