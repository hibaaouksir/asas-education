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

type GroupedProgram = {
  name: string;
  department: string;
  degrees: string[];
  languages: string[];
  universityCount: number;
  countryCount: number;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string;
  programs: Program[];
};

export default function ProgramCatalogue({ programs, countries }: { programs: Program[]; countries: Country[] }) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const paysParam = searchParams.get("pays") || "";
  const [countryFilter, setCountryFilter] = useState(countries.find(c => c.name.toLowerCase() === paysParam.toLowerCase())?.name || paysParam);
  const [degreeFilter, setDegreeFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<GroupedProgram | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", city: "", level: "", sessionType: "online" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const languages = [...new Set(programs.map(p => p.language))].sort();

  // Filter programs first
  const filtered = programs.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.department.toLowerCase().includes(search.toLowerCase())) return false;
    if (countryFilter && p.countryName.toLowerCase() !== countryFilter.toLowerCase()) return false;
    if (degreeFilter && p.degree !== degreeFilter) return false;
    if (languageFilter && p.language !== languageFilter) return false;
    return true;
  });

  // Group by program name
  const grouped: GroupedProgram[] = [];
  const groupMap = new Map<string, Program[]>();
  filtered.forEach(p => {
    const key = p.name.toLowerCase();
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(p);
  });

  groupMap.forEach((progs, _key) => {
    const first = progs[0];
    const prices = progs.map(p => p.pricePerYear).filter(Boolean) as number[];
    const uniqueUnis = new Set(progs.map(p => p.universityName));
    const uniqueCountries = new Set(progs.map(p => p.countryName));
    grouped.push({
      name: first.name,
      department: first.department,
      degrees: [...new Set(progs.map(p => p.degree))],
      languages: [...new Set(progs.map(p => p.language))],
      universityCount: uniqueUnis.size,
      countryCount: uniqueCountries.size,
      minPrice: prices.length > 0 ? Math.min(...prices) : null,
      maxPrice: prices.length > 0 ? Math.max(...prices) : null,
      currency: first.currency,
      programs: progs,
    });
  });

  grouped.sort((a, b) => a.name.localeCompare(b.name));

  const hasFilters = search || countryFilter || degreeFilter || languageFilter;

  const clearFilters = () => {
    setSearch(""); setCountryFilter(""); setDegreeFilter(""); setLanguageFilter("");
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

  const priceDisplay = (g: GroupedProgram) => {
    if (!g.minPrice) return "Prix sur demande";
    if (g.minPrice === g.maxPrice) return `${g.minPrice} ${g.currency}/an`;
    return `${g.minPrice} - ${g.maxPrice} ${g.currency}/an`;
  };

  return (
    <div>
      {/* Filters */}
      <section style={{ padding: "24px 40px", backgroundColor: "white", borderBottom: "1px solid #f0f0f0", position: "sticky", top: "70px", zIndex: 100 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: "280px", position: "relative" }}>
              <input style={{ width: "100%", padding: "12px 16px 12px 42px", border: "1px solid #E0E0E0", borderRadius: "10px", fontSize: "14px", outline: "none", backgroundColor: "#FAFAFA" }} placeholder="Rechercher un programme ou departement..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#888" }}>&#128269;</span>
            </div>
            <select style={{ padding: "12px 14px", border: "1px solid #E0E0E0", borderRadius: "10px", fontSize: "13px", cursor: "pointer", backgroundColor: countryFilter ? "#001459" : "white", color: countryFilter ? "white" : "#333" }} value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
              <option value="">Tous les pays</option>
              {countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
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
          <p style={{ margin: "10px 0 0", fontSize: "13px", color: "#888" }}>{grouped.length} programme{grouped.length !== 1 ? "s" : ""} unique{grouped.length !== 1 ? "s" : ""} dans {filtered.length} offre{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      </section>

      {/* Grouped Program Cards */}
      <section style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        {grouped.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>&#128270;</div>
            <p style={{ color: "#888", fontSize: "16px", marginBottom: "8px" }}>Aucun programme trouve.</p>
            <p style={{ color: "#aaa", fontSize: "14px" }}>Essayez d&apos;autres filtres ou termes de recherche.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
            {grouped.map((g) => (
              <div key={g.name} onClick={() => setSelectedGroup(g)} style={{
                backgroundColor: "white", borderRadius: "16px", overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
              >
                {/* Header with gradient */}
                <div style={{
                  background: "linear-gradient(135deg, #001459, #000B2E)",
                  padding: "28px 24px", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "rgba(221,186,82,0.08)" }} />
                  <div style={{ position: "absolute", bottom: "-30px", left: "-10px", width: "70px", height: "70px", borderRadius: "50%", backgroundColor: "rgba(221,186,82,0.05)" }} />
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>{g.department}</p>
                  <h3 style={{ color: "white", fontSize: "20px", fontWeight: "700", margin: "0 0 12px" }}>{g.name}</h3>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {g.degrees.map(d => (
                      <span key={d} style={{
                        padding: "3px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "700",
                        backgroundColor: d === "Bachelor" ? "rgba(46,125,50,0.2)" : d === "Master" ? "rgba(21,101,192,0.2)" : "rgba(230,81,0,0.2)",
                        color: d === "Bachelor" ? "#81C784" : d === "Master" ? "#64B5F6" : "#FFB74D",
                      }}>{d}</span>
                    ))}
                  </div>
                </div>

                {/* Info section */}
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "14px" }}>&#127979;</span>
                      <span style={{ fontSize: "13px", color: "#666" }}>{g.universityCount} universite{g.universityCount !== 1 ? "s" : ""}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "14px" }}>&#127758;</span>
                      <span style={{ fontSize: "13px", color: "#666" }}>{g.countryCount} pays</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {g.languages.map(l => (
                      <span key={l} style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "600", backgroundColor: "#F5F5F5", color: "#666" }}>&#127760; {l}</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ color: "#DDBA52", fontSize: "15px", fontWeight: "700", margin: 0 }}>{priceDisplay(g)}</p>
                    <span style={{ color: "#001459", fontSize: "12px", fontWeight: "600", padding: "6px 14px", borderRadius: "8px", backgroundColor: "#F0F4FF" }}>Voir les offres &#8594;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* University List Modal - when clicking a grouped program */}
      {selectedGroup && !selectedProgram && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 2000,
          backdropFilter: "blur(4px)",
        }} onClick={() => setSelectedGroup(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: "white", borderRadius: "20px", padding: "0",
            width: "100%", maxWidth: "700px", maxHeight: "85vh", overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}>
            {/* Modal Header */}
            <div style={{
              background: "linear-gradient(135deg, #001459, #000B2E)",
              padding: "28px 32px", position: "relative",
            }}>
              <button onClick={() => setSelectedGroup(null)} style={{
                position: "absolute", top: "16px", right: "16px",
                background: "rgba(255,255,255,0.15)", border: "none", color: "white",
                width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer",
                fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>&#10005;</button>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>{selectedGroup.department}</p>
              <h2 style={{ color: "white", fontSize: "24px", fontWeight: "800", margin: "0 0 8px" }}>{selectedGroup.name}</h2>
              <div style={{ display: "flex", gap: "6px" }}>
                {selectedGroup.degrees.map(d => (
                  <span key={d} style={{
                    padding: "3px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "700",
                    backgroundColor: d === "Bachelor" ? "rgba(46,125,50,0.2)" : d === "Master" ? "rgba(21,101,192,0.2)" : "rgba(230,81,0,0.2)",
                    color: d === "Bachelor" ? "#81C784" : d === "Master" ? "#64B5F6" : "#FFB74D",
                  }}>{d}</span>
                ))}
              </div>
            </div>

            {/* University List */}
            <div style={{ padding: "24px 32px", overflowY: "auto", flex: 1 }}>
              <p style={{ color: "#888", fontSize: "13px", marginBottom: "16px" }}>
                {selectedGroup.universityCount} universite{selectedGroup.universityCount !== 1 ? "s" : ""} proposent ce programme
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {selectedGroup.programs.map((p) => (
                  <div key={p.id} style={{
                    padding: "16px 20px", borderRadius: "12px",
                    border: "1px solid #F0F0F0", backgroundColor: "#FAFAFA",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#DDBA52"; (e.currentTarget as HTMLDivElement).style.backgroundColor = "white"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#F0F0F0"; (e.currentTarget as HTMLDivElement).style.backgroundColor = "#FAFAFA"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                      {p.universityPhoto ? (
                        <img src={p.universityPhoto} alt={p.universityName} style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover", border: "1px solid #eee" }} />
                      ) : (
                        <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "linear-gradient(135deg, #001459, #000B2E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: "#DDBA52", fontSize: "16px", fontWeight: "700" }}>{p.universityName.charAt(0)}</span>
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: "#001459", fontSize: "15px", fontWeight: "700", margin: "0 0 2px" }}>{p.universityName}</h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <img src={`https://flagcdn.com/16x12/${p.countryCode.toLowerCase()}.png`} alt="" style={{ borderRadius: "1px" }} />
                          <span style={{ fontSize: "12px", color: "#888" }}>{p.cityName}, {p.countryName}</span>
                        </div>
                      </div>
                      <span style={{
                        padding: "3px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "700",
                        backgroundColor: p.degree === "Bachelor" ? "#E8F5E9" : p.degree === "Master" ? "#E3F2FD" : "#FFF3E0",
                        color: p.degree === "Bachelor" ? "#2E7D32" : p.degree === "Master" ? "#1565C0" : "#E65100",
                      }}>{p.degree}</span>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", backgroundColor: "#F0F0F0", color: "#666" }}>&#127760; {p.language}</span>
                      <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", backgroundColor: "#F0F0F0", color: "#666" }}>&#9201; {p.duration} ans</span>
                      <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", backgroundColor: "#F0F0F0", color: "#666" }}>
                        {p.pricePerYear ? `${p.pricePerYear} ${p.currency}/an` : "Prix sur demande"}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <Link href={`/universites/${p.universityId}`} style={{
                        padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
                        color: "#001459", backgroundColor: "#F0F4FF", textDecoration: "none",
                        border: "1px solid #E0E8FF",
                      }}>Voir l&apos;universite</Link>
                      <button onClick={() => { setSelectedProgram(p); setSubmitted(false); }} style={{
                        padding: "8px 16px", borderRadius: "8px", border: "none",
                        background: "linear-gradient(135deg, #DDBA52, #C4A243)",
                        color: "#001459", fontSize: "12px", fontWeight: "700", cursor: "pointer",
                      }}>Postuler</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {selectedProgram && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 2100,
          backdropFilter: "blur(4px)",
        }} onClick={() => setSelectedProgram(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: "white", borderRadius: "20px", padding: "36px",
            width: "100%", maxWidth: "500px", maxHeight: "90vh", overflow: "auto",
          }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "24px" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>&#9989;</div>
                <h3 style={{ color: "#001459", fontSize: "22px", marginBottom: "8px", fontWeight: "800" }}>Merci !</h3>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px", lineHeight: "1.6" }}>Votre demande a ete envoyee. Un consultant vous contactera dans les plus brefs delais.</p>
                <button onClick={() => { setSelectedProgram(null); setSelectedGroup(null); }} style={{
                  padding: "12px 28px", borderRadius: "10px", border: "none",
                  background: "linear-gradient(135deg, #DDBA52, #C4A243)",
                  color: "#001459", fontSize: "14px", fontWeight: "700", cursor: "pointer",
                }}>Fermer</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ color: "#001459", fontSize: "20px", fontWeight: "800", margin: "0 0 6px" }}>Postuler maintenant</h3>
                  <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{selectedProgram.universityName} &mdash; {selectedProgram.name} ({selectedProgram.degree})</p>
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
                      {[{ val: "online", label: "&#128187; En ligne" }, { val: "office", label: "&#127970; Au bureau" }].map((t) => (
                        <button key={t.val} type="button" onClick={() => setFormData({ ...formData, sessionType: t.val })} style={{
                          flex: 1, padding: "12px", borderRadius: "10px",
                          border: formData.sessionType === t.val ? "2px solid #DDBA52" : "1px solid #E0E0E0",
                          backgroundColor: formData.sessionType === t.val ? "rgba(221,186,82,0.08)" : "white",
                          color: formData.sessionType === t.val ? "#001459" : "#888",
                          fontSize: "13px", fontWeight: formData.sessionType === t.val ? "700" : "400", cursor: "pointer",
                        }} dangerouslySetInnerHTML={{ __html: t.label }} />
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
