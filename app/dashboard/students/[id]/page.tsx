import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import DocumentSection from "./DocumentSection";
import EditStudentInfo from "./EditStudentInfo";

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
    },
  });

  if (!student) return notFound();

  const canEditDocs = role === "ADMIN" || (role === "SUB_AGENT" && student.consultantId === userId) || (role === "CONSULTANT" && student.consultantId === userId);
  const canEditInfo = canEditDocs;

  const app = student.applications[0];

  // Get desired program info if set
  let desiredProgram = null;
  if (student.desiredProgramId) {
    desiredProgram = await prisma.program.findUnique({
      where: { id: student.desiredProgramId },
      include: { university: { include: { city: { include: { country: true } } } } },
    });
  }

  // Get all programs for the selector
  const programs = canEditInfo ? await prisma.program.findMany({
    include: { university: { include: { city: { include: { country: true } } } } },
    orderBy: { university: { name: "asc" } },
  }) : [];

  const infoIncomplete = !student.passportNumber || !student.citizenship || !student.guardianName || student.dateOfBirth.toISOString().startsWith("2000-01-01");

  return (
    <div>
      <Link href="/dashboard/students" style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}>← Retour aux etudiants</Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 24px" }}>
        <div>
          <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", margin: "0 0 4px 0" }}>{student.firstName} {student.lastName}</h1>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Ajoute le {new Date(student.createdAt).toLocaleDateString("fr-FR")}</p>
        </div>
      </div>

      {infoIncomplete && canEditInfo && (
        <div style={{
          backgroundColor: "#FFF3E0", padding: "16px 20px", borderRadius: "10px",
          borderLeft: "4px solid #E65100", marginBottom: "20px",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <span style={{ fontSize: "20px" }}>⚠️</span>
          <div>
            <p style={{ color: "#E65100", fontSize: "14px", fontWeight: "600", margin: "0 0 2px" }}>Informations incompletes</p>
            <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>Cet etudiant a ete converti depuis un lead. Veuillez completer ses informations personnelles ci-dessous.</p>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        {canEditInfo ? (
          <EditStudentInfo
            studentId={student.id}
            initialData={{
              firstName: student.firstName,
              lastName: student.lastName,
              email: student.email,
              phone: student.phone,
              gender: student.gender,
              dateOfBirth: student.dateOfBirth.toISOString().split("T")[0],
              passportNumber: student.passportNumber,
              citizenship: student.citizenship,
              guardianName: student.guardianName,
              guardianEmail: student.guardianEmail,
              desiredProgramId: student.desiredProgramId || "",
            }}
            programs={programs.map(p => ({
              id: p.id,
              name: p.name,
              degree: p.degree,
              universityName: p.university.name,
              countryName: p.university.city.country.name,
            }))}
          />
        ) : (
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
                <span style={{ fontSize: "12px", color: "#888" }}>Passeport ou CIN</span>
                <p style={{ fontSize: "14px", color: "#001459", fontWeight: "600", margin: "4px 0 0" }}>{student.passportNumber || "-"}</p>
              </div>
              <div>
                <span style={{ fontSize: "12px", color: "#888" }}>Nationalite</span>
                <p style={{ fontSize: "14px", color: "#001459", fontWeight: "600", margin: "4px 0 0" }}>{student.citizenship || "-"}</p>
              </div>
            </div>
          </div>
        )}

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
          ) : desiredProgram ? (
            <div style={{ padding: "16px", backgroundColor: "#F8F9FA", borderRadius: "8px" }}>
              <p style={{ fontSize: "16px", fontWeight: "700", color: "#001459", margin: "0 0 8px" }}>{desiredProgram.university.name}</p>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 4px" }}>{desiredProgram.name} ({desiredProgram.degree})</p>
              <p style={{ fontSize: "13px", color: "#888", margin: "0 0 4px" }}>{desiredProgram.university.city.name}, {desiredProgram.university.city.country.name}</p>
              <p style={{ fontSize: "13px", color: "#888", margin: "0 0 4px" }}>Langue: {desiredProgram.language} | Duree: {desiredProgram.duration} ans</p>
              {desiredProgram.pricePerYear && <p style={{ fontSize: "14px", fontWeight: "600", color: "#DDBA52", margin: "8px 0 0" }}>{desiredProgram.pricePerYear} {desiredProgram.currency}/an</p>}
              <p style={{ fontSize: "11px", color: "#E65100", marginTop: "8px", fontStyle: "italic" }}>Programme souhaite (candidature pas encore envoyee)</p>
            </div>
          ) : (
            <p style={{ color: "#888", fontSize: "14px" }}>Aucun programme selectionne. Choisissez un programme dans le formulaire a gauche.</p>
          )}

          <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: "24px 0 12px" }}>Agent / Consultant</h3>
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
          photo: student.photo || "",
        }}
      />
    </div>
  );
}
