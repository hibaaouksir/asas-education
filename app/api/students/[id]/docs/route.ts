import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { field, url } = body;

    const allowedFields = ["transcript", "passportFile", "diploma", "cv", "motivationLetter", "photo"];
    if (!allowedFields.includes(field)) {
      return NextResponse.json({ error: "Champ invalide" }, { status: 400 });
    }

    const student = await prisma.student.update({
      where: { id },
      data: { [field]: url },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

