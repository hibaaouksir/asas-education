import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const country = await prisma.country.create({
      data: {
        name: body.name,
        code: body.code,
        flag: body.flag || null,
        photo: body.photo || null,
      },
    });
    return NextResponse.json(country, { status: 201 });
  } catch (error) {
    console.error("Error creating country:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      include: { cities: { include: { universities: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
