import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import GlassCard from "@/components/GlassCard";
import { Gem } from "lucide-react";

export const revalidate = 120;

const RARITY_STYLES: Record<string, string> = {
  common: "text-parchment/50 border-white/10",
  rare: "text-tide-glow border-tide/40",
  legendary: "text-brass-soft border-brass/50",
};

export default async function TreasureSection() {
  const items = await prisma.treasureItem.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } });

  return (
    <section id="treasure" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-16 max-w-xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brass-soft">
            <Gem size={12} /> The Hoard
          </span>
          <h2 className="font-display text-3xl text-parchment sm:text-4xl">Treasures Beyond the Fall</h2>
        </Reveal>

        {items.length === 0 ? (
          <p className="text-center text-sm text-parchment/40">The hoard is still being counted.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i * 0.06, 0.4)}>
                <GlassCard className="overflow-hidden">
                  <div className="relative aspect-square bg-abyss-700">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="25vw" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-parchment/20">
                        <Gem size={28} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className={`mb-2 inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${RARITY_STYLES[item.rarity] ?? RARITY_STYLES.common}`}>
                      {item.rarity}
                    </span>
                    <p className="font-display text-sm text-parchment">{item.name}</p>
                    <p className="mt-1 text-xs text-parchment/50">{item.description}</p>
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
