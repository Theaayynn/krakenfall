import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Images } from "lucide-react";

export const revalidate = 120;

export default async function GallerySection() {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" }, take: 9 });

  return (
    <section id="gallery" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-16 max-w-xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brass-soft">
            <Images size={12} /> Ship&apos;s Log
          </span>
          <h2 className="font-display text-3xl text-parchment sm:text-4xl">Fragments of the Fall</h2>
        </Reveal>

        {items.length === 0 ? (
          <p className="text-center text-sm text-parchment/40">The ship&apos;s log is still being kept.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i * 0.05, 0.3)}>
                <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-brass/15 bg-abyss-700">
                  {item.mediaType === "VIDEO" ? (
                    <video src={item.mediaUrl} muted loop playsInline autoPlay className="h-full w-full object-cover" />
                  ) : (
                    <Image
                      src={item.mediaUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-abyss/80 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm text-parchment">{item.title}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
