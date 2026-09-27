"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Search, Wand2 } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import UserSidebar from "@/components/layouts/UserSidebar";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import CartSidebar from "@/components/layouts/CartSidebar";

export default function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: session, status } = useSession();
  const totalItems = useCartStore((state) => state.getTotalItems());
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "AI Studio", href: "/ai-studio", hasDot: true },
    { name: "Creators", href: "/creators" },
  ];

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 border-b border-pink-200 dark:border-zinc-800 bg-pink-50/90 dark:bg-black/80 backdrop-blur-md transition-colors duration-300 pb-2 shadow-sm"
        style={{
          borderBottomLeftRadius: "50% 24px",
          borderBottomRightRadius: "50% 24px",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 pt-2">

          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-purple-500" />
            <Link href="/" className="text-2xl font-bold tracking-tighter text-pink-950 dark:text-white transition-colors">
              KRAFTIZE
            </Link>
          </div>

          {/* Desktop Navigation */}
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium group h-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  // 1. THE CONTAINER: Stretches to full height, handles margins, but NEVER scales.
                  // This mathematically locks the bottom line in place so it can never slip.
                  className={`
                    relative z-10 flex items-center h-full px-2 origin-center transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
                    hover:mx-3 hover:z-20
                  `}
                >
                  
                  {/* 2. THE TEXT: All scaling and hover effects happen securely in here */}
                  <span
                    className={`
                      relative flex items-center transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] origin-center
                      group-hover:scale-95 hover:!scale-[1.28]
                      ${isActive
                        ? "text-pink-700 dark:text-white font-bold scale-110 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)] dark:drop-shadow-[0_0_14px_rgba(255,255,255,0.85)]"
                        : link.hasDot
                          ? "text-pink-900/80 dark:text-white/90 hover:text-pink-600 dark:hover:text-pink-500"
                          : "text-pink-900/80 dark:text-white/90 hover:text-purple-600 dark:hover:text-purple-400"
                      }
                    `}
                  >
                    <span>{link.name}</span>

                    {/* Red Dot for AI Studio */}
                    {link.hasDot && (
                      <span className="relative flex h-2 w-2 ml-1">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isActive ? "bg-red-500" : "bg-red-600/50"}`} />
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${isActive ? "bg-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]" : "bg-red-500 drop-shadow-[0_0_6px_rgba(236,72,153,0.6)]"}`} />
                      </span>
                    )}
                  </span>

                  {/* 3. THE SHARP LINE: Locked exactly on the border curve, no ambient glow, no sliding. */}
                  {isActive && (
                    <span 
                      className="absolute -left-2 -right-2 bottom-[-8px] h-[2px] bg-gradient-to-r from-transparent via-pink-600 dark:via-white to-transparent animate-in fade-in duration-300"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Icons Section */}
          <div className="flex items-center gap-4 text-pink-400 dark:text-zinc-400">
            <button className="hover:text-pink-800 dark:hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="hover:text-pink-800 dark:hover:text-white transition-colors flex items-center justify-center"
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="h-7 w-7 rounded-full border border-pink-300 dark:border-zinc-600 object-cover hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:text-pink-800 dark:hover:text-white transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* The UI Components */}
      <UserSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenLogin={() => setIsAuthOpen(true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}