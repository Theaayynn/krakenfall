"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudioStore } from "@/store/audio-store";

export default function AudioToggle() {
  const { muted, volume, toggleMute, setVolume } = useAudioStore();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-[150] flex items-center gap-2"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className={`flex items-center overflow-hidden rounded-full border border-brass/25 bg-abyss-800/80 backdrop-blur-md transition-all duration-300 ${
          expanded ? "w-32 px-3" : "w-0 px-0"
        }`}
      >
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="h-1 w-full accent-brass"
          aria-label="Volume"
        />
      </div>
      <button
        onClick={toggleMute}
        data-cursor-hover
        aria-label={muted ? "Unmute" : "Mute"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brass/25 bg-abyss-800/80 text-brass-soft backdrop-blur-md transition hover:border-brass/60"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
}
