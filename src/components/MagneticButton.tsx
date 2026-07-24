"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAudioStore } from "@/store/audio-store";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  variant?: "solid" | "glass";
  className?: string;
}

export default function MagneticButton({ href, children, variant = "solid", className = "" }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const playSfx = useAudioStore((s) => s.playSfx);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setOffset({
      x: (e.clientX - rect.left - rect.width / 2) * 0.3,
      y: (e.clientY - rect.top - rect.height / 2) * 0.3,
    });
  }

  const base =
    variant === "solid"
      ? "bg-brass text-abyss hover:bg-brass-soft"
      : "border border-brass/30 text-parchment backdrop-blur-md bg-white/5 hover:border-brass/60";

  return (
    <motion.a
      ref={ref}
      href={href}
      data-cursor-hover
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      onClick={() => playSfx("click")}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.4 }}
      className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-colors ${base} ${className}`}
    >
      {children}
    </motion.a>
  );
}

export function StaticButton({ href, children, variant = "solid", className = "" }: MagneticButtonProps) {
  const playSfx = useAudioStore((s) => s.playSfx);
  const base =
    variant === "solid"
      ? "bg-brass text-abyss hover:bg-brass-soft"
      : "border border-brass/30 text-parchment backdrop-blur-md bg-white/5 hover:border-brass/60";
  return (
    <Link
      href={href}
      data-cursor-hover
      onClick={() => playSfx("click")}
      className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-colors ${base} ${className}`}
    >
      {children}
    </Link>
  );
}
