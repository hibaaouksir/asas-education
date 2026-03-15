import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const student = await prisma.student.update({
      where: { id },
      data: { status: body.status },
    });
    return NextResponse.json(student);
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

