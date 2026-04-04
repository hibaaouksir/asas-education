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
    pricePerYear: number | null;
    currency: string;
  }[];
};

export default function UniversitySearch({
  universities,
  countryFilter,
}: {
  universities: University[];
  countryFilter?: string;
}) {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryFilter || "");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Get unique countries
  const countries = useMemo(() => {
    const set = new Set(universities.map((u) => u.countryName));
    return Array.from(set).sort();
  }, [universities]);

  // Get unique degrees
  const degrees = useMemo(() => {
    const set = new Set(
      universities.flatMap((u) => u.programs.map((p) => p.degree))
    );
    return Array.from(set).sort();
  }, [universities]);

  // Filter universities
  const filtered = useMemo(() => {
    return universities.filter((uni) => {
      // Search by name
      if (
        search &&
        !uni.name.toLowerCase().includes(search.toLowerCase()) &&
        !uni.programs.some((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      ) {
        return false;
      }

      // Filter by country
      if (
        selectedCountry &&
        uni.countryName.toLowerCase() !== selectedCountry.toLowerCase()
      ) {
        return false;
      }

      // Filter by degree
      if (
        selectedDegree &&
        !uni.programs.some((p) => p.degree === selectedDegree)
      ) {
        return false;
      }

      // Filter by price range
      if (priceRange) {
        const prices = uni.programs
          .map((p) => p.pricePerYear)
          .filter((p): p is number => p !== null);
        if (prices.length === 0) return priceRange === "na";
        const minPrice = Math.min(...prices);
        if (priceRange === "0-3000" && minPrice > 3000) return false;
        if (priceRange === "3000-6000" && (minPrice < 3000 || minPrice > 6000))
          return false;
        if (priceRange === "6000-10000" && (minPrice < 6000 || minPrice > 10000))
          return false;
        if (priceRange === "10000+" && minPrice < 10000) return false;
        if (priceRange === "na" && prices.length > 0) return false;
      }

      return true;
    });
  }, [universities, search, selectedCountry, selectedDegree, priceRange]);

  const hasActiveFilters =
    search || selectedCountry || selectedDegree || priceRange;

  const selectStyle: React.CSSProperties = {
    padding: "12px 16px",
    border: "1px solid #E0E0E0",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#333",
    backgroundColor: "white",
    outline: "none",
    cursor: "pointer",
    minWidth: "160px",
  };

  return (
    <div>
      {/* Search & Filters Bar */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "24px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: "32px",
        }}
      >
        {/* Search Input */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <span
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              color: "#999",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Rechercher une universite ou un programme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px 14px 48px",
              border: "2px solid #F0F0F0",
              borderRadius: "12px",
              fontSize: "15px",
              outline: "none",
              transition: "border-color 0.3s",
              boxSizing: "border-box",
              backgroundColor: "#FAFAFA",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#DDBA52")}
            onBlur={(e) => (e.target.style.borderColor = "#F0F0F0")}
          />
        </div>

        {/* Filters Row */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Country filter - only show if not already filtered by country */}
          {!countryFilter && (
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={selectStyle}
            >
              <option value="">Tous les pays</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            style={selectStyle}
          >
            <option value="">Tous les niveaux</option>
            {degrees.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            style={selectStyle}
          >
            <option value="">Tous les prix</option>
            <option value="0-3000">Moins de 3 000 $/an</option>
            <option value="3000-6000">3 000 - 6 000 $/an</option>
            <option value="6000-10000">6 000 - 10 000 $/an</option>
            <option value="10000+">Plus de 10 000 $/an</option>
            <option value="na">Prix sur demande</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCountry(countryFilter || "");
                setSelectedDegree("");
                setPriceRange("");
              }}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#FFF3E0",
                color: "#E65100",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Reinitialiser
            </button>
          )}

          <span
            style={{
              marginLeft: "auto",
              fontSize: "13px",
              color: "#888",
              fontWeight: "500",
            }}
          >
            {filtered.length} universite{filtered.length !== 1 ? "s" : ""}{" "}
            trouvee{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</p>
          <p style={{ color: "#888", fontSize: "16px", marginBottom: "8px" }}>
            Aucune universite trouvee
          </p>
          <p style={{ color: "#bbb", fontSize: "13px" }}>
            Essayez de modifier vos criteres de recherche
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "24px",
          }}
        >
          {filtered.map((uni) => {
            const prices = uni.programs
              .map((p) => p.pricePerYear)
              .filter((p): p is number => p !== null);
            const minPrice = prices.length > 0 ? Math.min(...prices) : null;
            const currency =
              uni.programs.find((p) => p.pricePerYear === minPrice)?.currency ||
              "USD";

            return (
              <Link
                key={uni.id}
                href={`/universites/${uni.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 2px 12px rgba(0,0,0,0.06)";
                  }}
                >
                  {uni.photo ? (
                    <img
                      src={uni.photo}
                      alt={uni.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        background:
                          "linear-gradient(135deg, #001459, #000B2E)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "#DDBA52",
                          fontSize: "22px",
                          fontWeight: "700",
                        }}
                      >
                        {uni.name}
                      </span>
                    </div>
                  )}
                  <div style={{ padding: "20px 24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src={`https://flagcdn.com/20x15/${uni.countryCode.toLowerCase()}.png`}
                        alt=""
                        style={{ borderRadius: "2px" }}
                      />
                      <span style={{ fontSize: "12px", color: "#888" }}>
                        {uni.cityName}, {uni.countryName}
                      </span>
                    </div>
                    <h3
                      style={{
                        color: "#001459",
                        fontSize: "20px",
                        fontWeight: "700",
                        margin: "0 0 8px",
                      }}
                    >
                      {uni.name}
                    </h3>
                    {uni.description && (
                      <p
                        style={{
                          color: "#666",
                          fontSize: "13px",
                          lineHeight: "1.6",
                          margin: "0 0 12px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {uni.description}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#888" }}>
                        {uni.programCount} programme
                        {uni.programCount !== 1 ? "s" : ""}
                      </span>
                      {minPrice !== null ? (
                        <span
                          style={{
                            color: "#DDBA52",
                            fontSize: "15px",
                            fontWeight: "700",
                          }}
                        >
                          A partir de {minPrice.toLocaleString()} {currency}/an
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "#888",
                            fontSize: "13px",
                            fontStyle: "italic",
                          }}
                        >
                          Prix sur demande
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
