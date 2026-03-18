"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  studentId: string;
  canEdit: boolean;
  docs: {
    transcript: string;
    passportFile: string;
    diploma: string;
    cv: string;
    motivationLetter: string;
    photo: string;
  };
};

const docLabels = [
  { key: "transcript", label: "Releve de notes" },
  { key: "passportFile", label: "Passeport" },
  { key: "diploma", label: "Diplome" },
  { key: "cv", label: "CV" },
  { key: "motivationLetter", label: "Lettre de motivation" },
];

export default function DocumentSection({ studentId, canEdit, docs }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState("");

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
      await fetch(`/api/students/${studentId}/docs`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, url: data.secure_url }),
      });
      router.refresh();
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading("");
  };

  return (
    <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
      
      {/* Photo Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{
          width: "100px", height: "120px", borderRadius: "10px", overflow: "hidden",
          backgroundColor: "#F5F5F5", border: docs.photo ? "2px solid #DDBA52" : "2px dashed #ccc",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {docs.photo ? (
            <img src={docs.photo} alt="Photo etudiant" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "36px", color: "#ccc" }}>👤</span>
          )}
        </div>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "700", color: "#001459", margin: "0 0 4px" }}>Photo d&apos;identite</p>
          <p style={{ fontSize: "12px", color: "#888", margin: "0 0 10px" }}>
            {docs.photo ? "Photo uploadee" : "Aucune photo"}
          </p>
          {canEdit && (
            <label style={{
              fontSize: "12px", color: "#DDBA52", fontWeight: "600", cursor: "pointer",
              padding: "6px 14px", borderRadius: "6px", border: "1px solid #DDBA52",
              display: "inline-block",
            }}>
              {uploading === "photo" ? "Upload..." : docs.photo ? "Changer la photo" : "Uploader une photo"}
              <input type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleUpload("photo", e.target.files[0])} />
            </label>
          )}
        </div>
      </div>

      {/* Documents Section */}
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
              {canEdit && (
                <div>
                  <label style={{
                    fontSize: "11px", color: "#DDBA52", fontWeight: "600", cursor: "pointer",
                    padding: "4px 8px", borderRadius: "4px", border: "1px dashed #DDBA52",
                  }}>
                    {uploading === doc.key ? "Upload..." : url ? "Remplacer" : "Uploader"}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }}
                      onChange={(e) => e.target.files?.[0] && handleUpload(doc.key, e.target.files[0])} />
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
