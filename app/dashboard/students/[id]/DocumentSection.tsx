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
  additionalDocs: string[];
};

const docLabels = [
  { key: "transcript", label: "Releve de notes", required: true },
  { key: "passportFile", label: "Passeport", required: true },
  { key: "diploma", label: "Diplome", required: false },
  { key: "cv", label: "CV", required: false },
  { key: "motivationLetter", label: "Lettre de motivation", required: false },
];

export default function DocumentSection({ studentId, canEdit, docs, additionalDocs }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState("");
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState("");

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
      await fetch(`/api/students/${studentId}/docs`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "additionalDocs", url: data.secure_url }),
      });
      router.refresh();
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploadingAdditional(false);
  };

  const handleDeleteAdditional = async (url: string) => {
    setDeletingDoc(url);
    try {
      await fetch(`/api/students/${studentId}/docs`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
    }
    setDeletingDoc("");
  };

  return (
    <div>
      <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
          Photo d&apos;identite <span style={{ color: "#C62828" }}>*</span>
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
              <a href={docs.photo} target="_blank" rel="noopener noreferrer" style={{
                display: "block", fontSize: "12px", color: "#1565C0", textDecoration: "none", fontWeight: "600", marginBottom: "8px",
              }}>Voir la photo</a>
            )}
            {canEdit && (
              <label style={{
                fontSize: "12px", color: "#DDBA52", fontWeight: "600", cursor: "pointer",
                padding: "6px 14px", borderRadius: "6px", border: "1px dashed #DDBA52", display: "inline-block",
              }}>
                {uploading === "photo" ? "Upload..." : docs.photo ? "Changer" : "Uploader"}
                <input type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && handleUpload("photo", e.target.files[0])} />
              </label>
            )}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
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

      <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: 0 }}>Autres documents</h3>
          {canEdit && (
            <label style={{
              fontSize: "12px", color: "#DDBA52", fontWeight: "600", cursor: "pointer",
              padding: "6px 14px", borderRadius: "6px", border: "1px solid #DDBA52", display: "inline-block",
            }}>
              {uploadingAdditional ? "Upload..." : "+ Ajouter un document"}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleUploadAdditional(e.target.files[0])} />
            </label>
          )}
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
                {canEdit && (
                  <button onClick={() => handleDeleteAdditional(url)} disabled={deletingDoc === url} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "16px", color: "#C62828", padding: "4px",
                    opacity: deletingDoc === url ? 0.5 : 1,
                  }} title="Supprimer">✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
