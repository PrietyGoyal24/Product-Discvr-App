"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalItems, totalPrice, increaseQuantity, decreaseQuantity } = useCart();
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + tax;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Your Cart</h1>
        {items.length > 0 && (
          <button onClick={clearCart} className="text-sm font-medium text-[var(--text-muted)] hover:text-red-400 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4 opacity-50 translate-y-2 animate-bounce">🛒</div>
          <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Your cart is empty</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-sm">Looks like you haven&apos;t added any products to your cart yet. Discover something new with AI!</p>
          <Link href="/" className="btn-primary px-8 py-3 rounded-full font-bold">Start Exploring</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => {
              return (
                <div key={item.product.id} className="card p-4 flex gap-4 items-center group">
                  <div className="w-20 h-20 bg-[var(--bg-elevated)] rounded-xl flex items-center justify-center shrink-0 border border-[var(--border)] overflow-hidden transition-transform group-hover:scale-105">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.id}`} className="font-bold text-[var(--text-primary)] hover:text-[var(--accent)] truncate block transition-colors">
                      {item.product.name}
                    </Link>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-2">{item.product.category}</p>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-[var(--text-primary)]">${item.product.price}</span>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-[var(--bg-elevated)] rounded-lg border border-[var(--border)] overflow-hidden">
                        <button
                          onClick={() => decreaseQuantity(item.product.id)}
                          className="p-1.5 px-3 hover:bg-[var(--bg-card-hover)] transition-colors text-[var(--text-secondary)]"
                          disabled={item.quantity <= 1}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[var(--text-primary)] border-x border-[var(--border)]">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.product.id)}
                          className="p-1.5 px-3 hover:bg-[var(--bg-card-hover)] transition-colors text-[var(--text-secondary)]"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="md:col-span-1">
            <div className="card p-6 sticky top-24 shadow-xl border-[var(--accent-glow)]">
              <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)] border-b border-[var(--border)] pb-4">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--text-primary)]">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-[var(--text-primary)]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)] pt-4 border-t border-dashed border-[var(--border)]">
                  <span>Shipping</span>
                  <span className="text-green-500 font-bold uppercase text-xs tracking-widest mt-1">Free</span>
                </div>
                <div className="flex justify-between text-2xl font-extrabold text-[var(--text-primary)] pt-4 border-t border-[var(--border)]">
                  <span>Total</span>
                  <span className="text-[var(--accent)] tracking-tight">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/checkout/success"
                onClick={clearCart}
                className="btn-primary w-full py-4 rounded-xl font-bold text-lg mb-3 block text-center shadow-[var(--shadow-glow)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                Complete Purchase
              </Link>
              <p className="text-[var(--text-muted)] text-[10px] text-center uppercase tracking-widest">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
