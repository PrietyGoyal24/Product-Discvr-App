"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    signup(email, name);
    router.push("/");
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] blob mix-blend-screen blur-[100px] opacity-10" style={{ background: "var(--blob2)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] blob blob-3 mix-blend-screen blur-[100px] opacity-10" style={{ background: "var(--blob3)" }} />
      </div>

      <div className="card w-full max-w-md p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🚀</div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Create an Account</h1>
          <p className="text-[var(--text-secondary)] text-sm">Join us to save your favorite products and checkout seamlessly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-theme w-full px-4 py-3"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email Address</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-theme w-full px-4 py-3"
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3.5 mt-2 text-lg">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
