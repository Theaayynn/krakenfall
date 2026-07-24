import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Compass } from "lucide-react";

export const revalidate = 120;

export default async function JourneySection() {
  const chapters = await prisma.journeyChapter.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } });

  return (
    <section id="journey" className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto mb-16 max-w-xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brass-soft">
            <Compass size={12} /> The Route
          </span>
          <h2 className="font-display text-3xl text-parchment sm:text-4xl">The Journey So Far</h2>
        </Reveal>

        {chapters.length === 0 ? (
          <p className="text-center text-sm text-parchment/40">The route has yet to be charted.</p>
        ) : (
          <div className="space-y-16">
            {chapters.map((chapter, i) => (
              <Reveal key={chapter.id} delay={0.05}>
                <div className={`flex flex-col items-center gap-8 md:flex-row ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-brass/15 bg-abyss-700 md:w-1/2">
                    {chapter.imageUrl ? (
                      <Image src={chapter.imageUrl} alt={chapter.title} fill className="object-cover" sizes="50vw" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-parchment/20">
                        <Compass size={32} />
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2">
                    <p className="mb-1 text-xs uppercase tracking-[0.2em] text-tide-glow">{chapter.location}</p>
                    <h3 className="mb-3 font-display text-2xl text-parchment">{chapter.title}</h3>
                    <p className="text-sm leading-relaxed text-parchment/55">{chapter.summary}</p>
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
