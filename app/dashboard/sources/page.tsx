import { prisma } from "@/lib/prisma";
import SourceForm from "./SourceForm";
import DeleteSourceButton from "./DeleteSourceButton";

export default async function SourcesPage() {
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: "desc" },
  });

  const leadCounts: Record<string, number> = {};
  for (const source of sources) {
    leadCounts[source.id] = await prisma.lead.count({ where: { sourceId: source.id } });
  }

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Gestion des Sources</h1>

      <SourceForm />

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden", marginTop: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Nom</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Plateforme</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Influenceur</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Lien Landing Page</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Leads</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucune source. Creez votre premiere source de tracking.</td></tr>
            ) : (
              sources.map((source) => (
                <tr key={source.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{source.name}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                      backgroundColor: source.platform === "Instagram" ? "#FCE4EC" : source.platform === "Facebook" ? "#E3F2FD" : source.platform === "TikTok" ? "#F3E5F5" : "#FFF3E0",
                      color: source.platform === "Instagram" ? "#C2185B" : source.platform === "Facebook" ? "#1565C0" : source.platform === "TikTok" ? "#7B1FA2" : "#E65100",
                    }}>{source.platform}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{source.influencer || "-"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <code style={{ fontSize: "12px", backgroundColor: "#F5F5F5", padding: "4px 8px", borderRadius: "4px", color: "#001459" }}>/lp/{source.slug}</code>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "700", color: "#001459" }}>{leadCounts[source.id] || 0}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                      backgroundColor: source.isActive ? "#E8F5E9" : "#FFEBEE",
                      color: source.isActive ? "#2E7D32" : "#C62828",
                    }}>{source.isActive ? "Active" : "Inactive"}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <DeleteSourceButton sourceId={source.id} sourceName={source.name} />
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