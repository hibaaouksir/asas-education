import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const existing = await prisma.source.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Une source avec ce nom existe deja" }, { status: 400 });
    }

    const source = await prisma.source.create({
      data: {
        name: body.name,
        slug,
        platform: body.platform,
        influencer: body.influencer || null,
        description: body.description || null,
      },
    });
    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    console.error("Error creating source:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
