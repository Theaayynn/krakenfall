"use client";

import { useRef, useState } from "react";

const CIPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ$%&#@*01";

export default function CipherText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function scramble() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iteration = 0;
    const totalIterations = text.length * 3;

    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 3) return char;
            return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
          })
          .join("")
      );

      iteration += 1;
      if (iteration > totalIterations && intervalRef.current) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 28);
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplay(text);
  }

  return (
    <span onMouseEnter={scramble} onMouseLeave={reset} className="inline-block">
      {display}
    </span>
  );
}