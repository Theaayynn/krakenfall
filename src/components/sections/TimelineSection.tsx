import { prisma } from "@/lib/prisma";
import Reveal from "@/components/Reveal";
import { ScrollText } from "lucide-react";

export const revalidate = 120;

export default async function TimelineSection() {
  const events = await prisma.timelineEvent.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } });

  return (
    <section id="timeline" className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mx-auto mb-16 max-w-xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brass-soft">
            <ScrollText size={12} /> The Chronicle
          </span>
          <h2 className="font-display text-3xl text-parchment sm:text-4xl">A History Written in Salt</h2>
        </Reveal>

        {events.length === 0 ? (
          <p className="text-center text-sm text-parchment/40">The chronicle has yet to be inked.</p>
        ) : (
          <div className="relative border-l border-brass/20 pl-8">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={Math.min(i * 0.06, 0.4)} className="relative mb-12 last:mb-0">
                <span className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full border-2 border-brass bg-abyss" />
                <p className="mb-1 font-display text-sm text-brass-soft">{event.year}</p>
                <h3 className="mb-2 font-display text-lg text-parchment">{event.title}</h3>
                <p className="text-sm text-parchment/55">{event.description}</p>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
