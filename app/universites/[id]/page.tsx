import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UniversityApplyButton from "./UniversityApplyButton";

export default async function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const university = await prisma.university.findUnique({
    where: { id },
    include: {
      city: { include: { country: true } },
      programs: { orderBy: { name: "asc" } },
    },
  });

  if (!university) return notFound();

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ position: "relative", height: "350px", overflow: "hidden" }}>
        {university.photo ? (
          <img src={university.photo} alt={university.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #001459, #000B2E)" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 30%, rgba(0,0,0,0.8))" }} />
        <div style={{ position: "absolute", bottom: "40px", left: "48px", right: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <img src={`https://flagcdn.com/24x18/${university.city.country.code.toLowerCase()}.png`} alt="" style={{ borderRadius: "2px" }} />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>{university.city.name}, {university.city.country.name}</span>
          </div>
          <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", margin: "0 0 8px" }}>{university.name}</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", margin: 0 }}>{university.programs.length} programme{university.programs.length !== 1 ? "s" : ""} disponible{university.programs.length !== 1 ? "s" : ""}</p>
        </div>
      </section>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 48px" }}>
        <Link href="/programmes" style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}>← Retour au catalogue</Link>

        {/* University Info */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px", marginTop: "24px", marginBottom: "40px" }}>
          <div>
            {university.description && (
              <div style={{ backgroundColor: "white", padding: "28px", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
                <h2 style={{ color: "#001459", fontSize: "20px", fontWeight: "700", margin: "0 0 12px" }}>A propos</h2>
                <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.8", margin: 0 }}>{university.description}</p>
              </div>
            )}
          </div>
          <div style={{ backgroundColor: "white", padding: "28px", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "fit-content" }}>
            <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: "0 0 16px" }}>Informations</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#888", fontSize: "13px" }}>Pays</span>
                <span style={{ color: "#001459", fontSize: "13px", fontWeight: "600" }}>{university.city.country.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#888", fontSize: "13px" }}>Ville</span>
                <span style={{ color: "#001459", fontSize: "13px", fontWeight: "600" }}>{university.city.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#888", fontSize: "13px" }}>Programmes</span>
                <span style={{ color: "#001459", fontSize: "13px", fontWeight: "600" }}>{university.programs.length}</span>
              </div>
              {university.website && (
                <a href={university.website} target="_blank" rel="noopener noreferrer" style={{
                  display: "block", textAlign: "center", padding: "10px 20px", borderRadius: "10px",
                  border: "1px solid #DDBA52", color: "#DDBA52", fontSize: "13px",
                  fontWeight: "600", textDecoration: "none", marginTop: "4px",
                }}>Visiter le site web</a>
              )}
            </div>
          </div>
        </div>

        {/* Programs List */}
        <h2 style={{ color: "#001459", fontSize: "22px", fontWeight: "700", marginBottom: "20px" }}>Programmes disponibles</h2>

        {university.programs.length === 0 ? (
          <p style={{ color: "#888", fontSize: "15px" }}>Aucun programme disponible pour le moment.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {university.programs.map((prog) => (
              <div key={prog.id} style={{
                backgroundColor: "white", borderRadius: "14px", padding: "24px 28px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex",
                justifyContent: "space-between", alignItems: "center",
                transition: "box-shadow 0.2s",
              }}
                
                
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "#001459", fontSize: "17px", fontWeight: "700", margin: "0 0 6px" }}>{prog.name}</h3>
                  <p style={{ color: "#888", fontSize: "13px", margin: "0 0 10px" }}>{prog.department}</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
                      backgroundColor: prog.degree === "Bachelor" ? "#E8F5E9" : prog.degree === "Master" ? "#E3F2FD" : "#FFF3E0",
                      color: prog.degree === "Bachelor" ? "#2E7D32" : prog.degree === "Master" ? "#1565C0" : "#E65100",
                    }}>{prog.degree}</span>
                    <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", backgroundColor: "#F5F5F5", color: "#666" }}>{prog.language}</span>
                    <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", backgroundColor: "#F5F5F5", color: "#666" }}>{prog.duration} ans</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", marginLeft: "24px" }}>
                  {prog.pricePerYear ? (
                    <p style={{ color: "#DDBA52", fontSize: "22px", fontWeight: "800", margin: "0 0 8px" }}>{prog.pricePerYear} <span style={{ fontSize: "13px", color: "#888", fontWeight: "500" }}>{prog.currency}/an</span></p>
                  ) : (
                    <p style={{ color: "#888", fontSize: "14px", margin: "0 0 8px" }}>Prix sur demande</p>
                  )}
                  <UniversityApplyButton universityName={university.name} programName={prog.name} programDegree={prog.degree} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
