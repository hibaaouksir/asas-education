import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const student = await prisma.student.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        gender: body.gender,
        dateOfBirth: new Date(body.dateOfBirth),
        passportNumber: body.passportNumber,
        citizenship: body.citizenship,
        guardianName: body.guardianName,
        guardianEmail: body.guardianEmail,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error updating student info:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
