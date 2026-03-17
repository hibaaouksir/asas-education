"use client";

import { useState } from "react";

export default function UniversityApplyButton({ universityName, programName, programDegree }: { universityName: string; programName: string; programDegree: string }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", city: "", level: "", sessionType: "online" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName,
          email: form.email, phone: form.phone,
          city: form.city, educationLevel: form.level,
          sessionType: form.sessionType, sourceName: "Catalogue",
          universityName, departmentName: programName, level: programDegree,
        }),
      });
      setDone(true);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", border: "1px solid #E0E0E0",
    borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" as const, outline: "none",
  };

  if (done) return <span style={{ color: "#2E7D32", fontSize: "13px", fontWeight: "600" }}>Demande envoyee !</span>;

  return (
    <>
      <button onClick={() => setShowForm(true)} style={{
        padding: "10px 22px", borderRadius: "10px", border: "none",
        background: "linear-gradient(135deg, #DDBA52, #C4A243)",
        color: "#001459", fontSize: "13px", fontWeight: "700", cursor: "pointer",
      }}>Postuler</button>

      {showForm && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 2000,
          backdropFilter: "blur(4px)",
        }} onClick={() => setShowForm(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: "white", borderRadius: "20px", padding: "32px",
            width: "100%", maxWidth: "480px", maxHeight: "90vh", overflow: "auto",
          }}>
            <h3 style={{ color: "#001459", fontSize: "18px", fontWeight: "800", margin: "0 0 4px" }}>Postuler</h3>
            <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>{universityName} — {programName} ({programDegree})</p>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "3px", fontSize: "11px", color: "#666", fontWeight: "600" }}>Prenom *</label>
                  <input required style={inputStyle} placeholder="Prenom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "3px", fontSize: "11px", color: "#666", fontWeight: "600" }}>Nom *</label>
                  <input required style={inputStyle} placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "3px", fontSize: "11px", color: "#666", fontWeight: "600" }}>Email *</label>
                <input required type="email" style={inputStyle} placeholder="votre@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "3px", fontSize: "11px", color: "#666", fontWeight: "600" }}>Telephone *</label>
                <input required style={inputStyle} placeholder="+212 6XX XXX XXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "3px", fontSize: "11px", color: "#666", fontWeight: "600" }}>Ville *</label>
                  <input required style={inputStyle} placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "3px", fontSize: "11px", color: "#666", fontWeight: "600" }}>Niveau *</label>
                  <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                    <option value="">Selectionnez</option>
                    <option value="bac">Baccalaureat</option>
                    <option value="licence">Licence</option>
                    <option value="master">Master</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "11px", color: "#666", fontWeight: "600" }}>Type de consultation *</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[{ val: "online", label: "En ligne" }, { val: "office", label: "Au bureau" }].map((t) => (
                    <button key={t.val} type="button" onClick={() => setForm({ ...form, sessionType: t.val })} style={{
                      flex: 1, padding: "10px", borderRadius: "8px",
                      border: form.sessionType === t.val ? "2px solid #DDBA52" : "1px solid #E0E0E0",
                      backgroundColor: form.sessionType === t.val ? "rgba(221,186,82,0.08)" : "white",
                      color: form.sessionType === t.val ? "#001459" : "#888",
                      fontSize: "12px", fontWeight: form.sessionType === t.val ? "700" : "400", cursor: "pointer",
                    }}>{t.label}</button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "14px", background: "linear-gradient(135deg, #DDBA52, #C4A243)",
                color: "#001459", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: "700", cursor: "pointer", opacity: loading ? 0.7 : 1,
              }}>{loading ? "Envoi..." : "Envoyer ma demande"}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
