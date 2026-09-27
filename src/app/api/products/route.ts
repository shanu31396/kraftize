import { NextResponse } from "next/server";

export async function GET() {
  // Bina database ke direct dummy products return kar rahe hain
  const dummyProducts = [
    { id: "fallback-1", name: "Premium Heavyweight Hoodie", price: 65, category: "Hoodies", imageColor: "bg-zinc-800" },
    { id: "fallback-2", name: "Oversized Cyber Drop T-Shirt", price: 35, category: "T-Shirts", imageColor: "bg-purple-900/40" },
    { id: "fallback-3", name: "Utility Cargo Joggers", price: 55, category: "Pants", imageColor: "bg-zinc-800" },
    { id: "fallback-4", name: "Washed Vintage Tee", price: 30, category: "T-Shirts", imageColor: "bg-pink-900/20" },
  ];

  return NextResponse.json(dummyProducts);
}