import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const university = await prisma.university.update({
      where: { id },
      data: {
        name: body.name,
        website: body.website || null,
        description: body.description || null,
        photo: body.photo || null,
      },
    });
    return NextResponse.json(university);
  } catch (error) {
    console.error("Error updating university:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.university.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting university:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
