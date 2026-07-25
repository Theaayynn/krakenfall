"use client";
import { useState, useEffect } from "react";
import gsap from "gsap";
import { useAudioStore } from "@/store/audio-store";

export default function PreLoader() {
  const [phase, setPhase] = useState<"loading" | "masking" | "done">("loading");
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLog, setCurrentLog] = useState("HTTPS://KRAKENFALL.COM/GRAND_LINE/LOG_POSE/INIT");
  
  const playThunder = useAudioStore((s) => s.playThunder);

  const logs = [
    "HTTPS://KRAKENFALL.COM/GRAND_LINE/LOG_POSE/SET",
    "HTTPS://KRAKENFALL.COM/THOUSAND_SUNNY/REACTOR/ISOTOPE-C",
    "HTTPS://KRAKENFALL.COM/DEVIL_FRUIT/GUM_GUM_AWAKENING",
    "HTTPS://KRAKENFALL.COM/CREW/STRAW_HAT/BOUNTY_SCAN",
    "HTTPS://KRAKENFALL.COM/PONEGLYPH/DECRYPTION_SUCCESS"
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
    }, 35);

    const logInterval = setInterval(() => {
      if (!isLoaded) setCurrentLog(logs[Math.floor(Math.random() * logs.length)]);
    }, 140);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, [isLoaded]);

  const handleEnableSound = () => {
    if (!isLoaded) return;
    
    try {
      playThunder();
    } catch (e) {
      console.log("Audio play error:", e);
    }
    
    // Fade out UI, start mask zoom
    gsap.to(".preloader-ui", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => setPhase("masking")
    });
  };

  useEffect(() => {
    if (phase === "masking") {
      const tl = gsap.timeline({
        onComplete: () => setPhase("done")
      });
      // Massive zoom-in effect breaking through the letters (KPRverse style)
      tl.to(".mask-text", { scale: 220, duration: 2.0, ease: "power4.inOut" });
      tl.to(".mask-wrapper", { opacity: 0, duration: 0.4 }, "-=0.3");
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none select-none font-mono">
      
      {/* PHASE 2: Epic Mask Reveal (Massive One Piece letters zoom) */}
      <div className="mask-wrapper absolute inset-0 bg-white flex items-center justify-center overflow-hidden mix-blend-screen pointer-events-none">
        <h1 className="mask-text text-black font-black text-[18vw] leading-none tracking-tighter uppercase whitespace-nowrap origin-center">
          ONE PIECE
        </h1>
      </div>

      {/* PHASE 1: Loading Screen (Kprverse minimalist style with Thousand Sunny wave vibe) */}
      {phase === "loading" && (
        <div className="preloader-ui absolute inset-0 bg-white flex flex-col items-center justify-center text-black pointer-events-auto">
          
          {/* Animated Thousand Sunny / Wave Graphic Line */}
          <div className="w-full max-w-5xl px-8 flex flex-col gap-3 absolute top-1/2 -translate-y-1/2">
            <div className="flex justify-between items-center text-[10px] sm:text-xs uppercase font-semibold">
              <div className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-black animate-ping"></span>
                <span>&gt;&gt; SAILING - {progress}%</span>
              </div>
              <span className="text-gray-400 truncate max-w-[50%]">{currentLog}</span>
            </div>
            
            {/* Progress Bar with wave motion */}
            <div className="relative h-[2px] w-full bg-black/10 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-black transition-all duration-75"
                style={{ width: `${progress}%` }}
              >
                {/* Miniature Ship Icon moving forward */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-black rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Sound Enable Button */}
          <div 
            className={`absolute bottom-20 flex flex-col items-center gap-3 transition-all duration-700 ${isLoaded ? 'opacity-100 cursor-pointer translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            onClick={handleEnableSound}
          >
            <div className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </div>
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-black">
              Click to Enable Sound
            </span>
          </div>

        </div>
      )}

    </div>
  );
}