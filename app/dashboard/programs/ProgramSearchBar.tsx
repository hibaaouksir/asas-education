"use client";

import { useState } from "react";

type ProgramGroup = {
  key: string;
  name: string;
  department: string;
  degrees: string[];
  universities: {
    name: string;
    countryName: string;
    countryCode: string;
    language: string;
    pricePerYear: number | null;
  }[];
};

export default function ProgramSearchBar({
  programs,
  children,
}: {
  programs: ProgramGroup[];
  children: React.ReactNode;
}) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  // Extract unique values
  const countries = [...new Set(programs.flatMap((p) => p.universities.map((u) => u.countryName)))].sort();
  const languages = [...new Set(programs.flatMap((p) => p.universities.map((u) => u.language)))].sort();

  const hasFilters = search || countryFilter || degreeFilter || languageFilter || priceFilter;

  // We pass filter state down via data attributes on a wrapper div
  // The actual filtering happens by hiding/showing elements via CSS
  // But since this is React, we'll use a different approach:
  // We'll filter the program keys and pass them to a context

  const visibleKeys = programs
    .filter((pg) => {
      if (search) {
        const s = search.toLowerCase();
        if (
          !pg.name.toLowerCase().includes(s) &&
          !pg.department.toLowerCase().includes(s) &&
          !pg.universities.some((u) => u.name.toLowerCase().includes(s))
        )
          return false;
      }
      if (countryFilter && !pg.universities.some((u) => u.countryName === countryFilter)) return false;
      if (degreeFilter && !pg.degrees.includes(degreeFilter)) return false;
      if (languageFilter && !pg.universities.some((u) => u.language === languageFilter)) return false;
      if (priceFilter) {
        const prices = pg.universities.map((u) => u.pricePerYear).filter((p): p is number => p !== null);
        if (prices.length === 0) return priceFilter === "na";
        const minPrice = Math.min(...prices);
        if (priceFilter === "0-3000" && minPrice > 3000) return false;
        if (priceFilter === "3000-6000" && (minPrice < 3000 || minPrice > 6000)) return false;
        if (priceFilter === "6000-10000" && (minPrice < 6000 || minPrice > 10000)) return false;
        if (priceFilter === "10000+" && minPrice < 10000) return false;
        if (priceFilter === "na" && prices.length > 0) return false;
      }
      return true;
    })
    .map((pg) => pg.key);

  const selectStyle: React.CSSProperties = {
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
    backgroundColor: "white",
    minWidth: "140px",
  };

  return (
    <div>
      {/* Search Bar */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            style={{ ...selectStyle, flex: 1, minWidth: "250px" }}
            placeholder="Rechercher par nom, departement ou universite..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select style={selectStyle} value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
            <option value="">Tous les pays</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select style={selectStyle} value={degreeFilter} onChange={(e) => setDegreeFilter(e.target.value)}>
            <option value="">Tous les niveaux</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
          </select>
          <select style={selectStyle} value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
            <option value="">Toutes les langues</option>
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <select style={selectStyle} value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="">Tous les prix</option>
            <option value="0-3000">Moins de 3 000/an</option>
            <option value="3000-6000">3 000 - 6 000/an</option>
            <option value="6000-10000">6 000 - 10 000/an</option>
            <option value="10000+">Plus de 10 000/an</option>
            <option value="na">Prix sur demande</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setCountryFilter("");
                setDegreeFilter("");
                setLanguageFilter("");
                setPriceFilter("");
              }}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#FFF3E0",
                color: "#E65100",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Reinitialiser
            </button>
          )}
        </div>
        <div style={{ marginTop: "12px", fontSize: "13px", color: "#888" }}>
          {visibleKeys.length} programme{visibleKeys.length !== 1 ? "s" : ""} trouve{visibleKeys.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Filtered content - we use CSS to hide non-matching groups */}
      {hasFilters ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Re-render children but only show matching keys */}
          <style>{`
            ${programs
              .filter((pg) => !visibleKeys.includes(pg.key))
              .map((pg) => `[data-program-key="${pg.key}"] { display: none !important; }`)
              .join("\n")}
          `}</style>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
