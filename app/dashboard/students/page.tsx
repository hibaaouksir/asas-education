import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import ApplyButton from "./ApplyButton";
import DeleteStudentButton from "./DeleteStudentButton";

export default async function StudentsPage() {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  let students;
  let title = "Etudiants";

  if (role === "ADMIN" || role === "APPLICATION") {
    students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        consultant: true,
        applications: { include: { program: { include: { university: true } } } },
      },
    });
    title = role === "ADMIN" ? "Tous les Etudiants" : "Etudiants";
  } else {
    students = await prisma.student.findMany({
      where: { consultantId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        consultant: true,
        applications: { include: { program: { include: { university: true } } } },
      },
    });
    title = "Mes Etudiants";
  }

  const canAddStudent = role === "SUB_AGENT" || role === "ADMIN" || role === "CONSULTANT";
  const canApply = role === "SUB_AGENT" || role === "CONSULTANT";
  const canDelete = role === "SUB_AGENT" || role === "ADMIN";
  const showSource = role === "ADMIN" || role === "APPLICATION";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700" }}>{title}</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          {canAddStudent && (
            <Link href="/dashboard/students/new" style={{
              background: "linear-gradient(135deg, #DDBA52, #C4A243)",
              color: "#001459", padding: "10px 24px", borderRadius: "8px",
              textDecoration: "none", fontSize: "14px", fontWeight: "700",
            }}>+ Ajouter un etudiant</Link>
          )}
        </div>
      </div>

      {(role === "ADMIN" || role === "SUB_AGENT") && (
        <div style={{ marginBottom: "16px" }}>
          <a href="/api/export?type=students" style={{
            padding: "8px 16px", borderRadius: "8px", border: "1px solid #2E7D32",
            backgroundColor: "transparent", color: "#2E7D32", fontSize: "13px",
            fontWeight: "600", textDecoration: "none",
          }}>Export Excel</a>
        </div>
      )}

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "visible" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Etudiant</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Email</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Telephone</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Universite</th>
              {showSource && <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Source</th>}
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Documents</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Candidature</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={showSource ? 8 : 7} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun etudiant.</td></tr>
            ) : (
              students.map((student) => {
                const docs = [student.transcript, student.passportFile, student.diploma, student.cv, student.motivationLetter].filter(Boolean).length;
                const uniName = student.applications[0]?.program?.university?.name || "-";
                const hasApplication = student.applications.length > 0;
                const hasPhoto = !!student.photo;
                const infoComplete = !!student.passportNumber && student.passportNumber !== "" && !!student.citizenship && student.citizenship !== "" && !!student.guardianName && student.guardianName !== "" && student.gender !== "OTHER" && !student.dateOfBirth.toISOString().startsWith("2000-01-01");
            
                const docsComplete = docs >= 5 && hasPhoto && infoComplete;
                return (
                  <tr key={student.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {student.photo ? (
                          <img src={student.photo} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "2px solid #DDBA52" }} />
                        ) : (
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#ccc" }}>👤</div>
                        )}
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#001459" }}>{student.firstName} {student.lastName}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{student.email}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{student.phone}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{uniName}</td>
                    {showSource && (
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                          backgroundColor: student.consultant ? "#E3F2FD" : "#FFF3E0",
                          color: student.consultant ? "#1565C0" : "#E65100",
                        }}>{student.consultant ? `${student.consultant.firstName} ${student.consultant.lastName}` : "Site web"}</span>
                      </td>
                    )}
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", backgroundColor: docs >= 4 ? "#E8F5E9" : docs >= 2 ? "#FFF3E0" : "#FFEBEE", color: docs >= 4 ? "#2E7D32" : docs >= 2 ? "#E65100" : "#C62828" }}>{docs}/5 docs</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {canApply && !hasApplication && (
                        <ApplyButton studentId={student.id} studentName={`${student.firstName} ${student.lastName}`} docsComplete={docsComplete} />
                      )}
                      {hasApplication && (
                        <span style={{ padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "600", backgroundColor: "#E8F5E9", color: "#2E7D32" }}>Envoyee</span>
                      )}
                      {canApply && !hasApplication && !docsComplete && (
                        <span style={{ fontSize: "10px", color: "#C62828", display: "block", marginTop: "4px" }}>{docs < 5 ? "Docs incomplets" : !hasPhoto ? "Photo manquante" : "Infos incompletes"}</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <Link href={`/dashboard/students/${student.id}`} style={{
                          padding: "6px 14px", borderRadius: "6px", border: "1px solid #DDBA52",
                          color: "#DDBA52", textDecoration: "none", fontWeight: "600", fontSize: "12px",
                        }}>Voir</Link>
                        {canDelete && (
                          <DeleteStudentButton studentId={student.id} studentName={`${student.firstName} ${student.lastName}`} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}