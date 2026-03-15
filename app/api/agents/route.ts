import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ error: "Cet email existe deja" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        phone: body.phone || null,
        role: body.role === "SUB_AGENT" ? "SUB_AGENT" : "CONSULTANT",
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
