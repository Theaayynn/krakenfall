import PreLoader from "@/components/PreLoader";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#02060D] text-white flex flex-col items-center justify-center overflow-hidden">
      {/* KPRverse Style Preloader */}
      <PreLoader />

      {/* Main Hero Section (Placeholder for Next Step) */}
      <div className="text-center space-y-6 px-4">
        <span className="text-xs font-mono tracking-[0.4em] text-red-500 uppercase">
          &gt;&gt; STRAW HAT PIRATES UNIVERSE
        </span>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase">
          KRAKENFALL
        </h1>
        <p className="text-gray-400 font-mono text-sm max-w-md mx-auto">
          The Grand Line awaits. Explore the uncharted seas, awakening devil fruits, and legendary bounties.
        </p>
      </div>
    </main>
  );
}