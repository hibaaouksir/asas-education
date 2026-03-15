"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CityInfo = { id: string; name: string; universityCount: number };
type CountryInfo = { id: string; name: string; code: string; flag: string; cities: CityInfo[] };

export default function CountryCard({ country }: { country: CountryInfo }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [editingCountry, setEditingCountry] = useState(false);
  const [addingCity, setAddingCity] = useState(false);
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [countryForm, setCountryForm] = useState({ name: country.name, code: country.code });
  const [cityName, setCityName] = useState("");

  const flagUrl = `https://flagcdn.com/40x30/${country.code.toLowerCase()}.png`;

  const handleUpdateCountry = async () => {
    setLoadingCountry(true);
    try {
      await fetch(`/api/countries/${country.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...countryForm, flag: countryForm.code }),
      });
      setEditingCountry(false);
      router.refresh();
    } catch (err) { console.error(err); }
    setLoadingCountry(false);
  };

  const handleDeleteCountry = async () => {
    if (!confirm(`Supprimer ${country.name} et toutes ses villes/universites ?`)) return;
    try {
      await fetch(`/api/countries/${country.id}`, { method: "DELETE" });
      router.refresh();
    } catch (err) { console.error(err); }
  };

  const handleAddCity = async () => {
    if (!cityName.trim()) return;
    setLoadingCity(true);
    try {
      await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cityName, countryId: country.id }),
      });
      setCityName("");
      setAddingCity(false);
      router.refresh();
    } catch (err) { console.error(err); }
    setLoadingCity(false);
  };

  const handleDeleteCity = async (cityId: string, cityNameStr: string) => {
    if (!confirm(`Supprimer ${cityNameStr} ?`)) return;
    try {
      await fetch(`/api/cities/${cityId}`, { method: "DELETE" });
      router.refresh();
    } catch (err) { console.error(err); }
  };

  const inputStyle = {
    padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px",
    fontSize: "13px", outline: "none", boxSizing: "border-box" as const,
  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
      <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {editingCountry ? (
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flex: 1 }}>
            <input style={{ ...inputStyle, flex: 1 }} value={countryForm.name} onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })} placeholder="Nom du pays" />
            <input style={{ ...inputStyle, width: "70px" }} value={countryForm.code} onChange={(e) => setCountryForm({ ...countryForm, code: e.target.value.toUpperCase() })} placeholder="Code" maxLength={2} />
            {countryForm.code.length === 2 && (
              <img src={`https://flagcdn.com/40x30/${countryForm.code.toLowerCase()}.png`} alt="" style={{ width: "30px", height: "22px", borderRadius: "3px" }} />
            )}
            <button onClick={handleUpdateCountry} disabled={loadingCountry} style={{
              padding: "8px 16px", borderRadius: "6px", border: "none",
              backgroundColor: "#001459", color: "white", fontSize: "12px", fontWeight: "600", cursor: "pointer",
            }}>{loadingCountry ? "..." : "Sauvegarder"}</button>
            <button onClick={() => setEditingCountry(false)} style={{
              padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd",
              backgroundColor: "white", color: "#666", fontSize: "12px", cursor: "pointer",
            }}>Annuler</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button onClick={() => setExpanded(!expanded)} style={{
                background: "none", border: "none", cursor: "pointer", fontSize: "16px",
                color: "#001459", padding: "4px", display: "flex", alignItems: "center",
                transition: "transform 0.2s",
                transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              }}>&#9654;</button>
              <img src={flagUrl} alt={country.name} style={{ width: "32px", height: "24px", borderRadius: "3px", border: "1px solid #eee" }} />
              <div>
                <span style={{ color: "#001459", fontSize: "16px", fontWeight: "700" }}>{country.name}</span>
                <span style={{ color: "#888", fontSize: "13px", marginLeft: "8px" }}>({country.code})</span>
              </div>
              <span style={{ color: "#888", fontSize: "12px", backgroundColor: "#f5f5f5", padding: "3px 10px", borderRadius: "12px" }}>
                {country.cities.length} ville{country.cities.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => setEditingCountry(true)} style={{
                padding: "6px 14px", borderRadius: "6px", border: "1px solid #DDBA52",
                backgroundColor: "transparent", color: "#DDBA52", fontSize: "12px", fontWeight: "600", cursor: "pointer",
              }}>Modifier</button>
              <button onClick={handleDeleteCountry} style={{
                padding: "6px 14px", borderRadius: "6px", border: "1px solid #DD061A",
                backgroundColor: "transparent", color: "#DD061A", fontSize: "12px", fontWeight: "600", cursor: "pointer",
              }}>Supprimer</button>
            </div>
          </>
        )}
      </div>

      {expanded && (
        <div style={{ padding: "0 24px 16px", borderTop: "1px solid #f0f0f0" }}>
          <div style={{ paddingTop: "12px" }}>
            {country.cities.length === 0 ? (
              <p style={{ color: "#aaa", fontSize: "13px", fontStyle: "italic", margin: "0 0 12px 0" }}>Aucune ville ajoutee</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                {country.cities.map((city) => (
                  <div key={city.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 14px", backgroundColor: "#FAFAFA", borderRadius: "8px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#888", fontSize: "13px" }}>└</span>
                      <span style={{ color: "#001459", fontSize: "14px", fontWeight: "600" }}>{city.name}</span>
                      <span style={{ color: "#888", fontSize: "12px" }}>({city.universityCount} universite{city.universityCount !== 1 ? "s" : ""})</span>
                    </div>
                    <button onClick={() => handleDeleteCity(city.id, city.name)} style={{
                      padding: "4px 10px", borderRadius: "4px", border: "1px solid #DD061A",
                      backgroundColor: "transparent", color: "#DD061A", fontSize: "11px", fontWeight: "600", cursor: "pointer",
                    }}>Supprimer</button>
                  </div>
                ))}
              </div>
            )}

            {addingCity ? (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Nom de la ville (ex: Rome)" value={cityName} onChange={(e) => setCityName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddCity()} autoFocus />
                <button onClick={handleAddCity} disabled={loadingCity} style={{
                  padding: "8px 16px", borderRadius: "6px", border: "none",
                  backgroundColor: "#001459", color: "white", fontSize: "12px", fontWeight: "600", cursor: "pointer",
                }}>{loadingCity ? "..." : "Ajouter"}</button>
                <button onClick={() => { setAddingCity(false); setCityName(""); }} style={{
                  padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd",
                  backgroundColor: "white", color: "#666", fontSize: "12px", cursor: "pointer",
                }}>Annuler</button>
              </div>
            ) : (
              <button onClick={() => setAddingCity(true)} style={{
                padding: "8px 16px", borderRadius: "6px", border: "1px dashed #DDBA52",
                backgroundColor: "transparent", color: "#DDBA52", fontSize: "12px", fontWeight: "600", cursor: "pointer",
              }}>+ Ajouter une ville</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
