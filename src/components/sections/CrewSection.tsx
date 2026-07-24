import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import GlassCard from "@/components/GlassCard";
import { Anchor } from "lucide-react";

export const revalidate = 120;

export default async function CrewSection() {
  const crew = await prisma.crewMember.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } });

  return (
    <section id="crew" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-16 max-w-xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brass-soft">
            <Anchor size={12} /> The Roster
          </span>
          <h2 className="font-display text-3xl text-parchment sm:text-4xl">Those Who Sail the Fall</h2>
        </Reveal>

        {crew.length === 0 ? (
          <p className="text-center text-sm text-parchment/40">The crew roster is being drawn up.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {crew.map((member, i) => (
              <Reveal key={member.id} delay={Math.min(i * 0.08, 0.4)}>
                <GlassCard className="group overflow-hidden">
                  <div className="relative aspect-[4/5] overflow-hidden bg-abyss-700">
                    {member.portraitUrl ? (
                      <Image
                        src={member.portraitUrl}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-parchment/20">
                        <Anchor size={32} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <p className="font-display text-lg text-parchment">{member.name}</p>
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-brass-soft">{member.title}</p>
                    <p className="text-sm text-parchment/55">{member.bio}</p>
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
