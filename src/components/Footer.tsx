export default function Footer() {
  return (
    <footer className="border-t border-brass/10 px-6 py-10 text-center">
      <p className="font-display text-sm tracking-widest text-parchment/60">
        KRAKEN<span className="text-brass-soft">FALL</span>
      </p>
      <p className="mt-2 text-xs text-parchment/30">
        © {new Date().getFullYear()} Krakenfall. An original fictional universe.
      </p>
    </footer>
  );
}
