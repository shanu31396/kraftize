"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    imageColor: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  // Grab the addItem function from our Zustand store
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    // Send the product data to Zustand
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      // For now, we will default size and color. Later you can add selectors!
      size: "L", 
      color: product.imageColor,
      image: "placeholder", 
    });

    // Give visual feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  return (
    <button 
      onClick={handleAddToCart}
      className={`h-10 w-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${
        isAdded 
          ? "bg-green-500 text-white scale-110" 
          : "bg-black dark:bg-white text-white dark:text-black hover:scale-110"
      }`}
    >
      <ShoppingCart className="h-4 w-4" />
    </button>
  );
}