import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

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
    title = "Tous les Etudiants";
  } else if (role === "CONSULTANT") {
    students = await prisma.student.findMany({
      where: { consultantId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        consultant: true,
        applications: { include: { program: { include: { university: true } } } },
      },
    });
    title = "Mes Etudiants";
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

  const canChangeStatus = role === "ADMIN" || role === "APPLICATION" || role === "CONSULTANT";
  const canAddStudent = role === "SUB_AGENT" || role === "ADMIN" || role === "CONSULTANT";
  const showSource = role === "ADMIN";

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
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Universite</th>
              {showSource && <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Source</th>}
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Documents</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={showSource ? 7 : 6} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun etudiant.</td></tr>
            ) : (
              students.map((student) => {
                const docs = [student.transcript, student.passportFile, student.diploma, student.cv, student.motivationLetter].filter(Boolean).length;
                const uniName = student.applications[0]?.program?.university?.name || "-";
                return (
                  <tr key={student.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{student.firstName} {student.lastName}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{student.email}</td>
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
                      <StatusBadge studentId={student.id} currentStatus={student.status} canChange={canChangeStatus} />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Link href={`/dashboard/students/${student.id}`} style={{ color: "#DDBA52", textDecoration: "none", fontWeight: "600", fontSize: "13px" }}>Voir</Link>
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
