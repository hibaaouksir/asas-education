"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  university: {
    id: string;
    name: string;
    website: string;
    description: string;
    photo: string;
    cityName: string;
    countryName: string;
  };
};

export default function EditUniversityForm({ university }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(university.photo);
  const [form, setForm] = useState({
    name: university.name,
    website: university.website,
    description: university.description,
  });
  const [saved, setSaved] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "asas_uploads");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/di2ekf6v5/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImageUrl(data.secure_url);
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/universities/${university.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photo: imageUrl }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
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

  return (
    <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ color: "#001459", fontSize: "22px", fontWeight: "700", margin: "0 0 4px 0" }}>{university.name}</h1>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{university.cityName}, {university.countryName}</p>
        </div>
        {saved && <span style={{ color: "#2E7D32", fontSize: "13px", fontWeight: "600", backgroundColor: "#E8F5E9", padding: "6px 14px", borderRadius: "20px" }}>Sauvegarde !</span>}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Nom</label>
            <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Site web</label>
            <input style={inputStyle} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Description</label>
          <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Photo de l universite</label>
          {imageUrl && (
            <div style={{ marginBottom: "12px" }}>
              <img src={imageUrl} alt={university.name} style={{ width: "200px", height: "130px", objectFit: "cover", borderRadius: "10px", border: "2px solid #eee" }} />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: "14px" }} />
          {uploading && <p style={{ color: "#DDBA52", fontSize: "13px", marginTop: "6px" }}>Upload en cours...</p>}
        </div>

        <button type="submit" disabled={loading || uploading} style={{
          padding: "10px 24px", borderRadius: "8px", border: "none",
          backgroundColor: "#001459", color: "white", fontSize: "14px",
          fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1,
        }}>{loading ? "Sauvegarde..." : "Sauvegarder les modifications"}</button>
      </form>
    </div>
  );
}
