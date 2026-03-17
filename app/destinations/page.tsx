import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default async function DestinationsPage() {
  const countries = await prisma.country.findMany({
    orderBy: { name: "asc" },
    include: {
      cities: {
        include: {
          universities: {
            include: { _count: { select: { programs: true } } },
          },
        },
      },
    },
  });

  const countriesData = countries.map(c => ({
    id: c.id,
    name: c.name,
    code: c.code,
    universityCount: c.cities.reduce((sum, city) => sum + city.universities.length, 0),
    programCount: c.cities.reduce((sum, city) => sum + city.universities.reduce((s, u) => s + u._count.programs, 0), 0),
  }));

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <section style={{ padding: "60px 40px", backgroundColor: "#001459", textAlign: "center" }}>
        <h1 style={{ color: "#DDBA52", fontSize: "36px", fontWeight: "700", marginBottom: "10px" }}>Nos Destinations</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>Decouvrez les pays ou vous pouvez etudier avec ASAS</p>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        {countriesData.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", fontSize: "16px" }}>Aucune destination disponible pour le moment.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {countriesData.map((country) => (
              <Link key={country.id} href={`/programmes?pays=${encodeURIComponent(country.name)}`} style={{ textDecoration: "none" }}>
                <div style={{
                  backgroundColor: "white", borderRadius: "16px", overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                
                
                >
                  <div style={{
                    height: "120px", background: "linear-gradient(135deg, #001459, #000B2E)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "0 24px",
                  }}>
                    <img src={`https://flagcdn.com/48x36/${country.code.toLowerCase()}.png`} alt={country.name} style={{ borderRadius: "4px", width: "48px", height: "36px" }} />
                    <h3 style={{ color: "white", fontSize: "22px", fontWeight: "700", margin: 0 }}>{country.name}</h3>
                  </div>
                  <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ color: "#001459", fontSize: "14px", fontWeight: "600", margin: "0 0 2px" }}>{country.universityCount} universite{country.universityCount !== 1 ? "s" : ""}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{country.programCount} programme{country.programCount !== 1 ? "s" : ""}</p>
                    </div>
                    <span style={{ color: "#DDBA52", fontSize: "14px", fontWeight: "600" }}>Voir les programmes →</span>
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
