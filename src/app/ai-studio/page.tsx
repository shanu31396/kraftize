"use client";

import { Suspense } from "react";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { Sparkles, RefreshCw, Layers, Wand2 } from "lucide-react";

export default function AIStudioPage() {
  const prompt = useCustomizerStore((state) => state.prompt);
  const selectedProduct = useCustomizerStore((state) => state.selectedProduct);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6 mb-8 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Active Prompt</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              "{prompt || "Custom Cyberpunk Samurai T-Shirt"}"
            </h1>
          </div>

          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
            <RefreshCw className="h-4 w-4" /> Generate New Variations
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Mockup Preview Placeholder */}
        <div className="lg:col-span-2 border border-zinc-800 bg-zinc-900/30 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px] relative">
          <div className="absolute top-4 left-4 bg-zinc-800/80 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 backdrop-blur-sm">
            Product: {selectedProduct}
          </div>
          
          <div className="text-center text-zinc-500">
            <Wand2 className="h-12 w-12 mx-auto mb-4 animate-bounce text-purple-500" />
            <p className="text-lg font-medium text-zinc-300">3D Interactive Canvas Placeholder</p>
            <p className="text-sm mt-1">AI Mockups & Layer Customizer will render here in Phase 7</p>
          </div>
        </div>

        {/* Right Column: Style Controls */}
        <div className="border border-zinc-800 bg-zinc-900/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-pink-500" /> Studio Controls
          </h2>
          
          <div className="space-y-4 text-sm text-zinc-400">
            <div className="p-4 border border-zinc-800 bg-zinc-900/50 rounded-xl">
              <p className="font-medium text-white mb-1">Base Garment</p>
              <p>{selectedProduct}</p>
            </div>

            <div className="p-4 border border-zinc-800 bg-zinc-900/50 rounded-xl">
              <p className="font-medium text-white mb-1">Print Placement</p>
              <p>Front Chest (300DPI PNG)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}