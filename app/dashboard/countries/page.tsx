import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CountryForm from "./CountryForm";

export default async function CountriesPage() {
  const countries = await prisma.country.findMany({
    include: { cities: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700" }}>Gestion des Pays</h1>
      </div>

      <CountryForm />

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden", marginTop: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Drapeau</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nom</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Code</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Villes</th>
            </tr>
          </thead>
          <tbody>
            {countries.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun pays ajoute. Utilisez le formulaire ci-dessus.</td></tr>
            ) : (
              countries.map((country) => (
                <tr key={country.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "12px 16px", fontSize: "24px" }}>{country.flag || "🏳️"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>
                    <Link href={`/dashboard/countries/${country.id}`} style={{ color: "#001459", textDecoration: "none" }}>{country.name}</Link>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#666" }}>{country.code}</td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#666" }}>{country.cities.length} villes</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}