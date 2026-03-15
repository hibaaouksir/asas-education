import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const program = await prisma.program.update({
      where: { id },
      data: {
        name: body.name,
        department: body.department,
        degree: body.degree,
        language: body.language,
        duration: body.duration,
        pricePerYear: body.pricePerYear || null,
        currency: body.currency || "USD",
      },
    });
    return NextResponse.json(program);
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.program.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

