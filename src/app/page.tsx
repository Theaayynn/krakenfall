import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PreLoader from "@/components/PreLoader";
import CustomCursor from "@/components/CustomCursor";
import Hero from "@/components/Hero";
import CrewSection from "@/components/sections/CrewSection";
import DevilFruitsSection from "@/components/sections/DevilFruitsSection";
import JourneySection from "@/components/sections/JourneySection";
import TreasureSection from "@/components/sections/TreasureSection";
import GallerySection from "@/components/sections/GallerySection";
import TimelineSection from "@/components/sections/TimelineSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await prisma.seoMeta.findUnique({ where: { path: "/" } });
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: { title: seo.title, description: seo.description, images: seo.ogImage ? [seo.ogImage] : [] },
  };
}

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* 1. Custom Mouse Cursor */}
      <CustomCursor />
      
      {/* 2. KPRverse style Loader & Mask Animation */}
      <PreLoader />
      
      {/* 3. Main Site Components (Note: Puraana EntryGate yahan se hata diya gaya hai) */}
      <Hero />
      <CrewSection />
      <DevilFruitsSection />
      <JourneySection />
      <TreasureSection />
      <GallerySection />
      <TimelineSection />
      <ContactSection />
      <Footer />
    </main>
  );
}