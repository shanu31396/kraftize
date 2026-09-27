import { create } from "zustand";

interface CustomizerState {
  prompt: string;
  selectedProduct: string;
  isGenerating: boolean;
  generatedImages: string[];
  selectedImage: string | null;

  // Actions
  setPrompt: (prompt: string) => void;
  setSelectedProduct: (product: string) => void;
  setIsGenerating: (status: boolean) => void;
  setGeneratedImages: (images: string[]) => void;
  setSelectedImage: (image: string | null) => void;
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
  prompt: "",
  selectedProduct: "Oversized T-Shirts",
  isGenerating: false,
  generatedImages: [],
  selectedImage: null,

  setPrompt: (prompt) => set({ prompt }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGeneratedImages: (generatedImages) => set({ generatedImages }),
  setSelectedImage: (selectedImage) => set({ selectedImage }),
}));