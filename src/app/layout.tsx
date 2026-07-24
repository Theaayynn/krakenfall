import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import EntryGate from "@/components/EntryGate";
import Navbar from "@/components/Navbar";
import AudioToggle from "@/components/AudioToggle";
import PageViewTracker from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: {
    default: "Krakenfall — An Original Pirate Fantasy",
    template: "%s | Krakenfall",
  },
  description:
    "Krakenfall is an original fictional pirate-fantasy universe — storm-bound seas, forbidden fruits, and a crew chasing legend across the drowned world.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Krakenfall",
    description: "An original pirate-fantasy universe.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-abyss text-parchment antialiased">
        <SmoothScrollProvider>
          <PageViewTracker />
          <EntryGate />
          <CustomCursor />
          <Navbar />
          {children}
          <AudioToggle />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
