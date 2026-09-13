import React, { useState, useEffect } from "react";
import { Product, Offer } from "../types";
import { X, Check, Calculator, Calendar, Package, Tag, Layers } from "lucide-react";

interface OfferFormProps {
  products: Product[];
  onSave: (offer: Omit<Offer, "id">) => void;
  onCancel: () => void;
}

export default function OfferForm({ products, onSave, onCancel }: OfferFormProps) {
  const [type, setType] = useState<Offer["type"]>("limited");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [basePrice, setBasePrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [tillDate, setTillDate] = useState("");
  const [qty, setQty] = useState(0);
  const [comboCount, setComboCount] = useState(2);

  // Auto-calculate base price when products are selected
  useEffect(() => {
    const total = selectedProductIds.reduce((sum, id) => {
      const p = products.find(p => p.id === id);
      return sum + (p?.price || 0);
    }, 0);
    setBasePrice(total);
    // Default offer price to 10% off
    if (offerPrice === 0 || offerPrice === basePrice) {
      setOfferPrice(Math.round(total * 0.9));
    }
  }, [selectedProductIds, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductIds.length === 0) {
      alert("Please select at least one product.");
      return;
    }
    const newOffer: Omit<Offer, "id"> = {
      type,
      title: title || `${type.replace("-", " ").toUpperCase()} OFFER`,
      description: description || `Special ${type} promotion`,
      discountCode: `OFFER-${Date.now()}`,
      productIds: selectedProductIds,
      basePrice,
      offerPrice,
      tillDate,
      qty,
      comboCount: type === "combo" ? comboCount : undefined,
    };
    onSave(newOffer);
  };

  const toggleProduct = (id: string) => {
    if (type === "combo") {
      if (selectedProductIds.includes(id)) {
        setSelectedProductIds(selectedProductIds.filter(p => p !== id));
      } else if (selectedProductIds.length < comboCount) {
        setSelectedProductIds([...selectedProductIds, id]);
      } else {
        alert(`You can only select up to ${comboCount} products for this combo.`);
      }
    } else {
      setSelectedProductIds([id]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in text-left">
      {/* Type Selection */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest font-inter">Select Offer Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["limited", "combo", "clearance", "manual"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                setSelectedProductIds([]);
                setTitle("");
                setQty(0);
                setTillDate("");
              }}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${
                type === t 
                  ? "border-[#F97316] bg-[#F97316]/5 ring-4 ring-[#F97316]/10" 
                  : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
              }`}
            >
              {t === "limited" && <Calendar className={`w-5 h-5 ${type === t ? "text-[#F97316]" : "text-[#94A3B8]"}`} />}
              {t === "combo" && <Layers className={`w-5 h-5 ${type === t ? "text-[#F97316]" : "text-[#94A3B8]"}`} />}
              {t === "clearance" && <Package className={`w-5 h-5 ${type === t ? "text-[#F97316]" : "text-[#94A3B8]"}`} />}
              {t === "manual" && <Tag className={`w-5 h-5 ${type === t ? "text-[#F97316]" : "text-[#94A3B8]"}`} />}
              <span className={`text-[10px] font-black uppercase tracking-widest ${type === t ? "text-[#F97316]" : "text-[#64748B]"}`}>
                {t === "limited" ? "Limited Period" : t === "combo" ? "Combo Offer" : t === "clearance" ? "Clearance Sales" : "Manual Offer"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Specific Fields per Type */}
          {type === "combo" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest font-inter">Number of Products (Count)</label>
              <input 
                type="number" 
                min={2}
                max={10}
                value={comboCount}
                onChange={(e) => {
                  setComboCount(parseInt(e.target.value));
                  setSelectedProductIds([]);
                }}
                className="w-full px-5 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-sm font-bold font-inter text-[#0F172A] focus:outline-hidden focus:border-[#F97316] transition-all" 
              />
            </div>
          )}

          {type === "manual" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest font-inter">Offer Name</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Festival Special" 
                className="w-full px-5 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-sm font-bold font-inter text-[#0F172A] focus:outline-hidden focus:border-[#F97316] transition-all" 
              />
            </div>
          )}

          {/* Product Selection */}
          <div className="space-y-3 text-left">
            <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest font-inter flex items-center justify-between">
              <span>{type === "combo" ? `Product Selection (based on count: ${comboCount})` : "Product Selection"}</span>
              <span className="text-[#F97316]">{selectedProductIds.length} Selected</span>
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {products.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProduct(p.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group cursor-pointer ${
                    selectedProductIds.includes(p.id)
                      ? "border-[#F97316] bg-[#F97316]/5 shadow-xs"
                      : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"
                  }`}
                >
                  <img src={p.image} className="w-10 h-10 rounded-lg object-cover border border-[#E2E8F0]" alt={p.name} />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[11px] font-bold text-[#0F172A] truncate uppercase tracking-tight">{p.name}</p>
                    <p className="text-[10px] font-bold text-[#475569]/60 font-mono">Price: ₹{p.price}</p>
                  </div>
                  {selectedProductIds.includes(p.id) && <Check className="w-4 h-4 text-[#F97316]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-[#F8FAFC] p-8 rounded-[2.5rem] border border-[#E2E8F0]">
          <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-widest font-inter flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#F97316]" /> Offer Configuration
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest font-inter">
                  {type === "combo" ? "Total Price (Sum)" : "Product Price"}
                </label>
                <div className="px-5 py-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-black font-inter text-[#94A3B8]">
                  ₹{basePrice}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest font-inter">Offer Price (Editable)</label>
                <input 
                  type="number" 
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(parseInt(e.target.value))}
                  placeholder="₹" 
                  className="w-full px-5 py-4 bg-white border border-[#F97316]/30 rounded-2xl text-sm font-black font-inter text-[#0F172A] focus:outline-hidden focus:border-[#F97316] transition-all" 
                />
              </div>
            </div>

            {(type === "limited" || type === "manual" || type === "clearance") && (
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest font-inter">Till Date Selection</label>
                  <input 
                    type="date" 
                    value={tillDate}
                    onChange={(e) => setTillDate(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-bold font-inter text-[#0F172A] focus:outline-hidden focus:border-[#F97316] transition-all" 
                  />
                </div>
                {type === "limited" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest font-inter">Quantity (Qty)</label>
                    <input 
                      type="number" 
                      value={qty}
                      onChange={(e) => setQty(parseInt(e.target.value))}
                      placeholder="Units" 
                      className="w-full px-5 py-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-bold font-inter text-[#0F172A] focus:outline-hidden focus:border-[#F97316] transition-all" 
                    />
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 flex gap-4">
              <button 
                type="submit"
                disabled={selectedProductIds.length === 0}
                className="flex-1 py-4 bg-[#0F172A] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-[#1E293B] shadow-xl shadow-[#0F172A]/20 cursor-pointer font-inter disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Offer
              </button>
              <button 
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 bg-white border border-[#E2E8F0] text-[#475569] rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-[#F8FAFC] cursor-pointer font-inter"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>

  );
}
