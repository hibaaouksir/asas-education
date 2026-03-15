import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditUniversityForm from "./EditUniversityForm";

export default async function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const university = await prisma.university.findUnique({
    where: { id },
    include: { city: { include: { country: true } }, programs: true },
  });

  if (!university) return notFound();

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <a href="/dashboard/universities" style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}>← Retour aux universites</a>
      </div>
      <EditUniversityForm university={{
        id: university.id,
        name: university.name,
        website: university.website || "",
        description: university.description || "",
        photo: university.photo || "",
        cityName: university.city.name,
        countryName: university.city.country.name,
      }} />
      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden", marginTop: "24px" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: 0 }}>Programmes ({university.programs.length})</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Programme</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Niveau</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Langue</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Prix/an</th>
            </tr>
          </thead>
          <tbody>
            {university.programs.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun programme. Allez dans Programmes pour en ajouter.</td></tr>
            ) : (
              university.programs.map((prog) => (
                <tr key={prog.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{prog.name}</td>
                  <td style={{ padding: "12px 16px" }}><span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", backgroundColor: prog.degree === "Bachelor" ? "#E8F5E9" : "#E3F2FD", color: prog.degree === "Bachelor" ? "#2E7D32" : "#1565C0" }}>{prog.degree}</span></td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{prog.language}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#001459" }}>{prog.pricePerYear ? `${prog.pricePerYear} ${prog.currency}` : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
