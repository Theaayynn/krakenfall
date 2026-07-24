"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/form";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface SeoEntry {
  id: string;
  path: string;
  title: string;
  description: string;
  ogImage: string | null;
  keywords: string[];
}

const emptyForm = { path: "", title: "", description: "", ogImage: "", keywords: "" };

export default function AdminSeoPage() {
  const [entries, setEntries] = useState<SeoEntry[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SeoEntry | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/seo");
    const json = await res.json();
    setEntries(json.entries ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(e: SeoEntry) {
    setEditing(e);
    setForm({ path: e.path, title: e.title, description: e.description, ogImage: e.ogImage ?? "", keywords: e.keywords.join(", ") });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const payload = { ...form, keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean) };
    const res = await fetch(editing ? `/api/admin/seo/${editing.id}` : "/api/admin/seo", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(json.error ?? "Something went wrong."); return; }
    setModalOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this SEO entry?")) return;
    await fetch(`/api/admin/seo/${id}`, { method: "DELETE" });
    load();
  }

  const columns: Column<SeoEntry>[] = [
    { header: "Path", render: (e) => <span className="font-mono">{e.path}</span> },
    { header: "Title", render: (e) => e.title },
    { header: "Keywords", render: (e) => <span className="text-xs text-parchment/50">{e.keywords.join(", ") || "—"}</span> },
    {
      header: "Actions",
      render: (e) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(e)} className="text-parchment/50 hover:text-brass-soft"><Pencil size={14} /></button>
          <button onClick={() => handleDelete(e.id)} className="text-parchment/50 hover:text-red-400"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-parchment">SEO Editor</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-brass px-4 py-2 text-sm font-medium text-abyss hover:bg-brass-soft">
          <Plus size={14} /> New entry
        </button>
      </div>

      {entries === null ? <p className="text-sm text-parchment/50">Loading…</p> : (
        <AdminTable columns={columns} rows={entries} keyField={(e) => e.id} emptyMessage="No SEO entries yet." />
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit SEO entry" : "New SEO entry"}>
        <form onSubmit={handleSubmit}>
          <Field label="Path (e.g. /)"><TextInput value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })} required disabled={!!editing} /></Field>
          <Field label="Title"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="Description"><TextArea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></Field>
          <Field label="OG Image URL (optional)"><TextInput value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} /></Field>
          <Field label="Keywords (comma-separated)"><TextInput value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} /></Field>
          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          <SubmitButton loading={submitting}>{editing ? "Save changes" : "Create entry"}</SubmitButton>
        </form>
      </AdminModal>
    </div>
  );
}
