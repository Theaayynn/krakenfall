"use client";
import { useState, useEffect } from "react";
import gsap from "gsap";

export default function PreLoader() {
  const [phase, setPhase] = useState<"loading" | "masking" | "done">("loading");
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLog, setCurrentLog] = useState("HTTPS://KRAKENFALL.COM/SYS/INITIALIZING...");

  const logs = [
    "HTTPS://KRAKENFALL.COM/GRAND_LINE/NAV_DATA/LOG_POSE",
    "HTTPS://KRAKENFALL.COM/DEVIL_FRUIT/AWAKENING_SEQUENCE_INIT",
    "HTTPS://KRAKENFALL.COM/CREW/BOUNTY_UPDATE/NEW_RECORDS",
    "HTTPS://KRAKENFALL.COM/THOUSAND_SUNNY/REACTOR/ISOTOPE-C",
    "HTTPS://KRAKENFALL.COM/PONEGLYPH/DECRYPTION_IN_PROGRESS/43L"
  ];

  // 1. Loading Logic (0 to 100%)
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
    }, 40);

    const logInterval = setInterval(() => {
      if (!isLoaded) setCurrentLog(logs[Math.floor(Math.random() * logs.length)]);
    }, 150);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, [isLoaded]);

  // 2. Click to Enable Sound & Start Mask Transition
  const handleEnableSound = () => {
    if (!isLoaded) return;
    
    gsap.to(".preloader-ui", {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => setPhase("masking")
    });
  };

  // 3. The Massive KPR Zoom-in Animation
  useEffect(() => {
    if (phase === "masking") {
      const tl = gsap.timeline({
        onComplete: () => setPhase("done")
      });
      tl.to(".mask-text", { scale: 200, duration: 2.2, ease: "power4.inOut" });
      tl.to(".mask-wrapper", { opacity: 0, duration: 0.5 }, "-=0.3");
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      
      {/* PHASE 2: Mask Reveal */}
      <div className="mask-wrapper absolute inset-0 bg-white flex items-center justify-center overflow-hidden mix-blend-screen pointer-events-none">
        <h1 className="mask-text text-black font-black text-[25vw] leading-none tracking-tighter uppercase whitespace-nowrap origin-center">
          K P R
        </h1>
      </div>

      {/* PHASE 1: Loading Screen */}
      {phase === "loading" && (
        <div className="preloader-ui absolute inset-0 bg-white flex flex-col items-center justify-center text-black font-mono tracking-widest pointer-events-auto">
          
          <div className="w-full max-w-5xl px-8 flex justify-between items-center text-[10px] sm:text-xs uppercase absolute top-1/2 -translate-y-1/2">
            <div className="flex items-center gap-4 w-1/3">
              <span className="font-bold whitespace-nowrap">
                &gt;&gt; LOADING - {progress > 100 ? 100 : progress}%
              </span>
              <div className="h-[1px] w-full bg-black/20"></div>
            </div>
            <div className="text-right w-1/2 text-gray-500 truncate">{currentLog}</div>
          </div>

          <div 
            className={`absolute bottom-20 flex flex-col items-center gap-3 transition-opacity duration-700 ${isLoaded ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
            onClick={handleEnableSound}
          >
            <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center animate-pulse hover:bg-black hover:text-white transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold">
              Click to Enable Sound
            </span>
          </div>

        </div>
      )}

    </div>
  );
}