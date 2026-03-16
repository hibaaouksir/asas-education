"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProgramOption = { id: string; name: string; degree: string; universityName: string; countryName: string };

export default function StudentForm({ userId, programs }: { userId: string; programs: ProgramOption[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", gender: "MALE", dateOfBirth: "",
    passportNumber: "", citizenship: "", email: "", phone: "",
    guardianName: "", guardianEmail: "", programId: "",
  });
  const [docs, setDocs] = useState({
    transcript: "", passportFile: "", diploma: "", cv: "", motivationLetter: "",
  });

  const handleUpload = async (field: string, file: File) => {
    setUploading(field);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "asas_uploads");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/di2ekf6v5/auto/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setDocs((prev) => ({ ...prev, [field]: data.secure_url }));
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...docs, consultantId: userId }),
      });
      if (res.ok) {
        router.push("/dashboard/students");
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

  const labelStyle = { display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" as const };

  const docFields = [
    { key: "transcript", label: "Releve de notes" },
    { key: "diploma", label: "Attestation de scolarite ou diplome" },
    { key: "passportFile", label: "Passeport ou CIN" },
    { key: "cv", label: "CV" },
    { key: "motivationLetter", label: "Lettre de motivation" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Informations personnelles</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={labelStyle}>Prenom *</label>
            <input required style={inputStyle} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input required style={inputStyle} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Genre *</label>
            <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="MALE">Homme</option>
              <option value="FEMALE">Femme</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date de naissance *</label>
            <input required type="date" style={inputStyle} value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Numero de passeport ou CIN *</label>
            <input required style={inputStyle} value={form.passportNumber} onChange={(e) => setForm({ ...form, passportNumber: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Nationalite *</label>
            <input required style={inputStyle} placeholder="Ex: Marocaine" value={form.citizenship} onChange={(e) => setForm({ ...form, citizenship: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input required type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Telephone *</label>
            <input required style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Nom du tuteur *</label>
            <input required style={inputStyle} value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Email du tuteur *</label>
            <input required type="email" style={inputStyle} value={form.guardianEmail} onChange={(e) => setForm({ ...form, guardianEmail: e.target.value })} />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Programme souhaite</h3>
        <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value })}>
          <option value="">Selectionnez un programme</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>{p.universityName} - {p.name} ({p.degree}) - {p.countryName}</option>
          ))}
        </select>
      </div>

      <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Documents</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {docFields.map((doc) => (
            <div key={doc.key} style={{ padding: "16px", backgroundColor: "#FAFAFA", borderRadius: "8px" }}>
              <label style={labelStyle}>{doc.label}</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files?.[0] && handleUpload(doc.key, e.target.files[0])}
                style={{ fontSize: "13px" }}
              />
              {uploading === doc.key && <p style={{ color: "#DDBA52", fontSize: "12px", marginTop: "4px" }}>Upload en cours...</p>}
              {docs[doc.key as keyof typeof docs] && (
                <p style={{ color: "#2E7D32", fontSize: "12px", marginTop: "4px", fontWeight: "600" }}>Fichier uploade</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading || uploading !== ""} style={{
        padding: "14px 32px", borderRadius: "8px", border: "none",
        backgroundColor: "#001459", color: "white", fontSize: "16px",
        fontWeight: "700", cursor: "pointer", opacity: loading ? 0.7 : 1,
      }}>{loading ? "Enregistrement..." : "Enregistrer l etudiant"}</button>
    </form>
  );
}

