"use client";

import { X, Mail } from "lucide-react";
import { signIn } from "next-auth/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Blur Overlay - Soft pink tint in light mode, dark tint in dark mode */}
      <div
        className="absolute inset-0 bg-pink-950/20 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content - Crisp white in light mode, Pitch Black in dark mode */}
      <div className="relative w-full max-w-md bg-white dark:bg-black border border-pink-200 dark:border-zinc-800 rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.15)] dark:shadow-[0_0_40px_rgba(168,85,247,0.15)] overflow-hidden transition-colors duration-300">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-pink-400 hover:text-pink-800 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-pink-950 dark:text-white mb-2 transition-colors">Welcome to Kraftize</h2>
          <p className="text-pink-700/80 dark:text-zinc-400 text-sm mb-8 transition-colors">
            Log in to save your AI designs and access the Creator Marketplace.
          </p>

          <div className="space-y-4">
            {/* Google Login Button */}
            <button
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-100 border border-pink-200 dark:border-transparent text-black px-4 py-3 rounded-xl font-bold hover:bg-pink-50 dark:hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                {/* Replaced currentColor with Google Blue (#4285F4) */}
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Email/OTP Login Button */}
            <button
              className="w-full flex items-center justify-center gap-3 bg-pink-50 dark:bg-zinc-900 border border-pink-200 dark:border-zinc-800 text-pink-950 dark:text-white px-4 py-3 rounded-xl font-bold hover:bg-pink-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Mail className="h-5 w-5" />
              Continue with Email
            </button>
          </div>

          {/* Create Account Link */}
          <div className="mt-8 pt-6 border-t border-pink-200 dark:border-zinc-800 transition-colors">
            <p className="text-sm text-pink-800 dark:text-zinc-400">
              Don't have an account with us?{" "}
              <button className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer">
                Create new one
              </button>
            </p>
          </div>

          <p className="mt-8 text-xs text-pink-500/80 dark:text-zinc-500 transition-colors">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}