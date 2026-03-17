import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const country = await prisma.country.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      cities: {
        include: {
          universities: {
            include: {
              programs: true,
            },
          },
        },
      },
    },
  });

  if (!country) return notFound();

  const allUniversities = country.cities.flatMap(city =>
    city.universities.map(uni => ({
      ...uni,
      cityName: city.name,
      programCount: uni.programs.length,
      programs: uni.programs,
    }))
  );

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <section style={{ padding: "60px 40px", backgroundColor: "#001459", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "10px" }}>
          <img src={`https://flagcdn.com/48x36/${country.code.toLowerCase()}.png`} alt={country.name} style={{ borderRadius: "4px" }} />
          <h1 style={{ color: "#DDBA52", fontSize: "36px", fontWeight: "700", margin: 0 }}>Etudier en {country.name}</h1>
        </div>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>
          {allUniversities.length} universite{allUniversities.length !== 1 ? "s" : ""} disponible{allUniversities.length !== 1 ? "s" : ""}
        </p>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        {allUniversities.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#888", fontSize: "16px", marginBottom: "16px" }}>Aucune universite disponible pour le moment en {country.name}.</p>
            <Link href="/destinations" style={{ color: "#DDBA52", fontWeight: "600", textDecoration: "none" }}>← Retour aux destinations</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {allUniversities.map((uni) => (
              <div key={uni.id} style={{
                backgroundColor: "white", borderRadius: "16px", overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }}>
                <div style={{ display: "flex" }}>
                  {uni.photo ? (
                    <img src={uni.photo} alt={uni.name} style={{ width: "280px", height: "200px", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "280px", height: "200px", backgroundColor: "#001459", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#DDBA52", fontSize: "20px", fontWeight: "700" }}>{uni.name}</span>
                    </div>
                  )}
                  <div style={{ flex: 1, padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <h2 style={{ color: "#001459", fontSize: "22px", fontWeight: "700", margin: "0 0 4px" }}>{uni.name}</h2>
                        <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{uni.cityName}, {country.name}</p>
                      </div>
                      {uni.website && (
                        <a href={uni.website} target="_blank" rel="noopener noreferrer" style={{
                          padding: "6px 14px", borderRadius: "6px", border: "1px solid #DDBA52",
                          color: "#DDBA52", fontSize: "12px", fontWeight: "600", textDecoration: "none",
                        }}>Site web</a>
                      )}
                    </div>
                    {uni.description && <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", margin: "8px 0 12px" }}>{uni.description}</p>}
                    <p style={{ color: "#001459", fontSize: "14px", fontWeight: "600" }}>{uni.programCount} programme{uni.programCount !== 1 ? "s" : ""} disponible{uni.programCount !== 1 ? "s" : ""}</p>
                  </div>
                </div>

                {uni.programs.length > 0 && (
                  <div style={{ borderTop: "1px solid #f0f0f0" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#F8F9FA" }}>
                          <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Programme</th>
                          <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Departement</th>
                          <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Niveau</th>
                          <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Langue</th>
                          <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Duree</th>
                          <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Prix/an</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uni.programs.map((prog) => (
                          <tr key={prog.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                            <td style={{ padding: "10px 16px", fontSize: "13px", fontWeight: "600", color: "#001459" }}>{prog.name}</td>
                            <td style={{ padding: "10px 16px", fontSize: "13px", color: "#666" }}>{prog.department}</td>
                            <td style={{ padding: "10px 16px" }}>
                              <span style={{
                                padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                                backgroundColor: prog.degree === "Bachelor" ? "#E8F5E9" : prog.degree === "Master" ? "#E3F2FD" : "#FFF3E0",
                                color: prog.degree === "Bachelor" ? "#2E7D32" : prog.degree === "Master" ? "#1565C0" : "#E65100",
                              }}>{prog.degree}</span>
                            </td>
                            <td style={{ padding: "10px 16px", fontSize: "13px", color: "#666" }}>{prog.language}</td>
                            <td style={{ padding: "10px 16px", fontSize: "13px", color: "#666" }}>{prog.duration} ans</td>
                            <td style={{ padding: "10px 16px", fontSize: "13px", fontWeight: "600", color: "#001459" }}>{prog.pricePerYear ? `${prog.pricePerYear} ${prog.currency}` : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
