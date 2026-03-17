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
        <Link href="/destinations" style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}>← Retour aux destinations</Link>

        {allUniversities.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#888", fontSize: "16px" }}>Aucune universite disponible pour le moment en {country.name}.</p>
          </div>
        ) : (
          <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "40px" }}>
            {allUniversities.map((uni) => (
              <div key={uni.id}>
                {/* University Header Card */}
                <div style={{
                  backgroundColor: "white", borderRadius: "16px", overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: "16px",
                }}>
                  {uni.photo && (
                    <img src={uni.photo} alt={uni.name} style={{ width: "100%", height: "250px", objectFit: "cover" }} />
                  )}
                  <div style={{ padding: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h2 style={{ color: "#001459", fontSize: "24px", fontWeight: "800", margin: "0 0 6px" }}>{uni.name}</h2>
                        <p style={{ color: "#888", fontSize: "14px", margin: "0 0 8px" }}>{uni.cityName}, {country.name}</p>
                      </div>
                      {uni.website && (
                        <a href={uni.website} target="_blank" rel="noopener noreferrer" style={{
                          padding: "8px 18px", borderRadius: "8px", border: "1px solid #DDBA52",
                          color: "#DDBA52", fontSize: "13px", fontWeight: "600", textDecoration: "none",
                        }}>Visiter le site</a>
                      )}
                    </div>
                    {uni.description && <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.7", margin: "12px 0 0" }}>{uni.description}</p>}
                  </div>
                </div>

                {/* Programs Table */}
                {uni.programs.length > 0 && (
                  <div style={{
                    backgroundColor: "white", borderRadius: "12px", overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0" }}>
                      <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: 0 }}>
                        {uni.programCount} programme{uni.programCount !== 1 ? "s" : ""} disponible{uni.programCount !== 1 ? "s" : ""}
                      </h3>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#F8F9FA" }}>
                          <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Programme</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Departement</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Niveau</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Langue</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Duree</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Prix/an</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uni.programs.map((prog) => (
                          <tr key={prog.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                            <td style={{ padding: "14px 24px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{prog.name}</td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", color: "#666" }}>{prog.department}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{
                                padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
                                backgroundColor: prog.degree === "Bachelor" ? "#E8F5E9" : prog.degree === "Master" ? "#E3F2FD" : "#FFF3E0",
                                color: prog.degree === "Bachelor" ? "#2E7D32" : prog.degree === "Master" ? "#1565C0" : "#E65100",
                              }}>{prog.degree}</span>
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", color: "#666" }}>{prog.language}</td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", color: "#666" }}>{prog.duration} ans</td>
                            <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "700", color: "#DDBA52" }}>{prog.pricePerYear ? `${prog.pricePerYear} ${prog.currency}` : "-"}</td>
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
