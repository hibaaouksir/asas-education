"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  studentId: string;
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    passportNumber: string;
    citizenship: string;
    guardianName: string;
    guardianEmail: string;
  };
};

export default function EditStudentInfo({ studentId, initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${studentId}/info`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
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
    width: "100%", padding: "9px 12px", border: "1px solid #ddd",
    borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" as const, outline: "none",
  };

  const labelStyle = { display: "block", marginBottom: "3px", fontSize: "11px", color: "#888", fontWeight: "600" as const };

  return (
    <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: 0 }}>Informations personnelles</h3>
        {saved && <span style={{ color: "#2E7D32", fontSize: "12px", fontWeight: "600" }}>Sauvegarde !</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div>
          <label style={labelStyle}>Prenom</label>
          <input style={inputStyle} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Nom</label>
          <input style={inputStyle} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Telephone</label>
          <input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Genre</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="MALE">Homme</option>
            <option value="FEMALE">Femme</option>
            <option value="OTHER">Non specifie</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Date de naissance</label>
          <input type="date" style={inputStyle} value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Passeport ou CIN</label>
          <input style={{ ...inputStyle, borderColor: !form.passportNumber ? "#E65100" : "#ddd" }} placeholder="A completer" value={form.passportNumber} onChange={(e) => setForm({ ...form, passportNumber: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Nationalite</label>
          <input style={{ ...inputStyle, borderColor: !form.citizenship ? "#E65100" : "#ddd" }} placeholder="A completer" value={form.citizenship} onChange={(e) => setForm({ ...form, citizenship: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Nom du tuteur</label>
          <input style={{ ...inputStyle, borderColor: !form.guardianName ? "#E65100" : "#ddd" }} placeholder="A completer" value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Email du tuteur</label>
          <input type="email" style={{ ...inputStyle, borderColor: !form.guardianEmail ? "#E65100" : "#ddd" }} placeholder="A completer" value={form.guardianEmail} onChange={(e) => setForm({ ...form, guardianEmail: e.target.value })} />
        </div>
      </div>

      <button onClick={handleSave} disabled={loading} style={{
        marginTop: "16px", padding: "10px 24px", borderRadius: "8px", border: "none",
        backgroundColor: "#001459", color: "white", fontSize: "13px",
        fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1,
      }}>{loading ? "Sauvegarde..." : "Sauvegarder les informations"}</button>
    </div>
  );
}
