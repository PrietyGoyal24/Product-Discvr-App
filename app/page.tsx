"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import AskBar from "@/components/AskBar";
import ProductSkeleton from "@/components/ProductSkeleton";

const CATEGORIES = ["All", "Laptops", "Phones", "Audio", "Gaming"];

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAiMode, setIsAiMode] = useState(false);
  const [sortBy, setSortBy] = useState("Recommended");

  const getSortedProducts = useCallback((list: Product[], sortType: string) => {
    const sorted = [...list];
    if (sortType === "Price: Low to High") {
      return sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === "Price: High to Low") {
      return sorted.sort((a, b) => b.price - a.price);
    } else if (sortType === "Highest Rated") {
      return sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted; // Recommended / Default
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setAllProducts(data);
        setProducts(getSortedProducts(data, sortBy));
      } catch {
        setError("Failed to load products. Please refresh the page.");
      } finally {
        setPageLoading(false);
      }
    };
    fetchProducts();
  }, [getSortedProducts, sortBy]);

  // Watch products or sortBy change to re-sort
  useEffect(() => {
    if (pageLoading) return;
    setProducts(prev => getSortedProducts(prev, sortBy));
  }, [sortBy, getSortedProducts, pageLoading]);

  const handleCategoryFilter = useCallback(
    (cat: string) => {
      setActiveCategory(cat);
      if (isAiMode) return;
      if (cat === "All") {
        setProducts(getSortedProducts(allProducts, sortBy));
      } else {
        const filtered = allProducts.filter((p) => p.category === cat);
        setProducts(getSortedProducts(filtered, sortBy));
      }
    },
    [allProducts, isAiMode, getSortedProducts, sortBy]
  );

  const handleAsk = async (userQuery: string) => {
    setLoading(true);
    setError(null);
    setSummary(null);
    setQuery(userQuery);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setProducts(getSortedProducts(data.products, sortBy));
      setSummary(data.summary);
      setIsAiMode(true);
      setActiveCategory("All");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to get AI results. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSummary(null);
    setError(null);
    setIsAiMode(false);
    setActiveCategory("All");
    setProducts(getSortedProducts(allProducts, sortBy));
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* ── Background Blobs ── */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 left-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] blob mix-blend-multiply blur-3xl opacity-40" style={{ background: "var(--blob1)", transform: "translate(-20%, -20%)" }} />
        <div className="absolute bottom-0 right-0 w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] blob blob-2 mix-blend-multiply blur-3xl opacity-40" style={{ background: "var(--blob2)", transform: "translate(20%, 20%)" }} />
        <div className="absolute top-1/2 left-1/4 w-[30vw] h-[30vw] max-w-[350px] max-h-[350px] blob blob-3 mix-blend-multiply blur-3xl opacity-30" style={{ background: "var(--blob3)", transform: "translate(-50%, -50%)" }} />
      </div>

      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* ── Hero Section ── */}
        <header className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border text-xs sm:text-sm font-medium" style={{ background: "var(--accent-light)", borderColor: "var(--accent-glow)", color: "var(--accent)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
            Powered by Gemini AI 2.5
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight">
            <span style={{ background: "var(--gradient-hero)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Find Exactly What
            </span>
            <br />
            You&apos;re Looking For
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto px-4" style={{ color: "var(--text-secondary)" }}>
            Describe what you need in plain English and let our intelligent assistant curate the perfect products for you.
          </p>
        </header>

        {/* ── Ask Bar ── */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-12 relative z-10 px-2 sm:px-0">
          <AskBar onSubmit={handleAsk} loading={loading} initialValue={query} />
        </div>

        {/* ── Clear Button ── */}
        {isAiMode && (
          <div className="flex justify-center mb-8">
            <button id="clear-search-btn" onClick={handleClear} className="btn-ghost flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-muted)] hover:text-red-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear AI Search
            </button>
          </div>
        )}

        {/* ── AI Summary Box ── */}
        {summary && !error && (
          <div className="mb-10 max-w-4xl mx-auto summary-box shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-inner" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--accent)" }}>
                ✨
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold mb-1.5" style={{ color: "var(--accent)" }}>AI Analysis</p>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-primary)" }}>{summary}</p>
                {query && (
                  <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      <span className="text-xs font-semibold truncate italic text-[var(--text-secondary)]">&quot;{query}&quot;</span>
                    </div>
                    <span className="text-[10px] items-center gap-1 uppercase tracking-widest text-[var(--text-muted)] flex">
                      Smart Search Active
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Error Box ── */}
        {error && (
          <div className="mb-10 max-w-3xl mx-auto error-box animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* ── Category Filters ── */}
        {!isAiMode && !pageLoading && (
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-12 justify-center px-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryFilter(cat)}
                className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Product Grid ── */}
        <section aria-label="Product list">
          {pageLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-pulse opacity-80">
              {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 sm:py-24 max-w-md mx-auto">
              <div className="text-6xl sm:text-7xl mb-6 opacity-80 drop-shadow-lg scale-110">🔍</div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>No matches found</h2>
              <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
                {isAiMode
                  ? "Our AI couldn't find any products perfectly matching your description. Try altering your search query."
                  : "We don't have any products in this category yet."}
              </p>
              <button onClick={handleClear} className="btn-primary px-8 py-3 w-full sm:w-auto">
                Show All Products
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 px-1 gap-4">
                <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {isAiMode ? (
                    <>Found <span className="font-bold text-[var(--accent)]">{products.length}</span> optimized matches</>
                  ) : (
                    <>Showing <span className="font-bold text-[var(--text-primary)]">{products.length}</span> {activeCategory !== "All" ? activeCategory.toLowerCase() : "available"} items</>
                  )}
                </p>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)] whitespace-nowrap">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all cursor-pointer hover:border-[var(--text-muted)]"
                  >
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Highest Rated</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
