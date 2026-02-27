"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout, isLoaded } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-base/80 backdrop-blur-md border-b border-[var(--border)]" style={{ background: "color-mix(in srgb, var(--bg-base) 85%, transparent)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl transition-transform group-hover:scale-110">🛍️</span>
            <span className="font-bold text-lg sm:text-xl tracking-tight hidden sm:block" style={{ color: "var(--text-primary)" }}>
              Product Discovery
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <ThemeToggle />

            <Link
              href="/wishlist"
              className={`relative p-2 rounded-full transition-colors ${pathname === "/wishlist" ? "bg-[var(--bg-card-hover)] text-[var(--accent)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"}`}
              title="Wishlist"
            >
              <svg className="w-6 h-6" fill={pathname === "/wishlist" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 w-4 h-4 text-[10px] font-bold text-white bg-pink-500 rounded-full border-2 border-[var(--bg-base)]">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className={`relative p-2 rounded-full transition-colors ${pathname === "/cart" ? "bg-[var(--bg-card-hover)] text-[var(--accent)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"}`}
              title="Cart"
            >
              <svg className="w-6 h-6" fill={pathname === "/cart" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 w-4 h-4 text-[10px] font-bold text-white bg-[var(--accent)] rounded-full border-2 border-[var(--bg-base)] shadow-[var(--shadow-glow)]">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth section */}
            <div className="pl-2 sm:pl-4" style={{ borderLeft: "1px solid var(--border)" }}>
              {!isLoaded ? (
                <div className="w-16 h-8 rounded-lg skeleton"></div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-semibold text-[var(--text-primary)] leading-tight">{user.name}</span>
                    <button onClick={logout} className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent)] uppercase tracking-wider transition-colors">Logout</button>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[var(--gradient-hero)] flex items-center justify-center text-white font-bold shadow-[var(--shadow-glow)] cursor-default">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Mobile logout */}
                  <button onClick={logout} className="sm:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--accent)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn-primary text-sm px-4 py-2 font-medium">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
