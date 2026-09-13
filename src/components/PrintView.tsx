import React, { useEffect } from "react";
import { ArrowLeft, Printer, Scissors } from "lucide-react";
import { Order } from "../types";

interface PrintViewProps {
  order?: Order | null;
  ordersToPrint?: Order[];
  type: "label" | "both" | "invoice";
  onBack: () => void;
  shopName?: string;
  shopAddress?: string;
  shopPhone?: string;
  gstNum?: string;
}

export default function PrintView({
  order,
  ordersToPrint = [],
  type,
  onBack,
  shopName,
  shopAddress,
  shopPhone,
  gstNum
}: PrintViewProps) {
  
  // Auto-launch the printer window once the print preview mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Determine the list of orders to print
  const executionList = ordersToPrint.length > 0 ? ordersToPrint : (order ? [order] : []);

  // Visual thick/thin monochrome barcode blocks generator
  const renderVisualBarcode = (orderNo: string) => (
    <div className="flex flex-col items-center">
      <div className="flex items-end justify-center gap-[1.5px] py-1 px-3 bg-white border border-slate-200 rounded">
        {[2, 1, 3, 1, 4, 1, 2, 3, 1, 4, 1, 2, 1, 3, 2, 4, 1, 2, 1, 3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 1].map((w, idx) => (
          <div key={idx} className="bg-slate-950 h-7 shrink-0" style={{ width: `${w}px` }} />
        ))}
      </div>
      <span className="text-[9px] font-mono tracking-widest font-bold mt-1 text-slate-800 uppercase">{orderNo}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-xs">
      
      {/* 1. Header Control Panel (Excluded from print) */}
      <div className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              id="btn-print-back"
              onClick={onBack}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 transition-colors flex items-center justify-center cursor-pointer min-w-[36px]"
              title="Go back to dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Admin Print Desk ({executionList.length} {executionList.length === 1 ? "Order" : "Orders"})
                </span>
                {executionList.length === 1 && (
                  <span className="text-slate-400 font-mono text-[10px]">{executionList[0].orderNo}</span>
                )}
              </div>
              <h2 className="text-sm font-black text-slate-100 tracking-tight">
                {type === "label" 
                  ? "Square Shipping Label Run" 
                  : type === "invoice" 
                  ? "Official GST Invoice Run" 
                  : "Unified Invoice & Shipping Label Run"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="hidden md:inline text-[11px] text-slate-400 select-none mr-1">
              Continuous batch layout optimized for quick output
            </span>
            <button
              id="btn-trigger-system-print"
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black uppercase text-[10.5px] rounded-xl flex items-center gap-1.5 shadow-md active:scale-97 transition-all cursor-pointer select-none"
            >
              <Printer className="w-4 h-4" />
              Print Run
            </button>
          </div>
        </div>
      </div>

      {/* 2. Paper Layout Print Container */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 sm:py-10 space-y-12 print:p-0 print:m-0 print:max-w-none">
        
        {executionList.map((ord, index) => {
          // Compute Invoice items math
          const subtotal = ord.totalAmount;
          const gstAmount = subtotal * 0.18;
          const grandTotal = subtotal * 1.18;

          return (
            <React.Fragment key={ord.orderNo}>
              {/* Optional page-break BEFORE starting subsequent orders in print mode */}
              {index > 0 && <div className="print-page-break pt-4 no-print border-t-2 border-dashed border-slate-300" />}

              {/* Render TAX INVOICE */}
              {(type === "invoice" || type === "both") && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm print:shadow-none print:border-0 print:p-0 animate-fade-in">
                  {/* Invoice Top Row */}
                  <div className="flex flex-row justify-between items-start border-b border-slate-200 pb-5">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase font-sans">Official GST Tax Invoice</span>
                      <h1 className="text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">{shopName || "Enterprise Storefront"}</h1>
                      <p className="text-slate-500 mt-1 max-w-sm text-[11px] leading-relaxed">{shopAddress || "Store Registered Main Address Log"}</p>
                      {shopPhone && <p className="text-slate-500 font-medium text-[11px] mt-0.5">Phone: {shopPhone}</p>}
                      {gstNum && (
                        <div className="inline-block mt-2 bg-slate-50 border border-slate-200 rounded px-2.5 py-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Tax GSTIN ID</span>
                          <span className="text-slate-900 font-mono font-bold text-xs">{gstNum}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[9px] uppercase font-black tracking-wider">Invoice Statement No.</p>
                      <p className="font-mono text-base font-black text-slate-900 mt-0.5">{ord.orderNo}</p>
                      
                      <p className="text-slate-400 text-[9px] uppercase font-black tracking-wider mt-3.5">Settlement Status</p>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-black border ${
                        ord.paymentStatus === "Paid" 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                          : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}>
                        {ord.paymentStatus.toUpperCase()}
                      </span>
                      
                      <p className="text-slate-400 text-[9px] uppercase font-black tracking-wider mt-3.5">Sales Date</p>
                      <p className="font-mono text-xs font-bold text-slate-800 mt-0.5">{ord.date}</p>
                    </div>
                  </div>

                  {/* Billing Grid to / Buyer detail */}
                  <div className="grid grid-cols-2 gap-6 py-5 border-b border-slate-200 bg-slate-50/50 -mx-6 px-6 print:mx-0 print:px-0">
                    <div>
                      <span className="block font-black text-slate-400 uppercase text-[9px] tracking-wider mb-1">Customer / Consignee Address</span>
                      <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{ord.customerName}</p>
                      <p className="text-slate-600 mt-1 leading-relaxed max-w-xs">{ord.customerAddress || "No physical shipping address supply."}</p>
                    </div>
                    <div className="text-right">
                      <span className="block font-black text-slate-400 uppercase text-[9px] tracking-wider mb-1">Contact Details</span>
                      {ord.customerPhone && (
                        <p className="font-mono text-slate-800 font-bold flex items-center justify-end gap-1 text-[11px]">
                          <span className="text-slate-400 font-sans font-bold text-[9px] mr-0.5">☎</span> {ord.customerPhone}
                        </p>
                      )}
                      <p className="font-mono text-indigo-700 font-bold mt-1 text-[11px] truncate max-w-full">
                        {ord.customerEmail}
                      </p>
                      <p className="text-slate-400 text-[9px] mt-2 italic">Standard Prepaid Delivery Carrier</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="py-5">
                    <span className="block font-black text-slate-400 uppercase text-[9px] tracking-wider mb-2 select-none">Consignment Itemized Breakdown</span>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-3xs bg-white">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-250 text-slate-500 font-bold text-[9.5px] uppercase select-none">
                            <th className="py-3 px-4">Description of Item Purchased</th>
                            <th className="py-3 px-4 font-mono text-center">ID SKU</th>
                            <th className="py-3 px-4 text-right">Price Rate</th>
                            <th className="py-3 px-4 text-center">Qty</th>
                            <th className="py-3 px-4 text-right">Raw Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150 text-slate-700">
                          {ord.items.map((it) => (
                            <tr key={it.productId} className="hover:bg-slate-50/30 transition-colors">
                              <td className="py-3 px-4 font-black text-slate-900 text-[11.5px]">{it.name}</td>
                              <td className="py-3 px-4 font-mono text-center text-slate-400 text-[10.5px]">{it.productId}</td>
                              <td className="py-3 px-4 text-right font-mono">₹{it.price.toFixed(2)}</td>
                              <td className="py-3 px-4 text-center font-mono font-extrabold text-slate-900">{it.quantity}</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-slate-950">₹{(it.price * it.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Totals Sheet */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col items-end space-y-1.5 bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200">
                    <div className="flex justify-between w-64 text-slate-500 text-[11px]">
                      <span className="font-semibold">Items Subtotal:</span>
                      <span className="font-mono text-slate-800 font-bold">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between w-64 text-slate-500 text-[11px]">
                      <span className="font-semibold">IGST / CGST Component (18%):</span>
                      <span className="font-mono text-slate-600 font-bold">₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between w-64 border-t border-slate-300 pt-2 text-xs font-black text-rose-600 text-[12.5px]">
                      <span>Grand Total Payable:</span>
                      <span className="font-mono text-[14px] font-black">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Footer declaration */}
                  <div className="pt-6 mt-6 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-1 font-sans">
                    <p className="font-bold uppercase text-slate-500 tracking-wider">Declaration &amp; Authorized Signature</p>
                    <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                    <p className="pt-4 text-slate-300 italic">This is an automated system audit log page - no physical handwritten signature required.</p>
                  </div>
                </div>
              )}

              {/* Dynamic page-break when both to toggle cleanly */}
              {type === "both" && <div className="print-page-break" />}

              {/* Render SQUARE SHIPPING LABEL */}
              {(type === "label" || type === "both") && (
                <div className="relative flex justify-center">
                  {/* Visual Cut Border Aid for Cutoff (excluded from printing to keep clean or printed as a dashed cut line) */}
                  <div className="absolute -top-4 w-[380px] flex items-center justify-between text-slate-405 text-[9px] px-1 no-print">
                    <span className="flex items-center gap-1 font-mono font-bold">
                      <Scissors className="w-3.5 h-3.5" /> ✂-- Cut along label --
                    </span>
                    <span className="font-sans font-bold uppercase tracking-widest text-[8px]">Square Label</span>
                  </div>

                  {/* Perfect Layout 1:1 Aspect Ratio Square Label Sheet */}
                  <div 
                    id={`printed-square-shipping-label-${ord.orderNo}`} 
                    className="bg-white w-[380px] h-[380px] min-w-[380px] min-h-[380px] max-w-[380px] max-h-[380px] rounded-xs border-4 border-slate-950 p-4 flex flex-col justify-between font-sans text-[10.5px] text-slate-900 relative shadow-sm print:shadow-none bg-radial from-white to-slate-50"
                  >
                    {/* Top Row: Seller and Carrier Index */}
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2">
                      <div className="leading-tight">
                        <span className="bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider block w-max mb-1">
                          SHIPPER (FROM)
                        </span>
                        <p className="font-extrabold text-xs uppercase text-slate-950 truncate max-w-[190px]">
                          {shopName || "DEVELOPED AND DESIGNED BY PARASU RAMAN"}
                        </p>
                        <p className="text-slate-600 text-[10px] line-clamp-2 max-w-[190px]">
                          {shopAddress || "Corporate Warehousing Main HQ Registry"}
                        </p>
                        {shopPhone && <p className="text-slate-500 font-mono text-[9.5px] mt-0.5">Phone: {shopPhone}</p>}
                      </div>
                      
                      <div className="text-right leading-none shrink-0 flex flex-col items-end">
                        <span className="bg-emerald-600 text-white text-[7.5px] font-black px-1.5 py-1 rounded uppercase tracking-widest block font-sans select-none mb-1 shadow-3xs">
                          PREPAID
                        </span>
                        <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wide block">Weight Target</span>
                        <span className="font-mono text-[10.5px] font-extrabold text-slate-950 block mt-0.5">0.45 KG</span>
                      </div>
                    </div>

                    {/* Middle Section: Big visual Barcode / Order No */}
                    <div className="py-2.5 my-0.5 bg-slate-50/80 border border-slate-200/60 rounded-lg flex items-center justify-center">
                      {renderVisualBarcode(ord.orderNo)}
                    </div>

                    {/* Bottom Main: Delivery Address (TO) */}
                    <div className="border-t-2 border-dotted border-slate-900 pt-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="bg-slate-950 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider block w-max mb-1.5">
                          DELIVERY ADDRESS (TO)
                        </span>
                        <p className="font-black text-[13.5px] text-slate-950 tracking-tight leading-none uppercase">
                          {ord.customerName}
                        </p>
                        <p className="text-slate-900 font-extrabold text-[11px] leading-tight mt-1 line-clamp-3 font-sans">
                          {ord.customerAddress || "NO SHIPMENT DELIVERY ADDRESS SUPPLIED"}
                        </p>
                      </div>

                      {/* Logistics Phone and Footer Bar */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-150 mt-1.5">
                        <div className="font-mono text-[11px] font-black text-slate-950">
                          <span className="text-slate-400 font-sans font-bold text-[9px] mr-0.5">PHONE:</span> 
                          {ord.customerPhone || "N/A"}
                        </div>
                        
                        <div className="text-right text-[8px] font-black text-slate-400 uppercase tracking-widest font-sans">
                          developed and designed by parasu raman &copy; 2026
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}

      </div>

    </div>
  );
}
