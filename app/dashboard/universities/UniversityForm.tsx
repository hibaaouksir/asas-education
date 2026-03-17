"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type CityOption = { id: string; name: string; countryName: string };

export default function UniversityForm({ cities }: { cities: CityOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: "", cityId: "", website: "", description: "" });

  // City search state
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  const filteredCities = cities.filter(c =>
    c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.countryName.toLowerCase().includes(citySearch.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCitySelect = (city: CityOption) => {
    setForm({ ...form, cityId: city.id });
    setCitySearch(`${city.name} (${city.countryName})`);
    setShowCityDropdown(false);
  };

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
    if (!form.cityId) { window.alert("Selectionnez une ville"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photo: imageUrl }),
      });
      if (res.ok) {
        setForm({ name: "", cityId: "", website: "", description: "" });
        setImageUrl("");
        setCitySearch("");
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
      }}>+ Ajouter une universite</button>
    );
  }

  if (cities.length === 0) {
    return (
      <div style={{ backgroundColor: "#FFF3CD", padding: "16px", borderRadius: "8px", color: "#856404", fontSize: "14px" }}>
        Ajoutez d&apos;abord des pays et des villes.
        <a href="/dashboard/countries" style={{ color: "#001459", fontWeight: "600", marginLeft: "8px" }}>Aller aux pays</a>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "16px" }}>
      <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Nouvelle universite</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input required style={inputStyle} placeholder="Ex: Medipol University" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div ref={cityRef} style={{ position: "relative" }}>
            <label style={labelStyle}>Ville *</label>
            <input
              style={inputStyle}
              placeholder="Rechercher une ville..."
              value={citySearch}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setForm({ ...form, cityId: "" });
                setShowCityDropdown(true);
              }}
              onFocus={() => setShowCityDropdown(true)}
            />
            {showCityDropdown && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px",
                backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                zIndex: 100, maxHeight: "200px", overflowY: "auto", border: "1px solid #ddd",
              }}>
                {filteredCities.length === 0 ? (
                  <div style={{ padding: "12px 14px", color: "#888", fontSize: "13px" }}>Aucune ville trouvee</div>
                ) : (
                  filteredCities.map((city) => (
                    <button key={city.id} type="button" onClick={() => handleCitySelect(city)} style={{
                      display: "block", width: "100%", padding: "10px 14px", border: "none",
                      backgroundColor: form.cityId === city.id ? "#F0F0F0" : "white",
                      color: "#001459", fontSize: "13px", cursor: "pointer", textAlign: "left",
                    }}>
                      {city.name} <span style={{ color: "#888" }}>({city.countryName})</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label style={labelStyle}>Site web</label>
          <input style={inputStyle} placeholder="https://www.example.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} placeholder="Description de l universite..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Photo de l universite</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: "14px" }} />
          {uploading && <p style={{ color: "#DDBA52", fontSize: "13px", marginTop: "6px" }}>Upload en cours...</p>}
          {imageUrl && (
            <div style={{ marginTop: "8px" }}>
              <img src={imageUrl} alt="Preview" style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }} />
            </div>
          )}
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
