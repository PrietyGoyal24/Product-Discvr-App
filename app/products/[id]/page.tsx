"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { products, Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { use, useEffect, useState } from "react";

// Removed category gradients/icons since we use real images now

interface Params {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: Params) {
  // Use React `use` hook to unwrap the promise securely in Next 15 Client Comp
  const { id } = use(params);

  const product: Product | undefined = products.find(
    (p) => p.id === parseInt(id, 10)
  );

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!product) {
    if (mounted) notFound();
    return null;
  }

  const favorited = isWishlisted(product.id);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const [pitch, setPitch] = useState<string | null>(null);
  const [pitchLoading, setPitchLoading] = useState(false);

  const fetchPitch = async () => {
    if (pitchLoading || pitch) return;
    setPitchLoading(true);
    try {
      const res = await fetch("/api/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (res.ok) setPitch(data.pitch);
    } catch (err) {
      console.error("Pitch error:", err);
    } finally {
      setPitchLoading(false);
    }
  };

  const [localReviews, setLocalReviews] = useState(product.reviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewText || reviewRating === 0) return;

    const newReviewItem = {
      id: Date.now().toString(),
      author: reviewName,
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    setLocalReviews([newReviewItem, ...localReviews]);
    setReviewName("");
    setReviewText("");
    setReviewRating(0);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowReviewForm(false);
    }, 2000);
  };

  const handleCart = () => addToCart(product);
  const handleWishlist = () => favorited ? removeFromWishlist(product.id) : addToWishlist(product);

  return (
    <main className="min-h-screen relative flex flex-col items-center">
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-10 left-10 w-[30vw] h-[30vw] blob mix-blend-screen blur-[100px] opacity-10" style={{ background: "var(--blob1)" }} />
        <div className="absolute bottom-10 right-10 w-[20vw] h-[20vw] blob blob-2 mix-blend-screen blur-[100px] opacity-10" style={{ background: "var(--blob2)" }} />
      </div>

      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium hover:underline group"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        {/* ── Hero Image ── */}
        <section className="card overflow-hidden mb-12 sm:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center justify-center relative overflow-hidden h-64 sm:h-96 bg-[var(--bg-elevated)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)" }}
            />
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
                  {product.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 leading-tight text-[var(--text-primary)]">
                  {product.name}
                </h1>

                {/* Star Ratings */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-[var(--text-primary)]">{product.rating}</span>
                  <span className="text-sm text-[var(--text-muted)]">({product.reviews.length} reviews)</span>
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                ${product.price}
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-8 text-[var(--text-secondary)]">
              {product.description}
            </p>

            {/* AI Pitch Section */}
            <div className="mb-8">
              {!pitch && (
                <button
                  onClick={fetchPitch}
                  disabled={pitchLoading}
                  className="flex items-center gap-2 group px-4 py-2 rounded-xl border border-[var(--accent-glow)] bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all text-sm font-semibold disabled:opacity-50"
                >
                  {pitchLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {pitchLoading ? "Generating Insight..." : "Ask AI why to buy"}
                </button>
              )}
              {pitch && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-card)] border border-[var(--accent-glow)] shadow-inner animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">✨</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] mb-1">AI Smart Pitch</p>
                      <p className="text-sm sm:text-base italic text-[var(--text-primary)] leading-relaxed font-medium">
                        &quot;{pitch}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {product.tags.map((tag) => (
                <span key={tag} className="tag text-sm px-3 py-1">#{tag}</span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[var(--border)]">
              <button onClick={handleCart} className="btn-primary flex-1 py-3.5 sm:py-4 text-base sm:text-lg hover:shadow-lg active:scale-95 transition-all">
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`btn-ghost flex-1 py-3.5 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2 ${favorited ? 'text-pink-400 border-pink-400/50 bg-pink-400/10' : ''}`}
              >
                <svg className="w-5 h-5" fill={favorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favorited ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </section>

        {/* ── Reviews Section ── */}
        <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Customer Reviews</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-sm font-bold text-[var(--accent)] hover:underline decoration-2 underline-offset-4"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          </div>

          {showReviewForm && (
            <div className="card p-6 mb-8 border border-[var(--accent-glow)] bg-[var(--bg-elevated)] animate-in slide-in-from-top-4 duration-300">
              {submitted ? (
                <div className="py-8 text-center animate-in fade-in zoom-in duration-500">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Thank you!</h3>
                  <p className="text-[var(--text-secondary)]">Your review has been successfully submitted.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Share your experience</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setReviewRating(star)}
                            className="focus:outline-none transition-transform active:scale-110"
                          >
                            <svg
                              className={`w-8 h-8 ${(hoverRating || reviewRating) >= star ? 'text-yellow-500 fill-current' : 'text-gray-600'}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="reviewer-name" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Your Name</label>
                      <input
                        id="reviewer-name"
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g. Alex Smith"
                        className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="review-text" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Review</label>
                      <textarea
                        id="review-text"
                        required
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="What did you like or dislike?"
                        className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] outline-none resize-none"
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3 font-bold">
                      Submit Review
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {localReviews.length === 0 ? (
            <div className="card p-12 text-center border-dashed border-2 border-[var(--border)]">
              <p className="text-[var(--text-muted)] mb-2">No reviews yet.</p>
              <p className="text-sm text-[var(--text-secondary)]">Be the first to share your experience with this {product.name}!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {localReviews.map((review) => (
                <div key={review.id} className="card p-6 border border-[var(--border)] transition-all hover:border-[var(--accent-glow)]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">{review.author}</p>
                      <div className="flex text-yellow-500 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-tighter">{review.date}</span>
                  </div>
                  <p className="text-[var(--text-secondary)] italic leading-relaxed text-sm">
                    &quot;{review.text}&quot;
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Related ── */}
        {related.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 px-1 text-[var(--text-primary)]">
              Similar in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {related.map((p) => (
                <Link href={`/products/${p.id}`} key={p.id} className="group focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-[1rem]">
                  <article className="card flex items-center p-3 gap-4 rounded-[1rem]">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 bg-[var(--bg-elevated)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate group-hover:text-[var(--accent)] transition-colors text-[var(--text-primary)]">
                        {p.name}
                      </p>
                      <p className="text-sm font-medium mt-0.5 text-[var(--accent)]">${p.price}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
