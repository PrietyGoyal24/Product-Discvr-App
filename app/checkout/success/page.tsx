"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutSuccessPage() {
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Generate a semi-realistic order number
    const random = Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(`DAI-${random}`);
  }, []);

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center">
      <div className="card max-w-lg w-full p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Animated Background Confetti Mockup */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping" />
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
        </div>

        <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-green-500/10 border-4 border-green-500 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[var(--text-primary)]">Order Confirmed!</h1>
          <p className="text-[var(--text-secondary)] mb-8 text-lg">
            Thank you for choosing **DiscvrAI**. Your order has been processed successfully and is being prepared for shipment.
          </p>

          <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 mb-10 border border-[var(--border)]">
            <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest mb-1">Confirmation Number</p>
            <p className="text-2xl font-mono font-bold text-[var(--accent)] tracking-tighter">{orderNumber || "Loading..."}</p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="btn-primary w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 block shadow-[var(--shadow-glow)]"
            >
              Continue Shopping
            </Link>
            <p className="text-[var(--text-muted)] text-sm">
              A confirmation email has been sent to your registered address.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </main>
  );
}
