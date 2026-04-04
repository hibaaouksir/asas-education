"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type University = {
  id: string;
  name: string;
  photo: string | null;
  description: string | null;
  cityName: string;
  countryName: string;
  countryCode: string;
  programCount: number;
  programs: {
    name: string;
    degree: string;
    language: string;
    pricePerYear: number | null;
    currency: string;
  }[];
};

export default function DashboardUniversitySearch({
  universities,
  canEdit,
}: {
  universities: University[];
  canEdit: boolean;
}) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const countries = useMemo(() => {
    const set = new Set(universities.map((u) => u.countryName));
    return Array.from(set).sort();
  }, [universities]);

  const languages = useMemo(() => {
    const set = new Set(
      universities.flatMap((u) => u.programs.map((p) => p.language))
    );
    return Array.from(set).sort();
  }, [universities]);

  const filtered = useMemo(() => {
    return universities.filter((uni) => {
      if (
        search &&
        !uni.name.toLowerCase().includes(search.toLowerCase()) &&
        !uni.programs.some((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      )
        return false;

      if (countryFilter && uni.countryName !== countryFilter) return false;

      if (degreeFilter && !uni.programs.some((p) => p.degree === degreeFilter))
        return false;

      if (
        languageFilter &&
        !uni.programs.some((p) => p.language === languageFilter)
      )
        return false;

      if (priceFilter) {
        const prices = uni.programs
          .map((p) => p.pricePerYear)
          .filter((p): p is number => p !== null);
        if (prices.length === 0) return priceFilter === "na";
        const minPrice = Math.min(...prices);
        if (priceFilter === "0-3000" && minPrice > 3000) return false;
        if (priceFilter === "3000-6000" && (minPrice < 3000 || minPrice > 6000))
          return false;
        if (
          priceFilter === "6000-10000" &&
          (minPrice < 6000 || minPrice > 10000)
        )
          return false;
        if (priceFilter === "10000+" && minPrice < 10000) return false;
        if (priceFilter === "na" && prices.length > 0) return false;
      }

      return true;
    });
  }, [universities, search, countryFilter, degreeFilter, languageFilter, priceFilter]);

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

  const hasActiveFilters = search || countryFilter || degreeFilter || languageFilter || priceFilter;

  return (
    <div>
      {/* Search & Filters */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            style={{ ...selectStyle, flex: 1, minWidth: "250px" }}
            placeholder="Rechercher une universite ou un programme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={selectStyle}
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <option value="">Tous les pays</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            style={selectStyle}
            value={degreeFilter}
            onChange={(e) => setDegreeFilter(e.target.value)}
          >
            <option value="">Tous les niveaux</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
          </select>
          <select
            style={selectStyle}
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="">Toutes les langues</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            style={selectStyle}
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="">Tous les prix</option>
            <option value="0-3000">Moins de 3 000/an</option>
            <option value="3000-6000">3 000 - 6 000/an</option>
            <option value="6000-10000">6 000 - 10 000/an</option>
            <option value="10000+">Plus de 10 000/an</option>
            <option value="na">Prix sur demande</option>
          </select>
          {hasActiveFilters && (
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
          {filtered.length} universite{filtered.length !== 1 ? "s" : ""} trouvee
          {filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  color: "#888",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                Universite
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  color: "#888",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                Ville
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  color: "#888",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                Pays
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  color: "#888",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                Programmes
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  color: "#888",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                Prix min
              </th>
              {canEdit && (
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "12px",
                    color: "#888",
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={canEdit ? 6 : 5}
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#888",
                    fontSize: "14px",
                  }}
                >
                  Aucune universite trouvee.
                </td>
              </tr>
            ) : (
              filtered.map((uni) => {
                const prices = uni.programs
                  .map((p) => p.pricePerYear)
                  .filter((p): p is number => p !== null);
                const minPrice =
                  prices.length > 0 ? Math.min(...prices) : null;
                const currency =
                  uni.programs.find((p) => p.pricePerYear === minPrice)
                    ?.currency || "USD";

                return (
                  <tr
                    key={uni.id}
                    style={{ borderTop: "1px solid #F0F0F0" }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {uni.photo && (
                          <img
                            src={uni.photo}
                            alt=""
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "6px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#001459",
                          }}
                        >
                          {uni.name}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#666",
                      }}
                    >
                      {uni.cityName}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <img
                          src={`https://flagcdn.com/20x15/${uni.countryCode.toLowerCase()}.png`}
                          alt=""
                          style={{ borderRadius: "2px" }}
                        />
                        <span
                          style={{ fontSize: "13px", color: "#666" }}
                        >
                          {uni.countryName}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#666",
                      }}
                    >
                      {uni.programCount} programme
                      {uni.programCount !== 1 ? "s" : ""}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#001459",
                      }}
                    >
                      {minPrice !== null
                        ? `${minPrice.toLocaleString()} ${currency}/an`
                        : "-"}
                    </td>
                    {canEdit && (
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{ display: "flex", gap: "6px" }}
                        >
                          <Link
                            href={`/dashboard/universities/${uni.id}`}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "6px",
                              border: "1px solid #DDBA52",
                              color: "#DDBA52",
                              fontSize: "12px",
                              fontWeight: "600",
                              textDecoration: "none",
                            }}
                          >
                            Modifier
                          </Link>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
