"use client";

import { useEffect, useState, useCallback } from "react";
import { Sparkles, TrendingUp, Heart, ChevronLeft, ChevronRight, Crown, ArrowRight } from "lucide-react";
import HeroPromptInput from "@/components/home/HeroPromptInput";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

// Mock data for our trending designs
const trendingDesigns = [
  { id: 1, prompt: "Cyberpunk Samurai", creator: "@NeonNinja", likes: "12.4k", color: "bg-purple-500/20" },
  { id: 2, prompt: "Retro 90s Anime", creator: "@TokyoDrift", likes: "8.9k", color: "bg-pink-500/20" },
  { id: 3, prompt: "Minimalist F1 Car", creator: "@SpeedDemon", likes: "6.2k", color: "bg-blue-500/20" },
  { id: 4, prompt: "Gothic Typography", creator: "@DarkArts", likes: "5.1k", color: "bg-zinc-500/20" },
  { id: 5, prompt: "Synthwave Sunset", creator: "@VaporWave", likes: "4.8k", color: "bg-orange-500/20" },
];

const featuredCreators = [
  { name: "Tokyo Drift", handle: "@tokyodrift", sales: "1.2k+ drops", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
  { name: "Studio X", handle: "@studio_x", sales: "850+ drops", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
  { name: "Nomad Apparel", handle: "@nomad_apparel", sales: "2.5k+ drops", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
];

export default function HomePage() {
  // Initialize Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Arrow navigation functions
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Track the active slide to apply the "Apple scale" effect
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start text-center pt-28 pb-20 overflow-hidden bg-white dark:bg-black transition-colors duration-300">

      {/* 1. THE AI GENERATOR HERO */}
      <div className="px-4 sm:px-6 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-purple-500/30 bg-purple-500/10 text-sm font-medium text-purple-600 dark:text-purple-300 backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          <span>Kraftize AI Generator v1.0 is live</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-black dark:text-white max-w-4xl transition-colors duration-300">
          Don't just wear it. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 dark:from-purple-400 dark:via-pink-500 dark:to-red-500">
            Imagine it.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl transition-colors duration-300">
          Type a prompt, generate unique designs, and personalize premium heavyweight apparel in seconds.
        </p>

        {/* Interactive Client Component */}
        <div className="mt-10 w-full max-w-3xl relative z-20">
          <HeroPromptInput />
        </div>

        {/* Quick category pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-zinc-500">
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Oversized T-Shirts</span>
          <span className="hidden sm:inline">•</span>
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Premium Hoodies</span>
          <span className="hidden sm:inline">•</span>
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Cargo Pants</span>
        </div>
      </div>

      {/* 2. EMBLA TRENDING DESIGNS CAROUSEL */}
      <div className="mt-32 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Trending on Kraftize
            </h2>
          </div>

          <Link href="/explore" className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-pink-500 transition-colors cursor-pointer">
            View Marketplace →
          </Link>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative w-full py-6 group">
          
          <button 
            onClick={scrollPrev} 
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:text-purple-600 cursor-pointer hidden md:flex items-center justify-center"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="overflow-hidden w-full py-4" ref={emblaRef}>
            <div className="flex -ml-4 touch-pan-y">
              {trendingDesigns.map((design, index) => {
                const isActive = index === selectedIndex;
                return (
                  <div key={design.id} className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_35%] pl-4 min-w-0">
                    <div
                      onClick={() => emblaApi?.scrollTo(index)} 
                      className={`
                        group/card relative h-[380px] w-full overflow-hidden rounded-3xl
                        border border-zinc-200 dark:border-zinc-800
                        bg-zinc-100 dark:bg-zinc-950/60 backdrop-blur-xl
                        cursor-pointer transition-all duration-700 ease-out
                        ${isActive 
                          ? "scale-100 opacity-100 shadow-[0_20px_40px_-15px_rgba(168,85,247,0.3)] z-10 border-purple-500/50" 
                          : "scale-90 opacity-40 hover:opacity-60 z-0"
                        }
                      `}
                    >
                      <div className={`absolute inset-0 opacity-30 transition-transform duration-700 group-hover/card:scale-125 ${design.color}`} />

                      <div className="relative z-10 flex h-full items-center justify-center pb-8">
                        <div className="
                          h-48 w-44 rounded-xl bg-white dark:bg-zinc-800
                          border border-zinc-200 dark:border-zinc-700 shadow-2xl
                          flex items-center justify-center text-xs font-bold text-zinc-400
                          group-hover/card:scale-110 transition-transform duration-500
                        ">
                          AI Preview
                        </div>
                      </div>

                      <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-black dark:text-white shadow-sm">
                        <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
                        {design.likes}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-black/60 backdrop-blur-xl p-4 shadow-lg transition-transform duration-500">
                        <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">{design.creator}</p>
                        <p className="text-sm font-semibold text-black dark:text-white line-clamp-1">"{design.prompt}"</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={scrollNext} 
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:text-purple-600 cursor-pointer hidden md:flex items-center justify-center"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* 3. BUYER MARKETPLACE BRIDGE (NEW) */}
      <div className="mt-32 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-100 dark:border-zinc-900 pt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-black dark:text-white flex items-center justify-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-500" /> Featured Sellers
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
            Not feeling creative today? Browse and buy exclusive drops from the top AI artists in our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {featuredCreators.map((creator, idx) => (
            <Link href={`/shop/${creator.handle.replace('@', '')}`} key={idx} className="group">
              <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex items-center gap-4 hover:border-purple-500/50 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <img 
                  src={creator.avatar} 
                  alt={creator.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-zinc-800 shadow-sm"
                />
                <div className="text-left flex-1">
                  <h3 className="font-bold text-black dark:text-white group-hover:text-purple-600 transition-colors">{creator.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{creator.handle} • {creator.sales}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-300 dark:text-zinc-700 group-hover:text-purple-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}