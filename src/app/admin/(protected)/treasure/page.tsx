"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/form";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Treasure {
  id: string;
  name: string;
  description: string;
  rarity: string;
  imageUrl: string | null;
  order: number;
  isPublished: boolean;
}

const emptyForm = { name: "", description: "", rarity: "common", imageUrl: "", order: 0, isPublished: true };

export default function AdminTreasurePage() {
  const [items, setItems] = useState<Treasure[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Treasure | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/treasure");
    const json = await res.json();
    setItems(json.items ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(t: Treasure) {
    setEditing(t);
    setForm({ name: t.name, description: t.description, rarity: t.rarity, imageUrl: t.imageUrl ?? "", order: t.order, isPublished: t.isPublished });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch(editing ? `/api/admin/treasure/${editing.id}` : "/api/admin/treasure", {
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
    if (!confirm("Delete this treasure item?")) return;
    await fetch(`/api/admin/treasure/${id}`, { method: "DELETE" });
    load();
  }

  const columns: Column<Treasure>[] = [
    { header: "Name", render: (t) => t.name },
    { header: "Rarity", render: (t) => <span className="capitalize">{t.rarity}</span> },
    { header: "Status", render: (t) => <span className={t.isPublished ? "text-tide-glow" : "text-parchment/40"}>{t.isPublished ? "Published" : "Draft"}</span> },
    {
      header: "Actions",
      render: (t) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(t)} className="text-parchment/50 hover:text-brass-soft"><Pencil size={14} /></button>
          <button onClick={() => handleDelete(t.id)} className="text-parchment/50 hover:text-red-400"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-parchment">Treasure</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-brass px-4 py-2 text-sm font-medium text-abyss hover:bg-brass-soft">
          <Plus size={14} /> New treasure
        </button>
      </div>

      {items === null ? <p className="text-sm text-parchment/50">Loading…</p> : (
        <AdminTable columns={columns} rows={items} keyField={(t) => t.id} emptyMessage="No treasure yet." />
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit treasure" : "New treasure"}>
        <form onSubmit={handleSubmit}>
          <Field label="Name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label="Description"><TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></Field>
          <Field label="Rarity">
            <select value={form.rarity} onChange={(e) => setForm({ ...form, rarity: e.target.value })} className="w-full rounded-lg border border-brass/20 bg-abyss px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60">
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="legendary">Legendary</option>
            </select>
          </Field>
          <Field label="Image URL (optional)"><TextInput value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></Field>
          <Field label="Order"><TextInput type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></Field>
          <label className="mb-4 flex items-center gap-2 text-sm text-parchment/70">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Published
          </label>
          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          <SubmitButton loading={submitting}>{editing ? "Save changes" : "Create treasure"}</SubmitButton>
        </form>
      </AdminModal>
    </div>
  );
}
