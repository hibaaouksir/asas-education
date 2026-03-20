import { prisma } from "@/lib/prisma";
import ProgramForm from "./ProgramForm";
import ProgramActions from "./ProgramActions";
import ProgramGroupEdit from "./ProgramGroupEdit";

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    include: { university: { include: { city: { include: { country: true } } } } },
    orderBy: { name: "asc" },
  });

  const universities = await prisma.university.findMany({
    include: { city: { include: { country: true } } },
    orderBy: { name: "asc" },
  });

  // Get unique programs for auto-completion
  const uniquePrograms = new Map<string, { name: string; department: string; description: string; image: string }>();
  programs.forEach(p => {
    if (!uniquePrograms.has(p.name.toLowerCase())) {
      uniquePrograms.set(p.name.toLowerCase(), {
        name: p.name,
        department: p.department,
        description: p.description || "",
        image: p.image || "",
      });
    }
  });

  // Group programs by name
  const grouped = new Map<string, typeof programs>();
  programs.forEach(p => {
    const key = p.name.toLowerCase();
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p);
  });

  return (
    <div>
      <a href="/programmes" target="_blank" style={{ color: "#DDBA52", textDecoration: "none", fontSize: "13px", fontWeight: "600", display: "inline-block", marginBottom: "12px" }}>Voir les programmes sur le site →</a>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Gestion des Programmes</h1>

      <ProgramForm
        universities={universities.map(u => ({ id: u.id, name: u.name, cityName: u.city.name, countryName: u.city.country.name }))}
        existingPrograms={Array.from(uniquePrograms.values())}
      />

      <div style={{ marginTop: "24px" }}>
        {Array.from(grouped.entries()).length === 0 ? (
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>
            Aucun programme ajoute.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Array.from(grouped.entries()).map(([key, progs]) => {
              const first = progs[0];
              return (
                <div key={key} style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                  {/* Program Header */}
                  <div style={{
                    padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderBottom: "1px solid #f0f0f0", backgroundColor: "#FAFAFA",
                  }}>
                    <ProgramGroupEdit
                      programName={first.name}
                      department={first.department}
                      description={first.description || ""}
                      image={first.image || ""}
                    />
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[...new Set(progs.map(p => p.degree))].map(d => (
                        <span key={d} style={{
                          padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                          backgroundColor: d === "Bachelor" ? "#E8F5E9" : d === "Master" ? "#E3F2FD" : "#FFF3E0",
                          color: d === "Bachelor" ? "#2E7D32" : d === "Master" ? "#1565C0" : "#E65100",
                        }}>{d}</span>
                      ))}
                    </div>
                  </div>

                  {/* Universities Table */}
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "8px 20px", textAlign: "left", fontSize: "11px", color: "#aaa", fontWeight: "600", textTransform: "uppercase" }}>Universite</th>
                        <th style={{ padding: "8px 16px", textAlign: "left", fontSize: "11px", color: "#aaa", fontWeight: "600", textTransform: "uppercase" }}>Pays</th>
                        <th style={{ padding: "8px 16px", textAlign: "left", fontSize: "11px", color: "#aaa", fontWeight: "600", textTransform: "uppercase" }}>Niveau</th>
                        <th style={{ padding: "8px 16px", textAlign: "left", fontSize: "11px", color: "#aaa", fontWeight: "600", textTransform: "uppercase" }}>Langue</th>
                        <th style={{ padding: "8px 16px", textAlign: "left", fontSize: "11px", color: "#aaa", fontWeight: "600", textTransform: "uppercase" }}>Duree</th>
                        <th style={{ padding: "8px 16px", textAlign: "left", fontSize: "11px", color: "#aaa", fontWeight: "600", textTransform: "uppercase" }}>Prix/an</th>
                        <th style={{ padding: "8px 16px", textAlign: "left", fontSize: "11px", color: "#aaa", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progs.map((prog) => (
                        <tr key={prog.id} style={{ borderTop: "1px solid #F5F5F5" }}>
                          <td style={{ padding: "10px 20px", fontSize: "13px", fontWeight: "600", color: "#001459" }}>{prog.university.name}</td>
                          <td style={{ padding: "10px 16px", fontSize: "12px", color: "#666" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <img src={`https://flagcdn.com/16x12/${prog.university.city.country.code.toLowerCase()}.png`} alt="" style={{ borderRadius: "1px" }} />
                              {prog.university.city.country.name}
                            </div>
                          </td>
                          <td style={{ padding: "10px 16px" }}>
                            <span style={{
                              padding: "3px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600",
                              backgroundColor: prog.degree === "Bachelor" ? "#E8F5E9" : prog.degree === "Master" ? "#E3F2FD" : "#FFF3E0",
                              color: prog.degree === "Bachelor" ? "#2E7D32" : prog.degree === "Master" ? "#1565C0" : "#E65100",
                            }}>{prog.degree}</span>
                          </td>
                          <td style={{ padding: "10px 16px", fontSize: "12px", color: "#666" }}>{prog.language}</td>
                          <td style={{ padding: "10px 16px", fontSize: "12px", color: "#666" }}>{prog.duration} ans</td>
                          <td style={{ padding: "10px 16px", fontSize: "12px", color: "#001459", fontWeight: "600" }}>{prog.pricePerYear ? `${prog.pricePerYear} ${prog.currency}` : "-"}</td>
                          <td style={{ padding: "10px 16px" }}>
                            <ProgramActions programId={prog.id} program={{
                              name: prog.name, department: prog.department, degree: prog.degree,
                              language: prog.language, duration: String(prog.duration),
                              pricePerYear: prog.pricePerYear ? String(prog.pricePerYear) : "",
                              currency: prog.currency,
                            }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
