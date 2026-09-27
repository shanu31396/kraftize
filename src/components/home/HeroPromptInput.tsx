"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCustomizerStore } from "@/store/useCustomizerStore";

export default function HeroPromptInput() {
  const [inputPrompt, setInputPrompt] = useState("");
  const setPrompt = useCustomizerStore((state) => state.setPrompt);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim()) return;

    // Save prompt to Zustand store
    setPrompt(inputPrompt);

    // Navigate to the AI Studio
    router.push("/ai-studio");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 w-full max-w-2xl relative group">
      {/* Outer Glow Effect - Looks great in both themes */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
      
      {/* 
        THEME UPDATE:
        Light Mode: Clean white/soft pink background, dark text, pink-tinted borders.
        Dark Mode: Pitch black (dark:bg-black), white text, dark zinc borders.
      */}
      <div className="relative flex items-center bg-white dark:bg-black border border-pink-200 dark:border-zinc-800 rounded-2xl shadow-xl dark:shadow-2xl p-2 pl-6 transition-colors duration-300">
        
        {/* Icon Theme: vibrant pink in light mode, soft purple in dark mode */}
        <Sparkles className="h-5 w-5 text-pink-500 dark:text-purple-400 mr-3 hidden sm:block transition-colors" />
        
        <input 
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="e.g. A cyberpunk samurai on an oversized black hoodie..." 
          className="flex-1 bg-transparent border-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-0 text-base sm:text-lg transition-colors"
        />
        
        <button 
          type="submit"
          className="ml-2 sm:ml-4 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 sm:px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-pink-500/20"
        >
          Generate <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}