import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default async function BlogPublicPage() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <section style={{ padding: "60px 40px", backgroundColor: "#001459", textAlign: "center" }}>
        <h1 style={{ color: "#DDBA52", fontSize: "36px", fontWeight: "700", marginBottom: "10px" }}>Blog</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>Conseils, guides et actualités pour réussir vos études à l'étranger</p>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        {blogs.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", fontSize: "16px" }}>Aucun article pour le moment.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* Featured Article */}
            {blogs.length > 0 && (
              <Link href={`/blog/${blogs[0].slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  backgroundColor: "white", borderRadius: "16px", overflow: "hidden",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                }}>
                  {blogs[0].coverImage ? (
                    <img src={blogs[0].coverImage} alt={blogs[0].title} style={{ width: "100%", height: "320px", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "320px", background: "linear-gradient(135deg, #001459, #000B2E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#DDBA52", fontSize: "20px", fontWeight: "700" }}>ASAS Blog</span>
                    </div>
                  )}
                  <div style={{ padding: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
                      <span style={{ color: "#DDBA52", fontSize: "12px", fontWeight: "600" }}>{Math.ceil(blogs[0].content.length / 1000)} min de lecture</span>
                      <span style={{ color: "#ccc" }}>·</span>
                      <span style={{ color: "#888", fontSize: "12px" }}>{new Date(blogs[0].createdAt).toLocaleDateString("fr-FR")}</span>
                      <span style={{ color: "#ccc" }}>·</span>
                      <span style={{ color: "#888", fontSize: "12px" }}>👁 {blogs[0].views}</span>
                    </div>
                    <h2 style={{ color: "#001459", fontSize: "24px", fontWeight: "800", lineHeight: "1.3", margin: "0 0 12px" }}>{blogs[0].title}</h2>
                    {blogs[0].excerpt && <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.7", margin: "0 0 16px" }}>{blogs[0].excerpt}</p>}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                      {blogs[0].tags.map((tag) => (
                        <span key={tag} style={{
                          padding: "3px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "600",
                          backgroundColor: tag === "DESTINATION" ? "#E3F2FD" : tag === "UNIVERSITY" ? "#F3E5F5" : "#FFF3E0",
                          color: tag === "DESTINATION" ? "#1565C0" : tag === "UNIVERSITY" ? "#7B1FA2" : "#E65100",
                        }}>{tag}</span>
                      ))}
                    </div>
                    <span style={{ color: "#DDBA52", fontSize: "14px", fontWeight: "600" }}>Lire l article →</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Other Articles */}
            {blogs.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
                {blogs.slice(1).map((blog) => (
                  <Link key={blog.id} href={`/blog/${blog.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      backgroundColor: "white", borderRadius: "14px", overflow: "hidden",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%",
                    }}>
                      {blog.coverImage ? (
                        <img src={blog.coverImage} alt={blog.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #001459, #000B2E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: "#DDBA52", fontSize: "16px", fontWeight: "600" }}>ASAS Blog</span>
                        </div>
                      )}
                      <div style={{ padding: "20px" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
                          <span style={{ color: "#888", fontSize: "11px" }}>{Math.ceil(blog.content.length / 1000)} min</span>
                          <span style={{ color: "#ddd" }}>·</span>
                          <span style={{ color: "#888", fontSize: "11px" }}>{new Date(blog.createdAt).toLocaleDateString("fr-FR")}</span>
                          <span style={{ color: "#ddd" }}>·</span>
                          <span style={{ color: "#888", fontSize: "11px" }}>👁 {blog.views}</span>
                        </div>
                        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
                          {blog.tags.map((tag) => (
                            <span key={tag} style={{
                              padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "600",
                              backgroundColor: tag === "DESTINATION" ? "#E3F2FD" : tag === "UNIVERSITY" ? "#F3E5F5" : "#FFF3E0",
                              color: tag === "DESTINATION" ? "#1565C0" : tag === "UNIVERSITY" ? "#7B1FA2" : "#E65100",
                            }}>{tag}</span>
                          ))}
                        </div>
                        <h3 style={{ color: "#001459", fontSize: "17px", fontWeight: "700", margin: "0 0 8px", lineHeight: "1.3" }}>{blog.title}</h3>
                        {blog.excerpt && <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>{blog.excerpt.substring(0, 120)}{blog.excerpt.length > 120 ? "..." : ""}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
