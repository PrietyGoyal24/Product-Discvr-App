"use client";

import { useState, useEffect } from "react";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Small delay for dramatic effect when they load the site
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="card w-full max-w-md p-8 relative animate-in zoom-in-95 duration-500 shadow-2xl border border-[var(--border)] bg-[var(--bg-card)] rounded-2xl">

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
          aria-label="Close welcome popup"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Welcome to Product Discovery!
          </h2>
          <p className="text-[var(--text-secondary)] mb-6 text-sm leading-relaxed">
            We've just upgraded our entire catalog with gorgeous new products and advanced AI search capabilities.
            <br className="mb-2" />
            Try asking our AI assistant to find the perfect gear for you!
          </p>

          <button
            onClick={() => setIsOpen(false)}
            className="btn-primary w-full py-3 font-semibold tracking-wide"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
}
