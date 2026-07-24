"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/form";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Event {
  id: string;
  year: string;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
}

const emptyForm = { year: "", title: "", description: "", order: 0, isPublished: true };

export default function AdminTimelinePage() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/timeline");
    const json = await res.json();
    setEvents(json.events ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(e: Event) {
    setEditing(e);
    setForm({ year: e.year, title: e.title, description: e.description, order: e.order, isPublished: e.isPublished });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch(editing ? `/api/admin/timeline/${editing.id}` : "/api/admin/timeline", {
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
    if (!confirm("Delete this timeline event?")) return;
    await fetch(`/api/admin/timeline/${id}`, { method: "DELETE" });
    load();
  }

  const columns: Column<Event>[] = [
    { header: "Year", render: (e) => e.year },
    { header: "Title", render: (e) => e.title },
    { header: "Status", render: (e) => <span className={e.isPublished ? "text-tide-glow" : "text-parchment/40"}>{e.isPublished ? "Published" : "Draft"}</span> },
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
        <h1 className="font-display text-2xl text-parchment">Timeline</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-brass px-4 py-2 text-sm font-medium text-abyss hover:bg-brass-soft">
          <Plus size={14} /> New event
        </button>
      </div>

      {events === null ? <p className="text-sm text-parchment/50">Loading…</p> : (
        <AdminTable columns={columns} rows={events} keyField={(e) => e.id} emptyMessage="No timeline events yet." />
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit event" : "New event"}>
        <form onSubmit={handleSubmit}>
          <Field label="Year"><TextInput value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required /></Field>
          <Field label="Title"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="Description"><TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></Field>
          <Field label="Order"><TextInput type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></Field>
          <label className="mb-4 flex items-center gap-2 text-sm text-parchment/70">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Published
          </label>
          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          <SubmitButton loading={submitting}>{editing ? "Save changes" : "Create event"}</SubmitButton>
        </form>
      </AdminModal>
    </div>
  );
}
