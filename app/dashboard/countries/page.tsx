import { prisma } from "@/lib/prisma";
import CountryForm from "./CountryForm";
import CountryCard from "./CountryCard";

export default async function CountriesPage() {
  const countries = await prisma.country.findMany({
    include: { cities: { include: { _count: { select: { universities: true } } }, orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Gestion des Pays</h1>

      <CountryForm />

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>
        {countries.length === 0 ? (
          <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "12px", textAlign: "center", color: "#888", fontSize: "14px" }}>
            Aucun pays ajoute. Utilisez le bouton ci-dessus.
          </div>
        ) : (
          countries.map((country) => (
            <CountryCard
              key={country.id}
              country={{
                id: country.id,
                name: country.name,
                code: country.code,
                flag: country.flag || "",
                cities: country.cities.map(c => ({
                  id: c.id,
                  name: c.name,
                  universityCount: c._count.universities,
                })),
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}