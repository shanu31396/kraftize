"use client";

import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import KraftizePaymentUI from "@/components/checkout/KraftizePaymentUI";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-pink-950/20 dark:bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sliding Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-pink-50/95 dark:bg-black/90 backdrop-blur-xl border-l border-pink-200 dark:border-zinc-800 z-[101] transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pink-200 dark:border-zinc-800 transition-colors">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-bold text-pink-950 dark:text-white">Your Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="text-pink-400 hover:text-pink-800 dark:text-zinc-500 dark:hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-pink-100 dark:bg-zinc-900 flex items-center justify-center text-pink-400 dark:text-zinc-500">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-pink-950 dark:text-white">Your cart is empty</p>
                <p className="text-sm text-pink-700 dark:text-zinc-400 mt-1">Looks like you haven't added anything yet.</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex gap-4 p-4 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-pink-200 dark:border-zinc-800 transition-colors"
              >
                {/* Item Thumbnail Placeholder */}
                <div className="h-16 w-16 rounded-lg bg-pink-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-pink-500 dark:text-zinc-400">
                  {item.color.slice(0, 4)}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-pink-950 dark:text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-pink-700 dark:text-zinc-400 mt-0.5">
                    Size: {item.size} • Color: {item.color}
                  </p>
                  <p className="text-sm font-extrabold text-pink-900 dark:text-white mt-2">
                    ₹{item.price}
                  </p>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id, item.size, item.color)}
                    className="text-pink-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-2 bg-pink-100 dark:bg-zinc-800 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                      className="p-1 hover:text-purple-600 dark:hover:text-white transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center text-pink-950 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                      className="p-1 hover:text-purple-600 dark:hover:text-white transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-pink-200 dark:border-zinc-800 bg-pink-100/40 dark:bg-zinc-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-pink-800 dark:text-zinc-400">Subtotal</span>
              <span className="text-xl font-black text-pink-950 dark:text-white">₹{totalPrice}</span>
            </div>

            <button
              onClick={() => setIsPaymentOpen(true)}
              className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.98]">
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
      <KraftizePaymentUI
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={totalPrice}
      />
    </>
  );
}