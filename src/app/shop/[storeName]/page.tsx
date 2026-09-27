import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Globe, Shirt, Star, Package } from "lucide-react";

export const dynamic = "force-dynamic";

// 1. Define the props interface cleanly for Next.js 15
interface PageProps {
  params: Promise<{ storeName: string }>;
}

export default async function StorePage({ params }: PageProps) {
  // 2. Await and extract the storeName
  const { storeName } = await params;

  // 3. Fetch the store profile
  const store = await prisma.creatorProfile.findUnique({
    where: { storeName: storeName },
    include: { user: true },
  });

  // 4. If store doesn't exist, show 404
  if (!store) {
    notFound();
  }

  // 5. Fetch all published designs for this creator
  const designs = await prisma.userDesign.findMany({
    where: {
      userId: store.userId,
      isPublished: true,
    },
    include: {
      baseProduct: true, 
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen pb-16 bg-pink-50/30 dark:bg-black transition-colors duration-300">
      
      {/* Top Banner Gradient */}
      <div className="h-64 sm:h-80 w-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl" />
        
        {/* Back Button */}
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link 
            href="/shop" 
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white font-bold transition-all text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Creator Info Section */}
        <div className="relative -mt-24 sm:-mt-32 mb-16">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-pink-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start text-center sm:text-left">
            
            {/* Store Logo/Avatar */}
            <div className="relative shrink-0">
              <img
                src={store.user.image || `https://ui-avatars.com/api/?name=${store.storeName}&size=200`}
                alt={`${store.storeName} logo`}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-white dark:border-zinc-900 shadow-lg object-cover bg-pink-100 dark:bg-zinc-800"
              />
            </div>

            {/* Store Details */}
            <div className="flex-1 space-y-4 pt-2">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black text-pink-950 dark:text-white tracking-tight">
                  @{store.storeName}
                </h1>
                <p className="text-pink-600 dark:text-zinc-400 mt-2 text-lg max-w-2xl">
                  {store.bio || "Independent creator on Kraftize."}
                </p>
              </div>

              {store.socialLink && (
                <a
                  href={store.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 dark:bg-zinc-800 hover:bg-pink-100 dark:hover:bg-zinc-700 text-pink-700 dark:text-pink-300 rounded-xl font-medium transition-colors text-sm"
                >
                  <Globe className="h-4 w-4" />
                  Visit Portfolio
                </a>
              )}
            </div>
            
            {/* Stats Box */}
            <div className="hidden lg:flex flex-col gap-3 shrink-0">
              <div className="flex items-center gap-3 px-6 py-4 bg-pink-50 dark:bg-zinc-950 rounded-2xl border border-pink-100 dark:border-zinc-800">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                  <Shirt className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-pink-950 dark:text-white">{designs.length}</p>
                  <p className="text-xs text-pink-600 dark:text-zinc-500 font-medium">Designs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Catalog */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-pink-950 dark:text-white flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              Latest Drops
            </h2>
          </div>

          {designs.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 border-2 border-dashed border-pink-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center">
              <div className="h-20 w-20 bg-pink-50 dark:bg-zinc-950 rounded-full flex items-center justify-center mb-6">
                <Package className="h-10 w-10 text-pink-300 dark:text-zinc-700" />
              </div>
              <h3 className="text-2xl font-bold text-pink-950 dark:text-white mb-2">No drops yet.</h3>
              <p className="text-pink-600 dark:text-zinc-400 max-w-md mx-auto">
                @{store.storeName} is still cooking up their first collection in the AI Studio. Check back soon!
              </p>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designs.map((design) => (
                <Link key={design.id} href={`/shop/${store.storeName}/${design.id}`} className="group">
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-pink-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300">
                    
                    {/* Product Image Placeholder */}
                    <div className="aspect-[4/5] bg-pink-50 dark:bg-zinc-950 relative overflow-hidden flex items-center justify-center p-8">
                      {design.frontPrintUrl ? (
                        <img 
                          src={design.frontPrintUrl} 
                          alt={design.title || "T-Shirt Design"} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Shirt className="h-32 w-32 text-pink-200 dark:text-zinc-800" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-5">
                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1 uppercase tracking-wider">
                        {design.baseProduct?.category || "Apparel"}
                      </p>
                      <h3 className="font-bold text-pink-950 dark:text-white text-lg mb-2 truncate">
                        {design.title || "Untitled Design"}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="font-black text-lg text-pink-950 dark:text-white">
                          ₹{design.baseProduct?.basePrice ? design.baseProduct.basePrice + 500 : 1499}
                        </p>
                        <span className="text-xs font-bold px-2 py-1 bg-pink-100 dark:bg-zinc-800 text-pink-700 dark:text-zinc-300 rounded-lg">
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}