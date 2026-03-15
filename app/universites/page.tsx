import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default async function UniversitesPublicPage() {
  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    include: {
      city: { include: { country: true } },
      _count: { select: { programs: true } },
    },
  });

  const blogs = await prisma.blog.findMany({
    where: { isPublished: true, tags: { has: "UNIVERSITY" } },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <section style={{ padding: "60px 40px", backgroundColor: "#001459", textAlign: "center" }}>
        <h1 style={{ color: "#DDBA52", fontSize: "36px", fontWeight: "700", marginBottom: "10px" }}>Nos Universites Partenaires</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>Les meilleures universites pour votre avenir</p>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px", marginBottom: "60px" }}>
          {universities.map((uni) => (
            <div key={uni.id} style={{
              backgroundColor: "white", borderRadius: "12px", overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}>
              {uni.photo ? (
                <img src={uni.photo} alt={uni.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "180px", backgroundColor: "#001459", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#DDBA52", fontSize: "20px", fontWeight: "700" }}>{uni.name}</span>
                </div>
              )}
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <img src={`https://flagcdn.com/20x15/${uni.city.country.code.toLowerCase()}.png`} alt="" style={{ borderRadius: "2px" }} />
                  <span style={{ fontSize: "12px", color: "#888" }}>{uni.city.name}, {uni.city.country.name}</span>
                </div>
                <h3 style={{ color: "#001459", fontSize: "18px", fontWeight: "700", margin: "0 0 8px" }}>{uni.name}</h3>
                {uni.description && <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6", margin: "0 0 12px" }}>{uni.description}</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#888" }}>{uni._count.programs} programme{uni._count.programs !== 1 ? "s" : ""}</span>
                  <Link href="/programmes" style={{ color: "#DDBA52", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>Voir les programmes →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {blogs.length > 0 && (
          <>
            <h2 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Articles sur nos universites</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    backgroundColor: "white", borderRadius: "12px", overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  }}>
                    {blog.coverImage ? (
                      <img src={blog.coverImage} alt={blog.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "200px", backgroundColor: "#001459", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#DDBA52", fontSize: "18px", fontWeight: "600" }}>ASAS Blog</span>
                      </div>
                    )}
                    <div style={{ padding: "20px" }}>
                      <h3 style={{ color: "#001459", fontSize: "18px", fontWeight: "700", margin: "0 0 8px" }}>{blog.title}</h3>
                      {blog.excerpt && <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", margin: "0 0 8px" }}>{blog.excerpt}</p>}
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{new Date(blog.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}