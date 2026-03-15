import { prisma } from "@/lib/prisma";
import SearchProgramsClient from "./SearchProgramsClient";

export default async function SearchProgramsPage() {
  const programs = await prisma.program.findMany({
    include: { university: { include: { city: { include: { country: true } } } } },
    orderBy: { university: { name: "asc" } },
  });

  const countries = await prisma.country.findMany({ orderBy: { name: "asc" } });
  const cities = await prisma.city.findMany({ include: { country: true }, orderBy: { name: "asc" } });

  return (
    <SearchProgramsClient
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
      countries={countries.map(c => ({ id: c.id, name: c.name, code: c.code }))}
      cities={cities.map(c => ({ id: c.id, name: c.name, countryId: c.countryId }))}
    />
  );
}
