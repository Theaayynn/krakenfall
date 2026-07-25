"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioStore } from "@/store/audio-store";
import MaskReveal from "@/components/MaskReveal";

const LOG_LINES = [
  "KRAKENFALL://LOG/COORDINATES/N-12.442_W-58.117",
  "KRAKENFALL://LOG/CARGO_MANIFEST/VERIFYING",
  "KRAKENFALL://LOG/CREW_ROSTER/SYNCING",
  "KRAKENFALL://LOG/DEVIL_FRUIT_ARCHIVE/DECRYPTING",
  "KRAKENFALL://LOG/TIDE_CHARTS/CALIBRATING",
  "KRAKENFALL://LOG/TREASURE_VAULT/AUTHENTICATING",
  "KRAKENFALL://LOG/HULL_INTEGRITY/98.4%",
  "KRAKENFALL://LOG/WIND_READING/SOUTH-SOUTHEAST",
];

type Phase = "loading" | "ready" | "revealing" | "done";

export default function EntryGate() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const startAmbient = useAudioStore((s) => s.startAmbient);
  const playSfx = useAudioStore((s) => s.playSfx);

  useEffect(() => {
    if (phase !== "loading") return;

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 99) {
          clearInterval(progressTimer);
          setPhase("ready");
          return 100;
        }
        return p + Math.floor(Math.random() * 6) + 2;
      });
    }, 90);

    const logTimer = setInterval(() => {
      setLogIndex((i) => (i + 1) % LOG_LINES.length);
    }, 260);

    return () => {
      clearInterval(progressTimer);
      clearInterval(logTimer);
    };
  }, [phase]);

  function handleEnter() {
    playSfx("click");
    startAmbient();
    setPhase("revealing");
  }

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[400] flex flex-col items-center justify-center overflow-hidden bg-abyss px-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #E4C77A 0px, transparent 1px, transparent 2px)",
            }}
          />

          {phase !== "revealing" && (
            <div className="relative flex w-full max-w-3xl flex-col items-center text-center">
              <p className="mb-2 text-[10px] uppercase tracking-[0.5em] text-brass-dim">
                An Original Voyage
              </p>
              <h1 className="mb-10 font-display text-3xl text-parchment sm:text-4xl">
                Krakenfall
              </h1>

              {phase === "loading" ? (
                <>
                  <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-brass-soft">
                    {">>"} LOADING — {Math.min(progress, 99)}%
                  </div>

                  <div className="mb-6 h-px w-56 overflow-hidden bg-white/10">
                    <motion.div
                      className="h-full bg-brass-soft"
                      animate={{ width: `${Math.min(progress, 99)}%` }}
                      transition={{ duration: 0.15, ease: "linear" }}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={logIndex}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-mono text-[11px] tracking-wide text-parchment/40"
                    >
                      {LOG_LINES[logIndex]}
                    </motion.p>
                  </AnimatePresence>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-col items-center"
                >
                  <button
                    onClick={handleEnter}
                    data-cursor-hover
                    className="rounded-full border border-brass/40 bg-white/5 px-8 py-3 text-sm uppercase tracking-[0.2em] text-brass-soft backdrop-blur-md transition hover:border-brass/70 hover:bg-brass/10"
                  >
                    Enter the Fall
                  </button>
                  <p className="mt-6 text-xs text-parchment/30">
                    Best experienced with sound on
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {phase === "revealing" && <MaskReveal onComplete={() => setPhase("done")} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}