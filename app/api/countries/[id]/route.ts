import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const country = await prisma.country.update({
      where: { id },
      data: { name: body.name, code: body.code, flag: body.flag || null },
    });
    return NextResponse.json(country);
  } catch (error) {
    console.error("Error updating country:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.country.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting country:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

