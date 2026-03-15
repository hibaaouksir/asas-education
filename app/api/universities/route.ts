import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const university = await prisma.university.create({
      data: {
        name: body.name,
        cityId: body.cityId,
        website: body.website || null,
        description: body.description || null,
      },
    });
    return NextResponse.json(university, { status: 201 });
  } catch (error) {
    console.error("Error creating university:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      include: { city: { include: { country: true } }, programs: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(universities);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
