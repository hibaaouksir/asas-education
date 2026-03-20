import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, department, description, image } = body;

    await prisma.program.updateMany({
      where: { name: { equals: name, mode: "insensitive" } },
      data: {
        department: department || undefined,
        description: description || undefined,
        image: image || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating program group:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
