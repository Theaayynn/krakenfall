"use client";
import { useState, useEffect } from "react";
import gsap from "gsap";

export default function PreLoader() {
  const [phase, setPhase] = useState<"loading" | "gateBreak" | "done">("loading");
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLog, setCurrentLog] = useState("GRAND LINE // LOG POSE SYNCHRONIZING...");

  const logs = [
    "GRAND LINE // LOG POSE: NEW WORLD SECTOR",
    "THOUSAND SUNNY // COUP DE BURST REACTOR READY",
    "DEVIL FRUIT // HITO HITO NO MI, MODEL: NIKA AWAKENING",
    "STRAW HAT CREW // BOUNTY REFRESH: 3,000,000,000 BERRIES",
    "PONEGLYPH // ROAD PONEGLYPH DECRYPTION 100%"
  ];

  // 1. Loading progress counter
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

  // 2. Click handler for Ep 1015 Gate Split Reveal
  const handleStartVoyage = () => {
    if (!isLoaded) return;

    setPhase("gateBreak");

    const tl = gsap.timeline({
      onComplete: () => setPhase("done"),
    });

    // Step A: Fade out loader text
    tl.to(".loader-content", { opacity: 0, duration: 0.4 }, 0);
    // Step B: Split Episode 1015 gates apart to reveal website
    tl.to(".gate-left", { x: "-100%", duration: 1.0, ease: "power4.inOut" }, 0.2);
    tl.to(".gate-right", { x: "100%", duration: 1.0, ease: "power4.inOut" }, 0.2);
  };

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden font-mono select-none bg-[#02060D]">
      {/* EPISODE 1015 GATE DOORS (Behind loader content, splits open on click) */}
      <div className="absolute inset-0 z-10 flex pointer-events-none">
        <div className="gate-left w-1/2 h-full bg-[#02060D] border-r-2 border-red-600/50" />
        <div className="gate-right w-1/2 h-full bg-[#02060D] border-l-2 border-red-600/50" />
      </div>

      {/* PRELOADER INTERFACE (Above gate doors so everything is visible & clickable) */}
      <div className={`loader-content absolute inset-0 z-20 bg-[#02060D] text-white flex flex-col justify-between py-12 px-6 sm:px-16 transition-opacity duration-300 ${phase === "gateBreak" ? "pointer-events-none" : "pointer-events-auto"}`}>
        
        {/* Top System Logs */}
        <div className="w-full flex justify-between items-center text-[10px] sm:text-xs tracking-[0.25em] text-gray-400 border-b border-white/10 pb-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            KRAKENFALL // ONE PIECE
          </span>
          <span className="text-red-500 font-semibold truncate max-w-[50%]">{currentLog}</span>
        </div>

        {/* Center Title & Sailing Progress Bar */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 my-auto">
          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter uppercase text-white text-center">
            ONE PIECE
          </h1>

          {/* Ocean Track with Thousand Sunny */}
          <div className="w-full relative py-6">
            <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-amber-500 to-red-600 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Thousand Sunny Ship Icon moving across the line */}
            <div
              className="absolute top-0 -translate-y-1/2 transition-all duration-75 flex flex-col items-center"
              style={{ left: `${Math.min(progress, 95)}%` }}
            >
              <div className="text-xl sm:text-2xl animate-bounce">⛵</div>
              <span className="text-[10px] text-amber-400 font-bold bg-black/90 px-2 py-0.5 rounded border border-amber-500/30">
                {progress}%
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleStartVoyage}
            disabled={!isLoaded}
            className={`group relative px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm tracking-[0.3em] uppercase transition-all duration-300 shadow-2xl flex items-center gap-3 ${
              isLoaded
                ? "opacity-100 cursor-pointer animate-pulse scale-105"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <span>⚔️</span>
            <span>{isLoaded ? "CLICK TO ENTER THE GRAND LINE" : "INITIALIZING VOYAGE..."}</span>
          </button>
          <span className="text-[9px] text-gray-500 tracking-[0.2em] uppercase">
            AUDIO ENABLED EXPERIENCE
          </span>
        </div>

      </div>
    </div>
  );
}