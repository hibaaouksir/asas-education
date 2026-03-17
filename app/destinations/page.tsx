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
          universities: true,
        },
      },
    },
  });

  const countriesWithCount = countries.map(c => ({
    ...c,
    universityCount: c.cities.reduce((sum, city) => sum + city.universities.length, 0),
  }));

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <section style={{ padding: "60px 40px", backgroundColor: "#001459", textAlign: "center" }}>
        <h1 style={{ color: "#DDBA52", fontSize: "36px", fontWeight: "700", marginBottom: "10px" }}>Nos Destinations</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>Decouvrez les pays ou vous pouvez etudier avec ASAS</p>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        {countriesWithCount.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", fontSize: "16px" }}>Aucune destination disponible pour le moment.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {countriesWithCount.map((country) => (
              <Link key={country.id} href={`/destinations/${country.code.toLowerCase()}`} style={{ textDecoration: "none" }}>
                <div style={{
                  backgroundColor: "white", padding: "28px", borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "20px",
                  transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
                >
                  <img src={`https://flagcdn.com/48x36/${country.code.toLowerCase()}.png`} alt={country.name} style={{ borderRadius: "4px", width: "48px", height: "36px" }} />
                  <div>
                    <h3 style={{ color: "#001459", fontSize: "18px", fontWeight: "700", margin: "0 0 4px" }}>{country.name}</h3>
                    <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{country.universityCount} universite{country.universityCount !== 1 ? "s" : ""}</p>
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