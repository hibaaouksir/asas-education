import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const city = await prisma.city.create({
      data: {
        name: body.name,
        countryId: body.countryId,
      },
    });
    return NextResponse.json(city, { status: 201 });
  } catch (error) {
    console.error("Error creating city:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
