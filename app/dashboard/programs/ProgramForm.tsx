"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UniOption = { id: string; name: string; cityName: string; countryName: string };

export default function ProgramForm({ universities }: { universities: UniOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", department: "", degree: "Bachelor", language: "English",
    duration: "4", pricePerYear: "", currency: "USD", universityId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          duration: parseInt(form.duration),
          pricePerYear: form.pricePerYear ? parseFloat(form.pricePerYear) : null,
        }),
      });
      if (res.ok) {
        setForm({ name: "", department: "", degree: "Bachelor", language: "English", duration: "4", pricePerYear: "", currency: "USD", universityId: "" });
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
    borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" as const, outline: "none",
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        background: "linear-gradient(135deg, #DDBA52, #C4A243)",
        color: "#001459", padding: "10px 24px", borderRadius: "8px",
        border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer",
      }}>+ Ajouter un programme</button>
    );
  }

  if (universities.length === 0) {
    return (
      <div style={{ backgroundColor: "#FFF3CD", padding: "16px", borderRadius: "8px", color: "#856404", fontSize: "14px" }}>
        Ajoutez d abord des universites.
        <a href="/dashboard/universities" style={{ color: "#001459", fontWeight: "600", marginLeft: "8px" }}>Aller aux universites</a>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "16px" }}>
      <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Nouveau programme</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Nom du programme *</label>
            <input required style={inputStyle} placeholder="Ex: Industrial Engineering" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Departement *</label>
            <input required style={inputStyle} placeholder="Ex: Engineering" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Universite *</label>
            <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.universityId} onChange={(e) => setForm({ ...form, universityId: e.target.value })}>
              <option value="">Selectionnez</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>{uni.name} - {uni.cityName} ({uni.countryName})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Niveau *</label>
            <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })}>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
              <option value="Associate">Associate</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Langue *</label>
            <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Turkish">Turkish</option>
              <option value="German">German</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Duree (annees) *</label>
            <input required type="number" min="1" max="8" style={inputStyle} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Prix par an</label>
            <input type="number" style={inputStyle} placeholder="Ex: 4200" value={form.pricePerYear} onChange={(e) => setForm({ ...form, pricePerYear: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Devise</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR</option>
              <option value="TRY">TRY</option>
              <option value="GBP">GBP</option>
              <option value="MAD">MAD</option>
            </select>
          </div>
        </div>
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