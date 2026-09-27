// 1. IMPORT AUTH() INSTEAD OF getServerSession
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Wallet, Package, Shirt, Settings, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Force Next.js to dynamically render this page so wallet & orders are always fresh
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 2. USE NEXTAUTH v5 SYNTAX
  const session = await auth();
  
  if (!session || !session.user?.email) {
    // If not logged in, kick them back to the home page
    redirect("/");
  }

  // 3. Fetch the actual user from PostgreSQL using their Google email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  if (!user) {
    redirect("/");
  }

  // Mock data for now (Since we haven't connected real orders yet)
  const walletBalance = 500; // We will tie this to user.walletBalance later!
  const recentOrders = [
    { id: "ORD-9823", date: "Aug 18, 2026", status: "Processing", amount: 1499, item: "Heavyweight Oversized Tee" },
    { id: "ORD-7641", date: "Aug 12, 2026", status: "Delivered", amount: 2999, item: "Premium French Terry Hoodie" }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-pink-50/30 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-pink-950 dark:text-white tracking-tight mb-2">
            Command Center
          </h1>
          <p className="text-pink-700 dark:text-zinc-400">
            Manage your orders, wardrobe, and Kraftize Wallet.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Profile & Wallet (1/3 width) */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-pink-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-pink-300 to-purple-400 dark:from-purple-900 dark:to-pink-900 opacity-50" />
              
              <div className="relative mt-8 flex flex-col items-center text-center">
                <img 
                  src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`} 
                  alt="Profile" 
                  className="h-24 w-24 rounded-full border-4 border-white dark:border-zinc-900 shadow-lg object-cover mb-4"
                />
                <h2 className="text-xl font-bold text-pink-950 dark:text-white">{session.user.name}</h2>
                <p className="text-sm text-pink-600 dark:text-zinc-400 mb-6">{session.user.email}</p>
                
                <button className="flex items-center gap-2 text-sm font-bold text-pink-700 dark:text-pink-400 hover:text-purple-600 dark:hover:text-white transition-colors">
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Kraftize Wallet Card */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-6 shadow-xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white opacity-10 blur-2xl" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-2 text-white/90">
                  <Wallet className="h-5 w-5" />
                  <span className="font-semibold tracking-wide">KRAFTIZE WALLET</span>
                </div>
              </div>
              
              <div className="relative z-10">
                <p className="text-sm text-white/80 mb-1">Available Balance</p>
                <p className="text-5xl font-black mb-6">₹{walletBalance}</p>
                
                <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                  <span>Add Funds</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order History & Wardrobe (2/3 width) */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Orders Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-pink-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-pink-100 dark:bg-zinc-800 rounded-xl text-purple-600 dark:text-white">
                    <Package className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-pink-950 dark:text-white">Recent Orders</h3>
                </div>
                <Link href="/shop" className="text-sm font-bold text-purple-600 dark:text-pink-400 hover:underline">
                  Shop More
                </Link>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-pink-100 dark:border-zinc-800 hover:border-pink-300 dark:hover:border-zinc-700 transition-colors bg-pink-50/50 dark:bg-zinc-950/50 gap-4">
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-pink-950 dark:text-white">{order.id}</span>
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-zinc-800 text-pink-700 dark:text-zinc-300">
                          {order.date}
                        </span>
                      </div>
                      <p className="text-sm text-pink-700 dark:text-zinc-400">{order.item}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                      <div className="text-right">
                        <p className="font-black text-pink-950 dark:text-white">₹{order.amount}</p>
                      </div>
                      
                      <div className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl ${
                        order.status === "Delivered" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}>
                        {order.status === "Delivered" ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        {order.status}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Digital Wardrobe Placeholder */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-pink-200 dark:border-zinc-800 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-pink-100 dark:bg-zinc-800 rounded-xl text-purple-600 dark:text-white">
                    <Shirt className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-pink-950 dark:text-white">Digital Wardrobe</h3>
                </div>
                
                <div className="h-48 rounded-2xl border-2 border-dashed border-pink-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center p-6">
                  <Shirt className="h-10 w-10 text-pink-300 dark:text-zinc-600 mb-3" />
                  <p className="font-bold text-pink-950 dark:text-white">Your wardrobe is empty.</p>
                  <p className="text-sm text-pink-600 dark:text-zinc-500 mt-1">
                    Designs you create in the AI Studio will be saved here automatically.
                  </p>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}