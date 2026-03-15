import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const lead = await prisma.lead.findUnique({ where: { id: body.leadId } });
    if (!lead) return NextResponse.json({ error: "Lead non trouve" }, { status: 404 });
    if (lead.status !== "DEAL") return NextResponse.json({ error: "Le lead doit etre en statut DEAL" }, { status: 400 });

    const student = await prisma.student.create({
      data: {
        firstName: lead.firstName,
        lastName: lead.lastName,
        gender: "OTHER",
        dateOfBirth: new Date("2000-01-01"),
        passportNumber: "A_COMPLETER",
        citizenship: "A_COMPLETER",
        email: lead.email,
        phone: lead.phone,
        guardianName: "A_COMPLETER",
        guardianEmail: "A_COMPLETER",
        transcript: lead.transcript,
        cv: lead.cv,
        diploma: lead.diploma,
        passportFile: lead.passport,
        consultantId: lead.consultantId,
        status: "EN_ATTENTE",
      },
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: "DEAL" },
    });

    return NextResponse.json({ studentId: student.id }, { status: 201 });
  } catch (error) {
    console.error("Error converting lead:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}