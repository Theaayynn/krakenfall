"use client";

import { motion } from "framer-motion";

export default function MaskReveal({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[450]">
      <svg width="0" height="0" className="absolute">
        <defs>
          <mask id="krakenfall-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <motion.text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="700"
              fill="black"
              initial={{ scale: 1 }}
              animate={{ scale: 26 }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              style={{ transformOrigin: "center", fontSize: "14vw" }}
              onAnimationComplete={onComplete}
            >
              KRAKENFALL
            </motion.text>
          </mask>
        </defs>
      </svg>
      <div
        className="h-full w-full bg-abyss"
        style={{
          WebkitMaskImage: "url(#krakenfall-mask)",
          maskImage: "url(#krakenfall-mask)",
        }}
      />
    </div>
  );
}