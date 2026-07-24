import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import GlassCard from "@/components/GlassCard";
import { Sparkles } from "lucide-react";

export const revalidate = 120;

export default async function DevilFruitsSection() {
  const fruits = await prisma.devilFruit.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } });

  return (
    <section id="devil-fruits" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-16 max-w-xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brass-soft">
            <Sparkles size={12} /> Forbidden Gifts
          </span>
          <h2 className="font-display text-3xl text-parchment sm:text-4xl">Fruits of the Drowned Grove</h2>
          <p className="mt-4 text-sm text-parchment/55">
            Each fruit trades the sea&apos;s favor for a power the tide cannot forgive.
          </p>
        </Reveal>

        {fruits.length === 0 ? (
          <p className="text-center text-sm text-parchment/40">The grove has yet to bear fruit.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fruits.map((fruit, i) => (
              <Reveal key={fruit.id} delay={Math.min(i * 0.08, 0.4)}>
                <GlassCard className="flex h-full flex-col p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-brass/25 bg-brass/5">
                    {fruit.iconUrl ? (
                      <Image src={fruit.iconUrl} alt={fruit.name} width={32} height={32} className="object-contain" />
                    ) : (
                      <Sparkles className="text-brass-soft" size={20} />
                    )}
                  </div>
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-tide-glow">{fruit.category}</p>
                  <h3 className="mb-2 font-display text-lg text-parchment">{fruit.name}</h3>
                  <p className="mb-4 flex-1 text-sm text-parchment/55">{fruit.description}</p>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1 flex-1 rounded-full ${idx < fruit.powerLevel ? "bg-brass" : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
