"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/form";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  location: string;
  summary: string;
  imageUrl: string | null;
  order: number;
  isPublished: boolean;
}

const emptyForm = { title: "", location: "", summary: "", imageUrl: "", order: 0, isPublished: true };

export default function AdminJourneyPage() {
  const [chapters, setChapters] = useState<Chapter[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Chapter | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/journey");
    const json = await res.json();
    setChapters(json.chapters ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(c: Chapter) {
    setEditing(c);
    setForm({ title: c.title, location: c.location, summary: c.summary, imageUrl: c.imageUrl ?? "", order: c.order, isPublished: c.isPublished });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch(editing ? `/api/admin/journey/${editing.id}` : "/api/admin/journey", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(json.error ?? "Something went wrong."); return; }
    setModalOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this journey chapter?")) return;
    await fetch(`/api/admin/journey/${id}`, { method: "DELETE" });
    load();
  }

  const columns: Column<Chapter>[] = [
    { header: "Title", render: (c) => <div><p className="font-medium">{c.title}</p><p className="text-xs text-parchment/40">{c.location}</p></div> },
    { header: "Summary", render: (c) => <span className="line-clamp-2 max-w-xs text-xs text-parchment/50">{c.summary}</span> },
    { header: "Status", render: (c) => <span className={c.isPublished ? "text-tide-glow" : "text-parchment/40"}>{c.isPublished ? "Published" : "Draft"}</span> },
    {
      header: "Actions",
      render: (c) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(c)} className="text-parchment/50 hover:text-brass-soft"><Pencil size={14} /></button>
          <button onClick={() => handleDelete(c.id)} className="text-parchment/50 hover:text-red-400"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-parchment">Journey</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-brass px-4 py-2 text-sm font-medium text-abyss hover:bg-brass-soft">
          <Plus size={14} /> New chapter
        </button>
      </div>

      {chapters === null ? <p className="text-sm text-parchment/50">Loading…</p> : (
        <AdminTable columns={columns} rows={chapters} keyField={(c) => c.id} emptyMessage="No journey chapters yet." />
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit chapter" : "New chapter"}>
        <form onSubmit={handleSubmit}>
          <Field label="Title"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="Location"><TextInput value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></Field>
          <Field label="Summary"><TextArea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required /></Field>
          <Field label="Image URL (optional)"><TextInput value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></Field>
          <Field label="Order"><TextInput type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></Field>
          <label className="mb-4 flex items-center gap-2 text-sm text-parchment/70">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Published
          </label>
          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          <SubmitButton loading={submitting}>{editing ? "Save changes" : "Create chapter"}</SubmitButton>
        </form>
      </AdminModal>
    </div>
  );
}
