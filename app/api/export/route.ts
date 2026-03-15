import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let data: Record<string, unknown>[] = [];
    let fileName = "export";

    if (type === "leads") {
      const leads = await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        include: { consultant: true },
      });
      data = leads.map(l => ({
        Prenom: l.firstName,
        Nom: l.lastName,
        Email: l.email,
        Telephone: l.phone,
        Ville: l.city,
        Niveau: l.educationLevel,
        Statut: l.status,
        Source: l.source,
        Universite: l.universityName || "",
        Consultant: l.consultant ? `${l.consultant.firstName} ${l.consultant.lastName}` : "",
        Date: new Date(l.createdAt).toLocaleDateString("fr-FR"),
      }));
      fileName = "leads";
    } else if (type === "students") {
      const students = await prisma.student.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          consultant: true,
          applications: { include: { program: { include: { university: true } } } },
        },
      });
      data = students.map(s => ({
        Prenom: s.firstName,
        Nom: s.lastName,
        Email: s.email,
        Telephone: s.phone,
        Genre: s.gender,
        DateNaissance: new Date(s.dateOfBirth).toLocaleDateString("fr-FR"),
        Passeport: s.passportNumber,
        Nationalite: s.citizenship,
        Statut: s.status,
        Universite: s.applications[0]?.program?.university?.name || "",
        Programme: s.applications[0]?.program?.name || "",
        Agent: s.consultant ? `${s.consultant.firstName} ${s.consultant.lastName}` : "",
        RelevéNotes: s.transcript ? "Oui" : "Non",
        CV: s.cv ? "Oui" : "Non",
        Diplome: s.diploma ? "Oui" : "Non",
        Passeport_Doc: s.passportFile ? "Oui" : "Non",
        LettreMotivation: s.motivationLetter ? "Oui" : "Non",
        Date: new Date(s.createdAt).toLocaleDateString("fr-FR"),
      }));
      fileName = "etudiants";
    } else if (type === "programs") {
      const programs = await prisma.program.findMany({
        orderBy: { university: { name: "asc" } },
        include: { university: { include: { city: { include: { country: true } } } } },
      });
      data = programs.map(p => ({
        Universite: p.university.name,
        Programme: p.name,
        Departement: p.department,
        Niveau: p.degree,
        Langue: p.language,
        Duree: `${p.duration} ans`,
        Prix: p.pricePerYear ? `${p.pricePerYear} ${p.currency}` : "",
        Ville: p.university.city.name,
        Pays: p.university.city.country.name,
      }));
      fileName = "programmes";
    } else {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error exporting:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
