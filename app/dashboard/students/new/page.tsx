import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import StudentForm from "./StudentForm";

export default async function NewStudentPage() {
  const session = await auth();
  const programs = await prisma.program.findMany({
    include: { university: { include: { city: { include: { country: true } } } } },
    orderBy: { university: { name: "asc" } },
  });

  return (
    <div>
      <a href="/dashboard/students" style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}>← Retour aux etudiants</a>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", margin: "16px 0 24px" }}>Ajouter un etudiant</h1>
      <StudentForm
        userId={session?.user?.id || ""}
        programs={programs.map(p => ({
          id: p.id,
          name: p.name,
          degree: p.degree,
          universityName: p.university.name,
          countryName: p.university.city.country.name,
        }))}
      />
    </div>
  );
}
