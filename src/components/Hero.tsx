"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth GSAP Parallax Effect on Mouse Move
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      // Calculate movement offset
      const xPos = (clientX / window.innerWidth - 0.5) * 30; // 30px max movement
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      gsap.to(".hero-bg", {
        x: xPos,
        y: yPos,
        duration: 1.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      
      {/* Background Image with Parallax Class */}
      {/* We add -m-10 and larger w/h so the edges don't show when moving */}
      <div 
        className="hero-bg absolute inset-0 -m-10 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />
      
      {/* Cinematic Dark Gradients (Top & Bottom fades) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02060D]/80 via-transparent to-[#02060D] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#02060D_100%)] pointer-events-none opacity-80" />

      {/* Main Typography Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4 mix-blend-lighten">
        <span className="text-red-600 font-mono text-xs sm:text-sm tracking-[0.5em] uppercase animate-pulse drop-shadow-lg">
          &gt;&gt; The New Era Awaits
        </span>
        
        <h1 className="text-7xl sm:text-9xl md:text-[12rem] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-600 drop-shadow-2xl">
          KRAKENFALL
        </h1>
        
        <p className="text-gray-400 font-mono text-sm sm:text-base max-w-lg tracking-[0.2em] uppercase mt-4">
          Unleash the Gear 5 • Claim the One Piece
        </p>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60">
        <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-white">Scroll to Explore</span>
        <div className="w-[2px] h-16 bg-gradient-to-b from-red-600 to-transparent animate-pulse rounded-full" />
      </div>
      
    </section>
  );
}