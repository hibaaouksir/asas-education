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
    transcript: "", passportFile: "", diploma: "", cv: "", motivationLetter: "", photo: "",
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
    width: "100%", padding: "12px 16px", border: "1px solid #E0E0E0",
    borderRadius: "10px", fontSize: "14px", boxSizing: "border-box" as const,
    outline: "none", backgroundColor: "#FAFAFA", transition: "border-color 0.3s",
  };

  const labelStyle = { display: "block", marginBottom: "6px", fontSize: "12px", color: "#888", fontWeight: "600" as const };

  const docLabels = [
    { key: "transcript", label: "Releve de notes" },
    { key: "passportFile", label: "Passeport" },
    { key: "diploma", label: "Diplome" },
    { key: "cv", label: "CV" },
    { key: "motivationLetter", label: "Lettre de motivation" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      {/* Informations personnelles */}
      <div style={{ backgroundColor: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>Informations personnelles</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Prenom *</label>
            <input required style={inputStyle} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input required style={inputStyle} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
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
            <label style={labelStyle}>Passeport ou CIN *</label>
            <input required style={inputStyle} value={form.passportNumber} onChange={(e) => setForm({ ...form, passportNumber: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Nationalite *</label>
            <input required style={inputStyle} placeholder="Ex: Marocaine" value={form.citizenship} onChange={(e) => setForm({ ...form, citizenship: e.target.value })} />
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

      {/* Programme souhaite */}
      <div style={{ backgroundColor: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Programme souhaite</h3>
        <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value })}>
          <option value="">Selectionnez un programme</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>{p.universityName} - {p.name} ({p.degree}) - {p.countryName}</option>
          ))}
        </select>
      </div>

      {/* Photo d'identite */}
      <div style={{ backgroundColor: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{
            width: "100px", height: "120px", borderRadius: "10px", overflow: "hidden",
            backgroundColor: "#F5F5F5", border: docs.photo ? "2px solid #DDBA52" : "2px dashed #ccc",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {docs.photo ? (
              <img src={docs.photo} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "36px", color: "#ccc" }}>👤</span>
            )}
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#001459", margin: "0 0 4px" }}>Photo d&apos;identite</p>
            <p style={{ fontSize: "12px", color: "#888", margin: "0 0 10px" }}>
              {docs.photo ? "Photo uploadee" : "Aucune photo"}
            </p>
            <label style={{
              fontSize: "12px", color: "#DDBA52", fontWeight: "600", cursor: "pointer",
              padding: "6px 14px", borderRadius: "6px", border: "1px solid #DDBA52",
              display: "inline-block",
            }}>
              {uploading === "photo" ? "Upload..." : docs.photo ? "Changer la photo" : "Uploader une photo"}
              <input type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleUpload("photo", e.target.files[0])} />
            </label>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div style={{ backgroundColor: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Documents</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
          {docLabels.map((doc) => {
            const url = docs[doc.key as keyof typeof docs];
            return (
              <div key={doc.key} style={{
                padding: "16px", borderRadius: "8px", textAlign: "center",
                backgroundColor: url ? "#E8F5E9" : "#F5F5F5",
                border: url ? "1px solid #C8E6C9" : "1px solid #E0E0E0",
              }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{url ? "✅" : "❌"}</div>
                <p style={{ fontSize: "12px", fontWeight: "600", color: url ? "#2E7D32" : "#888", margin: "0 0 8px" }}>{doc.label}</p>
                {url && (
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{
                    display: "block", fontSize: "11px", color: "#1565C0", textDecoration: "none", fontWeight: "600", marginBottom: "8px",
                  }}>Telecharger</a>
                )}
                <label style={{
                  fontSize: "11px", color: "#DDBA52", fontWeight: "600", cursor: "pointer",
                  padding: "4px 8px", borderRadius: "4px", border: "1px dashed #DDBA52",
                }}>
                  {uploading === doc.key ? "Upload..." : url ? "Remplacer" : "Uploader"}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }}
                    onChange={(e) => e.target.files?.[0] && handleUpload(doc.key, e.target.files[0])} />
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading || uploading !== ""} style={{
        padding: "14px 32px", borderRadius: "10px", border: "none",
        background: "linear-gradient(135deg, #DDBA52, #C4A243)",
        color: "#001459", fontSize: "16px",
        fontWeight: "700", cursor: "pointer", opacity: loading ? 0.7 : 1,
        boxShadow: "0 4px 12px rgba(221,186,82,0.3)",
      }}>{loading ? "Enregistrement..." : "Enregistrer l etudiant"}</button>
    </form>
  );
}
