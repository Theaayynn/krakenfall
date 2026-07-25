"use client";
import CipherText from "@/components/CipherText";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioStore } from "@/store/audio-store";

const LINKS = [
  { href: "#crew", label: "Crew" },
  { href: "#devil-fruits", label: "Devil Fruits" },
  { href: "#journey", label: "Journey" },
  { href: "#treasure", label: "Treasure" },
  { href: "#gallery", label: "Gallery" },
  { href: "#timeline", label: "Timeline" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const playSfx = useAudioStore((s) => s.playSfx);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick() {
    playSfx("nav");
    setOpen(false);
  }

  return (
    <header className={`fixed inset-x-0 top-0 z-[200] transition-all duration-300 ${scrolled ? "py-3" : "py-6"}`}>
      <div className="mx-4 flex items-center justify-between rounded-full border border-brass/15 bg-abyss-900/60 px-5 py-2.5 backdrop-blur-xl sm:mx-auto sm:max-w-5xl">
        <a href="#" data-cursor-hover onClick={handleNavClick} className="font-display text-sm tracking-widest text-parchment">
          KRAKEN<span className="text-brass-soft">FALL</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor-hover
              onClick={handleNavClick}
              className="text-xs uppercase tracking-[0.2em] text-parchment/60 transition-colors hover:text-brass-soft"
            >
              <CipherText text={link.label} />
            </a>
          ))}
        </nav>

        <button data-cursor-hover onClick={() => setOpen((o) => !o)} className="text-parchment lg:hidden" aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-2 flex flex-col gap-1 rounded-2xl border border-brass/15 bg-abyss-900/90 p-4 backdrop-blur-xl lg:hidden"
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="rounded-lg px-3 py-2.5 text-sm text-parchment/80 hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
