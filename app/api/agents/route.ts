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

    const allowedRoles = ["ADMIN", "APPLICATION", "CONSULTANT", "SUB_AGENT"];
    const role = allowedRoles.includes(body.role) ? body.role : "CONSULTANT";

    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        phone: body.phone || null,
        role: role,
      },
    });
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.firstName) data.firstName = body.firstName;
    if (body.lastName) data.lastName = body.lastName;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.role) {
      const allowedRoles = ["ADMIN", "APPLICATION", "CONSULTANT", "SUB_AGENT"];
      if (allowedRoles.includes(body.role)) data.role = body.role;
    }
    if (body.isActive !== undefined) data.isActive = body.isActive;

    const user = await prisma.user.update({
      where: { id: body.id },
      data,
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}