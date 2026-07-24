"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Eye, Mail, Users2, Sparkles, Images } from "lucide-react";

interface Stats {
  totalViews: number;
  views30d: number;
  unreadMessages: number;
  totalMessages: number;
  subscribers: number;
  crewCount: number;
  fruitCount: number;
  galleryCount: number;
  viewsByDay: { day: string; count: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) return <p className="text-sm text-parchment/50">Loading analytics…</p>;

  const cards = [
    { label: "Page views (30d)", value: stats.views30d, icon: Eye },
    { label: "Total page views", value: stats.totalViews, icon: Eye },
    { label: "Unread messages", value: stats.unreadMessages, icon: Mail },
    { label: "Newsletter subs", value: stats.subscribers, icon: Users2 },
    { label: "Devil fruits", value: stats.fruitCount, icon: Sparkles },
    { label: "Gallery items", value: stats.galleryCount, icon: Images },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-parchment">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-brass/15 bg-white/[0.03] p-5">
            <c.icon className="mb-3 text-brass-soft" size={18} />
            <p className="text-2xl font-semibold text-parchment">{c.value}</p>
            <p className="text-xs text-parchment/50">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-brass/15 bg-white/[0.03] p-5">
        <h2 className="mb-4 text-base font-medium text-parchment">Traffic — last 30 days</h2>
        {stats.viewsByDay.length === 0 ? (
          <p className="py-10 text-center text-sm text-parchment/50">No traffic recorded yet.</p>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.viewsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fill: "rgba(237,228,211,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(237,228,211,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0A0F1C", border: "1px solid rgba(201,162,75,0.2)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#C9A24B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
