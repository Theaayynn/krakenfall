"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error ?? "Something went wrong.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-abyss px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-brass/15 bg-white/[0.03] p-8 backdrop-blur-xl">
        <h1 className="mb-6 font-display text-xl text-parchment">Harbor Master Access</h1>
        <label className="mb-1 block text-sm text-parchment/60">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="mb-4 w-full rounded-lg border border-brass/20 bg-transparent px-3 py-2 text-sm text-parchment outline-none focus:border-brass/60"
        />
        <label className="mb-1 block text-sm text-parchment/60">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="mb-4 w-full rounded-lg border border-brass/20 bg-transparent px-3 py-2 text-sm text-parchment outline-none focus:border-brass/60"
        />
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brass py-2.5 text-sm font-medium text-abyss transition hover:bg-brass-soft disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
