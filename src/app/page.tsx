import PreLoader from "@/components/PreLoader";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#02060D] text-white flex flex-col items-center justify-start overflow-hidden">
      {/* 1. Cinematic Preloader */}
      <PreLoader />
      
      {/* 2. Main Hero Section */}
      <Hero />
    </main>
  );
}