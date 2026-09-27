import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // This creates 4 real products in your PostgreSQL database
    const products = await prisma.product.createMany({
      data: [
        { 
          name: "Heavyweight Oversized Tee", 
          price: 1499, 
          category: "T-Shirt", 
          imageColor: "Pitch Black" 
        },
        { 
          name: "Premium French Terry Hoodie", 
          price: 2999, 
          category: "Hoodie", 
          imageColor: "Heather Grey" 
        },
        { 
          name: "Vintage Washed Cap", 
          price: 899, 
          category: "Accessories", 
          imageColor: "Navy Blue" 
        },
        { 
          name: "Cyberpunk Techwear Jacket", 
          price: 4599, 
          category: "Outerwear", 
          imageColor: "Neon Violet" 
        }
      ],
      skipDuplicates: true, // Prevents errors if you accidentally run it twice
    });

    return NextResponse.json({ 
      message: "Database seeded successfully with REAL products!", 
      count: products.count 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}