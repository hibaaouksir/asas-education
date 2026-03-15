import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const program = await prisma.program.create({
      data: {
        name: body.name,
        department: body.department,
        degree: body.degree,
        language: body.language,
        duration: body.duration,
        pricePerYear: body.pricePerYear || null,
        currency: body.currency || "USD",
        universityId: body.universityId,
        description: body.description || null,
      },
    });
    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      include: { university: { include: { city: { include: { country: true } } } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(programs);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
