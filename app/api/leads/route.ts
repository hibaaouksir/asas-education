import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const lead = await prisma.lead.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || "",
        city: body.city || "",
        educationLevel: body.educationLevel || body.level || "",
        sessionType: body.sessionType || null,
        sourceName: body.sourceName || "Site Web",
        sourceId: body.sourceId || null,
        universityName: body.universityName || null,
        departmentName: body.departmentName || null,
        language: body.language || null,
        level: body.level || null,
      },
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { consultant: true },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}