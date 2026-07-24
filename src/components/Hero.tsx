"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import MagneticButton from "@/components/MagneticButton";
import { ChevronDown } from "lucide-react";

const OceanScene = dynamic(() => import("@/components/OceanScene"), { ssr: false });

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from(".hero-eyebrow", { opacity: 0, y: 16, duration: 0.8, ease: "power3.out" })
        .from(".hero-title-line", { opacity: 0, y: 60, duration: 1.1, stagger: 0.12, ease: "power4.out" }, "-=0.4")
        .from(".hero-sub", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .from(".hero-cta", { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" }, "-=0.4")
        .from(".hero-scroll-hint", { opacity: 0, duration: 1 }, "-=0.2");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <OceanScene />

      {/* Vignette for legibility over the 3D scene */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-abyss/70 via-transparent to-abyss" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(4,6,10,0.7)_100%)]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <span className="hero-eyebrow mb-6 rounded-full border border-brass/25 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-brass-soft backdrop-blur-md">
          An Original Voyage
        </span>

        <h1 className="font-display text-5xl leading-[1.05] text-parchment sm:text-7xl lg:text-8xl">
          <span className="hero-title-line block">Chart the Edge</span>
          <span className="hero-title-line block bg-gradient-to-r from-brass-soft via-brass to-tide-glow bg-clip-text text-transparent">
            of the Drowned World
          </span>
        </h1>

        <p className="hero-sub mt-8 max-w-xl text-base text-parchment/60 sm:text-lg">
          A fable of storm-bound seas, forbidden fruits, and a crew who trade safety
          for legend. Raise sail — the tide will not wait.
        </p>

        <div className="hero-cta mt-10 flex flex-col gap-4 sm:flex-row">
          <MagneticButton href="#crew">Meet the Crew</MagneticButton>
          <MagneticButton href="#journey" variant="glass">
            Begin the Journey
          </MagneticButton>
        </div>
      </div>

      <div className="hero-scroll-hint absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-parchment/40">
        <span className="text-[10px] uppercase tracking-[0.3em]">Descend</span>
        <ChevronDown className="animate-bounce" size={16} />
      </div>
    </section>
  );
}
