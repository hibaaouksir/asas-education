import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastSeenLeads: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating lastSeenLeads:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
