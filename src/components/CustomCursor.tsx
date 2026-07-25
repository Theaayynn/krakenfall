"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Body se normal cursor hide kar dete hain
    document.body.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, { 
        x: e.clientX, 
        y: e.clientY, 
        duration: 0.1, 
        ease: "power2.out" 
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      {/* Sci-fi Crosshair SVG */}
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        <circle cx="12" cy="12" r="2" fill="white" />
      </svg>
    </div>
  );
}