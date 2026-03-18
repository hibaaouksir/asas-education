import { prisma } from "@/lib/prisma";
import UserForm from "./UserForm";
import UserTable from "./UserTable";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { assignedLeads: true, students: true } },
    },
  });

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Gestion des Utilisateurs</h1>
      <UserForm />
      <div style={{ marginTop: "24px" }}>
        <UserTable users={users.map(u => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone,
          role: u.role,
          isActive: u.isActive,
          leadCount: u._count.assignedLeads,
          studentCount: u._count.students,
        }))} />
      </div>
    </div>
  );
}