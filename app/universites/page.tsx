import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UniversitySearch from "./UniversitySearch";

export default async function UniversitesPublicPage({ searchParams }: { searchParams: Promise<{ pays?: string }> }) {
  const { pays } = await searchParams;

  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    include: {
      city: { include: { country: true } },
      programs: {
        select: {
          name: true,
          degree: true,
          pricePerYear: true,
          currency: true,
        },
      },
      _count: { select: { programs: true } },
    },
  });

  const countryName = pays
    ? (universities.find(u => u.city.country.name.toLowerCase() === pays.toLowerCase())?.city.country.name || pays)
    : null;

  const universitiesData = universities.map(u => ({
    id: u.id,
    name: u.name,
    photo: u.photo,
    description: u.description,
    cityName: u.city.name,
    countryName: u.city.country.name,
    countryCode: u.city.country.code,
    programCount: u._count.programs,
    programs: u.programs.map(p => ({
      name: p.name,
      degree: p.degree,
      pricePerYear: p.pricePerYear ? Number(p.pricePerYear) : null,
      currency: p.currency,
    })),
  }));

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

      <section style={{ padding: "40px 40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
        {pays && (
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/destinations" style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}>← Retour aux destinations</Link>
            <span style={{ color: "#ccc" }}>|</span>
            <Link href="/universites" style={{ color: "#DDBA52", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Voir toutes les universites</Link>
          </div>
        )}

        <UniversitySearch
          universities={universitiesData}
          countryFilter={countryName || undefined}
        />
      </section>

      <Footer />
    </div>
  );
}
