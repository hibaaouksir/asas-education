import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

