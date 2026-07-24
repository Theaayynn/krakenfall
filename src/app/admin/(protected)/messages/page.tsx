"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import { Trash2, Mail, MailOpen } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[] | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/messages");
    const json = await res.json();
    setMessages(json.messages ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleRead(id: string, isRead: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    load();
  }

  const columns: Column<Message>[] = [
    { header: "From", render: (m) => <div><p className={m.isRead ? "text-parchment/70" : "font-medium"}>{m.name}</p><p className="text-xs text-parchment/40">{m.email}</p></div> },
    { header: "Message", render: (m) => <span className="line-clamp-2 max-w-sm text-xs text-parchment/50">{m.message}</span> },
    { header: "Date", render: (m) => new Date(m.createdAt).toLocaleDateString() },
    {
      header: "Actions",
      render: (m) => (
        <div className="flex gap-2">
          <button onClick={() => toggleRead(m.id, !m.isRead)} className="text-parchment/50 hover:text-brass-soft" title={m.isRead ? "Mark unread" : "Mark read"}>
            {m.isRead ? <MailOpen size={14} /> : <Mail size={14} />}
          </button>
          <button onClick={() => handleDelete(m.id)} className="text-parchment/50 hover:text-red-400"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-parchment">Messages</h1>
      {messages === null ? <p className="text-sm text-parchment/50">Loading…</p> : (
        <AdminTable columns={columns} rows={messages} keyField={(m) => m.id} emptyMessage="No messages yet." />
      )}
    </div>
  );
}
