"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Program = {
  id: string; universityId: string; name: string; department: string; degree: string;
  language: string; duration: number; pricePerYear: number | null;
  currency: string; universityName: string; universityPhoto: string | null;
  cityName: string; countryName: string; countryCode: string;
};
type Country = { name: string; code: string };

export default function ProgramCatalogue({ programs, countries }: { programs: Program[]; countries: Country[] }) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState(searchParams.get("pays") || "");
  const [universityFilter, setUniversityFilter] = useState(searchParams.get("universite") || "");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", city: "", level: "", sessionType: "online" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const universities = [...new Set(programs.map(p => p.universityName))].sort();
  const languages = [...new Set(programs.map(p => p.language))].sort();

  const filtered = programs.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.universityName.toLowerCase().includes(search.toLowerCase()) && !p.department.toLowerCase().includes(search.toLowerCase())) return false;
    if (countryFilter && p.countryName !== countryFilter) return false;
    if (universityFilter && p.universityName !== universityFilter) return false;
    if (degreeFilter && p.degree !== degreeFilter) return false;
    if (languageFilter && p.language !== languageFilter) return false;
    return true;
  });

  const hasFilters = search || countryFilter || universityFilter || degreeFilter || languageFilter;

  const clearFilters = () => {
    setSearch(""); setCountryFilter(""); setUniversityFilter(""); setDegreeFilter(""); setLanguageFilter("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName, lastName: formData.lastName,
          email: formData.email, phone: formData.phone,
          city: formData.city, educationLevel: formData.level,
          sessionType: formData.sessionType, sourceName: "Catalogue",
          universityName: selectedProgram?.universityName,
          departmentName: selectedProgram?.department,
          language: selectedProgram?.language, level: selectedProgram?.degree,
        }),
      });
      setSubmitted(true);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", border: "1px solid #E0E0E0",
    borderRadius: "10px", fontSize: "14px", boxSizing: "border-box" as const, outline: "none",
  };

  return (
    <div>
      {/* Filters */}
      <section style={{ padding: "24px 40px", backgroundColor: "white", borderBottom: "1px solid #f0f0f0", position: "sticky", top: "70px", zIndex: 100 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: "280px", position: "relative" }}>
              <input style={{ width: "100%", padding: "12px 16px 12px 42px", border: "1px solid #E0E0E0", borderRadius: "10px", fontSize: "14px", outline: "none", backgroundColor: "#FAFAFA" }} placeholder="Rechercher un programme, universite, departement..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#888" }}>🔍</span>
            </div>
            <select style={{ padding: "12px 14px", border: "1px solid #E0E0E0", borderRadius: "10px", fontSize: "13px", cursor: "pointer", backgroundColor: countryFilter ? "#001459" : "white", color: countryFilter ? "white" : "#333" }} value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
              <option value="">Tous les pays</option>
              {countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
            </select>
            <select style={{ padding: "12px 14px", border: "1px solid #E0E0E0", borderRadius: "10px", fontSize: "13px", cursor: "pointer", backgroundColor: universityFilter ? "#001459" : "white", color: universityFilter ? "white" : "#333" }} value={universityFilter} onChange={(e) => setUniversityFilter(e.target.value)}>
              <option value="">Toutes les universites</option>
              {universities.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <select style={{ padding: "12px 14px", border: "1px solid #E0E0E0", borderRadius: "10px", fontSize: "13px", cursor: "pointer", backgroundColor: degreeFilter ? "#001459" : "white", color: degreeFilter ? "white" : "#333" }} value={degreeFilter} onChange={(e) => setDegreeFilter(e.target.value)}>
              <option value="">Tous les niveaux</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </select>
            <select style={{ padding: "12px 14px", border: "1px solid #E0E0E0", borderRadius: "10px", fontSize: "13px", cursor: "pointer", backgroundColor: languageFilter ? "#001459" : "white", color: languageFilter ? "white" : "#333" }} value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
              <option value="">Toutes les langues</option>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {hasFilters && (
              <button onClick={clearFilters} style={{ padding: "12px 16px", borderRadius: "10px", border: "none", backgroundColor: "#FFEBEE", color: "#C62828", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Effacer</button>
            )}
          </div>
          <p style={{ margin: "10px 0 0", fontSize: "13px", color: "#888" }}>{filtered.length} programme{filtered.length !== 1 ? "s" : ""} trouve{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      </section>

      {/* Program Cards */}
      <section style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p style={{ color: "#888", fontSize: "16px", marginBottom: "8px" }}>Aucun programme trouve.</p>
            <p style={{ color: "#aaa", fontSize: "14px" }}>Essayez d autres filtres ou termes de recherche.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
            {filtered.map((p) => (
              <div key={p.id} style={{
                backgroundColor: "white", borderRadius: "16px", overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
              >
                <Link href={`/universites/${p.universityId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ position: "relative" }}>
                    {p.universityPhoto ? (
                      <img src={p.universityPhoto} alt={p.universityName} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "180px", background: "linear-gradient(135deg, #001459, #000B2E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#DDBA52", fontSize: "22px", fontWeight: "700" }}>{p.universityName}</span>
                      </div>
                    )}
                    <span style={{
                      position: "absolute", top: "12px", left: "12px",
                      padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                      backgroundColor: p.degree === "Bachelor" ? "#E8F5E9" : p.degree === "Master" ? "#E3F2FD" : "#FFF3E0",
                      color: p.degree === "Bachelor" ? "#2E7D32" : p.degree === "Master" ? "#1565C0" : "#E65100",
                    }}>{p.degree}</span>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <img src={`https://flagcdn.com/20x15/${p.countryCode.toLowerCase()}.png`} alt="" style={{ borderRadius: "2px" }} />
                      <span style={{ fontSize: "12px", color: "#888" }}>{p.cityName}, {p.countryName}</span>
                    </div>
                    <h3 style={{ color: "#001459", fontSize: "17px", fontWeight: "700", margin: "0 0 4px" }}>{p.name}</h3>
                    <p style={{ color: "#888", fontSize: "13px", margin: "0 0 4px" }}>{p.department}</p>
                    <p style={{ color: "#666", fontSize: "13px", margin: "0 0 16px" }}>{p.universityName}</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "600", backgroundColor: "#F5F5F5", color: "#666" }}>🌐 {p.language}</span>
                      <span style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "600", backgroundColor: "#F5F5F5", color: "#666" }}>⏱ {p.duration} ans</span>
                    </div>
                  </div>
                </Link>
                <div style={{ padding: "0 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {p.pricePerYear ? (
                    <p style={{ color: "#DDBA52", fontSize: "20px", fontWeight: "800", margin: 0 }}>{p.pricePerYear} <span style={{ fontSize: "13px", fontWeight: "500", color: "#888" }}>{p.currency}/an</span></p>
                  ) : (
                    <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Prix sur demande</p>
                  )}
                  <button onClick={() => { setSelectedProgram(p); setSubmitted(false); }} style={{
                    padding: "10px 20px", borderRadius: "10px", border: "none",
                    background: "linear-gradient(135deg, #DDBA52, #C4A243)",
                    color: "#001459", fontSize: "13px", fontWeight: "700", cursor: "pointer",
                  }}>Postuler</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Application Modal */}
      {selectedProgram && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 2000,
          backdropFilter: "blur(4px)",
        }} onClick={() => setSelectedProgram(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: "white", borderRadius: "20px", padding: "36px",
            width: "100%", maxWidth: "500px", maxHeight: "90vh", overflow: "auto",
          }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "24px" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ color: "#001459", fontSize: "22px", marginBottom: "8px", fontWeight: "800" }}>Merci !</h3>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px", lineHeight: "1.6" }}>Votre demande a ete envoyee. Un consultant vous contactera dans les plus brefs delais.</p>
                <button onClick={() => setSelectedProgram(null)} style={{
                  padding: "12px 28px", borderRadius: "10px", border: "none",
                  background: "linear-gradient(135deg, #DDBA52, #C4A243)",
                  color: "#001459", fontSize: "14px", fontWeight: "700", cursor: "pointer",
                }}>Fermer</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ color: "#001459", fontSize: "20px", fontWeight: "800", margin: "0 0 6px" }}>Postuler maintenant</h3>
                  <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{selectedProgram.universityName} — {selectedProgram.name} ({selectedProgram.degree})</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Prenom *</label>
                      <input required style={inputStyle} placeholder="Votre prenom" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Nom *</label>
                      <input required style={inputStyle} placeholder="Votre nom" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Email *</label>
                    <input required type="email" style={inputStyle} placeholder="votre@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Telephone *</label>
                    <input required style={inputStyle} placeholder="+212 6XX XXX XXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Ville *</label>
                      <input required style={inputStyle} placeholder="Votre ville" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
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
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "#666", fontWeight: "600" }}>Type de consultation *</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {[{ val: "online", label: "💻 En ligne" }, { val: "office", label: "🏢 Au bureau" }].map((t) => (
                        <button key={t.val} type="button" onClick={() => setFormData({ ...formData, sessionType: t.val })} style={{
                          flex: 1, padding: "12px", borderRadius: "10px",
                          border: formData.sessionType === t.val ? "2px solid #DDBA52" : "1px solid #E0E0E0",
                          backgroundColor: formData.sessionType === t.val ? "rgba(221,186,82,0.08)" : "white",
                          color: formData.sessionType === t.val ? "#001459" : "#888",
                          fontSize: "13px", fontWeight: formData.sessionType === t.val ? "700" : "400", cursor: "pointer",
                        }}>{t.label}</button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={loading} style={{
                    width: "100%", padding: "15px",
                    background: "linear-gradient(135deg, #DDBA52, #C4A243)",
                    color: "#001459", border: "none", borderRadius: "10px",
                    fontSize: "15px", fontWeight: "700", cursor: "pointer", opacity: loading ? 0.7 : 1,
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
