"use client";

import { useState } from "react";

type Program = {
  id: string; name: string; department: string; degree: string;
  language: string; duration: number; pricePerYear: number | null;
  currency: string; universityName: string; universityPhoto: string | null;
  cityName: string; countryName: string; countryCode: string;
};
type Country = { id: string; name: string; code: string };
type City = { id: string; name: string; countryId: string };

export default function SearchProgramsClient({ programs, countries, cities }: { programs: Program[]; countries: Country[]; cities: City[] }) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

  const filteredCities = countryFilter ? cities.filter(c => c.countryId === countryFilter) : cities;

  const filtered = programs.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.department.toLowerCase().includes(search.toLowerCase()) && !p.universityName.toLowerCase().includes(search.toLowerCase())) return false;
    if (countryFilter) { const country = countries.find(c => c.id === countryFilter); if (country && p.countryName !== country.name) return false; }
    if (cityFilter) { const city = cities.find(c => c.id === cityFilter); if (city && p.cityName !== city.name) return false; }
    if (degreeFilter && p.degree !== degreeFilter) return false;
    if (languageFilter && p.language !== languageFilter) return false;
    return true;
  });

  const selectStyle = {
    padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px",
    fontSize: "13px", outline: "none", cursor: "pointer", backgroundColor: "white",
    minWidth: "150px",
  };

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Recherche de Programmes</h1>

      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            style={{ ...selectStyle, flex: 1, minWidth: "250px" }}
            placeholder="Rechercher par nom, departement ou universite..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select style={selectStyle} value={countryFilter} onChange={(e) => { setCountryFilter(e.target.value); setCityFilter(""); }}>
            <option value="">Tous les pays</option>
            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select style={selectStyle} value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            <option value="">Toutes les villes</option>
            {filteredCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
            <option value="German">German</option>
          </select>
        </div>
        <div style={{ marginTop: "12px", fontSize: "13px", color: "#888" }}>
          {filtered.length} programme{filtered.length !== 1 ? "s" : ""} trouve{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#DDBA52" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#001459", fontWeight: "700", textTransform: "uppercase" }}>Universite</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#001459", fontWeight: "700", textTransform: "uppercase" }}>Programme</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#001459", fontWeight: "700", textTransform: "uppercase" }}>Pays</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#001459", fontWeight: "700", textTransform: "uppercase" }}>Ville</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#001459", fontWeight: "700", textTransform: "uppercase" }}>Niveau</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#001459", fontWeight: "700", textTransform: "uppercase" }}>Langue</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#001459", fontWeight: "700", textTransform: "uppercase" }}>Duree</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#001459", fontWeight: "700", textTransform: "uppercase" }}>Prix/an</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun programme trouve.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    {p.universityPhoto && <img src={p.universityPhoto} alt="" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />}
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#001459" }}>{p.universityName}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#001459" }}>{p.name}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{p.department}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <img src={`https://flagcdn.com/20x15/${p.countryCode.toLowerCase()}.png`} alt="" style={{ borderRadius: "2px" }} />
                      <span style={{ fontSize: "13px", color: "#666" }}>{p.countryName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{p.cityName}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", backgroundColor: p.degree === "Bachelor" ? "#E8F5E9" : p.degree === "Master" ? "#E3F2FD" : "#FFF3E0", color: p.degree === "Bachelor" ? "#2E7D32" : p.degree === "Master" ? "#1565C0" : "#E65100" }}>{p.degree}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{p.language}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{p.duration} ans</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#001459" }}>{p.pricePerYear ? `${p.pricePerYear} ${p.currency}` : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}