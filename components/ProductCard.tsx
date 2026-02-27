"use client";

import Link from "next/link";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const favorited = isWishlisted(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorited) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.id}`} className="group focus:outline-none">
      <article className="card h-full flex flex-col overflow-hidden relative">
        {/* Quick Actions (Floating) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={toggleWishlist}
            className="p-2 rounded-full bg-[rgba(0,0,0,0.5)] backdrop-blur-md text-white hover:text-pink-500 transition-colors shadow-lg"
            title="Wishlist"
          >
            <svg className="w-5 h-5" fill={favorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-[rgba(0,0,0,0.5)] backdrop-blur-md text-white hover:text-[var(--accent)] transition-colors shadow-lg"
            title="Add to Cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>

        {/* Hero Banner (Real Image) */}
        <div className="h-48 md:h-56 relative w-full overflow-hidden flex items-center justify-center bg-[var(--bg-elevated)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)"
            }}
          />
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-bold px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-full border border-white/20 shadow-sm tracking-wider uppercase">
              ${product.price}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 flex flex-col flex-1 relative z-10 bg-[var(--bg-card)]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent)] transition-colors truncate pr-2">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] font-bold text-[var(--text-primary)]">{product.rating}</span>
          </div>
          <p className="text-xs sm:text-sm line-clamp-2 mb-4" style={{ color: "var(--text-secondary)" }}>
            {product.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag text-[0.65rem] px-2 py-0.5 opacity-90">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
