"use client";
import { useState } from "react";
import Link from "next/link";

interface CipherMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CipherMenu({ isOpen, onClose }: CipherMenuProps) {
  const menuItems = [
    { label: "STORY", cipher: "PZTEYL", href: "#story" },
    { label: "PROTOCOL", cipher: "LXMD", href: "#protocol" },
    { label: "JOURNAL", cipher: "GDMSWD", href: "#journal" },
    { label: "MEDIA", cipher: "KPRV-99", href: "#media" },
    { label: "GALLERY", cipher: "GALLR", href: "#gallery" },
    { label: "ABOUT", cipher: "ABOD", href: "#about" },
  ];

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99998] bg-black/90 backdrop-blur-md flex items-center justify-between px-12 md:px-24 text-white font-mono select-none animate-fadeIn">
      
      {/* Left Column: Menu Navigation */}
      <div className="flex flex-col gap-6">
        <span className="text-xs text-gray-400 tracking-[0.3em] mb-4">&gt;&gt; NAVIGATION_DIRECTORY</span>
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            onClick={onClose}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="text-4xl md:text-7xl font-black tracking-tighter uppercase hover:text-red-500 transition-colors duration-200 flex items-center gap-6"
          >
            <span>{hoveredIdx === idx ? item.cipher : item.label}</span>
            <span className="text-xs font-normal text-gray-500">[{`0${idx + 1}`}]</span>
          </Link>
        ))}
      </div>

      {/* Right Column: Close Button & Info */}
      <div className="flex flex-col justify-between h-full py-16 text-right">
        <button 
          onClick={onClose}
          className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center self-end hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
        >
          ✕
        </button>

        <div className="text-xs text-gray-400 space-y-2 uppercase tracking-widest">
          <p>GRAND LINE SECTOR 7</p>
          <p>ONE PIECE UNIVERSE</p>
          <p className="text-red-500 font-bold">SYSTEM ACTIVE</p>
        </div>
      </div>

    </div>
  );
}