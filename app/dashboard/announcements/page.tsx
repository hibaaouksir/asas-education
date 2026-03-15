import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import AnnouncementForm from "./AnnouncementForm";

export default async function AnnouncementsPage() {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  const announcements = await prisma.announcement.findMany({
    where: role === "ADMIN" || role === "APPLICATION" ? {} : { isActive: true },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700" }}>Annonces</h1>
      </div>

      {(role === "ADMIN" || role === "APPLICATION") && (
        <AnnouncementForm userId={userId || ""} />
      )}

      {announcements.length === 0 ? (
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "12px", textAlign: "center", color: "#888", fontSize: "14px" }}>
          Aucune annonce pour le moment.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
          {announcements.map((ann) => (
            <div key={ann.id} style={{
              backgroundColor: "white", padding: "24px", borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderLeft: "4px solid #DDBA52",
              position: "relative",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: "0 0 4px" }}>{ann.title}</h3>
                  <span style={{ color: "#888", fontSize: "12px" }}>
                    {new Date(ann.createdAt).toLocaleDateString("fr-FR")} par {ann.author.firstName} {ann.author.lastName}
                  </span>
                </div>
                {(role === "ADMIN" || role === "APPLICATION") && (
                  <span style={{
                    padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                    backgroundColor: ann.isActive ? "#E8F5E9" : "#FFEBEE",
                    color: ann.isActive ? "#2E7D32" : "#C62828",
                  }}>{ann.isActive ? "Active" : "Inactive"}</span>
                )}
              </div>
              <p style={{ color: "#444", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>{ann.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
