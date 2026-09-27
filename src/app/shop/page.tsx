import prisma from "@/lib/prisma";
import Link from "next/link";
import { Store, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

// Force dynamic so new creator stores appear instantly
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  // Fetch all approved creator profiles from PostgreSQL
  const creators = await prisma.creatorProfile.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-pink-50/30 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 text-sm font-bold tracking-wide">
            <Sparkles className="h-4 w-4" />
            KRAFTIZE MARKETPLACE
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-pink-950 dark:text-white tracking-tight">
            Discover Independent <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Creator Brands</span>
          </h1>
          <p className="text-lg text-pink-700 dark:text-zinc-400">
            Shop unique, AI-assisted streetwear designed by independent creators from around the globe.
          </p>
        </div>

        {/* Creator Stores Grid */}
        {creators.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-pink-200 dark:border-zinc-800 p-8 max-w-lg mx-auto shadow-sm">
            <Store className="h-12 w-12 text-pink-300 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-pink-950 dark:text-white mb-2">No Active Stores Yet</h3>
            <p className="text-pink-600 dark:text-zinc-400 mb-6 text-sm">
              Be the first to launch your brand on Kraftize!
            </p>
            <Link 
              href="/creators"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-md hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <span>Apply as a Creator</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creators.map((creator) => (
              <div 
                key={creator.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-pink-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Store Header Banner */}
                  <div className="h-24 rounded-2xl bg-gradient-to-r from-pink-300/50 to-purple-400/50 dark:from-purple-900/40 dark:to-pink-900/40 mb-6 relative overflow-hidden flex items-end p-4">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-xl" />
                    <div className="flex items-center gap-1.5 bg-white/80 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-pink-950 dark:text-white">
                      <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                      Verified Creator
                    </div>
                  </div>

                  {/* Store Info */}
                  <div className="space-y-2 mb-6">
                    <h3 className="text-2xl font-black text-pink-950 dark:text-white group-hover:text-purple-600 transition-colors">
                      @{creator.storeName}
                    </h3>
                    <p className="text-sm text-pink-700 dark:text-zinc-400 line-clamp-2">
                      {creator.bio || "Crafting exclusive streetwear drops on Kraftize."}
                    </p>
                  </div>
                </div>

                {/* Visit Store Button */}
                <Link
                  href={`/shop/${creator.storeName}`}
                  className="w-full py-3 bg-pink-50 dark:bg-zinc-800 hover:bg-pink-100 dark:hover:bg-zinc-700 text-pink-950 dark:text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Explore Store</span>
                  <ArrowRight className="h-4 w-4 text-purple-600" />
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}