import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.status) data.status = body.status;
    if (body.status) data.isUpdated = false;
    if (body.offerLetter) data.offerLetter = body.offerLetter;
    if (body.finalAdmission) data.finalAdmission = body.finalAdmission;

    const application = await prisma.studentApplication.update({
      where: { id },
      data,
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 
