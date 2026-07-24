"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Howl } from "howler";

export type SfxKey = "hover" | "click" | "nav" | "scroll";

interface AudioState {
  muted: boolean;
  volume: number; // 0..1
  ambientStarted: boolean;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  startAmbient: () => void;
  playSfx: (key: SfxKey) => void;
  playThunder: () => void;
}

let ambientOcean: Howl | null = null;
let ambientThunderBed: Howl | null = null;
let sfxHover: Howl | null = null;
let sfxClick: Howl | null = null;
let sfxNav: Howl | null = null;
let sfxScroll: Howl | null = null;
let sfxThunderStrike: Howl | null = null;

function ensureSoundsLoaded() {
  if (typeof window === "undefined") return;
  if (ambientOcean) return; // already initialized

  ambientOcean = new Howl({ src: ["/audio/ocean-ambience.mp3"], loop: true, volume: 0.4, html5: true });
  ambientThunderBed = new Howl({ src: ["/audio/thunder-bed.mp3"], loop: true, volume: 0.15, html5: true });
  sfxHover = new Howl({ src: ["/audio/sfx-hover.mp3"], volume: 0.25 });
  sfxClick = new Howl({ src: ["/audio/sfx-click.mp3"], volume: 0.35 });
  sfxNav = new Howl({ src: ["/audio/sfx-nav.mp3"], volume: 0.3 });
  sfxScroll = new Howl({ src: ["/audio/sfx-scroll.mp3"], volume: 0.2 });
  sfxThunderStrike = new Howl({ src: ["/audio/sfx-thunder-strike.mp3"], volume: 0.5 });
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      muted: false,
      volume: 0.6,
      ambientStarted: false,

      toggleMute: () => {
        const next = !get().muted;
        set({ muted: next });
        const v = next ? 0 : get().volume;
        ambientOcean?.volume(v * 0.4);
        ambientThunderBed?.volume(v * 0.15);
      },

      setVolume: (v: number) => {
        set({ volume: v });
        if (!get().muted) {
          ambientOcean?.volume(v * 0.4);
          ambientThunderBed?.volume(v * 0.15);
        }
      },

      startAmbient: () => {
        ensureSoundsLoaded();
        if (get().ambientStarted) return;
        set({ ambientStarted: true });
        const v = get().muted ? 0 : get().volume;
        ambientOcean?.volume(v * 0.4);
        ambientThunderBed?.volume(v * 0.15);
        ambientOcean?.play();
        ambientThunderBed?.play();
      },

      playSfx: (key: SfxKey) => {
        ensureSoundsLoaded();
        if (get().muted) return;
        const v = get().volume;
        const map: Record<SfxKey, Howl | null> = { hover: sfxHover, click: sfxClick, nav: sfxNav, scroll: sfxScroll };
        const sound = map[key];
        if (sound) {
          sound.volume(v * 0.5);
          sound.play();
        }
      },

      playThunder: () => {
        ensureSoundsLoaded();
        if (get().muted) return;
        sfxThunderStrike?.volume(get().volume * 0.7);
        sfxThunderStrike?.play();
      },
    }),
    {
      name: "krakenfall-audio-prefs",
      partialize: (state) => ({ muted: state.muted, volume: state.volume }),
    }
  )
);
