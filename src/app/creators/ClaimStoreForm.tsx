"use client";

import { createCreatorProfile } from "./actions";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Sparkles, TrendingUp, Package, ArrowRight, CheckCircle2, Store, Paintbrush, Globe } from "lucide-react";

export default function ClaimStoreForm({ isAuthenticated = true }: { isAuthenticated?: boolean }) {
    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Form State
    const [storeName, setStoreName] = useState("");
    const [bio, setBio] = useState("");
    const [socialLink, setSocialLink] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(""); // Clear old errors

        // Call the server action directly!
        const result = await createCreatorProfile({
            storeName,
            bio,
            socialLink
        });

        setIsSubmitting(false);

        // Handle the response
        if (result.error) {
            setErrorMsg(result.error);
        } else if (result.success) {
            setIsSuccess(true);
        }
    };

    const perks = [
        {
            icon: <Paintbrush className="h-6 w-6 text-pink-500" />,
            title: "Design with AI",
            description: "Use our AI Studio to generate mind-blowing concepts in seconds. No design degree required."
        },
        {
            icon: <Package className="h-6 w-6 text-purple-500" />,
            title: "Zero Inventory",
            description: "We handle the printing, packing, and shipping. You focus entirely on creating and promoting."
        },
        {
            icon: <TrendingUp className="h-6 w-6 text-green-500" />,
            title: "High Margins",
            description: "Set your own prices above our base manufacturing cost and keep 100% of the profit."
        }
    ];

    // We can use either the prop from the server or the client-side session status
    const showLoginPrompt = !isAuthenticated || status === "unauthenticated";

    return (
        <div className="min-h-screen pt-24 pb-12 bg-pink-50/30 dark:bg-black transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Left Side: Copy & Value Proposition */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 text-sm font-bold tracking-wide">
                            <Sparkles className="h-4 w-4" />
                            KRAFTIZE CREATORS
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black text-pink-950 dark:text-white tracking-tight leading-tight">
                            Turn your imagination into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">fashion empire.</span>
                        </h1>

                        <p className="text-lg text-pink-700 dark:text-zinc-400">
                            Launch your own premium streetwear brand in minutes. We provide the AI tools and handle the logistics. You collect the profits.
                        </p>

                        <div className="space-y-6 pt-4">
                            {perks.map((perk, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-pink-100 dark:border-zinc-800">
                                        {perk.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-pink-950 dark:text-white">{perk.title}</h3>
                                        <p className="text-pink-700 dark:text-zinc-400 mt-1">{perk.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: The Application Form */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 lg:p-10 border border-pink-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">

                            {/* Background gradient decoration */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-500/20 blur-3xl" />

                            {isSuccess ? (
                                <div className="relative z-10 flex flex-col items-center text-center py-12 animate-in fade-in zoom-in duration-500">
                                    <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h2 className="text-3xl font-black text-pink-950 dark:text-white mb-4">Store Created Successfully!</h2>
                                    <p className="text-pink-700 dark:text-zinc-400 mb-8">
                                        Your new brand is ready to go, {session?.user?.name}. Let's get to work!
                                    </p>
                                    <a
                                        href="/creators"
                                        className="px-8 py-3 bg-pink-950 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:scale-105 transition-transform"
                                    >
                                        Go to Creator HQ
                                    </a>
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold text-pink-950 dark:text-white mb-2">Claim your store</h2>
                                    <p className="text-pink-600 dark:text-zinc-400 mb-8">Set up your brand profile to start selling.</p>

                                    {showLoginPrompt ? (
                                        <div className="text-center py-10 bg-pink-50 dark:bg-zinc-950 rounded-2xl border border-dashed border-pink-200 dark:border-zinc-800">
                                            <Store className="h-12 w-12 text-pink-300 dark:text-zinc-600 mx-auto mb-4" />
                                            <h3 className="text-lg font-bold text-pink-950 dark:text-white mb-2">Authentication Required</h3>
                                            <p className="text-sm text-pink-700 dark:text-zinc-400 mb-6 px-4">
                                                You must be logged in to apply for a creator account.
                                            </p>

                                            <Link
                                                href="/creators?login=true"
                                                className="inline-block text-center px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold shadow-md hover:bg-purple-700 transition-colors w-full sm:w-auto"
                                            >
                                                Log In to Apply
                                            </Link>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">

                                            {/* Show Errors here */}
                                            {errorMsg && (
                                                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold animate-in fade-in">
                                                    {errorMsg}
                                                </div>
                                            )}

                                            {/* Store Name Input */}
                                            <div>
                                                <label className="block text-sm font-bold text-pink-950 dark:text-white mb-2">Store Name</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 font-bold">@</span>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={storeName}
                                                        onChange={(e) => setStoreName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                        placeholder="your_brand_name"
                                                        className="w-full pl-10 pr-4 py-3 bg-pink-50 dark:bg-zinc-950 border border-pink-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white"
                                                    />
                                                </div>
                                                <p className="text-xs text-pink-500 dark:text-zinc-500 mt-1">This will be your unique store URL.</p>
                                            </div>

                                            {/* Bio Input */}
                                            <div>
                                                <label className="block text-sm font-bold text-pink-950 dark:text-white mb-2">Brand Bio</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                    placeholder="What is your design style? Who are you?"
                                                    className="w-full px-4 py-3 bg-pink-50 dark:bg-zinc-950 border border-pink-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
                                                />
                                            </div>

                                            {/* Social Link Input */}
                                            <div>
                                                <label className="block text-sm font-bold text-pink-950 dark:text-white mb-2">Instagram / Portfolio (Optional)</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                                                    <input
                                                        type="url"
                                                        value={socialLink}
                                                        onChange={(e) => setSocialLink(e.target.value)}
                                                        placeholder="https://instagram.com/..."
                                                        className="w-full pl-11 pr-4 py-3 bg-pink-50 dark:bg-zinc-950 border border-pink-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting || storeName.length < 3}
                                                className="w-full py-4 mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                                            >
                                                {isSubmitting ? (
                                                    <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Submit Application
                                                        <ArrowRight className="h-5 w-5" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}