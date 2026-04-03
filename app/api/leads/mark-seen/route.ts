import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  
  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastSeenLeads: new Date() },
  });
  
  return NextResponse.json({ success: true });
}
