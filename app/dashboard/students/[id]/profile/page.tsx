import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const role = session?.user?.role;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      consultant: true,
      applications: { include: { program: { include: { university: { include: { city: { include: { country: true } } } } } } } },
      desiredProgram: { include: { university: { include: { city: { include: { country: true } } } } } },
    },
  });

  if (!student) return notFound();

  const program = student.applications[0]?.program || student.desiredProgram;
  const university = program?.university;

  const docs = [
    { label: "Releve de notes", url: student.transcript, required: true },
    { label: "Passeport", url: student.passportFile, required: true },
    { label: "Diplome", url: student.diploma, required: false },
    { label: "CV", url: student.cv, required: false },
    { label: "Lettre de motivation", url: student.motivationLetter, required: false },
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div>
      <Link href="/dashboard/students" style={{ color: "#888", textDecoration: "none", fontSize: "13px", display: "block", marginBottom: "20px" }}>
        ← Retour aux etudiants
      </Link>

      {/* Header with photo */}
      <div style={{
        backgroundColor: "white", borderRadius: "16px", overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #001459, #002080)", padding: "40px 32px",
          display: "flex", alignItems: "center", gap: "24px",
        }}>
          {student.photo ? (
            <img src={student.photo} alt="" style={{
              width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover",
              border: "3px solid #DDBA52", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }} />
          ) : (
            <div style={{
              width: "100px", height: "100px", borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.1)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "36px", color: "rgba(255,255,255,0.4)",
              border: "3px solid rgba(255,255,255,0.2)",
            }}>👤</div>
          )}
          <div>
            <h1 style={{ color: "white", fontSize: "28px", fontWeight: "800", margin: "0 0 6px" }}>
              {student.firstName} {student.lastName}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: "0 0 4px" }}>{student.email}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>
              Ajoute le {formatDate(student.createdAt)}
            </p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            {student.applications.length > 0 ? (
              <span style={{
                padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                backgroundColor: "#E8F5E9", color: "#2E7D32",
              }}>Candidature envoyee</span>
            ) : (
              <span style={{
                padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                backgroundColor: "#FFF3E0", color: "#E65100",
              }}>En attente</span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Informations personnelles */}
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>Informations personnelles</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { label: "Prenom", value: student.firstName },
              { label: "Nom", value: student.lastName },
              { label: "Email", value: student.email },
              { label: "Telephone", value: student.phone },
              { label: "Genre", value: student.gender === "MALE" ? "Homme" : student.gender === "FEMALE" ? "Femme" : "Non specifie" },
              { label: "Date de naissance", value: formatDate(student.dateOfBirth) },
              { label: "Passeport ou CIN", value: student.passportNumber || "Non renseigne" },
              { label: "Nationalite", value: student.citizenship || "Non renseigne" },
              { label: "Nom du tuteur", value: student.guardianName || "Non renseigne" },
              { label: "Email du tuteur", value: student.guardianEmail || "Non renseigne" },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ fontSize: "11px", color: "#888", fontWeight: "600", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.3px" }}>{item.label}</p>
                <p style={{ fontSize: "14px", color: "#001459", fontWeight: "500", margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Programme & Agent */}
        <div>
          {program && (
            <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
              <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Programme</h3>
              <div style={{ borderLeft: "3px solid #DDBA52", paddingLeft: "16px" }}>
                <p style={{ fontSize: "16px", fontWeight: "700", color: "#001459", margin: "0 0 4px" }}>{university?.name}</p>
                <p style={{ fontSize: "14px", color: "#333", margin: "0 0 4px" }}>{program.name} ({program.degree})</p>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>
                  {university?.city?.name}, {university?.city?.country?.name}
                </p>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 8px" }}>
                  Langue: {program.language} | Duree: {program.duration} ans
                </p>
                {program.pricePerYear && (
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "#DDBA52", margin: 0 }}>
                    {program.pricePerYear} {program.currency}/an
                  </p>
                )}
              </div>
            </div>
          )}

          {student.consultant && (
            <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>Agent / Consultant</h3>
              <p style={{ fontSize: "14px", color: "#001459", margin: 0 }}>
                {student.consultant.firstName} {student.consultant.lastName} ({student.consultant.email})
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "24px" }}>
        <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Documents</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
          {docs.map((doc, i) => (
            <div key={i} style={{
              padding: "16px", borderRadius: "8px", textAlign: "center",
              backgroundColor: doc.url ? "#E8F5E9" : "#F5F5F5",
              border: doc.url ? "1px solid #C8E6C9" : "1px solid #E0E0E0",
            }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{doc.url ? "✅" : "❌"}</div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: doc.url ? "#2E7D32" : "#888", margin: "0 0 8px" }}>
                {doc.label} {doc.required && <span style={{ color: "#C62828" }}>*</span>}
              </p>
              {doc.url && (
                <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: "11px", color: "#1565C0", textDecoration: "none", fontWeight: "600",
                }}>Telecharger</a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Autres documents */}
      {student.additionalDocs && student.additionalDocs.length > 0 && (
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Autres documents</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
            {student.additionalDocs.map((url: string, index: number) => (
              <div key={index} style={{
                padding: "14px", borderRadius: "8px", backgroundColor: "#E8F5E9",
                border: "1px solid #C8E6C9", display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span style={{ fontSize: "18px" }}>📎</span>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "#2E7D32", margin: "0 0 4px" }}>Document {index + 1}</p>
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: "11px", color: "#1565C0", textDecoration: "none", fontWeight: "600",
                  }}>Telecharger</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

