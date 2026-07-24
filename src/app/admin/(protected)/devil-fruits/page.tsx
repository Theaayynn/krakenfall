"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/form";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Fruit {
  id: string;
  name: string;
  category: string;
  description: string;
  powerLevel: number;
  iconUrl: string | null;
  order: number;
  isPublished: boolean;
}

const emptyForm = { name: "", category: "", description: "", powerLevel: 3, iconUrl: "", order: 0, isPublished: true };

export default function AdminDevilFruitsPage() {
  const [fruits, setFruits] = useState<Fruit[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Fruit | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/devil-fruits");
    const json = await res.json();
    setFruits(json.fruits ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(f: Fruit) {
    setEditing(f);
    setForm({ name: f.name, category: f.category, description: f.description, powerLevel: f.powerLevel, iconUrl: f.iconUrl ?? "", order: f.order, isPublished: f.isPublished });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch(editing ? `/api/admin/devil-fruits/${editing.id}` : "/api/admin/devil-fruits", {
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
    if (!confirm("Delete this devil fruit?")) return;
    await fetch(`/api/admin/devil-fruits/${id}`, { method: "DELETE" });
    load();
  }

  const columns: Column<Fruit>[] = [
    { header: "Name", render: (f) => <div><p className="font-medium">{f.name}</p><p className="text-xs text-parchment/40">{f.category}</p></div> },
    { header: "Power", render: (f) => "★".repeat(f.powerLevel) },
    { header: "Status", render: (f) => <span className={f.isPublished ? "text-tide-glow" : "text-parchment/40"}>{f.isPublished ? "Published" : "Draft"}</span> },
    {
      header: "Actions",
      render: (f) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(f)} className="text-parchment/50 hover:text-brass-soft"><Pencil size={14} /></button>
          <button onClick={() => handleDelete(f.id)} className="text-parchment/50 hover:text-red-400"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-parchment">Devil Fruits</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-brass px-4 py-2 text-sm font-medium text-abyss hover:bg-brass-soft">
          <Plus size={14} /> New fruit
        </button>
      </div>

      {fruits === null ? <p className="text-sm text-parchment/50">Loading…</p> : (
        <AdminTable columns={columns} rows={fruits} keyField={(f) => f.id} emptyMessage="No devil fruits yet." />
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit devil fruit" : "New devil fruit"}>
        <form onSubmit={handleSubmit}>
          <Field label="Name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label="Category"><TextInput value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></Field>
          <Field label="Description"><TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></Field>
          <Field label="Power level (1-5)"><TextInput type="number" min={1} max={5} value={form.powerLevel} onChange={(e) => setForm({ ...form, powerLevel: Number(e.target.value) })} /></Field>
          <Field label="Icon URL (optional)"><TextInput value={form.iconUrl} onChange={(e) => setForm({ ...form, iconUrl: e.target.value })} /></Field>
          <Field label="Order"><TextInput type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></Field>
          <label className="mb-4 flex items-center gap-2 text-sm text-parchment/70">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Published
          </label>
          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          <SubmitButton loading={submitting}>{editing ? "Save changes" : "Create fruit"}</SubmitButton>
        </form>
      </AdminModal>
    </div>
  );
}
