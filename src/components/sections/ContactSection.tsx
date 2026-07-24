"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Reveal from "@/components/Reveal";
import GlassCard from "@/components/GlassCard";
import { Mail } from "lucide-react";
import { useAudioStore } from "@/store/audio-store";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});
type ContactInput = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "done">("idle");
  const [email, setEmail] = useState("");
  const playSfx = useAudioStore((s) => s.playSfx);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setStatus("idle");
    const res = await fetch("/api/forms/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    playSfx("click");
    setStatus("success");
    reset();
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setNewsletterStatus("sending");
    await fetch("/api/forms/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    setNewsletterStatus("done");
    setEmail("");
  }

  return (
    <section id="contact" className="relative px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <Reveal className="mx-auto mb-16 max-w-xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brass-soft">
            <Mail size={12} /> Send Word
          </span>
          <h2 className="font-display text-3xl text-parchment sm:text-4xl">Reach the Crow&apos;s Nest</h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <GlassCard className="p-6">
              {status === "success" ? (
                <p className="py-10 text-center text-sm text-tide-glow">
                  Your message rides the tide — we&apos;ll answer before the next full moon.
                </p>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <input
                      {...register("name")}
                      placeholder="Name"
                      data-cursor-hover
                      className="w-full rounded-lg border border-brass/20 bg-transparent px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Email"
                      data-cursor-hover
                      className="w-full rounded-lg border border-brass/20 bg-transparent px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                  </div>
                  <div>
                    <textarea
                      {...register("message")}
                      rows={4}
                      placeholder="Your message to the crew..."
                      data-cursor-hover
                      className="w-full rounded-lg border border-brass/20 bg-transparent px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60"
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                  </div>
                  {status === "error" && <p className="text-sm text-red-400">Something went wrong — please try again.</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-cursor-hover
                    className="w-full rounded-lg bg-brass py-2.5 text-sm font-medium text-abyss transition hover:bg-brass-soft disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard className="flex h-full flex-col justify-center p-6">
              <h3 className="mb-2 font-display text-lg text-parchment">Join the Ledger</h3>
              <p className="mb-5 text-sm text-parchment/55">
                Word of new chapters, fruits, and treasures — sent when there&apos;s something worth reading.
              </p>
              {newsletterStatus === "done" ? (
                <p className="text-sm text-tide-glow">Your name is inked in the ledger.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    data-cursor-hover
                    className="w-full rounded-lg border border-brass/20 bg-transparent px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === "sending"}
                    data-cursor-hover
                    className="shrink-0 rounded-lg border border-brass/40 px-4 py-2.5 text-sm text-brass-soft hover:bg-brass/10 disabled:opacity-50"
                  >
                    Join
                  </button>
                </form>
              )}
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
