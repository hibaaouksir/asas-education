import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import UniversityForm from "./UniversityForm";
import DeleteUniversityButton from "./DeleteUniversityButton";
import DashboardUniversitySearch from "./DashboardUniversitySearch";

export default async function UniversitiesPage() {
  const session = await auth();
  const role = session?.user?.role;
  const canEdit = role === "ADMIN" || role === "APPLICATION";

  const countries = await prisma.country.findMany({ orderBy: { name: "asc" } });
  const allCities = await prisma.city.findMany({ include: { country: true }, orderBy: { name: "asc" } });

  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    include: {
      city: { include: { country: true } },
      programs: {
        select: {
          name: true,
          degree: true,
          language: true,
          pricePerYear: true,
          currency: true,
        },
      },
      _count: { select: { programs: true } },
    },
  });

  const universitiesData = universities.map((u) => ({
    id: u.id,
    name: u.name,
    photo: u.photo,
    description: u.description,
    cityName: u.city.name,
    countryName: u.city.country.name,
    countryCode: u.city.country.code,
    programCount: u._count.programs,
    programs: u.programs.map((p) => ({
      name: p.name,
      degree: p.degree,
      language: p.language,
      pricePerYear: p.pricePerYear ? Number(p.pricePerYear) : null,
      currency: p.currency,
    })),
  }));

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700" }}>
          {canEdit ? "Gestion des Universites" : "Universites"}
        </h1>
      </div>

      {canEdit && (
        <UniversityForm
          countries={countries.map((c) => ({
            id: c.id,
            name: c.name,
            code: c.code,
          }))}
          cities={allCities.map((c) => ({
            id: c.id,
            name: c.name,
            countryId: c.countryId,
          }))}
        />
      )}

      <DashboardUniversitySearch
        universities={universitiesData}
        canEdit={canEdit}
      />
    </div>
  );
}
