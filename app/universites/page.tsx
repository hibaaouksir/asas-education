import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default async function UniversitesPublicPage({ searchParams }: { searchParams: Promise<{ pays?: string }> }) {
  const { pays } = await searchParams;

  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    include: {
      city: { include: { country: true } },
      _count: { select: { programs: true } },
    },
  });

  const filtered = pays
    ? universities.filter(u => u.city.country.name.toLowerCase() === pays.toLowerCase())
    : universities;

  const countryName = pays
    ? (filtered[0]?.city.country.name || pays)
    : null;

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <section style={{ padding: "60px 40px", backgroundColor: "#001459", textAlign: "center" }}>
        <h1 style={{ color: "#DDBA52", fontSize: "36px", fontWeight: "700", marginBottom: "10px" }}>
          {countryName ? `Universites en ${countryName}` : "Nos Universites Partenaires"}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>
          {countryName ? `Decouvrez nos universites partenaires en ${countryName}` : "Les meilleures universites pour votre avenir"}
        </p>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        {pays && (
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/destinations" style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}>← Retour aux destinations</Link>
            <span style={{ color: "#ccc" }}>|</span>
            <Link href="/universites" style={{ color: "#DDBA52", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Voir toutes les universites</Link>
          </div>
        )}

        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", fontSize: "16px" }}>Aucune universite disponible {countryName ? `en ${countryName}` : ""} pour le moment.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            {filtered.map((uni) => (
              <Link key={uni.id} href={`/universites/${uni.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  backgroundColor: "white", borderRadius: "16px", overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "transform 0.2s, box-shadow 0.2s",
                }}>
                  {uni.photo ? (
                    <img src={uni.photo} alt={uni.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #001459, #000B2E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#DDBA52", fontSize: "22px", fontWeight: "700" }}>{uni.name}</span>
                    </div>
                  )}
                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <img src={`https://flagcdn.com/20x15/${uni.city.country.code.toLowerCase()}.png`} alt="" style={{ borderRadius: "2px" }} />
                      <span style={{ fontSize: "12px", color: "#888" }}>{uni.city.name}, {uni.city.country.name}</span>
                    </div>
                    <h3 style={{ color: "#001459", fontSize: "20px", fontWeight: "700", margin: "0 0 8px" }}>{uni.name}</h3>
                    {uni.description && <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6", margin: "0 0 12px" }}>{uni.description}</p>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: "#888" }}>{uni._count.programs} programme{uni._count.programs !== 1 ? "s" : ""}</span>
                      <span style={{ color: "#DDBA52", fontSize: "13px", fontWeight: "600" }}>Voir l&apos;universite →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

