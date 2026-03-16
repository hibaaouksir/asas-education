import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import UniversityForm from "./UniversityForm";
import DeleteUniversityButton from "./DeleteUniversityButton";

export default async function UniversitiesPage() {
  const session = await auth();
  const role = session?.user?.role;
  const canEdit = role === "ADMIN";

  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    include: {
      city: { include: { country: true } },
      _count: { select: { programs: true } },
    },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700" }}>
          {canEdit ? "Gestion des Universites" : "Universites"}
        </h1>
      </div>

      {canEdit && <UniversityForm />}

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden", marginTop: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Universite</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Ville</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Pays</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Programmes</th>
              {canEdit && <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {universities.length === 0 ? (
              <tr><td colSpan={canEdit ? 5 : 4} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucune universite.</td></tr>
            ) : (
              universities.map((uni) => (
                <tr key={uni.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {uni.photo && <img src={uni.photo} alt="" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />}
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#001459" }}>{uni.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{uni.city.name}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <img src={`https://flagcdn.com/20x15/${uni.city.country.code.toLowerCase()}.png`} alt="" style={{ borderRadius: "2px" }} />
                      <span style={{ fontSize: "13px", color: "#666" }}>{uni.city.country.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{uni._count.programs} programmes</td>
                  {canEdit && (
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Link href={`/dashboard/universities/${uni.id}`} style={{
                          padding: "4px 10px", borderRadius: "6px", border: "1px solid #DDBA52",
                          color: "#DDBA52", fontSize: "12px", fontWeight: "600", textDecoration: "none",
                        }}>Modifier</Link>
                        <DeleteUniversityButton universityId={uni.id} universityName={uni.name} />
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}