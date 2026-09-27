import { auth } from "../../../auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Palette, Store, PlusCircle, IndianRupee, Settings, ExternalLink, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import ClaimStoreForm from "./ClaimStoreForm";

// Force Next.js to always fetch fresh data
export const dynamic = "force-dynamic";

export default async function CreatorsRouterPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; store?: string }>; // <-- 1. Updated Type
}) {
  // 2. UNWRAP THE PROMISE HERE
  const params = await searchParams; 

  const session = await auth();

  // Not logged in -> Show the form telling them to log in
  if (!session || !session.user?.email) {
    return <ClaimStoreForm isAuthenticated={false} />;
  }

  // Fetch user and ALL their stores
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    // @ts-ignore
    include: { creatorProfiles: true },
  });

  // @ts-ignore
  const stores = user?.creatorProfiles || [];

  // ==========================================
  // VIEW A: CREATING A NEW STORE
  // Triggers if they have 0 stores, OR if they clicked "Add Another Store" (?new=true)
  // ==========================================
  if (stores.length === 0 || params.new === "true") {
    return (
      <div className="relative">
        {/* If they already have a store, give them a back button! */}
        {stores.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 -mb-16 relative z-10">
            <Link 
              href="/creators" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-pink-200 dark:border-zinc-800 rounded-xl text-pink-600 hover:text-purple-600 font-bold shadow-sm transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Cancel & Go Back
            </Link>
          </div>
        )}
        <ClaimStoreForm isAuthenticated={true} />
      </div>
    );
  }

  // ==========================================
  // VIEW B: THE STORE SELECTOR HUB
  // Triggers if they have MULTIPLE stores, but haven't selected one yet
  // ==========================================
  if (stores.length > 1 && !params.store) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-pink-50/30 dark:bg-black">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-pink-950 dark:text-white">Select your Brand</h1>
              <p className="text-lg text-pink-700 dark:text-zinc-400 mt-2">Which creator dashboard do you want to open?</p>
            </div>
            <Link 
              href="/creators?new=true" 
              className="flex items-center gap-2 px-6 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              <PlusCircle className="h-5 w-5" /> Add Another Store
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {stores.map((s: any) => (
              <Link 
                key={s.id} 
                href={`/creators?store=${s.id}`} 
                className="group block p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-pink-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-300 dark:hover:border-purple-800 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-pink-50 dark:bg-zinc-800 rounded-2xl group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
                    <Store className="h-8 w-8 text-pink-500 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <ChevronRight className="h-6 w-6 text-zinc-300 group-hover:text-purple-500 transition-colors" />
                </div>
                <h2 className="text-2xl font-black text-pink-950 dark:text-white mb-2">@{s.storeName}</h2>
                <p className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold text-sm rounded-lg">
                  <IndianRupee className="h-3 w-3" />
                  {s.totalEarnings.toFixed(2)} Earned
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW C: THE CREATOR HQ DASHBOARD
  // Loads the exact store they selected (or the only store they have)
  // ==========================================
  
  const store = params.store 
    ? stores.find((s: any) => s.id === params.store) || stores[0]
    : stores[0];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-pink-50/30 dark:bg-black">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-bold mb-4">
              <Store className="h-4 w-4" />
              Creator HQ
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-pink-950 dark:text-white flex items-center gap-3">
              @{store.storeName}
              
              {/* If they have multiple stores, let them switch back to the hub! */}
              {stores.length > 1 && (
                <Link href="/creators" className="text-sm px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 transition-colors">
                  Switch
                </Link>
              )}
            </h1>
          </div>
          
          <Link 
            href={`/shop/${store.storeName}`}
            target="_blank"
            className="flex items-center gap-2 text-pink-600 dark:text-zinc-400 font-bold hover:text-purple-600 transition-colors"
          >
            View Public Store <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* THE STUDIO BUTTON */}
          <Link href="/studio" className="group">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-8 h-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <Palette className="h-12 w-12 text-white mb-6" />
              <h2 className="text-2xl font-black text-white mb-2">Open Creator Studio</h2>
              <p className="text-pink-100 font-medium">
                Upload new artwork, generate AI assets, and drop new merch.
              </p>
            </div>
          </Link>

          {/* INTERACTIVE EARNINGS STATS BOX */}
          <Link 
            href={`/creators/analytics?store=${store.id}`} 
            className="group bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-pink-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Hover highlight effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-2xl group-hover:bg-green-200 transition-colors">
                <IndianRupee className="h-8 w-8" />
              </div>
              <span className="px-3 py-1 bg-pink-50 dark:bg-zinc-800 text-pink-700 dark:text-zinc-300 font-bold text-sm rounded-lg border border-pink-100 dark:border-zinc-700">
                {store.commissionRate}% Commission
              </span>
            </div>
            
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm uppercase tracking-wider mb-1">
                  Total Earnings
                </p>
                <h3 className="text-4xl font-black text-pink-950 dark:text-white">
                  ₹{store.totalEarnings.toFixed(2)}
                </h3>
              </div>
              <div className="text-green-600 flex items-center gap-1 font-bold text-sm group-hover:translate-x-1 transition-transform">
                View <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* BOTTOM SECTION: Store Management & Add Store */}
        <div className="mt-12 pt-8 border-t border-pink-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* INTERACTIVE SETTINGS LINK */}
          <Link 
            href={`/creators/settings?store=${store.id}`}
            className="px-6 py-3 bg-white dark:bg-zinc-900 border border-pink-200 dark:border-zinc-700 text-pink-950 dark:text-white font-bold rounded-xl flex items-center gap-2 hover:bg-pink-50 dark:hover:bg-zinc-800 transition-colors w-full sm:w-auto justify-center"
          >
            <Settings className="h-4 w-4" />
            Store Settings
          </Link>

          {/* INTERACTIVE ADD STORE LINK */}
          <Link 
            href="/creators?new=true"
            className="px-6 py-3 border-2 border-dashed border-purple-300 dark:border-purple-900/50 text-purple-700 dark:text-purple-400 font-bold rounded-xl flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors w-full sm:w-auto justify-center"
          >
            <PlusCircle className="h-5 w-5" />
            Add Another Store
          </Link>
        </div>

      </div>
    </div>
  );
}