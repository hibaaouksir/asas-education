"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProgramOption = { id: string; name: string; degree: string; universityName: string; countryName: string };

export default function StudentForm({ userId, programs }: { userId: string; programs: ProgramOption[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState("");
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", gender: "MALE", dateOfBirth: "",
    passportNumber: "", citizenship: "", email: "", phone: "",
    guardianName: "", guardianEmail: "", programId: "",
  });
  const [docs, setDocs] = useState({
    transcript: "", passportFile: "", diploma: "", cv: "", motivationLetter: "", photo: "",
  });
  const [additionalDocs, setAdditionalDocs] = useState<string[]>([]);

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
      if (data.secure_url) {
        setDocs((prev) => ({ ...prev, [field]: data.secure_url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading("");
  };

  const handleUploadAdditional = async (file: File) => {
    setUploadingAdditional(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "asas_uploads");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/di2ekf6v5/auto/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setAdditionalDocs((prev) => [...prev, data.secure_url]);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploadingAdditional(false);
  };

  const handleDeleteAdditional = (url: string) => {
    setAdditionalDocs((prev) => prev.filter((d) => d !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...docs, additionalDocs, consultantId: userId }),
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

  const star = <span style={{ color: "#C62828" }}>*</span>;

  const docLabels = [
    { key: "transcript", label: "Releve de notes", required: true },
    { key: "passportFile", label: "Passeport", required: true },
    { key: "diploma", label: "Diplome", required: false },
    { key: "cv", label: "CV", required: false },
    { key: "motivationLetter", label: "Lettre de motivation", required: false },
  ];

  // Check if all required fields are filled
  const isInfoComplete = form.firstName !== "" && form.lastName !== "" && form.email !== "" && form.phone !== "" && form.dateOfBirth !== "" && form.passportNumber !== "" && form.citizenship !== "" && form.guardianName !== "" && form.guardianEmail !== "" && form.programId !== "" && form.gender !== "OTHER";
  const isDocsComplete = docs.photo !== "" && docs.transcript !== "" && docs.passportFile !== "";
  const isComplete = isInfoComplete && isDocsComplete;

  return (
    <form onSubmit={handleSubmit}>
      {/* Warning banner */}
      {!isComplete && (
        <div style={{
          backgroundColor: "#FFF3E0", borderLeft: "4px solid #E65100",
          padding: "16px 20px", borderRadius: "0 8px 8px 0", marginBottom: "20px",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <span style={{ fontSize: "24px" }}>⚠️</span>
          <div>
            <p style={{ color: "#E65100", fontSize: "14px", fontWeight: "600", margin: "0 0 2px" }}>Champs obligatoires incomplets</p>
            <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>
              Veuillez remplir toutes les informations marquees d&apos;une etoile {star} ainsi que la photo, le releve de notes et le passeport pour pouvoir envoyer la candidature.
            </p>
          </div>
        </div>
      )}

      {/* Informations personnelles */}
      <div style={{ backgroundColor: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>Informations personnelles</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Prenom {star}</label>
            <input required style={inputStyle} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Nom {star}</label>
            <input required style={inputStyle} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Email {star}</label>
            <input required type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Telephone {star}</label>
            <input required style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Genre {star}</label>
            <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="MALE">Homme</option>
              <option value="FEMALE">Femme</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date de naissance {star}</label>
            <input required type="date" style={inputStyle} value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Passeport ou CIN {star}</label>
            <input required style={inputStyle} value={form.passportNumber} onChange={(e) => setForm({ ...form, passportNumber: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Nationalite {star}</label>
            <input required style={inputStyle} placeholder="Ex: Marocaine" value={form.citizenship} onChange={(e) => setForm({ ...form, citizenship: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Nom du tuteur {star}</label>
            <input required style={inputStyle} value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Email du tuteur {star}</label>
            <input required type="email" style={inputStyle} value={form.guardianEmail} onChange={(e) => setForm({ ...form, guardianEmail: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Programme souhaite */}
      <div style={{ backgroundColor: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Programme souhaite {star}</h3>
        <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value })}>
          <option value="">Selectionnez un programme</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>{p.universityName} - {p.name} ({p.degree}) - {p.countryName}</option>
          ))}
        </select>
      </div>

      {/* Photo d'identite */}
      <div style={{ backgroundColor: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
          Photo d&apos;identite {star}
        </h3>
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
            {docs.photo && (
              <p style={{ fontSize: "12px", color: "#2E7D32", fontWeight: "600", margin: "0 0 8px" }}>✅ Photo uploadee</p>
            )}
            <label style={{
              fontSize: "12px", color: "#DDBA52", fontWeight: "600", cursor: "pointer",
              padding: "6px 14px", borderRadius: "6px", border: "1px dashed #DDBA52",
              display: "inline-block",
            }}>
              {uploading === "photo" ? "Upload en cours..." : docs.photo ? "Changer la photo" : "Uploader une photo"}
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
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{url ? "✅" : "📄"}</div>
                <p style={{ fontSize: "12px", fontWeight: "600", color: url ? "#2E7D32" : "#888", margin: "0 0 8px" }}>
                  {doc.label} {doc.required && <span style={{ color: "#C62828" }}>*</span>}
                </p>
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

      {/* Autres documents */}
      <div style={{ backgroundColor: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: 0 }}>Autres documents</h3>
          <label style={{
            fontSize: "12px", color: "#DDBA52", fontWeight: "600", cursor: "pointer",
            padding: "6px 14px", borderRadius: "6px", border: "1px solid #DDBA52", display: "inline-block",
          }}>
            {uploadingAdditional ? "Upload..." : "+ Ajouter un document"}
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleUploadAdditional(e.target.files[0])} />
          </label>
        </div>
        {additionalDocs.length === 0 ? (
          <p style={{ color: "#bbb", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>Aucun document supplementaire</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
            {additionalDocs.map((url, index) => (
              <div key={index} style={{
                padding: "14px", borderRadius: "8px", backgroundColor: "#E8F5E9",
                border: "1px solid #C8E6C9", display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px" }}>📎</span>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#2E7D32", margin: "0 0 4px" }}>Document {index + 1}</p>
                    <a href={url} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: "11px", color: "#1565C0", textDecoration: "none", fontWeight: "600",
                    }}>Telecharger</a>
                  </div>
                </div>
                <button type="button" onClick={() => handleDeleteAdditional(url)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "16px", color: "#C62828", padding: "4px",
                }} title="Supprimer">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note obligatoire */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", color: "#C62828", margin: 0 }}>{star} Champs obligatoires pour pouvoir envoyer la candidature</p>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading || uploading !== "" || uploadingAdditional} style={{
        padding: "14px 32px", borderRadius: "10px", border: "none",
        background: "linear-gradient(135deg, #DDBA52, #C4A243)",
        color: "#001459", fontSize: "16px",
        fontWeight: "700", cursor: "pointer", opacity: loading ? 0.7 : 1,
        boxShadow: "0 4px 12px rgba(221,186,82,0.3)",
      }}>{loading ? "Enregistrement..." : "Enregistrer l etudiant"}</button>
    </form>
  );
}
