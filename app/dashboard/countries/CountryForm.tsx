"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function codeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export default function CountryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", code: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const flag = codeToFlag(form.code);
      const res = await fetch("/api/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, flag }),
      });
      if (res.ok) {
        setForm({ name: "", code: "" });
        setOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "1px solid #ddd",
    borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" as const,
    outline: "none",
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        background: "linear-gradient(135deg, #DDBA52, #C4A243)",
        color: "#001459", padding: "10px 24px", borderRadius: "8px",
        border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer",
      }}>+ Ajouter un pays</button>
    );
  }

  return (
    <div style={{
      backgroundColor: "white", padding: "24px", borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "16px",
    }}>
      <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Nouveau pays</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", alignItems: "end" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Nom du pays *</label>
          <input required style={inputStyle} placeholder="Ex: Turquie" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div style={{ width: "120px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Code ISO *</label>
          <input required style={inputStyle} placeholder="Ex: TR" maxLength={2} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
        </div>
        {form.code.length === 2 && (
          <div style={{ fontSize: "32px", paddingBottom: "4px" }}>{codeToFlag(form.code)}</div>
        )}
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="submit" disabled={loading} style={{
            padding: "10px 20px", borderRadius: "8px", border: "none",
            backgroundColor: "#001459", color: "white", fontSize: "13px",
            fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1,
          }}>{loading ? "..." : "Ajouter"}</button>
          <button type="button" onClick={() => setOpen(false)} style={{
            padding: "10px 16px", borderRadius: "8px", border: "1px solid #ddd",
            backgroundColor: "white", color: "#666", fontSize: "13px", cursor: "pointer",
          }}>Annuler</button>
        </div>
      </form>
    </div>
  );
}
