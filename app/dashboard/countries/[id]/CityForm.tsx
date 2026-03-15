"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CityForm({ countryId }: { countryId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, countryId }),
      });
      if (res.ok) {
        setName("");
        setOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        background: "linear-gradient(135deg, #DDBA52, #C4A243)",
        color: "#001459", padding: "10px 24px", borderRadius: "8px",
        border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer",
      }}>+ Ajouter une ville</button>
    );
  }

  return (
    <div style={{
      backgroundColor: "white", padding: "24px", borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "16px",
    }}>
      <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Nouvelle ville</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", alignItems: "end" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Nom de la ville *</label>
          <input required style={{
            width: "100%", padding: "10px 14px", border: "1px solid #ddd",
            borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", outline: "none",
          }} placeholder="Ex: Istanbul" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} style={{
          padding: "10px 20px", borderRadius: "8px", border: "none",
          backgroundColor: "#001459", color: "white", fontSize: "13px",
          fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1,
        }}>{loading ? "..." : "Ajouter"}</button>
        <button type="button" onClick={() => setOpen(false)} style={{
          padding: "10px 16px", borderRadius: "8px", border: "1px solid #ddd",
          backgroundColor: "white", color: "#666", fontSize: "13px", cursor: "pointer",
        }}>Annuler</button>
      </form>
    </div>
  );
}
