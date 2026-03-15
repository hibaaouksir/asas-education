import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const existing = await prisma.studentApplication.findFirst({
      where: { studentId: body.studentId, programId: body.programId },
    });

    if (existing) {
      return NextResponse.json({ error: "Cet etudiant a deja candidate pour ce programme" }, { status: 400 });
    }

    const application = await prisma.studentApplication.create({
      data: {
        studentId: body.studentId,
        programId: body.programId,
        status: "APPLIED",
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
