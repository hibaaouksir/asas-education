import { prisma } from "@/lib/prisma";
import UserForm from "./UserForm";
import UserActions from "./UserActions";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { assignedLeads: true, students: true } },
    },
  });

  const roleConfig: Record<string, { label: string; bg: string; color: string }> = {
    ADMIN: { label: "Admin", bg: "#FFEBEE", color: "#C62828" },
    APPLICATION: { label: "Application", bg: "#F3E5F5", color: "#7B1FA2" },
    CONSULTANT: { label: "Consultant", bg: "#E3F2FD", color: "#1565C0" },
    SUB_AGENT: { label: "Sous-Agent", bg: "#FFF3E0", color: "#E65100" },
  };

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Gestion des Utilisateurs</h1>

      <UserForm />

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "visible", marginTop: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Nom</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Email</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Telephone</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Role</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Leads</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Etudiants</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun utilisateur.</td></tr>
            ) : (
              users.map((user) => {
                const config = roleConfig[user.role] || roleConfig.CONSULTANT;
                return (
                  <tr key={user.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{user.firstName} {user.lastName}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{user.email}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{user.phone || "-"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                        backgroundColor: config.bg, color: config.color,
                      }}>{config.label}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{user._count.assignedLeads}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{user._count.students}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                        backgroundColor: user.isActive ? "#E8F5E9" : "#FFEBEE",
                        color: user.isActive ? "#2E7D32" : "#C62828",
                      }}>{user.isActive ? "Actif" : "Inactif"}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <UserActions userId={user.id} userName={`${user.firstName} ${user.lastName}`} currentRole={user.role} isActive={user.isActive} />
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