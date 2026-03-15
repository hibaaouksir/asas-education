"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsultantForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "CONSULTANT" }),
      });
      if (res.ok) {
        setForm({ firstName: "", lastName: "", email: "", password: "", phone: "" });
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
      }}>+ Ajouter un consultant</button>
    );
  }

  return (
    <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "16px" }}>
      <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Nouveau Consultant</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Prenom *</label>
            <input required style={inputStyle} placeholder="Prenom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Nom *</label>
            <input required style={inputStyle} placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Email *</label>
            <input required type="email" style={inputStyle} placeholder="email@exemple.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Mot de passe *</label>
            <input required type="password" style={inputStyle} placeholder="Minimum 8 caracteres" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Telephone</label>
          <input style={inputStyle} placeholder="+212 6 00 00 00 00" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="submit" disabled={loading} style={{
            padding: "10px 20px", borderRadius: "8px", border: "none",
            backgroundColor: "#001459", color: "white", fontSize: "13px",
            fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1,
          }}>{loading ? "..." : "Creer le compte"}</button>
          <button type="button" onClick={() => setOpen(false)} style={{
            padding: "10px 16px", borderRadius: "8px", border: "1px solid #ddd",
            backgroundColor: "white", color: "#666", fontSize: "13px", cursor: "pointer",
          }}>Annuler</button>
        </div>
      </form>
    </div>
  );
}