"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm text-parchment/70">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-brass/20 bg-transparent px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60 ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-brass/20 bg-transparent px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60 ${props.className ?? ""}`}
    />
  );
}

export function SubmitButton({ children, loading }: { children: ReactNode; loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-brass py-2.5 text-sm font-medium text-abyss transition hover:bg-brass-soft disabled:opacity-50"
    >
      {loading ? "Saving…" : children}
    </button>
  );
}
