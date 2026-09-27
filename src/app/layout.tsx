import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SessionProvider from "@/components/providers/SessionProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kraftize | AI Fashion & Creator Marketplace",
  description: "Personalize your wardrobe with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // SuppressHydrationWarning is required by next-themes so the server doesn't complain about class names
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-zinc-950 text-black dark:text-white min-h-screen antialiased transition-colors duration-300`}>
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}