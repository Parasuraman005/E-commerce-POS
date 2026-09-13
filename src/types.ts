export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // This acts as selling price or selling rate
  image: string;
  category: string;
  purchasePrice?: number; // purchase rate
  gst?: number; // GST percentage
  qty?: number; // Stock quantity level
}

export interface CartItem {
  id: string; // unique cart item id or matches product id
  productId: string;
  quantity: number;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  firstName?: string;
  lastName?: string;
  phone2?: string;
  shippingAddress?: string;
  profilePhoto?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  orderNo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: "Paid" | "Pending" | "Unpaid" | "COD" | "UPI" | "QR Code" | "Not Paid";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Deleted" | "Customer Cancelled";
  date: string;
  cancellationReason?: string;
  cancellationFeedback?: string;
}

export interface HomeContent {
  bannerImage: string;
  featuredHeading: string;
  featuredSubheading: string;
  promotionalBanner: string;
  promotionalText: string;
  featuredProductIds?: string[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountCode: string;
  discountPercentage?: number;
  bannerImage?: string;
  colorTheme?: string; 
  type: "limited" | "combo" | "clearance" | "manual";
  productIds?: string[]; // target product selection ids
  basePrice?: number; // combined base price for calculation
  offerPrice: number; // final promotional pricing
  tillDate?: string; // expiration date
  qty?: number; // targeted stock limit for promo
  comboCount?: number; // for combo offers
}

