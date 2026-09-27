"use client";

import { useState, useEffect, useRef } from "react";
import { X, Smartphone, QrCode, CreditCard, Building2, Wallet, ArrowRight, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface KraftizePaymentUIProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
}

type PaymentMethod = "upi_intent" | "qr" | "card" | "netbanking" | "wallet";

export default function KraftizePaymentUI({ isOpen, onClose, amount }: KraftizePaymentUIProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi_intent");
    const [isMobile, setIsMobile] = useState(false);
    const [upiId, setUpiId] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);

    // Detect if user is on a mobile device to show Intent vs QR as default
    useEffect(() => {
        if (typeof window !== "undefined") {
            const checkMobile = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
            setIsMobile(checkMobile);
            setSelectedMethod(checkMobile ? "upi_intent" : "qr");
        }
    }, [isOpen]);

        // Clean up polling if they close the modal early
    useEffect(() => {
        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, []);

    if (!isOpen) return null;

    // This is the string that opens payment apps when scanned or clicked
    const upiString = `upi://pay?pa=merchant@razorpay&pn=Kraftize&am=${amount}&cu=INR&tn=Kraftize%20Order`;

    const handleUPIAppClick = (appName: string) => {
        // In a real mobile app, this deep links directly to PhonePe/GPay
        window.location.href = upiString;
    };

    const handleUPICollect = async () => {
        if (!upiId.includes("@")) {
            alert("Please enter a valid UPI ID (e.g., name@ybl)");
            return;
        }

        setIsProcessing(true);
        setPaymentStatus("pending");

        try {
            // 1. Call our backend to ping the banking network
            const res = await fetch("/api/checkout/upi-collect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ upiId, amount }),
            });

            const data = await res.json();

            if (data.success) {
                setActiveOrderId(data.razorpayOrderId);
                startPolling(data.razorpayOrderId); // 2. Start waiting for phone completion
            } else {
                setPaymentStatus("failed");
                alert(data.error);
            }
        } catch (err) {
            setPaymentStatus("failed");
        } finally {
            setIsProcessing(false);
        }
    };

    // THE REAL POLLING LOGIC (Checking if they paid on their phone)
    const startPolling = (orderId: string) => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);

        // Check backend every 3 seconds to see if they typed their PIN
        pollingInterval.current = setInterval(async () => {
            const res = await fetch(`/api/checkout/status?orderId=${orderId}`);
            const data = await res.json();

            if (data.status === "success") {
                if (pollingInterval.current) clearInterval(pollingInterval.current);
                setPaymentStatus("success");
                setTimeout(() => {
                    alert("Payment Successful! Order Placed.");
                    onClose(); // Close modal on success
                }, 1500);
            }
        }, 3000);
    };


    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-pink-950/40 dark:bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-zinc-950 w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-pink-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-300">

                {/* Left Side: Order Summary & Wallet */}
                <div className="w-full md:w-1/3 bg-pink-50 dark:bg-zinc-900 p-8 border-r border-pink-200 dark:border-zinc-800 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-pink-950 dark:text-white mb-6">Kraftize Secure Checkout</h2>
                        <p className="text-sm text-pink-700 dark:text-zinc-400 mb-2">Total Amount to Pay</p>
                        <p className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-8">₹{amount}</p>

                        {/* Kraftize Wallet Integration */}
                        <div className="bg-white dark:bg-black rounded-2xl p-4 border border-pink-200 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Wallet className="text-pink-500" />
                                <h3 className="font-bold text-pink-950 dark:text-white">Kraftize Wallet</h3>
                            </div>
                            <p className="text-sm text-pink-700 dark:text-zinc-400 mb-3">Available Balance: ₹500</p>
                            <button className="w-full py-2 bg-pink-100 dark:bg-zinc-800 text-pink-700 dark:text-pink-400 text-sm font-bold rounded-xl hover:bg-pink-200 dark:hover:bg-zinc-700 transition-colors">
                                Apply Wallet Balance
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-xs text-pink-600 dark:text-zinc-500 font-medium">
                        <ShieldCheck className="h-4 w-4" />
                        <span>256-bit Encrypted Seamless Payment</span>
                    </div>
                </div>

                {/* Right Side: Payment Methods */}
                <div className="w-full md:w-2/3 flex flex-col h-[500px]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-pink-100 dark:border-zinc-800">
                        <h3 className="font-bold text-pink-950 dark:text-white">Select Payment Method</h3>
                        <button onClick={onClose} className="text-pink-400 hover:text-pink-800 dark:text-zinc-500 dark:hover:text-white">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar Navigation */}
                        <div className="w-1/3 bg-white dark:bg-zinc-950 border-r border-pink-100 dark:border-zinc-800 p-4 space-y-2">
                            <NavButton icon={<QrCode />} label="Scan QR" active={selectedMethod === "qr"} onClick={() => setSelectedMethod("qr")} />
                            <NavButton icon={<Smartphone />} label="UPI Apps" active={selectedMethod === "upi_intent"} onClick={() => setSelectedMethod("upi_intent")} />
                            <NavButton icon={<CreditCard />} label="Card" active={selectedMethod === "card"} onClick={() => setSelectedMethod("card")} />
                            <NavButton icon={<Building2 />} label="Netbanking" active={selectedMethod === "netbanking"} onClick={() => setSelectedMethod("netbanking")} />
                        </div>

                        {/* Dynamic Content Area */}
                        <div className="w-2/3 p-6 flex flex-col justify-center">

                            {/* STATE 1: SCAN QR CODE */}
                            {selectedMethod === "qr" && (
                                <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
                                    <h4 className="font-bold text-pink-950 dark:text-white mb-2">Scan with any UPI App</h4>
                                    <p className="text-sm text-pink-700 dark:text-zinc-400 mb-6">PhonePe, Google Pay, Paytm</p>
                                    <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-purple-500">
                                        <QRCodeSVG value={upiString} size={200} level="H" />
                                    </div>
                                    <p className="text-xs text-pink-600 dark:text-zinc-500 mt-6 animate-pulse">Waiting for payment confirmation...</p>
                                </div>
                            )}

                            {/* STATE 2: UPI APPS / COLLECT */}
                            {selectedMethod === "upi_intent" && (
                                <div className="animate-in fade-in duration-300">
                                    {isMobile ? (
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-pink-950 dark:text-white mb-4">Pay via App</h4>
                                            <AppButton name="PhonePe" color="bg-purple-600" onClick={() => handleUPIAppClick('phonepe')} />
                                            <AppButton name="Google Pay" color="bg-blue-600" onClick={() => handleUPIAppClick('gpay')} />
                                            <AppButton name="Paytm" color="bg-sky-500" onClick={() => handleUPIAppClick('paytm')} />
                                        </div>
                                    ) : (
                                        <div className="space-y-4 text-center">
                                            <div className="h-16 w-16 bg-pink-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Smartphone className="h-8 w-8 text-purple-500" />
                                            </div>
                                            <h4 className="font-bold text-pink-950 dark:text-white">Send request to your phone</h4>
                                            <input
                                                type="text"
                                                placeholder="Enter UPI ID (eg. 9876543210@ybl)"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-pink-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                            
                                            {/* ---> HERE IS THE UPDATED BUTTON AND SUCCESS MESSAGE <--- */}
                                            <button 
                                                onClick={handleUPICollect}
                                                disabled={isProcessing || paymentStatus === "pending"}
                                                className="w-full mt-2 py-3 bg-purple-600 disabled:bg-purple-400 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
                                            >
                                                {paymentStatus === "pending" ? "Check your phone..." : "Send Request to App"}
                                            </button>

                                            {paymentStatus === "success" && (
                                                <div className="mt-4 p-3 bg-green-100 text-green-700 font-bold rounded-xl border border-green-300">
                                                    Payment Received Successfully!
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STATE 3: CARDS */}
                            {selectedMethod === "card" && (
                                <div className="animate-in fade-in duration-300 space-y-4">
                                    <h4 className="font-bold text-pink-950 dark:text-white mb-4">Enter Card Details</h4>
                                    <input type="text" placeholder="Card Number" className="w-full px-4 py-3 rounded-xl border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    <div className="flex gap-4">
                                        <input type="text" placeholder="MM/YY" className="w-1/2 px-4 py-3 rounded-xl border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        <input type="text" placeholder="CVV" className="w-1/2 px-4 py-3 rounded-xl border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                    <button className="w-full mt-4 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">
                                        Pay ₹{amount} Securely
                                    </button>
                                </div>
                            )}

                            {/* STATE 4: NETBANKING */}
                            {selectedMethod === "netbanking" && (
                                <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center text-center h-full">
                                    <Building2 className="h-12 w-12 text-pink-300 dark:text-zinc-600 mb-4" />
                                    <h4 className="font-bold text-pink-950 dark:text-white mb-2">Netbanking</h4>
                                    <p className="text-sm text-pink-700 dark:text-zinc-400">Select your bank from the secure portal on the next step.</p>
                                    <button className="w-full mt-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                                        <span>Proceed to Banks</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components for the UI
function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 border border-purple-200 dark:border-purple-800 shadow-sm"
                    : "text-pink-700 dark:text-zinc-400 hover:bg-pink-50 dark:hover:bg-zinc-900 hover:text-pink-950 dark:hover:text-white"
                }`}
        >
            <div className={active ? "text-purple-600" : "opacity-70"}>{icon}</div>
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );
}

function AppButton({ name, color, onClick }: { name: string, color: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-purple-500 transition-colors group"
        >
            <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center text-white font-bold text-xs`}>
                    {name[0]}
                </div>
                <span className="font-bold text-pink-950 dark:text-white">{name}</span>
            </div>
            <ArrowRight className="text-pink-300 dark:text-zinc-600 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
        </button>
    );
}