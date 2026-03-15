import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ApplicationTable from "./ApplicationTable";

export default async function ApplicationsPage() {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  let applications;
  if (role === "ADMIN" || role === "APPLICATION") {
    applications = await prisma.studentApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        student: { include: { consultant: true } },
        program: { include: { university: { include: { city: { include: { country: true } } } } } },
      },
    });
  } else {
    applications = await prisma.studentApplication.findMany({
      where: { student: { consultantId: userId } },
      orderBy: { createdAt: "desc" },
      include: {
        student: { include: { consultant: true } },
        program: { include: { university: { include: { city: { include: { country: true } } } } } },
      },
    });
  }

  const title = role === "ADMIN" ? "Toutes les Candidatures" : role === "APPLICATION" ? "Candidatures" : "Mes Candidatures";

  return (
    <div>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>{title}</h1>

      <ApplicationTable
        applications={applications.map(a => ({
          id: a.id,
          studentName: `${a.student.firstName} ${a.student.lastName}`,
          studentEmail: a.student.email,
          universityName: a.program.university.name,
          programName: a.program.name,
          department: a.program.department,
          degree: a.program.degree,
          language: a.program.language,
          countryName: a.program.university.city.country.name,
          status: a.status,
          offerLetter: a.offerLetter || "",
          finalAdmission: a.finalAdmission || "",
          source: a.student.consultant ? `${a.student.consultant.firstName} ${a.student.consultant.lastName}` : "Site web",
          createdAt: a.createdAt.toISOString(),
        }))}
        isAdmin={role === "ADMIN" || role === "APPLICATION"}
        role={role || ""}
      />
    </div>
  );
}