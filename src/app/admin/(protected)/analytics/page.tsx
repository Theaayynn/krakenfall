"use client";

import { useEffect, useState } from "react";
import { Eye, Users2 } from "lucide-react";

interface Stats {
  totalViews: number;
  views30d: number;
  subscribers: number;
  topPages: { path: string; count: number }[];
}

interface Subscriber {
  id: string;
  email: string;
  isSubscribed: boolean;
  createdAt: string;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
    fetch("/api/admin/newsletter").then((r) => r.json()).then((j) => setSubscribers(j.subscribers ?? []));
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-parchment">Analytics</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brass/15 bg-white/[0.03] p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-medium text-parchment">
            <Eye size={16} /> Top pages (30d)
          </h2>
          {!stats ? (
            <p className="text-sm text-parchment/50">Loading…</p>
          ) : stats.topPages.length === 0 ? (
            <p className="text-sm text-parchment/50">No traffic recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.topPages.map((p) => (
                <div key={p.path} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-parchment/70">{p.path}</span>
                  <span className="text-parchment/50">{p.count} views</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-brass/15 bg-white/[0.03] p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-medium text-parchment">
            <Users2 size={16} /> Newsletter subscribers
          </h2>
          {!subscribers ? (
            <p className="text-sm text-parchment/50">Loading…</p>
          ) : subscribers.length === 0 ? (
            <p className="text-sm text-parchment/50">No subscribers yet.</p>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {subscribers.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-parchment/70">{s.email}</span>
                  <span className="text-xs text-parchment/40">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
