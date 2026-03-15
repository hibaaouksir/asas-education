import { prisma } from "@/lib/prisma";
import ConsultantForm from "./ConsultantForm";

export default async function ConsultantsPage() {
  const consultants = await prisma.user.findMany({
    where: { role: "CONSULTANT" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { assignedLeads: true, students: true } },
    },
  });

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Gestion des Consultants</h1>

      <ConsultantForm />

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden", marginTop: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Nom</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Email</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Telephone</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Leads</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Etudiants</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {consultants.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun consultant ajoute.</td></tr>
            ) : (
              consultants.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{c.firstName} {c.lastName}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{c.email}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{c.phone || "-"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{c._count.assignedLeads}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{c._count.students}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                      backgroundColor: c.isActive ? "#E8F5E9" : "#FFEBEE",
                      color: c.isActive ? "#2E7D32" : "#C62828",
                    }}>{c.isActive ? "Actif" : "Inactif"}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}