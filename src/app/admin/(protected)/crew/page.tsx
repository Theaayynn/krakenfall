"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/form";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Crew {
  id: string;
  name: string;
  title: string;
  bio: string;
  portraitUrl: string | null;
  order: number;
  isPublished: boolean;
}

const emptyForm = { name: "", title: "", bio: "", portraitUrl: "", order: 0, isPublished: true };

export default function AdminCrewPage() {
  const [crew, setCrew] = useState<Crew[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Crew | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/crew");
    const json = await res.json();
    setCrew(json.crew ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(c: Crew) {
    setEditing(c);
    setForm({ name: c.name, title: c.title, bio: c.bio, portraitUrl: c.portraitUrl ?? "", order: c.order, isPublished: c.isPublished });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch(editing ? `/api/admin/crew/${editing.id}` : "/api/admin/crew", {
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
    if (!confirm("Delete this crew member?")) return;
    await fetch(`/api/admin/crew/${id}`, { method: "DELETE" });
    load();
  }

  const columns: Column<Crew>[] = [
    { header: "Name", render: (c) => <div><p className="font-medium">{c.name}</p><p className="text-xs text-parchment/40">{c.title}</p></div> },
    { header: "Bio", render: (c) => <span className="line-clamp-2 max-w-xs text-xs text-parchment/50">{c.bio}</span> },
    { header: "Order", render: (c) => c.order },
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
        <h1 className="font-display text-2xl text-parchment">Crew</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-brass px-4 py-2 text-sm font-medium text-abyss hover:bg-brass-soft">
          <Plus size={14} /> New crew member
        </button>
      </div>

      {crew === null ? <p className="text-sm text-parchment/50">Loading…</p> : (
        <AdminTable columns={columns} rows={crew} keyField={(c) => c.id} emptyMessage="No crew members yet." />
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit crew member" : "New crew member"}>
        <form onSubmit={handleSubmit}>
          <Field label="Name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label="Title"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="Bio"><TextArea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required /></Field>
          <Field label="Portrait URL (optional)"><TextInput value={form.portraitUrl} onChange={(e) => setForm({ ...form, portraitUrl: e.target.value })} /></Field>
          <Field label="Order"><TextInput type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></Field>
          <label className="mb-4 flex items-center gap-2 text-sm text-parchment/70">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Published
          </label>
          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          <SubmitButton loading={submitting}>{editing ? "Save changes" : "Create crew member"}</SubmitButton>
        </form>
      </AdminModal>
    </div>
  );
}
