import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: { applications: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Etudiant non trouve" }, { status: 404 });
    }

    if (student.applications.length > 0) {
      return NextResponse.json({ error: "Cet etudiant a deja une candidature en cours" }, { status: 400 });
    }

    if (!student.desiredProgramId) {
      return NextResponse.json({ error: "Aucun programme selectionne pour cet etudiant" }, { status: 400 });
    }

    const docs = [student.transcript, student.passportFile].filter(Boolean).length;
    if (docs < 2) {
      return NextResponse.json({ error: "Les documents ne sont pas complets. Relevé de notes et passeport sont requis." }, { status: 400 });
    }

    const application = await prisma.studentApplication.create({
      data: {
        studentId: id,
        programId: student.desiredProgramId,
        status: "APPLIED",
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error applying:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
