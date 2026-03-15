import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default async function DestinationsPage() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true, tags: { has: "DESTINATION" } },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  const countries = await prisma.country.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { cities: true } } },
  });

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <section style={{ padding: "60px 40px", backgroundColor: "#001459", textAlign: "center" }}>
        <h1 style={{ color: "#DDBA52", fontSize: "36px", fontWeight: "700", marginBottom: "10px" }}>Nos Destinations</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>Decouvrez les pays ou vous pouvez etudier avec ASAS</p>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Pays disponibles</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginBottom: "60px" }}>
          {countries.map((country) => (
            <div key={country.id} style={{
              backgroundColor: "white", padding: "24px", borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "16px",
            }}>
              <img src={`https://flagcdn.com/48x36/${country.code.toLowerCase()}.png`} alt={country.name} style={{ borderRadius: "4px" }} />
              <div>
                <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: "0 0 4px" }}>{country.name}</h3>
                <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{country._count.cities} ville{country._count.cities !== 1 ? "s" : ""}</p>
              </div>
            </div>
          ))}
        </div>

        {blogs.length > 0 && (
          <>
            <h2 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Articles sur nos destinations</h2>
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