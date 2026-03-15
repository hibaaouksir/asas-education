import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import LeadTable from "./LeadTable";

export default async function LeadsPage() {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  const leads = await prisma.lead.findMany({
    where: role === "ADMIN" ? {} : { consultantId: userId },
    orderBy: { createdAt: "desc" },
    include: { consultant: true },
  });

  const consultants = role === "ADMIN" ? await prisma.user.findMany({
    where: { role: "CONSULTANT", isActive: true },
    orderBy: { firstName: "asc" },
  }) : [];

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>
        {role === "ADMIN" ? "Tous les Leads" : "Mes Leads"}
      </h1>

      <LeadTable
        leads={leads.map(l => ({
          id: l.id,
          firstName: l.firstName,
          lastName: l.lastName,
          email: l.email,
          phone: l.phone,
          city: l.city,
          educationLevel: l.educationLevel,
          status: l.status,
          source: l.source,
          universityName: l.universityName || "-",
          consultantId: l.consultantId || "",
          consultantName: l.consultant ? `${l.consultant.firstName} ${l.consultant.lastName}` : "-",
          createdAt: l.createdAt.toISOString(),
        }))}
        consultants={consultants.map(c => ({ id: c.id, name: `${c.firstName} ${c.lastName}` }))}
        isAdmin={role === "ADMIN"}
      />
    </div>
  );
}
