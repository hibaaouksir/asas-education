"use client";

import { useState } from "react";

type Program = {
  id: string; name: string; department: string; degree: string;
  language: string; duration: number; pricePerYear: number | null;
  currency: string; universityName: string; universityPhoto: string | null;
  cityName: string; countryName: string; countryCode: string;
};
type Country = { name: string; code: string };

export default function ProgramCatalogue({ programs, countries }: { programs: Program[]; countries: Country[] }) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", city: "", level: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtered = programs.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.universityName.toLowerCase().includes(search.toLowerCase()) && !p.department.toLowerCase().includes(search.toLowerCase())) return false;
    if (countryFilter && p.countryName !== countryFilter) return false;
    if (degreeFilter && p.degree !== degreeFilter) return false;
    if (languageFilter && p.language !== languageFilter) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          educationLevel: formData.level,
          source: "CATALOGUE",
          universityName: selectedProgram?.universityName,
          departmentName: selectedProgram?.department,
          language: selectedProgram?.language,
          level: selectedProgram?.degree,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const selectStyle = {
    padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px",
    fontSize: "14px", outline: "none", cursor: "pointer", backgroundColor: "white",
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "1px solid #ddd",
    borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" as const, outline: "none",
  };

  return (
    <div>
      <section style={{ padding: "30px 40px", backgroundColor: "#f5f5f5" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input style={{ ...selectStyle, flex: 1, minWidth: "250px" }} placeholder="Rechercher un programme ou une universite..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select style={selectStyle} value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
            <option value="">Tous les pays</option>
            {countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
          </select>
          <select style={selectStyle} value={degreeFilter} onChange={(e) => setDegreeFilter(e.target.value)}>
            <option value="">Tous les niveaux</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
          </select>
          <select style={selectStyle} value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
            <option value="">Toutes les langues</option>
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Turkish">Turkish</option>
          </select>
        </div>
        <p style={{ maxWidth: "1200px", margin: "12px auto 0", fontSize: "13px", color: "#888" }}>{filtered.length} programme{filtered.length !== 1 ? "s" : ""} trouve{filtered.length !== 1 ? "s" : ""}</p>
      </section>

      <section style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", fontSize: "16px", padding: "60px 0" }}>Aucun programme trouve. Essayez d autres filtres.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            {filtered.map((p) => (
              <div key={p.id} style={{
                backgroundColor: "white", borderRadius: "12px", overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)", transition: "transform 0.2s",
              }}>
                {p.universityPhoto ? (
                  <img src={p.universityPhoto} alt={p.universityName} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "160px", backgroundColor: "#001459", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#DDBA52", fontSize: "24px", fontWeight: "700" }}>{p.universityName}</span>
                  </div>
                )}
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <img src={`https://flagcdn.com/20x15/${p.countryCode.toLowerCase()}.png`} alt="" style={{ borderRadius: "2px" }} />
                    <span style={{ fontSize: "12px", color: "#888" }}>{p.cityName}, {p.countryName}</span>
                  </div>
                  <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: "0 0 4px" }}>{p.universityName}</h3>
                  <p style={{ color: "#666", fontSize: "14px", margin: "0 0 12px" }}>{p.name} - {p.department}</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", backgroundColor: "#E3F2FD", color: "#1565C0" }}>{p.degree}</span>
                    <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", backgroundColor: "#FFF3E0", color: "#E65100" }}>{p.language}</span>
                    <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", backgroundColor: "#F3E5F5", color: "#7B1FA2" }}>{p.duration} ans</span>
                  </div>
                  {p.pricePerYear && (
                    <p style={{ color: "#DDBA52", fontSize: "18px", fontWeight: "700", margin: "0 0 16px" }}>{p.pricePerYear} {p.currency}/an</p>
                  )}
                  <button onClick={() => { setSelectedProgram(p); setSubmitted(false); }} style={{
                    width: "100%", padding: "12px", borderRadius: "8px", border: "none",
                    backgroundColor: "#001459", color: "white", fontSize: "14px",
                    fontWeight: "600", cursor: "pointer",
                  }}>Prendre un rendez-vous</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedProgram && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 2000,
        }} onClick={() => setSelectedProgram(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: "white", borderRadius: "16px", padding: "32px",
            width: "100%", maxWidth: "500px", maxHeight: "90vh", overflow: "auto",
          }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ color: "#001459", fontSize: "20px", marginBottom: "8px" }}>Merci !</h3>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>Votre demande a ete envoyee. Nous vous contacterons bientot.</p>
                <button onClick={() => setSelectedProgram(null)} style={{
                  padding: "10px 24px", borderRadius: "8px", border: "none",
                  backgroundColor: "#DDBA52", color: "#001459", fontSize: "14px", fontWeight: "600", cursor: "pointer",
                }}>Fermer</button>
              </div>
            ) : (
              <>
                <h3 style={{ color: "#001459", fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>Prendre un rendez-vous</h3>
                <p style={{ color: "#888", fontSize: "13px", marginBottom: "20px" }}>{selectedProgram.universityName} - {selectedProgram.name}</p>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Prenom *</label>
                      <input required style={inputStyle} value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Nom *</label>
                      <input required style={inputStyle} value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Email *</label>
                    <input required type="email" style={inputStyle} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Telephone *</label>
                    <input required style={inputStyle} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Ville *</label>
                      <input required style={inputStyle} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Niveau *</label>
                      <select required style={{ ...inputStyle, cursor: "pointer" }} value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                        <option value="">Selectionnez</option>
                        <option value="bac">Baccalaureat</option>
                        <option value="licence">Licence</option>
                        <option value="master">Master</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} style={{
                    width: "100%", padding: "14px", borderRadius: "8px", border: "none",
                    backgroundColor: "#DDBA52", color: "#001459", fontSize: "16px",
                    fontWeight: "700", cursor: "pointer", opacity: loading ? 0.7 : 1,
                  }}>{loading ? "Envoi..." : "Envoyer ma demande"}</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
