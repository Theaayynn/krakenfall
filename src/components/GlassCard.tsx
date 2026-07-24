import type { ReactNode } from "react";

export default function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-brass/15 bg-white/[0.03] backdrop-blur-xl transition-colors hover:border-brass/35 ${className}`}
    >
      {children}
    </div>
  );
}
