"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function PreLoader() {
  const [phase, setPhase] = useState<"loading" | "gateBreak" | "done">("loading");
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLog, setCurrentLog] = useState("GRAND LINE // LOG POSE SYNCHRONIZING...");

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  const logs = [
    "GRAND LINE // LOG POSE: NEW WORLD SECTOR",
    "THOUSAND SUNNY // COUP DE BURST REACTOR READY",
    "DEVIL FRUIT // HITO HITO NO MI, MODEL: NIKA AWAKENING",
    "STRAW HAT CREW // BOUNTY REFRESH: 3,000,000,000 BERRIES",
    "PONEGLYPH // ROAD PONEGLYPH DECRYPTION 100%"
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsLoaded(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 3) + 1;
      });
    }, 35);

    const logInterval = setInterval(() => {
      if (!isLoaded) {
        setCurrentLog(logs[Math.floor(Math.random() * logs.length)]);
      }
    }, 180);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, [isLoaded]);

  const handleStartVoyage = () => {
    if (!isLoaded) return;

    setPhase("gateBreak");

    const tl = gsap.timeline({
      onComplete: () => setPhase("done"),
    });

    tl.to(logoRef.current, {
      scale: 2.5,
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut",
    }, 0);

    tl.to(".loader-content", { opacity: 0, duration: 0.5 }, 0);
    tl.to(".gate-left", { x: "-100%", duration: 1.1, ease: "power4.inOut" }, 0.2);
    tl.to(".gate-right", { x: "100%", duration: 1.1, ease: "power4.inOut" }, 0.2);
  };

  if (phase === "done") return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[99999] overflow-hidden font-mono select-none bg-[#02060D]">
      
      {/* EPISODE 1015 GATE DOORS */}
      <div className="absolute inset-0 z-10 flex pointer-events-none">
        <div className="gate-left w-1/2 h-full bg-[#02060D] border-r border-red-600/40" />
        <div className="gate-right w-1/2 h-full bg-[#02060D] border-l border-red-600/40" />
      </div>

      {/* PRELOADER INTERFACE */}
      <div className={`loader-content absolute inset-0 z-20 text-white flex flex-col justify-between py-10 px-6 sm:px-16 ${phase === "gateBreak" ? "pointer-events-none" : ""}`}>
        
        {/* Top System Log Pose */}
        <div className="w-full flex justify-between items-center text-[10px] sm:text-xs tracking-[0.25em] text-gray-400 border-b border-white/10 pb-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            KRAKENFALL // STRAW HAT VOYAGE
          </span>
          <span className="text-amber-400 font-semibold truncate max-w-[50%]">{currentLog}</span>
        </div>

        {/* Center: Official Animated One Piece Logo & Thousand Sunny Wave Bar */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 my-auto">
          
          {/* Official One Piece Logo Image */}
          <div className="relative group">
            <img 
              ref={logoRef}
              src="/onepiece-logo.png" 
              alt="One Piece Logo" 
              className="h-20 sm:h-32 object-contain filter drop-shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-pulse"
            />
          </div>

          {/* Ocean Track with Thousand Sunny PNG Riding the Wave */}
          <div className="w-full relative py-8 mt-4">
            
            {/* Ocean Track Base Line */}
            <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-amber-400 to-red-600 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Thousand Sunny Image Moving along Progress Bar */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 flex flex-col items-center pointer-events-none"
              style={{ left: `calc(${Math.min(progress, 92)}% - 20px)` }}
            >
              <img 
                src="/sunny.png" 
                alt="Thousand Sunny" 
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain -m-2 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] animate-bounce"
              />
              <span className="mt-1 text-[10px] font-bold text-amber-400 bg-black/80 px-2 py-0.5 rounded border border-amber-500/40">
                {progress}%
              </span>
            </div>

          </div>
        </div>

        {/* Bottom Enter Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleStartVoyage}
            disabled={!isLoaded}
            className={`group relative px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm tracking-[0.3em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center gap-3 rounded-sm ${
              isLoaded
                ? "opacity-100 cursor-pointer animate-pulse scale-105"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <span>⚔️</span>
            <span>{isLoaded ? "CLICK TO ENTER THE GRAND LINE" : "PREPARING THOUSAND SUNNY..."}</span>
          </button>
          <span className="text-[9px] text-gray-500 tracking-[0.2em] uppercase">
            RECOMMENDED WITH AUDIO ENABLED
          </span>
        </div>

      </div>
    </div>
  );
}