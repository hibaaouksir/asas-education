"use client";

import { useState } from "react";

export default function LandingForm({ sourceId, sourceName }: { sourceId: string; sourceName: string }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", city: "", level: "", sessionType: "online",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          educationLevel: form.level,
          sourceName: sourceName,
          sourceId: sourceId,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px", fontSize: "14px", boxSizing: "border-box" as const,
    outline: "none", backgroundColor: "rgba(255,255,255,0.08)", color: "white",
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "16px", border: "1px solid rgba(221,186,82,0.3)" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <h3 style={{ color: "#DDBA52", fontSize: "20px", marginBottom: "8px" }}>Merci !</h3>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>Votre demande a ete envoyee. Un consultant vous contactera bientot.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: "rgba(255,255,255,0.04)", padding: "28px", borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>Prenom *</label>
          <input required style={inputStyle} placeholder="Votre prenom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>Nom *</label>
          <input required style={inputStyle} placeholder="Votre nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </div>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>Email *</label>
        <input required type="email" style={inputStyle} placeholder="votre@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>Telephone *</label>
        <input required style={inputStyle} placeholder="+212 6XX XXX XXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>Ville *</label>
          <input required style={inputStyle} placeholder="Votre ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>Niveau *</label>
          <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
            <option value="" style={{ color: "#333" }}>Selectionnez</option>
            <option value="bac" style={{ color: "#333" }}>Baccalaureat</option>
            <option value="licence" style={{ color: "#333" }}>Licence</option>
            <option value="master" style={{ color: "#333" }}>Master</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>Type de seance *</label>
        <div style={{ display: "flex", gap: "12px" }}>
          {[{ val: "online", label: "💻 En ligne" }, { val: "office", label: "🏢 Au bureau" }].map((t) => (
            <button key={t.val} type="button" onClick={() => setForm({ ...form, sessionType: t.val })} style={{
              flex: 1, padding: "12px", borderRadius: "10px",
              border: form.sessionType === t.val ? "2px solid #DDBA52" : "1px solid rgba(255,255,255,0.15)",
              backgroundColor: form.sessionType === t.val ? "rgba(221,186,82,0.15)" : "rgba(255,255,255,0.04)",
              color: form.sessionType === t.val ? "#DDBA52" : "rgba(255,255,255,0.5)",
              fontSize: "14px", fontWeight: form.sessionType === t.val ? "600" : "400",
              cursor: "pointer",
            }}>{t.label}</button>
          ))}
        </div>
      </div>
      <button type="submit" disabled={loading} style={{
        width: "100%", padding: "15px",
        background: "linear-gradient(135deg, #DDBA52, #C4A243)",
        color: "#001459", border: "none", borderRadius: "10px",
        fontSize: "15px", fontWeight: "700", cursor: "pointer",
        opacity: loading ? 0.7 : 1,
      }}>{loading ? "Envoi..." : "Reserver ma consultation gratuite"}</button>
    </form>
  );
}

