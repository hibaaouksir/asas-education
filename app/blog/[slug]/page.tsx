import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!blog || !blog.isPublished) return notFound();

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <article style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
          {blog.tags.map((tag) => (
            <span key={tag} style={{
              padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
              backgroundColor: tag === "DESTINATION" ? "#E3F2FD" : tag === "UNIVERSITY" ? "#F3E5F5" : "#FFF3E0",
              color: tag === "DESTINATION" ? "#1565C0" : tag === "UNIVERSITY" ? "#7B1FA2" : "#E65100",
            }}>{tag}</span>
          ))}
        </div>

        <h1 style={{ color: "#001459", fontSize: "32px", fontWeight: "800", lineHeight: "1.3", marginBottom: "12px" }}>{blog.title}</h1>

        <p style={{ color: "#888", fontSize: "14px", marginBottom: "30px" }}>
          Par {blog.author.firstName} {blog.author.lastName} | {new Date(blog.createdAt).toLocaleDateString("fr-FR")}
        </p>

        {blog.coverImage && (
          <div style={{ marginBottom: "30px", borderRadius: "12px", overflow: "hidden" }}>
            <img src={blog.coverImage} alt={blog.title} style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        )}

        {blog.excerpt && (
          <p style={{ color: "#001459", fontSize: "18px", fontWeight: "600", lineHeight: "1.6", marginBottom: "30px", padding: "20px", backgroundColor: "#F8F9FA", borderRadius: "8px", borderLeft: "4px solid #DDBA52" }}>
            {blog.excerpt}
          </p>
        )}

        <div style={{ color: "#333", fontSize: "16px", lineHeight: "1.8" }}>
          {blog.content.split("\n").map((paragraph, i) => (
            paragraph.trim() ? <p key={i} style={{ marginBottom: "16px" }}>{paragraph}</p> : null
          ))}
        </div>

        <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #eee", textAlign: "center" }}>
          <a href="/blog" style={{ color: "#DDBA52", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>← Retour aux articles</a>
        </div>
      </article>

      <Footer />
    </div>
  );
}
