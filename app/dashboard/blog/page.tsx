import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteBlogButton from "./DeleteBlogButton";

export default async function BlogDashboardPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700" }}>Gestion du Blog</h1>
        <Link href="/dashboard/blog/new" style={{
          background: "linear-gradient(135deg, #DDBA52, #C4A243)",
          color: "#001459", padding: "10px 24px", borderRadius: "8px",
          textDecoration: "none", fontSize: "14px", fontWeight: "700",
        }}>+ Nouvel article</Link>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Titre</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Tags</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Auteur</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Date</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun article. Cliquez sur "+ Nouvel article" pour commencer.</td></tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#001459" }}>{blog.title}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {blog.tags.map((tag) => (
                        <span key={tag} style={{
                          padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "600",
                          backgroundColor: tag === "DESTINATION" ? "#E3F2FD" : tag === "UNIVERSITY" ? "#F3E5F5" : "#FFF3E0",
                          color: tag === "DESTINATION" ? "#1565C0" : tag === "UNIVERSITY" ? "#7B1FA2" : "#E65100",
                        }}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{blog.author.firstName} {blog.author.lastName}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                      backgroundColor: blog.isPublished ? "#E8F5E9" : "#FFF3E0",
                      color: blog.isPublished ? "#2E7D32" : "#E65100",
                    }}>{blog.isPublished ? "Publie" : "Brouillon"}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#888" }}>{new Date(blog.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Link href={`/blog/${blog.slug}`} style={{ color: "#DDBA52", textDecoration: "none", fontWeight: "600", fontSize: "12px" }}>Voir</Link>
                      <DeleteBlogButton blogId={blog.id} blogTitle={blog.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
