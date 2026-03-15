import { prisma } from "@/lib/prisma";
import AgentForm from "./AgentForm";

export default async function AgentsPage() {
  const agents = await prisma.user.findMany({
    where: { role: "SUB_AGENT" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { students: true } },
    },
  });

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Gestion des Sous-Agents</h1>

      <AgentForm />

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden", marginTop: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Nom</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Email</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Telephone</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Etudiants</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun sous-agent ajoute.</td></tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{agent.firstName} {agent.lastName}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{agent.email}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{agent.phone || "-"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{agent._count.students}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                      backgroundColor: agent.isActive ? "#E8F5E9" : "#FFEBEE",
                      color: agent.isActive ? "#2E7D32" : "#C62828",
                    }}>{agent.isActive ? "Actif" : "Inactif"}</span>
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
