import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CityForm from "./CityForm";

export default async function CountryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const country = await prisma.country.findUnique({
    where: { id },
    include: { cities: { include: { universities: true }, orderBy: { name: "asc" } } },
  });

  if (!country) return notFound();

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <a href="/dashboard/countries" style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}>← Retour aux pays</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <span style={{ fontSize: "36px" }}>{country.flag || "🏳️"}</span>
        <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700" }}>{country.name}</h1>
        <span style={{ color: "#888", fontSize: "14px" }}>({country.code})</span>
      </div>

      <CityForm countryId={country.id} />

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden", marginTop: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Ville</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Universites</th>
            </tr>
          </thead>
          <tbody>
            {country.cities.length === 0 ? (
              <tr><td colSpan={2} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucune ville ajoutee. Utilisez le formulaire ci-dessus.</td></tr>
            ) : (
              country.cities.map((city) => (
                <tr key={city.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{city.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#666" }}>{city.universities.length} universites</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}