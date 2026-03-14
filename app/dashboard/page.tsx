import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [leadCount, studentCount, programCount, universityCount] = await Promise.all([
    prisma.lead.count(),
    prisma.student.count(),
    prisma.program.count(),
    prisma.university.count(),
  ]);

  const stats = [
    { label: "Leads", count: leadCount, color: "#DDBA52" },
    { label: "Etudiants", count: studentCount, color: "#001459" },
    { label: "Programmes", count: programCount, color: "#DD061A" },
    { label: "Universites", count: universityCount, color: "#DDBA52" },
  ];

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>
        Tableau de bord
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            backgroundColor: "white", padding: "24px", borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderLeft: `4px solid ${stat.color}`,
          }}>
            <div style={{ color: "#888", fontSize: "13px", marginBottom: "8px" }}>{stat.label}</div>
            <div style={{ color: "#001459", fontSize: "32px", fontWeight: "800" }}>{stat.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
