import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Krakenfall | One Piece",
  description: "Enter the Grand Line - An Epic Pirate Adventure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#02060D] text-white antialiased cursor-none`}>
        {/* Custom Cursor Component */}
        <CustomCursor />
        
        {/* Main Website Content */}
        {children}
      </body>
    </html>
  );
}