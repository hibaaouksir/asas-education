import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    const programs = await prisma.program.findMany({ where: { name: { equals: name, mode: "insensitive" } }, select: { id: true } });
    const programIds = programs.map(p => p.id);

    await prisma.student.updateMany({ where: { desiredProgramId: { in: programIds } }, data: { desiredProgramId: null } });
    await prisma.studentApplication.deleteMany({ where: { programId: { in: programIds } } });
    await prisma.program.deleteMany({ where: { name: { equals: name, mode: "insensitive" } } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting program group:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
