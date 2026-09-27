"use client";

import { useState, useRef } from "react";
import { UploadCloud, Wand2, Shirt, Save, Image as ImageIcon, Palette, Type, Settings2, LayoutTemplate, Layers, ChevronDown, Trash2, Info } from "lucide-react";
import { Rnd } from "react-rnd"; 

export default function CreatorStudio() {
  const [activeTab, setActiveTab] = useState<"upload" | "ai">("upload");
  
  // Independent States for Front and Back!
  const [activeView, setActiveView] = useState<"front" | "back">("front");
  const [frontArt, setFrontArt] = useState<string | null>(null);
  const [backArt, setBackArt] = useState<string | null>(null);
  const [frontDesign, setFrontDesign] = useState({ x: 50, y: 50, width: 150, height: 150 });
  const [backDesign, setBackDesign] = useState({ x: 50, y: 50, width: 150, height: 150 });
  
  // Helper variables to easily manage the currently active side
  const currentArt = activeView === "front" ? frontArt : backArt;
  const setCurrentArt = activeView === "front" ? setFrontArt : setBackArt;
  const currentDesign = activeView === "front" ? frontDesign : backDesign;
  const setCurrentDesign = activeView === "front" ? setFrontDesign : setBackDesign;

  // Professional Studio States
  type ProductKey = "tshirt_dtg" | "tshirt_aop" | "hoodie_dtg" | "hoodie_aop" | "joggers_dtg" | "mug";
  const [activeProduct, setActiveProduct] = useState<ProductKey>("tshirt_dtg");
  
  // Product Details State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("1499");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- COMPREHENSIVE PRODUCT CATALOG ---
  const productConfigs: Record<ProductKey, any> = {
    tshirt_dtg: {
      name: "Classic T-Shirt",
      type: "DTG (Direct-to-Garment)",
      desc: "Standard flat print on center chest/back.",
      baseCost: 799,
      printArea: { width: "50%", height: "55%", top: "20%", left: "50%", borderRadius: "8px" }
    },
    tshirt_aop: {
      name: "Premium T-Shirt (All-Over Print)",
      type: "Cut & Sew",
      desc: "Fabric is printed edge-to-edge, including sleeves, then sewn.",
      baseCost: 1499,
      printArea: { width: "100%", height: "100%", top: "0%", left: "50%", borderRadius: "0px" }
    },
    hoodie_dtg: {
      name: "Heavyweight Hoodie",
      type: "DTG (Direct-to-Garment)",
      desc: "Standard print above the front pocket.",
      baseCost: 1299,
      printArea: { width: "45%", height: "35%", top: "25%", left: "50%", borderRadius: "8px" }
    },
    hoodie_aop: {
      name: "Streetwear Hoodie (All-Over Print)",
      type: "Cut & Sew",
      desc: "Edge-to-edge printing across the entire hoodie.",
      baseCost: 2199,
      printArea: { width: "100%", height: "100%", top: "0%", left: "50%", borderRadius: "0px" }
    },
    joggers_dtg: {
      name: "Fleece Joggers",
      type: "DTG (Direct-to-Garment)",
      desc: "Standard print on the upper left leg.",
      baseCost: 1099,
      printArea: { width: "20%", height: "60%", top: "20%", left: "65%", borderRadius: "4px" }
    },
    mug: {
      name: "Ceramic Coffee Mug",
      type: "Sublimation",
      desc: "Wraparound glossy print.",
      baseCost: 399,
      printArea: { width: "70%", height: "60%", top: "20%", left: "50%", borderRadius: "12px" }
    }
  };

  const currentConfig = productConfigs[activeProduct];

  // Drag & Drop Handlers
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setCurrentArt(e.target?.result as string);
    reader.readAsDataURL(file);
    // Reset design position to center when new art is uploaded
    setCurrentDesign({ x: 50, y: 50, width: 150, height: 150 });
  };

  const handleDeleteArt = () => {
    setCurrentArt(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-pink-50/30 dark:bg-black transition-colors duration-300">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-pink-950 dark:text-white flex items-center gap-2">
              <Palette className="h-8 w-8 text-purple-600" />
              Creator Studio
            </h1>
            <p className="text-pink-600 dark:text-zinc-400 font-medium">Design and publish your next drop.</p>
          </div>
          
          <button className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5">
            <Save className="h-5 w-5" />
            Publish Product
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: Professional Tools */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. PRODUCT SELECTOR (DROPDOWN) */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-pink-100 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-bold text-pink-950 dark:text-white text-lg flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5 text-pink-500" /> Select Product Canvas
              </h3>
              
              <div className="relative">
                <select 
                  value={activeProduct}
                  onChange={(e) => setActiveProduct(e.target.value as ProductKey)}
                  className="w-full appearance-none bg-pink-50 dark:bg-zinc-950 border border-pink-200 dark:border-zinc-800 text-pink-950 dark:text-white rounded-xl px-4 py-4 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <optgroup label="Standard Products (DTG)">
                    <option value="tshirt_dtg">Classic T-Shirt - ₹799</option>
                    <option value="hoodie_dtg">Heavyweight Hoodie - ₹1299</option>
                    <option value="joggers_dtg">Fleece Joggers - ₹1099</option>
                  </optgroup>
                  <optgroup label="Premium Edge-to-Edge (Cut & Sew)">
                    <option value="tshirt_aop">Premium T-Shirt (All-Over Print) - ₹1499</option>
                    <option value="hoodie_aop">Streetwear Hoodie (All-Over Print) - ₹2199</option>
                  </optgroup>
                  <optgroup label="Accessories">
                    <option value="mug">Ceramic Coffee Mug - ₹399</option>
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500 pointer-events-none" />
              </div>

              {/* Dynamic Info Box explaining the manufacturing process */}
              <div className="flex gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/50">
                <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-purple-900 dark:text-purple-300 text-sm">{currentConfig.type}</p>
                  <p className="text-sm text-purple-700 dark:text-purple-400/80">{currentConfig.desc}</p>
                </div>
              </div>
            </div>

            {/* 2. ARTWORK UPLOAD (WITH DELETE BUTTON) */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-pink-100 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-pink-950 dark:text-white text-lg">
                  Editing: <span className="text-purple-600 capitalize">{activeView} Side</span>
                </h3>
                
                {/* DELETE BUTTON */}
                {currentArt && (
                  <button 
                    onClick={handleDeleteArt}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Remove Art
                  </button>
                )}
              </div>

              {currentArt ? (
                 <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-2xl flex items-center gap-4">
                    <div className="h-16 w-16 bg-white dark:bg-black rounded-lg overflow-hidden border border-green-200 dark:border-green-900/50">
                      <img src={currentArt} alt="Active Art" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-bold text-green-800 dark:text-green-400">Artwork loaded on {activeView}</p>
                      <p className="text-xs text-green-600 dark:text-green-500">Drag to position, use corners to scale.</p>
                    </div>
                 </div>
              ) : (
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
                    isDragging 
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10" 
                      : "border-pink-200 dark:border-zinc-700 hover:border-pink-400 hover:bg-pink-50/50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg" className="hidden" />
                  <div className="p-4 bg-white dark:bg-zinc-800 rounded-full shadow-sm">
                    <UploadCloud className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-bold text-pink-950 dark:text-white">Upload to {activeView}</p>
                    <p className="text-xs text-pink-600 dark:text-zinc-400 mt-1">High-res transparent PNG recommended.</p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. PRODUCT DETAILS */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-pink-100 dark:border-zinc-800 shadow-sm space-y-5">
              <h3 className="font-bold text-pink-950 dark:text-white text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-pink-400" /> Listing Details
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-2">Design Title</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`${currentConfig.name} Design`}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-pink-50 dark:bg-zinc-950 border-0 focus:ring-2 focus:ring-pink-500 font-medium text-pink-950 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-2">Retail Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-pink-400">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-pink-50 dark:bg-zinc-950 border-0 focus:ring-2 focus:ring-pink-500 font-black text-pink-950 dark:text-white"
                  />
                </div>
                <div className="flex justify-between items-center mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/50">
                  <span className="text-sm font-medium text-green-800 dark:text-green-400">Base Cost: ₹{currentConfig.baseCost}</span>
                  <span className="text-sm font-black text-green-700 dark:text-green-300">
                    Profit: ₹{(Number(price) - currentConfig.baseCost).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Interactive Pro Canvas */}
          <div className="lg:col-span-7 flex flex-col h-[750px]">
            
            {/* VIEW SWITCHER (Front/Back) */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-white dark:bg-zinc-900 p-1.5 rounded-full border border-pink-200 dark:border-zinc-800 shadow-sm relative z-20">
                <button 
                  onClick={() => setActiveView("front")}
                  className={`px-8 py-2.5 rounded-full font-black text-sm transition-all ${
                    activeView === "front" ? "bg-purple-600 text-white shadow-md" : "text-zinc-500 hover:text-pink-950 dark:hover:text-white"
                  }`}
                >
                  FRONT VIEW
                </button>
                <button 
                  onClick={() => setActiveView("back")}
                  className={`px-8 py-2.5 rounded-full font-black text-sm transition-all ${
                    activeView === "back" ? "bg-purple-600 text-white shadow-md" : "text-zinc-500 hover:text-pink-950 dark:hover:text-white"
                  }`}
                >
                  BACK VIEW
                </button>
              </div>
            </div>

            {/* The Main Stage */}
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-3xl border border-pink-100 dark:border-zinc-800 shadow-inner relative overflow-hidden flex items-center justify-center">
              
              {/* Background Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              {/* Product Mockup Container */}
              <div className="relative w-full max-w-lg aspect-[3/4] flex items-center justify-center z-10 transition-transform duration-500">
                
                {/* FAKE MOCKUP IMAGE (SVG placeholder) */}
                {activeProduct.includes("joggers") ? (
                  <div className="w-48 h-[500px] bg-white rounded-t-3xl shadow-xl flex gap-1 p-1 transition-all">
                    <div className="flex-1 bg-zinc-50 rounded-l-2xl border-r border-zinc-200" />
                    <div className="flex-1 bg-zinc-50 rounded-r-2xl border-l border-zinc-200" />
                  </div>
                ) : activeProduct === "mug" ? (
                  <div className="w-56 h-64 bg-white rounded-2xl shadow-xl relative transition-all">
                    <div className="absolute -right-8 top-12 w-12 h-32 border-[12px] border-white rounded-r-3xl shadow-lg -z-10" />
                  </div>
                ) : (
                  <Shirt 
                    className="absolute inset-0 w-full h-full text-white drop-shadow-2xl transition-all" 
                    strokeWidth={0.2} 
                    fill="#ffffff" 
                  />
                )}
                
                {/* DYNAMIC PRINT AREA (The Boundary Box) */}
                <div 
                  className={`absolute border-2 border-dashed z-20 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                    currentConfig.type === "Cut & Sew" ? "border-purple-400 bg-purple-500/10" : "border-zinc-400/50 bg-white/20 dark:bg-black/20"
                  }`}
                  style={{
                    width: currentConfig.printArea.width,
                    height: currentConfig.printArea.height,
                    top: currentConfig.printArea.top,
                    left: currentConfig.printArea.left || "50%",
                    transform: "translateX(-50%)",
                    borderRadius: currentConfig.printArea.borderRadius
                  }}
                >
                  
                  {!currentArt && (
                    <div className="flex flex-col items-center opacity-40 text-purple-900 dark:text-purple-300 pointer-events-none">
                      <Layers className="h-8 w-8 mb-2" />
                      <span className="text-xs font-bold tracking-widest uppercase text-center px-4">
                        {currentConfig.type === "Cut & Sew" ? "All-Over Print Canvas" : "DTG Print Zone"} <br/> ({activeView})
                      </span>
                    </div>
                  )}

                  {currentArt && (
                    <Rnd
                      bounds="parent" // Locks design to the print zone!
                      size={{ width: currentDesign.width, height: currentDesign.height }}
                      position={{ x: currentDesign.x, y: currentDesign.y }}
                      onDragStop={(e, d) => setCurrentDesign((prev) => ({ ...prev, x: d.x, y: d.y }))}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        setCurrentDesign({
                          width: parseInt(ref.style.width, 10),
                          height: parseInt(ref.style.height, 10),
                          ...position,
                        });
                      }}
                      lockAspectRatio={true}
                      className="group border border-transparent hover:border-purple-500 border-dotted transition-colors"
                    >
                      {/* Interactive Drag Corners */}
                      <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-purple-600 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm z-30 cursor-nwse-resize" />
                      <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-purple-600 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm z-30 cursor-nesw-resize" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-purple-600 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm z-30 cursor-nesw-resize" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-purple-600 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm z-30 cursor-nwse-resize" />
                      
                      <img 
                        src={currentArt} 
                        alt={`${activeView} Design`} 
                        className="w-full h-full object-contain pointer-events-none drop-shadow-md"
                      />
                    </Rnd>
                  )}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}