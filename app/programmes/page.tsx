import { prisma } from "@/lib/prisma";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgramCatalogue from "./ProgramCatalogue";

export default async function ProgrammesPage() {
  const programs = await prisma.program.findMany({
    include: { university: { include: { city: { include: { country: true } } } } },
    orderBy: { university: { name: "asc" } },
  });

  const countries = await prisma.country.findMany({ orderBy: { name: "asc" } });

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <section style={{ padding: "60px 40px", backgroundColor: "#001459", textAlign: "center" }}>
        <h1 style={{ color: "#DDBA52", fontSize: "36px", fontWeight: "700", marginBottom: "10px" }}>
          Catalogue des Programmes
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
          Trouvez le programme ideal parmi nos universites partenaires
        </p>
      </section>

      <ProgramCatalogue
        programs={programs.map(p => ({
          id: p.id,
          name: p.name,
          department: p.department,
          degree: p.degree,
          language: p.language,
          duration: p.duration,
          pricePerYear: p.pricePerYear,
          currency: p.currency,
          universityName: p.university.name,
          universityPhoto: p.university.photo,
          cityName: p.university.city.name,
          countryName: p.university.city.country.name,
          countryCode: p.university.city.country.code,
        }))}
        countries={countries.map(c => ({ name: c.name, code: c.code }))}
      />

      <Footer />
    </div>
  );
}
