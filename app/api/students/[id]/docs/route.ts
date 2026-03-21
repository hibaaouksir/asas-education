import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { field, url } = body;

    // Handle additionalDocs (array field - push new doc)
    if (field === "additionalDocs") {
      const student = await prisma.student.update({
        where: { id },
        data: { additionalDocs: { push: url } },
      });
      await prisma.studentApplication.updateMany({ where: { studentId: id }, data: { isUpdated: true } });
      return NextResponse.json(student);
    }

    const allowedFields = ["transcript", "passportFile", "diploma", "cv", "motivationLetter", "photo"];
    if (!allowedFields.includes(field)) {
      return NextResponse.json({ error: "Champ invalide" }, { status: 400 });
    }

    const student = await prisma.student.update({
      where: { id },
      data: { [field]: url },
    });
    await prisma.studentApplication.updateMany({ where: { studentId: id }, data: { isUpdated: true } });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { url } = body;

    const student = await prisma.student.findUnique({ where: { id }, select: { additionalDocs: true } });
    if (!student) return NextResponse.json({ error: "Etudiant introuvable" }, { status: 404 });

    const updated = await prisma.student.update({
      where: { id },
      data: { additionalDocs: student.additionalDocs.filter((d: string) => d !== url) },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
