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
  const leadCount = role === "ADMIN" 
    ? await prisma.lead.count() 
    : await prisma.lead.count({ where: { consultantId: userId } });
  const consultantCount = role === "ADMIN" ? await prisma.user.count({ where: { role: "CONSULTANT" } }) : 0;
  const agentCount = role === "ADMIN" ? await prisma.user.count({ where: { role: "SUB_AGENT" } }) : 0;
  const applicationCount = role === "ADMIN" ? await prisma.user.count({ where: { role: "APPLICATION" } }) : 0;

  const appCounts = (role === "ADMIN" || role === "APPLICATION") ? {
    applied: await prisma.studentApplication.count({ where: { status: "APPLIED" } }),
    received: await prisma.studentApplication.count({ where: { status: "RECEIVED" } }),
    offerLetter: await prisma.studentApplication.count({ where: { status: "OFFER_LETTER" } }),
    paid: await prisma.studentApplication.count({ where: { status: "PAID" } }),
    finalAdmission: await prisma.studentApplication.count({ where: { status: "FINAL_ADMISSION" } }),
    total: await prisma.studentApplication.count(),
  } : null;

  const recentLeads = role === "ADMIN" || role === "CONSULTANT" 
    ? await prisma.lead.findMany({
        where: role === "ADMIN" ? {} : { consultantId: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { consultant: true },
      })
    : [];

  const recentStudents = await prisma.student.findMany({
    where: role === "ADMIN" || role === "APPLICATION" ? {} : { consultantId: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentApplications = (role === "APPLICATION") 
    ? await prisma.studentApplication.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { student: true, program: { include: { university: true } } },
      })
    : [];

  // Admin layout
  if (role === "ADMIN") {
    return (
      <div>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: "#001459", fontSize: "28px", fontWeight: "800", margin: "0 0 6px" }}>Tableau de bord</h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Vue d ensemble de la plateforme ASAS</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Leads", count: leadCount, color: "#DDBA52", href: "/dashboard/leads", icon: "📋", sub: "Demandes recues" },
            { label: "Etudiants", count: studentCount, color: "#001459", href: "/dashboard/students", icon: "🎓", sub: "Inscrits" },
           { label: "Utilisateurs", count: consultantCount + agentCount + applicationCount, color: "#DD061A", href: "/dashboard/users", icon: "👥", sub: "Consultants, Agents & Application" },
            { label: "Universites", count: universityCount, color: "#001459", href: "/dashboard/universities", icon: "🏛", sub: "Partenaires" },
            { label: "Programmes", count: programCount, color: "#DD061A", href: "/dashboard/programs", icon: "📚", sub: "Disponibles" },
          ].map((stat, i) => (
            <Link key={i} href={stat.href} style={{ textDecoration: "none" }}>
              <div style={{
                backgroundColor: "white", padding: "20px", borderRadius: "14px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)", borderLeft: `4px solid ${stat.color}`,
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "#999", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>{stat.label}</p>
                    <p style={{ color: "#001459", fontSize: "30px", fontWeight: "800", margin: "0 0 2px", lineHeight: 1 }}>{stat.count}</p>
                    <p style={{ color: "#bbb", fontSize: "11px", margin: 0 }}>{stat.sub}</p>
                  </div>
                  <span style={{ fontSize: "28px", opacity: 0.8 }}>{stat.icon}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "#001459", fontSize: "15px", fontWeight: "700", margin: 0 }}>Derniers Leads</h3>
              <Link href="/dashboard/leads" style={{ color: "#DDBA52", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>Voir tout →</Link>
            </div>
            {recentLeads.length === 0 ? (
              <p style={{ padding: "30px", textAlign: "center", color: "#bbb", fontSize: "13px" }}>Aucun lead</p>
            ) : (
              recentLeads.map((lead, i) => (
                <div key={lead.id} style={{ padding: "12px 20px", borderBottom: i < recentLeads.length - 1 ? "1px solid #f8f8f8" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#001459", margin: "0 0 2px" }}>{lead.firstName} {lead.lastName}</p>
                    <p style={{ fontSize: "11px", color: "#999", margin: 0 }}>{lead.email}</p>
                  </div>
                  <span style={{
                    padding: "3px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "700",
                    backgroundColor: lead.status === "NEW" ? "#E3F2FD" : lead.status === "DEAL" ? "#E8F5E9" : "#FFF3E0",
                    color: lead.status === "NEW" ? "#1565C0" : lead.status === "DEAL" ? "#2E7D32" : "#E65100",
                  }}>{lead.status}</span>
                </div>
              ))
            )}
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "#001459", fontSize: "15px", fontWeight: "700", margin: 0 }}>Derniers Etudiants</h3>
              <Link href="/dashboard/students" style={{ color: "#DDBA52", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>Voir tout →</Link>
            </div>
            {recentStudents.length === 0 ? (
              <p style={{ padding: "30px", textAlign: "center", color: "#bbb", fontSize: "13px" }}>Aucun etudiant</p>
            ) : (
              recentStudents.map((student, i) => (
                <div key={student.id} style={{ padding: "12px 20px", borderBottom: i < recentStudents.length - 1 ? "1px solid #f8f8f8" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#001459", margin: "0 0 2px" }}>{student.firstName} {student.lastName}</p>
                    <p style={{ fontSize: "11px", color: "#999", margin: 0 }}>{student.email}</p>
                  </div>
                  <span style={{
                    padding: "3px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "700",
                    backgroundColor: student.status === "EN_ATTENTE" ? "#FFF3E0" : student.status === "VALIDE" ? "#E8F5E9" : "#E3F2FD",
                    color: student.status === "EN_ATTENTE" ? "#E65100" : student.status === "VALIDE" ? "#2E7D32" : "#1565C0",
                  }}>{student.status.replace("_", " ")}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // APPLICATION layout
  if (role === "APPLICATION") {
    return (
      <div>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: "#001459", fontSize: "28px", fontWeight: "800", margin: "0 0 6px" }}>Bienvenue, {session?.user?.name?.split(" ")[0]}</h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Gerez les candidatures et le suivi des admissions</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <Link href="/dashboard/applications" style={{ textDecoration: "none" }}>
            <div style={{
              background: "linear-gradient(135deg, #7B1FA2, #9C27B0)", padding: "28px",
              borderRadius: "16px", color: "white", cursor: "pointer", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "120px", opacity: 0.06 }}>📄</div>
              <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.7, margin: "0 0 8px" }}>Candidatures</p>
              <p style={{ fontSize: "42px", fontWeight: "800", margin: "0 0 4px", lineHeight: 1 }}>{appCounts?.total || 0}</p>
              <p style={{ fontSize: "12px", opacity: 0.5, margin: 0 }}>Total des candidatures</p>
            </div>
          </Link>
          <Link href="/dashboard/students" style={{ textDecoration: "none" }}>
            <div style={{
              backgroundColor: "white", padding: "28px", borderRadius: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer",
              borderTop: "4px solid #001459",
            }}>
              <span style={{ fontSize: "28px" }}>🎓</span>
              <p style={{ color: "#001459", fontSize: "36px", fontWeight: "800", margin: "8px 0 2px", lineHeight: 1 }}>{studentCount}</p>
              <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>Etudiants</p>
            </div>
          </Link>
          <Link href="/dashboard/announcements" style={{ textDecoration: "none" }}>
            <div style={{
              backgroundColor: "white", padding: "28px", borderRadius: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer",
              borderTop: "4px solid #DD061A",
            }}>
              <span style={{ fontSize: "28px" }}>📢</span>
              <p style={{ color: "#001459", fontSize: "36px", fontWeight: "800", margin: "8px 0 2px", lineHeight: 1 }}>{announcementCount}</p>
              <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>Annonces</p>
            </div>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Applied", count: appCounts?.applied || 0, bg: "#E3F2FD", color: "#1565C0" },
            { label: "Received", count: appCounts?.received || 0, bg: "#FFF3E0", color: "#E65100" },
            { label: "Offer Letter", count: appCounts?.offerLetter || 0, bg: "#F3E5F5", color: "#7B1FA2" },
            { label: "Paid", count: appCounts?.paid || 0, bg: "#E8F5E9", color: "#2E7D32" },
            { label: "Final Admission", count: appCounts?.finalAdmission || 0, bg: "#E8F5E9", color: "#1B5E20" },
          ].map((stat, i) => (
            <Link key={i} href="/dashboard/applications" style={{ textDecoration: "none" }}>
              <div style={{
                backgroundColor: "white", padding: "16px", borderRadius: "12px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)", textAlign: "center", cursor: "pointer",
              }}>
                <p style={{ fontSize: "24px", fontWeight: "800", color: stat.color, margin: "0 0 4px" }}>{stat.count}</p>
                <span style={{
                  padding: "3px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "600",
                  backgroundColor: stat.bg, color: stat.color,
                }}>{stat.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ color: "#001459", fontSize: "15px", fontWeight: "700", margin: 0 }}>Dernieres Candidatures</h3>
            <Link href="/dashboard/applications" style={{ color: "#DDBA52", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>Voir tout →</Link>
          </div>
          {recentApplications.length === 0 ? (
            <p style={{ padding: "30px", textAlign: "center", color: "#bbb", fontSize: "13px" }}>Aucune candidature</p>
          ) : (
            recentApplications.map((app, i) => (
              <div key={app.id} style={{ padding: "12px 20px", borderBottom: i < recentApplications.length - 1 ? "1px solid #f8f8f8" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "#001459", margin: "0 0 2px" }}>{app.student.firstName} {app.student.lastName}</p>
                  <p style={{ fontSize: "11px", color: "#999", margin: 0 }}>{app.program.university.name} - {app.program.name}</p>
                </div>
                <span style={{
                  padding: "3px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "700",
                  backgroundColor: app.status === "APPLIED" ? "#E3F2FD" : app.status === "RECEIVED" ? "#FFF3E0" : app.status === "OFFER_LETTER" ? "#F3E5F5" : "#E8F5E9",
                  color: app.status === "APPLIED" ? "#1565C0" : app.status === "RECEIVED" ? "#E65100" : app.status === "OFFER_LETTER" ? "#7B1FA2" : "#2E7D32",
                }}>{app.status.replace("_", " ")}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Consultant layout
  if (role === "CONSULTANT") {
    const consultantLeadCount = await prisma.lead.count({ where: { consultantId: userId } });
    return (
      <div>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: "#001459", fontSize: "28px", fontWeight: "800", margin: "0 0 6px" }}>Bienvenue, {session?.user?.name?.split(" ")[0]}</h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Voici un apercu de votre activite</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <Link href="/dashboard/leads" style={{ textDecoration: "none" }}>
            <div style={{
              background: "linear-gradient(135deg, #001459, #002080)", padding: "28px",
              borderRadius: "16px", color: "white", cursor: "pointer", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "120px", opacity: 0.06 }}>📋</div>
              <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.7, margin: "0 0 8px" }}>Mes Leads</p>
              <p style={{ fontSize: "42px", fontWeight: "800", margin: "0 0 4px", lineHeight: 1 }}>{consultantLeadCount}</p>
              <p style={{ fontSize: "12px", opacity: 0.5, margin: 0 }}>Demandes a traiter</p>
            </div>
          </Link>
          <Link href="/dashboard/students" style={{ textDecoration: "none" }}>
            <div style={{
              backgroundColor: "white", padding: "28px", borderRadius: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer",
              borderTop: "4px solid #DDBA52",
            }}>
              <span style={{ fontSize: "28px" }}>🎓</span>
              <p style={{ color: "#001459", fontSize: "36px", fontWeight: "800", margin: "8px 0 2px", lineHeight: 1 }}>{studentCount}</p>
              <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>Etudiants</p>
            </div>
          </Link>
          <Link href="/dashboard/announcements" style={{ textDecoration: "none" }}>
            <div style={{
              backgroundColor: "white", padding: "28px", borderRadius: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer",
              borderTop: "4px solid #DD061A",
            }}>
              <span style={{ fontSize: "28px" }}>📢</span>
              <p style={{ color: "#001459", fontSize: "36px", fontWeight: "800", margin: "8px 0 2px", lineHeight: 1 }}>{announcementCount}</p>
              <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>Annonces</p>
            </div>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <Link href="/dashboard/search-programs" style={{ textDecoration: "none" }}>
            <div style={{
              backgroundColor: "white", padding: "20px", borderRadius: "14px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "16px",
            }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🔍</div>
              <div>
                <p style={{ color: "#001459", fontSize: "15px", fontWeight: "700", margin: "0 0 2px" }}>Recherche Programme</p>
                <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>{programCount} programmes disponibles</p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/universities" style={{ textDecoration: "none" }}>
            <div style={{
              backgroundColor: "white", padding: "20px", borderRadius: "14px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "16px",
            }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🏛</div>
              <div>
                <p style={{ color: "#001459", fontSize: "15px", fontWeight: "700", margin: "0 0 2px" }}>Universites</p>
                <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>{universityCount} universites partenaires</p>
              </div>
            </div>
          </Link>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ color: "#001459", fontSize: "15px", fontWeight: "700", margin: 0 }}>Derniers Leads</h3>
            <Link href="/dashboard/leads" style={{ color: "#DDBA52", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>Voir tout →</Link>
          </div>
          {recentLeads.length === 0 ? (
            <p style={{ padding: "30px", textAlign: "center", color: "#bbb", fontSize: "13px" }}>Aucun lead assigne</p>
          ) : (
            recentLeads.map((lead, i) => (
              <div key={lead.id} style={{ padding: "12px 20px", borderBottom: i < recentLeads.length - 1 ? "1px solid #f8f8f8" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "#001459", margin: "0 0 2px" }}>{lead.firstName} {lead.lastName}</p>
                  <p style={{ fontSize: "11px", color: "#999", margin: 0 }}>{lead.email} | {lead.city}</p>
                </div>
                <span style={{
                  padding: "3px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "700",
                  backgroundColor: lead.status === "NEW" ? "#E3F2FD" : lead.status === "DEAL" ? "#E8F5E9" : "#FFF3E0",
                  color: lead.status === "NEW" ? "#1565C0" : lead.status === "DEAL" ? "#2E7D32" : "#E65100",
                }}>{lead.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Agent layout
  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#001459", fontSize: "28px", fontWeight: "800", margin: "0 0 6px" }}>Bienvenue, {session?.user?.name?.split(" ")[0]}</h1>
        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Gerez vos etudiants et suivez leurs dossiers</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <Link href="/dashboard/students" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, #001459, #002080)", padding: "28px",
            borderRadius: "16px", color: "white", cursor: "pointer", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "120px", opacity: 0.06 }}>🎓</div>
            <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.7, margin: "0 0 8px" }}>Mes Etudiants</p>
            <p style={{ fontSize: "42px", fontWeight: "800", margin: "0 0 4px", lineHeight: 1 }}>{studentCount}</p>
            <p style={{ fontSize: "12px", opacity: 0.5, margin: 0 }}>Etudiants enregistres</p>
          </div>
        </Link>
        <Link href="/dashboard/announcements" style={{ textDecoration: "none" }}>
          <div style={{
            backgroundColor: "white", padding: "28px", borderRadius: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer",
            borderTop: "4px solid #DD061A",
          }}>
            <span style={{ fontSize: "28px" }}>📢</span>
            <p style={{ color: "#001459", fontSize: "36px", fontWeight: "800", margin: "8px 0 2px", lineHeight: 1 }}>{announcementCount}</p>
            <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>Annonces</p>
          </div>
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <Link href="/dashboard/search-programs" style={{ textDecoration: "none" }}>
          <div style={{
            backgroundColor: "white", padding: "20px", borderRadius: "14px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "16px",
          }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🔍</div>
            <div>
              <p style={{ color: "#001459", fontSize: "15px", fontWeight: "700", margin: "0 0 2px" }}>Recherche Programme</p>
              <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>{programCount} programmes disponibles</p>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/universities" style={{ textDecoration: "none" }}>
          <div style={{
            backgroundColor: "white", padding: "20px", borderRadius: "14px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "16px",
          }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🏛</div>
            <div>
              <p style={{ color: "#001459", fontSize: "15px", fontWeight: "700", margin: "0 0 2px" }}>Universites</p>
              <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>{universityCount} universites partenaires</p>
            </div>
          </div>
        </Link>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: "#001459", fontSize: "15px", fontWeight: "700", margin: 0 }}>Derniers Etudiants</h3>
          <Link href="/dashboard/students" style={{ color: "#DDBA52", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>Voir tout →</Link>
        </div>
        {recentStudents.length === 0 ? (
          <p style={{ padding: "30px", textAlign: "center", color: "#bbb", fontSize: "13px" }}>Aucun etudiant</p>
        ) : (
          recentStudents.map((student, i) => (
            <div key={student.id} style={{ padding: "12px 20px", borderBottom: i < recentStudents.length - 1 ? "1px solid #f8f8f8" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#001459", margin: "0 0 2px" }}>{student.firstName} {student.lastName}</p>
                <p style={{ fontSize: "11px", color: "#999", margin: 0 }}>{student.email}</p>
              </div>
              <span style={{
                padding: "3px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "700",
                backgroundColor: student.status === "EN_ATTENTE" ? "#FFF3E0" : student.status === "VALIDE" ? "#E8F5E9" : "#E3F2FD",
                color: student.status === "EN_ATTENTE" ? "#E65100" : student.status === "VALIDE" ? "#2E7D32" : "#1565C0",
              }}>{student.status.replace("_", " ")}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
