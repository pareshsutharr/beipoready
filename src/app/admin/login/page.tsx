"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-brand-gold rounded-md" />
            <span className="font-serif text-lg font-bold text-white">Be IPO Ready</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="font-sans text-sm text-white/50">Sign in to manage leads and content</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                placeholder="admin@beipoready.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="font-sans text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-gold text-brand-navy font-semibold rounded-lg text-sm hover:bg-amber-400 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center font-sans text-xs text-white/30 mt-6">
          Be IPO Ready Admin Portal &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
