"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioStore } from "@/store/audio-store";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [visible, setVisible] = useState(false);
  const playSfx = useAudioStore((s) => s.playSfx);

  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const trailIdRef = useRef(0);
  const lastTrailTime = useRef(0);

  useEffect(() => {
    // Desktop-only — mobile/touch devices skip the custom cursor entirely.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setVisible(true);
    let raf: number;

    function handleMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor-hover]");
      setIsPointer(Boolean(interactive));

      const now = performance.now();
      if (now - lastTrailTime.current > 45) {
        lastTrailTime.current = now;
        trailIdRef.current += 1;
        const id = trailIdRef.current;
        setTrail((t) => [...t.slice(-7), { x: e.clientX, y: e.clientY, id }]);
        setTimeout(() => setTrail((t) => t.filter((p) => p.id !== id)), 380);
      }
    }

    function handleDown() {
      setIsDown(true);
      const id = Date.now();
      setRipples((r) => [...r, { x: pos.current.x, y: pos.current.y, id }]);
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    }
    function handleUp() {
      setIsDown(false);
    }

    function handleOverInteractive(e: Event) {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor-hover]")) playSfx("hover");
    }

    function loop() {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      raf = requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("mouseover", handleOverInteractive);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("mouseover", handleOverInteractive);
    };
  }, [playSfx]);

  if (!visible) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300] hidden md:block">
      {/* Slash trail */}
      {trail.map((p, i) => (
        <div
          key={p.id}
          className="absolute h-px rounded-full bg-brass-soft/60"
          style={{
            left: p.x,
            top: p.y,
            width: 18,
            opacity: (i + 1) / trail.length,
            transform: "translate(-50%, -50%) rotate(-35deg)",
            transition: "opacity 0.35s ease-out",
          }}
        />
      ))}

      {/* Ripples on click */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full border border-brass/60"
          style={{
            left: r.x,
            top: r.y,
            width: 8,
            height: 8,
            transform: "translate(-50%, -50%)",
            animation: "cursor-ripple 0.6s ease-out forwards",
          }}
        />
      ))}

      {/* Outer ring — morphs on hover, shrinks on click */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full border transition-[width,height,border-color] duration-200 ease-out"
        style={{
          width: isPointer ? 56 : 32,
          height: isPointer ? 56 : 32,
          marginLeft: isPointer ? -28 : -16,
          marginTop: isPointer ? -28 : -16,
          borderColor: isPointer ? "rgba(228,199,122,0.8)" : "rgba(228,199,122,0.35)",
          transform: `scale(${isDown ? 0.85 : 1})`,
        }}
      />

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass-soft transition-transform duration-150"
        style={{ transform: `translate(-50%, -50%) scale(${isDown ? 1.8 : 1})` }}
      />

      <style jsx global>{`
        @keyframes cursor-ripple {
          to {
            width: 64px;
            height: 64px;
            margin-left: -32px;
            margin-top: -32px;
            opacity: 0;
          }
        }
        * {
          cursor: none !important;
        }
      `}</style>
    </div>
  );
}
