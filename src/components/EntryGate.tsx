"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioStore } from "@/store/audio-store";

export default function EntryGate() {
  const [entered, setEntered] = useState(false);
  const startAmbient = useAudioStore((s) => s.startAmbient);

  function handleEnter() {
    startAmbient();
    setEntered(true);
  }

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[400] flex flex-col items-center justify-center bg-abyss"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center px-6 text-center"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brass-soft">An Original Voyage</p>
            <h1 className="mb-8 font-display text-3xl text-parchment sm:text-4xl">Krakenfall</h1>
            <button
              onClick={handleEnter}
              data-cursor-hover
              className="rounded-full border border-brass/40 bg-white/5 px-8 py-3 text-sm uppercase tracking-[0.2em] text-brass-soft backdrop-blur-md transition hover:border-brass/70 hover:bg-brass/10"
            >
              Enter the Fall
            </button>
            <p className="mt-6 text-xs text-parchment/30">Best experienced with sound</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
