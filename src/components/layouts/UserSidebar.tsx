"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { X, Home, LogIn, LogOut, Settings, Moon, Sun, ChevronDown, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

// --- THE MAGIC TRIGGER ---
// Kept in its own tiny component so useSearchParams() can sit inside <Suspense>.
// That lets Next.js pre-render every page that uses the sidebar during `npm run build`.
function LoginParamListener({ onLoginParam }: { onLoginParam: () => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      onLoginParam();

      // Removes ?login=true from the URL but stays on the current page
      router.replace(pathname, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null; // renders nothing, only listens to the URL
}

export default function UserSidebar({ isOpen, onClose, onOpenLogin }: UserSidebarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: session } = useSession();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLoginClick = () => {
    onClose();
    onOpenLogin();
  };

  return (
    <>
      {/* Listens for ?login=true in the URL and opens your custom modal */}
      <Suspense fallback={null}>
        <LoginParamListener onLoginParam={handleLoginClick} />
      </Suspense>

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-pink-950/20 dark:bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sliding Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-pink-50/95 dark:bg-black/90 backdrop-blur-xl border-l border-pink-200 dark:border-zinc-800 z-[101] transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pink-200 dark:border-zinc-800 transition-colors">
          <h2 className="text-lg font-bold text-pink-950 dark:text-white">Menu</h2>
          <button onClick={onClose} className="text-pink-400 hover:text-pink-800 dark:text-zinc-500 dark:hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Options */}
        <div className="p-4 space-y-2 text-pink-950 dark:text-white">
          <button
            onClick={() => handleNavigation("/")}
            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-pink-100 dark:hover:bg-zinc-900 transition-colors text-left font-medium"
          >
            <Home className="h-5 w-5 text-pink-500 dark:text-zinc-400 transition-colors" />
            Home
          </button>

          {/* --- USER AUTH SECTION --- */}
          {session ? (
            <>
              {/* Profile Card */}
              <div className="flex items-center gap-3 p-4 mb-2 rounded-xl bg-pink-100/50 dark:bg-zinc-900/50 border border-pink-200 dark:border-zinc-800">
                <img
                  src={session.user?.image || ""}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border-2 border-purple-500 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-pink-950 dark:text-white truncate">
                    {session.user?.name}
                  </span>
                  <span className="text-xs text-pink-700 dark:text-zinc-400 truncate">
                    {session.user?.email}
                  </span>
                </div>
              </div>

              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-pink-100 dark:hover:bg-zinc-900 transition-colors text-pink-950 dark:text-white font-medium"
              >
                <LayoutDashboard className="h-5 w-5 text-purple-500" />
                <span>Dashboard</span>
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors font-medium text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            /* Login Button (If not logged in) */
            <button
              onClick={handleLoginClick}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-pink-100 dark:hover:bg-zinc-900 transition-colors text-left font-medium"
            >
              <LogIn className="h-5 w-5 text-purple-500 dark:text-purple-400 transition-colors" />
              Login
            </button>
          )}

          {/* Settings Accordion */}
          <div>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-pink-100 dark:hover:bg-zinc-900 transition-colors text-left font-medium mt-2"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-pink-500 dark:text-zinc-400 transition-colors" />
                Settings
              </div>
              <ChevronDown className={`h-4 w-4 text-pink-500 dark:text-zinc-400 transition-transform ${isSettingsOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Expanded Settings Options */}
            {isSettingsOpen && (
              <div className="pl-12 pr-4 py-2 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-pink-800 dark:text-zinc-400 transition-colors">Appearance</span>

                  {/* Theme Toggle Button */}
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-lg bg-pink-100 dark:bg-zinc-800 hover:bg-pink-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Moon className="h-4 w-4 text-purple-500" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}