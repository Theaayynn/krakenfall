"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO" | "AUDIO";
  order: number;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/gallery");
    const json = await res.json();
    setItems(json.items ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function detectMediaType(file: File): "IMAGE" | "VIDEO" | "AUDIO" {
    if (file.type.startsWith("video/")) return "VIDEO";
    if (file.type.startsWith("audio/")) return "AUDIO";
    return "IMAGE";
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!title.trim()) {
      setError("Give the upload a title first.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("File too large — max 25MB.");
      return;
    }

    setError("");
    setUploading(true);
    const mediaType = detectMediaType(file);

    const reader = new FileReader();
    reader.onload = async () => {
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: reader.result, type: mediaType, filename: file.name }),
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) {
        setUploading(false);
        setError(uploadJson.error ?? "Upload failed.");
        return;
      }

      const galleryRes = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, mediaUrl: uploadJson.asset.url, mediaType }),
      });
      setUploading(false);
      if (!galleryRes.ok) {
        setError("Uploaded to storage but failed to save the gallery entry.");
        return;
      }
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      load();
    };
    reader.readAsDataURL(file);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this media item?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-parchment">Gallery / Media</h1>
      </div>

      <div className="mb-6 rounded-2xl border border-brass/15 bg-white/[0.03] p-5">
        <p className="mb-3 text-sm text-parchment/70">Upload image, video, or audio (max 25MB)</p>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title for this upload"
            className="flex-1 rounded-lg border border-brass/20 bg-transparent px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg bg-brass px-4 py-2.5 text-sm font-medium text-abyss hover:bg-brass-soft disabled:opacity-50"
          >
            <Upload size={14} /> {uploading ? "Uploading…" : "Choose file"}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*" onChange={handleFileSelect} className="hidden" />
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      {items === null ? (
        <p className="text-sm text-parchment/50">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-brass/15 bg-white/[0.03] py-16 text-center text-sm text-parchment/50">No media yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-brass/15 bg-abyss-700">
              {item.mediaType === "IMAGE" && <Image src={item.mediaUrl} alt={item.title} fill className="object-cover" sizes="25vw" />}
              {item.mediaType === "VIDEO" && <video src={item.mediaUrl} className="h-full w-full object-cover" muted />}
              {item.mediaType === "AUDIO" && (
                <div className="flex h-full items-center justify-center p-4 text-center text-xs text-parchment/50">🎵 {item.title}</div>
              )}
              <div className="absolute inset-0 flex flex-col justify-between bg-black/50 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => handleDelete(item.id)} className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-red-500/80 text-white">
                  <Trash2 size={13} />
                </button>
                <p className="text-xs text-white">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
