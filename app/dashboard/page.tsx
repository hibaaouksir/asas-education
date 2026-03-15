import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  const studentCount = await prisma.student.count(
    role === "ADMIN" || role === "APPLICATION" ? {} : { where: { consultantId: userId } }
  );
  const programCount = await prisma.program.count();
  const universityCount = await prisma.university.count();
  const announcementCount = await prisma.announcement.count({ where: { isActive: true } });

  const adminStats = [
    { label: "Leads", count: await prisma.lead.count(), color: "#DDBA52", href: "/dashboard/leads", icon: "📋" },
    { label: "Etudiants", count: studentCount, color: "#001459", href: "/dashboard/students", icon: "🎓" },
    { label: "Consultants", count: await prisma.user.count({ where: { role: "CONSULTANT" } }), color: "#DD061A", href: "/dashboard/consultants", icon: "💼" },
    { label: "Agents", count: await prisma.user.count({ where: { role: "SUB_AGENT" } }), color: "#DDBA52", href: "/dashboard/agents", icon: "👥" },
    { label: "Universites", count: universityCount, color: "#001459", href: "/dashboard/universities", icon: "🏛" },
    { label: "Programmes", count: programCount, color: "#DD061A", href: "/dashboard/programs", icon: "📚" },
  ];

  const agentStats = [
    { label: "Mes Etudiants", count: studentCount, color: "#001459", href: "/dashboard/students", icon: "🎓" },
    { label: "Universites", count: universityCount, color: "#DDBA52", href: "/dashboard/universities", icon: "🏛" },
    { label: "Programmes", count: programCount, color: "#DD061A", href: "/dashboard/search-programs", icon: "🔍" },
    { label: "Annonces", count: announcementCount, color: "#DDBA52", href: "/dashboard/announcements", icon: "📢" },
  ];

  const stats = role === "ADMIN" ? adminStats : agentStats;

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>
        Tableau de bord
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} style={{ textDecoration: "none" }}>
            <div style={{
              backgroundColor: "white", padding: "24px", borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderLeft: `4px solid ${stat.color}`,
              cursor: "pointer",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#888", fontSize: "13px", marginBottom: "8px" }}>{stat.label}</div>
                  <div style={{ color: "#001459", fontSize: "32px", fontWeight: "800" }}>{stat.count}</div>
                </div>
                <div style={{ fontSize: "32px" }}>{stat.icon}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
