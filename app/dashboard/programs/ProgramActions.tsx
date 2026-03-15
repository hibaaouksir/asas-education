"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  programId: string;
  program: {
    name: string;
    department: string;
    degree: string;
    language: string;
    duration: string;
    pricePerYear: string;
    currency: string;
  };
};

export default function ProgramActions({ programId, program }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(program);

  const handleDelete = async () => {
    if (!confirm("Supprimer ce programme ?")) return;
    try {
      await fetch(`/api/programs/${programId}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await fetch(`/api/programs/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          duration: parseInt(form.duration),
          pricePerYear: form.pricePerYear ? parseFloat(form.pricePerYear) : null,
        }),
      });
      setEditing(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const inputStyle = {
    padding: "6px 10px", border: "1px solid #ddd", borderRadius: "6px",
    fontSize: "13px", outline: "none", width: "100%", boxSizing: "border-box" as const,
  };

  if (editing) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
        <div style={{ backgroundColor: "white", padding: "28px", borderRadius: "14px", width: "500px", maxHeight: "90vh", overflow: "auto" }}>
          <h3 style={{ color: "#001459", fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Modifier le programme</h3>
          <div style={{ display: "grid", gap: "12px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Nom</label>
              <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Departement</label>
              <input style={inputStyle} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Niveau</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })}>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Langue</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Turkish">Turkish</option>
                  <option value="German">German</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Duree (ans)</label>
                <input type="number" style={inputStyle} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Prix/an</label>
                <input type="number" style={inputStyle} value={form.pricePerYear} onChange={(e) => setForm({ ...form, pricePerYear: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Devise</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="TRY">TRY</option>
                  <option value="GBP">GBP</option>
                  <option value="MAD">MAD</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
            <button onClick={handleUpdate} disabled={loading} style={{
              padding: "10px 20px", borderRadius: "8px", border: "none",
              backgroundColor: "#001459", color: "white", fontSize: "13px",
              fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1,
            }}>{loading ? "..." : "Sauvegarder"}</button>
            <button onClick={() => setEditing(false)} style={{
              padding: "10px 16px", borderRadius: "8px", border: "1px solid #ddd",
              backgroundColor: "white", color: "#666", fontSize: "13px", cursor: "pointer",
            }}>Annuler</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <button onClick={() => setEditing(true)} style={{
        padding: "5px 12px", borderRadius: "6px", border: "1px solid #DDBA52",
        backgroundColor: "transparent", color: "#DDBA52", fontSize: "12px",
        fontWeight: "600", cursor: "pointer",
      }}>Modifier</button>
      <button onClick={handleDelete} style={{
        padding: "5px 12px", borderRadius: "6px", border: "1px solid #DD061A",
        backgroundColor: "transparent", color: "#DD061A", fontSize: "12px",
        fontWeight: "600", cursor: "pointer",
      }}>Supprimer</button>
    </div>
  );
}
