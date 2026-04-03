"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  programName: string;
  department: string;
  description: string;
  image: string;
};

export default function ProgramGroupEdit({ programName, department, description, image }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ department, description, image });

  const handleImageUpload = async (file: File) => {
    setUploading(true);
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
        setForm((prev) => ({ ...prev, image: data.secure_url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  };
  const handleDeleteAll = async () => {
    if (!confirm(`Supprimer le programme "${programName}" et toutes ses universites ? Cette action est irreversible.`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/programs/delete-group", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: programName }),
      });
      if (res.ok) router.refresh();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/programs/update-group", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: programName,
          department: form.department,
          description: form.description,
          image: form.image,
        }),
      });
      if (res.ok) {
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

  const labelStyle = { display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" as const };

  if (!open) {
    return (
      <div onClick={() => setOpen(true)} style={{ display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
        {image ? (
          <img src={image} alt={programName} style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "linear-gradient(135deg, #001459, #000B2E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#DDBA52", fontSize: "18px", fontWeight: "700" }}>{programName.charAt(0)}</span>
          </div>
        )}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: 0 }}>{programName}</h3>
            <span style={{ fontSize: "11px", color: "#DDBA52", fontWeight: "600" }}>✏️ Modifier</span>
          </div>
          <p style={{ color: "#888", fontSize: "12px", margin: "2px 0 0" }}>{department}</p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); handleDeleteAll(); }} style={{
          padding: "4px 10px", borderRadius: "6px", border: "1px solid #DD061A",
          backgroundColor: "transparent", color: "#DD061A", fontSize: "11px",
          fontWeight: "600", cursor: "pointer", marginLeft: "auto",
        }}>Supprimer</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FAFAFA", padding: "20px", borderRadius: "12px", border: "1px solid #E0E0E0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: 0 }}>Modifier {programName}</h3>
        <button onClick={() => setOpen(false)} style={{
          background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#888",
        }}>✕</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        <div>
          <label style={labelStyle}>Departement</label>
          <input style={inputStyle} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Image du programme</label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {form.image ? (
              <img src={form.image} alt="" style={{ width: "80px", height: "56px", objectFit: "cover", borderRadius: "6px", border: "2px solid #DDBA52" }} />
            ) : (
              <div style={{ width: "80px", height: "56px", borderRadius: "6px", backgroundColor: "#F0F0F0", border: "2px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#ccc" }}>Aucune</div>
            )}
            <label style={{
              fontSize: "11px", color: "#DDBA52", fontWeight: "600", cursor: "pointer",
              padding: "4px 10px", borderRadius: "6px", border: "1px dashed #DDBA52",
            }}>
              {uploading ? "..." : form.image ? "Changer" : "Uploader"}
              <input type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            </label>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle}>Description</label>
        <textarea
          style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
          placeholder="Description du programme..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={handleSave} disabled={loading || uploading} style={{
          padding: "8px 16px", borderRadius: "6px", border: "none",
          backgroundColor: "#001459", color: "white", fontSize: "12px",
          fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1,
        }}>{loading ? "..." : "Sauvegarder"}</button>
        <button onClick={() => setOpen(false)} style={{
          padding: "8px 16px", borderRadius: "6px", border: "1px solid #ddd",
          backgroundColor: "white", color: "#666", fontSize: "12px", cursor: "pointer",
        }}>Annuler</button>
      </div>
    </div>
  );
}
