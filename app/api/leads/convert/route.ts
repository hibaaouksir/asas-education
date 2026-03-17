import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const lead = await prisma.lead.findUnique({ where: { id: body.leadId } });
    if (!lead) return NextResponse.json({ error: "Lead non trouve" }, { status: 404 });
    if (lead.status !== "DEAL") return NextResponse.json({ error: "Le lead doit etre en statut DEAL" }, { status: 400 });

    // Check if lead was already converted
    const existingStudent = await prisma.student.findFirst({
      where: { email: lead.email },
    });
    if (existingStudent) {
      return NextResponse.json({ error: "Ce lead a deja ete converti en etudiant" }, { status: 400 });
    }

    // Create student with lead info pre-filled
    const student = await prisma.student.create({
      data: {
        firstName: lead.firstName,
        lastName: lead.lastName,
        gender: "OTHER",
        dateOfBirth: new Date("2000-01-01"),
        passportNumber: "",
        citizenship: "",
        email: lead.email,
        phone: lead.phone,
        guardianName: "",
        guardianEmail: "",
        // Copy any documents the lead might have
        transcript: lead.transcript,
        cv: lead.cv,
        diploma: lead.diploma,
        passportFile: lead.passport,
        // Assign to the same consultant
        consultantId: lead.consultantId,
        status: "EN_ATTENTE",
      },
    });
    // Remove lead from leads table after conversion
    await prisma.lead.delete({ where: { id: lead.id } });

    return NextResponse.json({ studentId: student.id }, { status: 201 });
  } catch (error) {
    console.error("Error converting lead:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
