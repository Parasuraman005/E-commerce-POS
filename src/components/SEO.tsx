import { useEffect } from "react";
import { Product } from "../types";

interface SEOProps {
  activeTab: string;
  shopName: string;
  shopLogo: string;
  selectedProduct: Product | null;
  selectedCategory?: string;
  searchQuery?: string;
}

export default function SEO({ activeTab, shopName, shopLogo, selectedProduct, selectedCategory, searchQuery }: SEOProps) {
  useEffect(() => {
    let title = "";
    let description = "";
    const url = window.location.href;
    const siteName = shopName;
    let image = shopLogo || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80";

    switch (activeTab) {
      case "home":
        title = `${siteName} | Shop Online`;
        description = `Explore quality products, discover the latest offers, and enjoy a simple and secure shopping experience at ${siteName}.`;
        break;
      case "products":
        if (searchQuery) {
          title = `Search Results | ${siteName}`;
          description = `Explore products matching your search at ${siteName}.`;
        } else if (selectedCategory && selectedCategory !== "All") {
          title = `${selectedCategory} | ${siteName}`;
          description = `Explore our collection of ${selectedCategory} products at ${siteName}.`;
        } else {
          title = `Shop Products | ${siteName}`;
          description = `Browse our collection of quality products and find the items you need at ${siteName}.`;
        }
        break;
      case "details":
        if (selectedProduct) {
          title = `${selectedProduct.name} | ${siteName}`;
          description = selectedProduct.description ? 
            (selectedProduct.description.length > 160 ? selectedProduct.description.substring(0, 157) + "..." : selectedProduct.description) : 
            `Buy ${selectedProduct.name} at ${siteName}. High quality and best prices.`;
          image = selectedProduct.image;
        } else {
          title = `Product Details | ${siteName}`;
          description = `View detailed information about our products at ${siteName}.`;
        }
        break;
      case "wishlist":
        title = `My Wishlist | ${siteName}`;
        description = `Review your saved products and curated collection at ${siteName}.`;
        break;
      case "offers":
        title = `Latest Offers and Deals | ${siteName}`;
        description = `Discover the latest offers, discounts, and special deals available at ${siteName}.`;
        break;
      case "orders":
        title = `My Orders | ${siteName}`;
        description = `Track your order history and procurement logs securely at ${siteName}.`;
        break;
      case "cart":
        title = `Shopping Cart | ${siteName}`;
        description = `Review your selected products and continue your shopping securely.`;
        break;
      case "checkout":
        title = `Checkout | ${siteName}`;
        description = `Complete your order securely and enjoy a simple shopping experience.`;
        break;
      case "confirmation":
        title = `Order Confirmed | ${siteName}`;
        description = `Thank you for your order! Your procurement has been successfully authorized.`;
        break;
      case "categories":
        title = `Shop by Category | ${siteName}`;
        description = `Explore products by category and find exactly what you are looking for at ${siteName}.`;
        break;
      case "admin":
        title = `Admin Command Center | ${siteName}`;
        description = `Administrative control panel for managing logistics, inventory, and operations.`;
        break;
      case "about":
        title = `About Us | ${siteName}`;
        description = `Learn more about ${siteName}, our products, and our commitment to providing a better shopping experience.`;
        break;
      case "contact":
        title = `Contact Us | ${siteName}`;
        description = `Contact ${siteName} for product information, support, and assistance.`;
        break;
      case "terms":
        title = `Terms of Service | ${siteName}`;
        description = `Read our terms of service and conditions for using ${siteName}.`;
        break;
      case "privacy":
        title = `Privacy Policy | ${siteName}`;
        description = `Learn how we handle your data and protect your privacy at ${siteName}.`;
        break;
      case "settings":
      case "profile":
        title = `User Settings | ${siteName}`;
        description = `Manage your profile, security, and preferences at ${siteName}.`;
        break;
      case "error404":
        title = `Page Not Found | ${siteName}`;
        description = `The page you are looking for may have been moved, deleted, or does not exist.`;
        break;
      default:
        title = `${siteName} | Shop Online`;
        description = `Explore quality products, discover the latest offers, and enjoy a simple and secure shopping experience at ${siteName}.`;
    }

    // Update Title
    document.title = title;

    // Helper to update or create meta tags
    const updateMetaTag = (name: string, property: string, content: string) => {
      let tag = name 
        ? document.querySelector(`meta[name="${name}"]`) 
        : document.querySelector(`meta[property="${property}"]`);
      
      if (!tag) {
        tag = document.createElement("meta");
        if (name) tag.setAttribute("name", name);
        if (property) tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // Helper to update or create link tags (for favicons)
    const updateLinkTag = (rel: string, sizes: string, href: string, type: string = "image/png") => {
      let tag = document.querySelector(`link[rel="${rel}"][sizes="${sizes}"]`) || 
                 document.querySelector(`link[rel="${rel}"]`);
      
      if (!tag) {
        tag = document.createElement("link");
        tag.setAttribute("rel", rel);
        if (sizes) tag.setAttribute("sizes", sizes);
        document.head.appendChild(tag);
      }
      tag.setAttribute("href", href);
      if (type) tag.setAttribute("type", type);
    };

    // Update Favicons Dynamically
    if (shopLogo) {
      updateLinkTag("icon", "16x16", shopLogo);
      updateLinkTag("icon", "32x32", shopLogo);
      updateLinkTag("icon", "48x48", shopLogo);
      updateLinkTag("apple-touch-icon", "180x180", shopLogo);
      updateLinkTag("icon", "192x192", shopLogo);
      updateLinkTag("icon", "512x512", shopLogo);
    }

    // Standard Meta
    updateMetaTag("description", "", description);
    updateMetaTag("viewport", "", "width=device-width, initial-scale=1.0, maximum-scale=5.0");
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Open Graph
    updateMetaTag("", "og:title", title);
    updateMetaTag("", "og:description", description);
    updateMetaTag("", "og:image", image);
    updateMetaTag("", "og:url", url);
    updateMetaTag("", "og:type", "website");
    updateMetaTag("", "og:site_name", siteName);

    // Twitter
    updateMetaTag("twitter:card", "", "summary_large_image");
    updateMetaTag("twitter:title", "", title);
    updateMetaTag("twitter:description", "", description);
    updateMetaTag("twitter:image", "", image);

    // Indexing for specific pages
    const noIndexTabs = ["cart", "admin", "settings", "profile", "error404", "orders", "wishlist", "checkout", "confirmation"];
    if (noIndexTabs.includes(activeTab) || searchQuery) {
      updateMetaTag("robots", "", "noindex, nofollow");
    } else {
      updateMetaTag("robots", "", "index, follow");
    }

  }, [activeTab, shopName, selectedProduct, selectedCategory]);

  return null;
}
