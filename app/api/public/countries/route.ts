import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    const result = countries.map(c => ({
      id: c.id,
      name: c.name,
      code: c.code,
      universityCount: c.cities.reduce((sum, city) => sum + city.universities.length, 0),
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
