import { prisma } from "@/lib/prisma";
import ProgramForm from "./ProgramForm";
import ProgramActions from "./ProgramActions";

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    include: { university: { include: { city: { include: { country: true } } } } },
    orderBy: { name: "asc" },
  });

  const universities = await prisma.university.findMany({
    include: { city: { include: { country: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Gestion des Programmes</h1>

      <ProgramForm universities={universities.map(u => ({ id: u.id, name: u.name, cityName: u.city.name, countryName: u.city.country.name }))} />

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden", marginTop: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Programme</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Departement</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Universite</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Niveau</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Langue</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Duree</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Prix/an</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun programme ajoute.</td></tr>
            ) : (
              programs.map((prog) => (
                <tr key={prog.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{prog.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#666" }}>{prog.department}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{prog.university.name}</td>
                  <td style={{ padding: "12px 16px" }}><span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", backgroundColor: prog.degree === "Bachelor" ? "#E8F5E9" : prog.degree === "Master" ? "#E3F2FD" : "#FFF3E0", color: prog.degree === "Bachelor" ? "#2E7D32" : prog.degree === "Master" ? "#1565C0" : "#E65100" }}>{prog.degree}</span></td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{prog.language}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{prog.duration} ans</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#001459", fontWeight: "600" }}>{prog.pricePerYear ? `${prog.pricePerYear} ${prog.currency}` : "-"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <ProgramActions programId={prog.id} program={{
                      name: prog.name, department: prog.department, degree: prog.degree,
                      language: prog.language, duration: String(prog.duration),
                      pricePerYear: prog.pricePerYear ? String(prog.pricePerYear) : "",
                      currency: prog.currency,
                    }} />
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