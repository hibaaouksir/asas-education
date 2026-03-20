"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UniOption = { id: string; name: string; cityName: string; countryName: string };
type ExistingProgram = { name: string; department: string; description: string; image: string };

export default function ProgramForm({ universities, existingPrograms }: { universities: UniOption[]; existingPrograms: ExistingProgram[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [suggestions, setSuggestions] = useState<ExistingProgram[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [form, setForm] = useState({
    name: "", department: "", degree: "Bachelor", language: "English",
    duration: "4", pricePerYear: "", currency: "USD", universityId: "",
    description: "", image: "",
  });

  const handleNameChange = (value: string) => {
    setForm((prev) => ({ ...prev, name: value }));
    if (value.length >= 2) {
      const matches = existingPrograms.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectExistingProgram = (prog: ExistingProgram) => {
    setForm((prev) => ({
      ...prev,
      name: prog.name,
      department: prog.department,
      description: prog.description || prev.description,
      image: prog.image || prev.image,
    }));
    setShowSuggestions(false);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          duration: parseInt(form.duration),
          pricePerYear: form.pricePerYear ? parseFloat(form.pricePerYear) : null,
        }),
      });
      if (res.ok) {
        setForm({ name: "", department: "", degree: "Bachelor", language: "English", duration: "4", pricePerYear: "", currency: "USD", universityId: "", description: "", image: "" });
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
      <button onClick={() => setOpen(true)} style={{
        background: "linear-gradient(135deg, #DDBA52, #C4A243)",
        color: "#001459", padding: "10px 24px", borderRadius: "8px",
        border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer",
      }}>+ Ajouter un programme</button>
    );
  }

  if (universities.length === 0) {
    return (
      <div style={{ backgroundColor: "#FFF3CD", padding: "16px", borderRadius: "8px", color: "#856404", fontSize: "14px" }}>
        Ajoutez d abord des universites.
        <a href="/dashboard/universities" style={{ color: "#001459", fontWeight: "600", marginLeft: "8px" }}>Aller aux universites</a>
      </div>
    );
  }

  const isExisting = existingPrograms.some(p => p.name.toLowerCase() === form.name.toLowerCase());

  return (
    <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "16px" }}>
      <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Nouveau programme</h3>

      {isExisting && (
        <div style={{
          backgroundColor: "#E3F2FD", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px",
          fontSize: "13px", color: "#1565C0", display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ fontSize: "16px" }}>ℹ️</span>
          Ce programme existe deja. Le departement, la description et l&apos;image ont ete pre-remplis. Choisissez l&apos;universite et les details specifiques.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div style={{ position: "relative" }}>
            <label style={labelStyle}>Nom du programme *</label>
            <input required style={inputStyle} placeholder="Ex: Industrial Engineering" value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
                backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "1px solid #E0E0E0", maxHeight: "200px", overflowY: "auto",
              }}>
                {suggestions.map((s, i) => (
                  <div key={i} onMouseDown={() => selectExistingProgram(s)} style={{
                    padding: "10px 14px", cursor: "pointer", fontSize: "13px",
                    borderBottom: i < suggestions.length - 1 ? "1px solid #f0f0f0" : "none",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <span style={{ fontWeight: "600", color: "#001459" }}>{s.name}</span>
                      <span style={{ color: "#888", marginLeft: "8px" }}>{s.department}</span>
                    </div>
                    <span style={{ fontSize: "11px", color: "#DDBA52", fontWeight: "600" }}>Utiliser</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Departement *</label>
            <input required style={{ ...inputStyle, backgroundColor: isExisting ? "#F5F5F5" : "white" }} placeholder="Ex: Engineering" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} readOnly={isExisting} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={labelStyle}>Universite *</label>
            <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.universityId} onChange={(e) => setForm({ ...form, universityId: e.target.value })}>
              <option value="">Selectionnez</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>{uni.name} - {uni.cityName} ({uni.countryName})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Niveau *</label>
            <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })}>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
              <option value="Associate">Associate</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Langue *</label>
            <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Turkish">Turkish</option>
              <option value="German">German</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={labelStyle}>Duree (annees) *</label>
            <input required type="number" min="1" max="8" style={inputStyle} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Prix par an</label>
            <input type="number" style={inputStyle} placeholder="Ex: 4200" value={form.pricePerYear} onChange={(e) => setForm({ ...form, pricePerYear: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Devise</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR</option>
              <option value="TRY">TRY</option>
              <option value="GBP">GBP</option>
              <option value="MAD">MAD</option>
            </select>
          </div>
        </div>

        {/* Description - only show if new program or editing */}
        <div style={{ marginBottom: "12px" }}>
          <label style={labelStyle}>Description du programme {isExisting && <span style={{ color: "#888", fontWeight: "400" }}>(pre-remplie)</span>}</label>
          <textarea
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical", backgroundColor: isExisting && form.description ? "#F5F5F5" : "white" }}
            placeholder="Decrivez le programme en detail..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Image - only show if new program or no image yet */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Image du programme {isExisting && form.image && <span style={{ color: "#888", fontWeight: "400" }}>(pre-remplie)</span>}</label>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {form.image ? (
              <img src={form.image} alt="Preview" style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "2px solid #DDBA52" }} />
            ) : (
              <div style={{ width: "120px", height: "80px", borderRadius: "8px", backgroundColor: "#F5F5F5", border: "2px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#ccc" }}>Aucune image</div>
            )}
            <label style={{
              fontSize: "12px", color: "#DDBA52", fontWeight: "600", cursor: "pointer",
              padding: "6px 14px", borderRadius: "6px", border: "1px dashed #DDBA52",
            }}>
              {uploading ? "Upload..." : form.image ? "Changer" : "Uploader une image"}
              <input type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button type="submit" disabled={loading || uploading} style={{
            padding: "10px 20px", borderRadius: "8px", border: "none",
            backgroundColor: "#001459", color: "white", fontSize: "13px",
            fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1,
          }}>{loading ? "..." : "Ajouter"}</button>
          <button type="button" onClick={() => setOpen(false)} style={{
            padding: "10px 16px", borderRadius: "8px", border: "1px solid #ddd",
            backgroundColor: "white", color: "#666", fontSize: "13px", cursor: "pointer",
          }}>Annuler</button>
        </div>
      </form>
    </div>
  );
}
