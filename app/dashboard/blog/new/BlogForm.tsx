"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const tagOptions = ["DESTINATION", "UNIVERSITY", "GENERAL", "SCHOLARSHIP", "TIPS"];

export default function BlogForm({ authorId }: { authorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "", content: "", excerpt: "", coverImage: "", tags: [] as string[], isPublished: false,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "asas_uploads");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/di2ekf6v5/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setForm({ ...form, coverImage: data.secure_url });
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  const toggleTag = (tag: string) => {
    setForm({
      ...form,
      tags: form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug, authorId }),
      });
      if (res.ok) {
        router.push("/dashboard/blog");
      } else {
        const data = await res.json();
        alert(data.error || "Erreur");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "1px solid #ddd",
    borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" as const, outline: "none",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Titre *</label>
          <input required style={{ ...inputStyle, fontSize: "18px", fontWeight: "600" }} placeholder="Titre de l article" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Resume (court)</label>
          <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} placeholder="Resume de l article en 1-2 phrases..." value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Contenu *</label>
          <textarea required style={{ ...inputStyle, minHeight: "300px", resize: "vertical", lineHeight: "1.8" }} placeholder="Ecrivez votre article ici..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Image de couverture</label>
          {form.coverImage && (
            <img src={form.coverImage} alt="Cover" style={{ width: "200px", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px", display: "block" }} />
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: "14px" }} />
          {uploading && <p style={{ color: "#DDBA52", fontSize: "12px", marginTop: "4px" }}>Upload en cours...</p>}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Tags</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {tagOptions.map((tag) => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{
                padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                cursor: "pointer", border: "none",
                backgroundColor: form.tags.includes(tag) ? "#001459" : "#f0f0f0",
                color: form.tags.includes(tag) ? "white" : "#666",
              }}>{tag}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#333" }}>
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Publier immediatement
          </label>
        </div>
      </div>

      <button type="submit" disabled={loading || uploading} style={{
        padding: "14px 32px", borderRadius: "8px", border: "none",
        backgroundColor: "#001459", color: "white", fontSize: "16px",
        fontWeight: "700", cursor: "pointer", opacity: loading ? 0.7 : 1,
      }}>{loading ? "Enregistrement..." : "Enregistrer l article"}</button>
    </form>
  );
}
