import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default async function BlogPublicPage() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <section style={{ padding: "60px 40px", backgroundColor: "#001459", textAlign: "center" }}>
        <h1 style={{ color: "#DDBA52", fontSize: "36px", fontWeight: "700", marginBottom: "10px" }}>Blog</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>Conseils, guides et actualites pour etudier a l etranger</p>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        {blogs.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", fontSize: "16px" }}>Aucun article pour le moment.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  backgroundColor: "white", borderRadius: "12px", overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)", transition: "transform 0.2s",
                }}>
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "200px", backgroundColor: "#001459", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#DDBA52", fontSize: "18px", fontWeight: "600" }}>ASAS Blog</span>
                    </div>
                  )}
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
                      {blog.tags.map((tag) => (
                        <span key={tag} style={{
                          padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "600",
                          backgroundColor: tag === "DESTINATION" ? "#E3F2FD" : tag === "UNIVERSITY" ? "#F3E5F5" : "#FFF3E0",
                          color: tag === "DESTINATION" ? "#1565C0" : tag === "UNIVERSITY" ? "#7B1FA2" : "#E65100",
                        }}>{tag}</span>
                      ))}
                    </div>
                    <h3 style={{ color: "#001459", fontSize: "18px", fontWeight: "700", margin: "0 0 8px" }}>{blog.title}</h3>
                    {blog.excerpt && <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", margin: "0 0 12px" }}>{blog.excerpt}</p>}
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
                      {new Date(blog.createdAt).toLocaleDateString("fr-FR")} par {blog.author.firstName} {blog.author.lastName}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
