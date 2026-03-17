import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog || !blog.isPublished) return notFound();

  // Increment views
  await prisma.blog.update({
    where: { id: blog.id },
    data: { views: { increment: 1 } },
  });

  const readTime = Math.ceil(blog.content.length / 1000);

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <article style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
            {blog.tags.map((tag) => (
              <span key={tag} style={{
                padding: "4px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                backgroundColor: tag === "DESTINATION" ? "#E3F2FD" : tag === "UNIVERSITY" ? "#F3E5F5" : "#FFF3E0",
                color: tag === "DESTINATION" ? "#1565C0" : tag === "UNIVERSITY" ? "#7B1FA2" : "#E65100",
              }}>{tag}</span>
            ))}
          </div>

          <h1 style={{ color: "#001459", fontSize: "34px", fontWeight: "800", lineHeight: "1.3", marginBottom: "16px" }}>{blog.title}</h1>

          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "30px" }}>
            <span style={{ color: "#DDBA52", fontSize: "13px", fontWeight: "600" }}>{readTime} min de lecture</span>
            <span style={{ color: "#ddd" }}>·</span>
            <span style={{ color: "#888", fontSize: "13px" }}>{new Date(blog.createdAt).toLocaleDateString("fr-FR")}</span>
            <span style={{ color: "#ddd" }}>·</span>
            <span style={{ color: "#888", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>👁 {blog.views + 1} vue{blog.views > 0 ? "s" : ""}</span>
          </div>
        </div>

        {blog.coverImage && (
          <div style={{ marginBottom: "32px", borderRadius: "14px", overflow: "hidden" }}>
            <img src={blog.coverImage} alt={blog.title} style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        )}

        {blog.excerpt && (
          <p style={{
            color: "#001459", fontSize: "18px", fontWeight: "600", lineHeight: "1.6",
            marginBottom: "32px", padding: "24px", backgroundColor: "#F8F9FA",
            borderRadius: "12px", borderLeft: "4px solid #DDBA52",
          }}>
            {blog.excerpt}
          </p>
        )}

        <div style={{ color: "#333", fontSize: "16px", lineHeight: "1.9" }}>
          {blog.content.split("\n").map((paragraph, i) => (
            paragraph.trim() ? <p key={i} style={{ marginBottom: "18px" }}>{paragraph}</p> : null
          ))}
        </div>

        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #eee", textAlign: "center" }}>
          <a href="/blog" style={{
            color: "#DDBA52", textDecoration: "none", fontWeight: "600", fontSize: "14px",
            padding: "12px 28px", borderRadius: "10px", border: "1px solid #DDBA52",
          }}>← Retour aux articles</a>
        </div>
      </article>

      <Footer />
    </div>
  );
}
