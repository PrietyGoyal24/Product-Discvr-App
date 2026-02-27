"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-4rem)] flex flex-col">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-[var(--text-primary)] flex items-center gap-3">
        Your Wishlist
        <span className="text-xl font-medium px-3 py-1 bg-[var(--bg-card)] rounded-full text-[var(--accent)] border border-[var(--border)]">
          {items.length}
        </span>
      </h1>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4 opacity-50">💔</div>
          <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Your wishlist is empty</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-sm">Save your favorite products here so you can easily find them later when you are ready to buy.</p>
          <Link href="/" className="btn-primary px-6 py-3">Discover Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
