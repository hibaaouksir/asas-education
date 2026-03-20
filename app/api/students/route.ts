import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const student = await prisma.student.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        dateOfBirth: new Date(body.dateOfBirth),
        passportNumber: body.passportNumber,
        citizenship: body.citizenship,
        email: body.email,
        phone: body.phone,
        guardianName: body.guardianName,
        guardianEmail: body.guardianEmail,
        transcript: body.transcript || null,
        passportFile: body.passportFile || null,
        diploma: body.diploma || null,
        cv: body.cv || null,
        motivationLetter: body.motivationLetter || null,
        photo: body.photo || null,
        additionalDocs: body.additionalDocs || [],
        consultantId: body.consultantId || null,
        desiredProgramId: body.programId || null,
      },
    });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}