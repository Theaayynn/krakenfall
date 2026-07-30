"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function PreLoader() {
  const [phase, setPhase] = useState<"loading" | "gateBreak" | "done">("loading");
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLog, setCurrentLog] = useState("GRAND LINE // LOG POSE SYNCHRONIZING...");
  const [logoError, setLogoError] = useState(false);
  const [sunnyError, setSunnyError] = useState(false);

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
        return prev + Math.floor(Math.random() * 4) + 1;
      });
    }, 30);

    const logInterval = setInterval(() => {
      if (!isLoaded) {
        setCurrentLog(logs[Math.floor(Math.random() * logs.length)]);
      }
    }, 150);

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

    if (logoRef.current) {
      tl.to(logoRef.current, {
        scale: 2.5,
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
      }, 0);
    }

    tl.to(".loader-content", { opacity: 0, duration: 0.4 }, 0);
    tl.to(".gate-left", { x: "-100%", duration: 1.0, ease: "power4.inOut" }, 0.2);
    tl.to(".gate-right", { x: "100%", duration: 1.0, ease: "power4.inOut" }, 0.2);
  };

  if (phase === "done") return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[99999] overflow-hidden font-mono select-none bg-[#010409]">
      
      {/* Background Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* EPISODE 1015 GATE DOORS */}
      <div className="absolute inset-0 z-10 flex pointer-events-none">
        <div className="gate-left w-1/2 h-full bg-[#02060D] border-r-2 border-red-600/60 shadow-[inset_-20px_0_50px_rgba(220,38,38,0.3)]" />
        <div className="gate-right w-1/2 h-full bg-[#02060D] border-l-2 border-red-600/60 shadow-[inset_20px_0_50px_rgba(220,38,38,0.3)]" />
      </div>

      {/* PRELOADER INTERFACE */}
      <div className={`loader-content absolute inset-0 z-20 text-white flex flex-col justify-between py-8 px-6 sm:px-16 ${phase === "gateBreak" ? "pointer-events-none" : ""}`}>
        
        {/* Top System Log Bar */}
        <div className="w-full flex justify-between items-center text-[10px] sm:text-xs tracking-[0.25em] text-gray-400 border-b border-white/10 pb-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            KRAKENFALL // GRAND LINE VOYAGE
          </span>
          <span className="text-red-500 font-bold tracking-widest truncate max-w-[50%]">{currentLog}</span>
        </div>

        {/* Center Glassmorphism Card (Logo & Thousand Sunny Track) */}
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-10 my-auto bg-black/50 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
          
          {/* Sci-Fi Corner Borders */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-red-600" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-red-600" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-red-600" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-red-600" />

          {/* Logo Section */}
          <div className="relative group flex justify-center">
            {!logoError ? (
              <img 
                ref={logoRef}
                src="/onepiece-logo.png" 
                alt="One Piece Logo" 
                onError={() => setLogoError(true)}
                className="h-24 sm:h-36 object-contain filter drop-shadow-[0_0_35px_rgba(239,68,68,0.7)] animate-pulse"
              />
            ) : (
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-600 to-white">
                ONE PIECE
              </h1>
            )}
          </div>

          {/* Progress Bar & Thousand Sunny */}
          <div className="w-full relative py-6">
            <div className="w-full h-3 bg-black/90 rounded-full border border-white/20 relative overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-amber-500 to-red-600 rounded-full transition-all duration-75 shadow-[0_0_20px_rgba(220,38,38,0.9)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Thousand Sunny Ship Slider */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 flex flex-col items-center pointer-events-none"
              style={{ left: `calc(${Math.min(progress, 90)}% - 15px)` }}
            >
              {!sunnyError ? (
                <img 
                  src="/sunny.png" 
                  alt="Thousand Sunny" 
                  onError={() => setSunnyError(true)}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] animate-bounce"
                />
              ) : (
                <span className="text-2xl animate-bounce">⛵</span>
              )}
            </div>

            <div className="flex justify-between items-center mt-3 text-xs font-bold text-gray-400">
              <span className="tracking-widest">SYNCHRONIZING LOG POSE...</span>
              <span className="text-amber-400 font-mono text-sm">{progress}%</span>
            </div>
          </div>

        </div>

        {/* Bottom Enter Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleStartVoyage}
            disabled={!isLoaded}
            className={`group relative px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs sm:text-sm tracking-[0.35em] uppercase transition-all duration-300 shadow-[0_0_40px_rgba(220,38,38,0.6)] border border-red-500/50 flex items-center gap-4 rounded-xl ${
              isLoaded
                ? "opacity-100 cursor-pointer animate-pulse scale-105"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <span className="text-lg">⚔️</span>
            <span>{isLoaded ? "ENTER THE GRAND LINE" : "INITIALIZING VOYAGE..."}</span>
          </button>
          <span className="text-[10px] text-gray-500 tracking-[0.3em] uppercase">
            RECOMMENDED WITH AUDIO ENABLED
          </span>
        </div>

      </div>
    </div>
  );
}