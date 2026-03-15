import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./LogoutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user.role;

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "📊", roles: ["ADMIN", "APPLICATION", "CONSULTANT", "SUB_AGENT"] },
    { label: "Leads", href: "/dashboard/leads", icon: "📋", roles: ["ADMIN", "CONSULTANT"] },
    { label: "Etudiants", href: "/dashboard/students", icon: "🎓", roles: ["ADMIN", "APPLICATION", "CONSULTANT", "SUB_AGENT"] },
    { label: "Candidatures", href: "/dashboard/applications", icon: "📄", roles: ["ADMIN", "APPLICATION", "CONSULTANT", "SUB_AGENT"] },
    { label: "Consultants", href: "/dashboard/consultants", icon: "💼", roles: ["ADMIN"] },
    { label: "Agents", href: "/dashboard/agents", icon: "👥", roles: ["ADMIN"] },
    { label: "Pays", href: "/dashboard/countries", icon: "🌍", roles: ["ADMIN"] },
    { label: "Universites", href: "/dashboard/universities", icon: "🏛", roles: ["ADMIN", "CONSULTANT", "SUB_AGENT"] },
    { label: "Recherche Programme", href: "/dashboard/search-programs", icon: "🔍", roles: ["CONSULTANT", "SUB_AGENT"] },
    { label: "Programmes", href: "/dashboard/programs", icon: "📚", roles: ["ADMIN"] },
    { label: "Blog", href: "/dashboard/blog", icon: "✏️", roles: ["ADMIN", "APPLICATION"] },
    { label: "Annonces", href: "/dashboard/announcements", icon: "📢", roles: ["ADMIN", "APPLICATION", "CONSULTANT", "SUB_AGENT"] },
  ];

  const visibleItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <aside style={{
        width: "260px", backgroundColor: "#001459", padding: "20px 0",
        display: "flex", flexDirection: "column", position: "fixed",
        top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Image src="/images/logo.png" alt="ASAS" width={40} height={40} style={{ objectFit: "contain" }} />
            <div>
              <div style={{ color: "#DDBA52", fontSize: "14px", fontWeight: "700", letterSpacing: "1px" }}>ASAS</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>FOR EDUCATION</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {visibleItems.map((item) => (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 16px", borderRadius: "8px",
              color: "rgba(255,255,255,0.65)", textDecoration: "none",
              fontSize: "13px", fontWeight: "500",
            }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{session.user.name}</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "2px" }}>{role}</div>
        </div>
      </aside>
      <main style={{ flex: 1, marginLeft: "260px", backgroundColor: "#F5F6FA", minHeight: "100vh" }}>
        <header style={{
          backgroundColor: "white", padding: "16px 32px", borderBottom: "1px solid #E8E8E8",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontSize: "14px", color: "#888" }}>
            Bienvenue, <span style={{ color: "#001459", fontWeight: "600" }}>{session.user.name}</span>
          </div>
          <LogoutButton />
        </header>
        <div style={{ padding: "32px" }}>{children}</div>
      </main>
    </div>
  );
}
