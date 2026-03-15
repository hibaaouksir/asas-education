import { prisma } from "@/lib/prisma";
import UniversityForm from "./UniversityForm";
import UniversityActions from "./UniversityActions";

export default async function UniversitiesPage() {
  const universities = await prisma.university.findMany({
    include: { city: { include: { country: true } }, programs: true },
    orderBy: { name: "asc" },
  });

  const cities = await prisma.city.findMany({
    include: { country: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700" }}>Gestion des Universites</h1>
      </div>

      <UniversityForm cities={cities.map(c => ({ id: c.id, name: c.name, countryName: c.country.name }))} />

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden", marginTop: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Universite</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Ville</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Pays</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Programmes</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {universities.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucune universite ajoutee.</td></tr>
            ) : (
              universities.map((uni) => (
                <tr key={uni.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>
                    <a href={`/dashboard/universities/${uni.id}`} style={{ color: "#001459", textDecoration: "none" }}>{uni.name}</a>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#666" }}>{uni.city.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#666" }}>{uni.city.country.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#666" }}>{uni.programs.length} programmes</td>
                  <td style={{ padding: "12px 16px" }}>
                    <UniversityActions universityId={uni.id} universityName={uni.name} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
