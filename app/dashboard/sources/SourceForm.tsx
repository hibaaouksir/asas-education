"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SourceForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", platform: "Instagram", influencer: "", description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", platform: "Instagram", influencer: "", description: "" });
        setOpen(false);
        router.refresh();
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

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        background: "linear-gradient(135deg, #DDBA52, #C4A243)",
        color: "#001459", padding: "10px 24px", borderRadius: "8px",
        border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer",
      }}>+ Ajouter une source</button>
    );
  }

  return (
    <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "16px" }}>
      <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Nouvelle source de tracking</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Nom de la campagne *</label>
            <input required style={inputStyle} placeholder="Ex: Campagne Mars 2026" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Plateforme *</label>
            <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Influenceur (optionnel)</label>
            <input style={inputStyle} placeholder="Ex: Bahae" value={form.influencer} onChange={(e) => setForm({ ...form, influencer: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Description (optionnel)</label>
            <input style={inputStyle} placeholder="Details de la campagne" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="submit" disabled={loading} style={{
            padding: "10px 20px", borderRadius: "8px", border: "none",
            backgroundColor: "#001459", color: "white", fontSize: "13px",
            fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1,
          }}>{loading ? "..." : "Creer la source"}</button>
          <button type="button" onClick={() => setOpen(false)} style={{
            padding: "10px 16px", borderRadius: "8px", border: "1px solid #ddd",
            backgroundColor: "white", color: "#666", fontSize: "13px", cursor: "pointer",
          }}>Annuler</button>
        </div>
      </form>
    </div>
  );
}