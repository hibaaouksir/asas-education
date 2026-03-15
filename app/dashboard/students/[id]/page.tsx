import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "../StatusBadge";
import DocumentSection from "./DocumentSection";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      consultant: true,
      applications: { include: { program: { include: { university: { include: { city: { include: { country: true } } } } } } } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!student) return notFound();

  const canChangeStatus = role === "ADMIN" || role === "APPLICATION" || role === "CONSULTANT";
  const canEditDocs = role === "ADMIN" || (role === "SUB_AGENT" && student.consultantId === userId);

  const app = student.applications[0];

  return (
    <div>
      <Link href="/dashboard/students" style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}>← Retour aux etudiants</Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 24px" }}>
        <div>
          <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", margin: "0 0 4px 0" }}>{student.firstName} {student.lastName}</h1>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Ajoute le {new Date(student.createdAt).toLocaleDateString("fr-FR")}</p>
        </div>
        <StatusBadge studentId={student.id} currentStatus={student.status} canChange={canChangeStatus} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Informations personnelles</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <span style={{ fontSize: "12px", color: "#888" }}>Prenom</span>
              <p style={{ fontSize: "14px", color: "#001459", fontWeight: "600", margin: "4px 0 0" }}>{student.firstName}</p>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#888" }}>Nom</span>
              <p style={{ fontSize: "14px", color: "#001459", fontWeight: "600", margin: "4px 0 0" }}>{student.lastName}</p>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#888" }}>Email</span>
              <p style={{ fontSize: "14px", color: "#001459", fontWeight: "600", margin: "4px 0 0" }}>{student.email}</p>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#888" }}>Telephone</span>
              <p style={{ fontSize: "14px", color: "#001459", fontWeight: "600", margin: "4px 0 0" }}>{student.phone}</p>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#888" }}>Genre</span>
              <p style={{ fontSize: "14px", color: "#001459", fontWeight: "600", margin: "4px 0 0" }}>{student.gender === "MALE" ? "Homme" : "Femme"}</p>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#888" }}>Date de naissance</span>
              <p style={{ fontSize: "14px", color: "#001459", fontWeight: "600", margin: "4px 0 0" }}>{new Date(student.dateOfBirth).toLocaleDateString("fr-FR")}</p>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#888" }}>Passeport</span>
              <p style={{ fontSize: "14px", color: "#001459", fontWeight: "600", margin: "4px 0 0" }}>{student.passportNumber}</p>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#888" }}>Nationalite</span>
              <p style={{ fontSize: "14px", color: "#001459", fontWeight: "600", margin: "4px 0 0" }}>{student.citizenship}</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Programme choisi</h3>
          {app ? (
            <div style={{ padding: "16px", backgroundColor: "#F8F9FA", borderRadius: "8px" }}>
              <p style={{ fontSize: "16px", fontWeight: "700", color: "#001459", margin: "0 0 8px" }}>{app.program.university.name}</p>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 4px" }}>{app.program.name} ({app.program.degree})</p>
              <p style={{ fontSize: "13px", color: "#888", margin: "0 0 4px" }}>{app.program.university.city.name}, {app.program.university.city.country.name}</p>
              <p style={{ fontSize: "13px", color: "#888", margin: "0 0 4px" }}>Langue: {app.program.language} | Duree: {app.program.duration} ans</p>
              {app.program.pricePerYear && <p style={{ fontSize: "14px", fontWeight: "600", color: "#DDBA52", margin: "8px 0 0" }}>{app.program.pricePerYear} {app.program.currency}/an</p>}
            </div>
          ) : (
            <p style={{ color: "#888", fontSize: "14px" }}>Aucun programme selectionne</p>
          )}

          <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: "24px 0 12px" }}>Agent</h3>
          {student.consultant ? (
            <p style={{ fontSize: "14px", color: "#001459" }}>{student.consultant.firstName} {student.consultant.lastName} ({student.consultant.email})</p>
          ) : (
            <p style={{ color: "#888", fontSize: "14px" }}>Non assigne</p>
          )}
        </div>
      </div>

      <DocumentSection
        studentId={student.id}
        canEdit={canEditDocs}
        docs={{
          transcript: student.transcript || "",
          passportFile: student.passportFile || "",
          diploma: student.diploma || "",
          cv: student.cv || "",
          motivationLetter: student.motivationLetter || "",
        }}
      />
    </div>
  );
}