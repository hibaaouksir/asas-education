import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

export default async function StudentsPage() {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  let students;
  if (role === "ADMIN" || role === "APPLICATION" || role === "CONSULTANT") {
    students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        consultant: true,
        applications: { include: { program: { include: { university: true } } } },
      },
    });
  } else {
    students = await prisma.student.findMany({
      where: { consultantId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        consultant: true,
        applications: { include: { program: { include: { university: true } } } },
      },
    });
  }

  const canChangeStatus = role === "ADMIN" || role === "APPLICATION" || role === "CONSULTANT";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700" }}>
          {role === "ADMIN" ? "Tous les Etudiants" : role === "CONSULTANT" ? "Etudiants" : "Mes Etudiants"}
        </h1>
        {(role === "SUB_AGENT" || role === "ADMIN") && (
          <Link href="/dashboard/students/new" style={{
            background: "linear-gradient(135deg, #DDBA52, #C4A243)",
            color: "#001459", padding: "10px 24px", borderRadius: "8px",
            textDecoration: "none", fontSize: "14px", fontWeight: "700",
          }}>+ Ajouter un etudiant</Link>
        )}
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "visible" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Etudiant</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Email</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Universite</th>
              {(role === "ADMIN" || role === "CONSULTANT") && <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Agent</th>}
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Documents</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun etudiant.</td></tr>
            ) : (
              students.map((student) => {
                const docs = [student.transcript, student.passportFile, student.diploma, student.cv, student.motivationLetter].filter(Boolean).length;
                const uniName = student.applications[0]?.program?.university?.name || "-";
                return (
                  <tr key={student.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{student.firstName} {student.lastName}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{student.email}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{uniName}</td>
                    {(role === "ADMIN" || role === "CONSULTANT") && <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{student.consultant ? `${student.consultant.firstName} ${student.consultant.lastName}` : "-"}</td>}
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