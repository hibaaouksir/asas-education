import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default async function ProgramDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).replace(/-/g, " ");

  // Find all programs with this name (across different universities)
  const programs = await prisma.program.findMany({
    where: { name: { equals: decodedName, mode: "insensitive" } },
    include: {
      university: {
        include: {
          city: { include: { country: true } },
        },
      },
    },
    orderBy: { pricePerYear: "asc" },
  });

  if (programs.length === 0) return notFound();

  // Use the first program for general info
  const mainProgram = programs[0];
  const degrees = [...new Set(programs.map(p => p.degree))];
  const languages = [...new Set(programs.map(p => p.language))];
  const countries = [...new Set(programs.map(p => p.university.city.country.name))];
  const description = programs.find(p => p.description)?.description;
  const heroImage = programs.find(p => p.image)?.image;

  const priceRange = programs.filter(p => p.pricePerYear).map(p => p.pricePerYear as number);
  const minPrice = priceRange.length > 0 ? Math.min(...priceRange) : null;
  const maxPrice = priceRange.length > 0 ? Math.max(...priceRange) : null;

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        position: "relative", height: "400px", overflow: "hidden",
        background: heroImage ? "none" : "linear-gradient(135deg, #001459 0%, #000B2E 100%)",
      }}>
        {heroImage && (
          <>
            <img src={heroImage} alt={mainProgram.name} style={{
              width: "100%", height: "100%", objectFit: "cover",
            }} />
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: "linear-gradient(to bottom, rgba(0,20,89,0.3) 0%, rgba(0,11,46,0.85) 100%)",
            }} />
          </>
        )}
        <div style={{
          position: "absolute", bottom: "40px", left: "0", right: "0",
          padding: "0 40px", maxWidth: "1200px", margin: "0 auto",
        }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{
              padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
              backgroundColor: "rgba(221,186,82,0.2)", color: "#DDBA52",
            }}>{mainProgram.department}</span>
            {degrees.map(d => (
              <span key={d} style={{
                padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                backgroundColor: "rgba(255,255,255,0.15)", color: "white",
              }}>{d}</span>
            ))}
          </div>
          <h1 style={{ color: "white", fontSize: "42px", fontWeight: "800", margin: "0 0 8px", lineHeight: 1.1 }}>
            {mainProgram.name}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", margin: 0 }}>
            Disponible dans {programs.length} universite{programs.length > 1 ? "s" : ""} · {countries.length} pays
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ backgroundColor: "white", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 40px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>Niveaux</p>
            <p style={{ fontSize: "15px", fontWeight: "700", color: "#001459", margin: 0 }}>{degrees.join(", ")}</p>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>Langues</p>
            <p style={{ fontSize: "15px", fontWeight: "700", color: "#001459", margin: 0 }}>{languages.join(", ")}</p>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>Duree</p>
            <p style={{ fontSize: "15px", fontWeight: "700", color: "#001459", margin: 0 }}>
              {[...new Set(programs.map(p => p.duration))].sort().join("-")} ans
            </p>
          </div>
          {minPrice && (
            <div>
              <p style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>Prix</p>
              <p style={{ fontSize: "15px", fontWeight: "700", color: "#DDBA52", margin: 0 }}>
                {minPrice === maxPrice ? `${minPrice} USD/an` : `${minPrice} - ${maxPrice} USD/an`}
              </p>
            </div>
          )}
          <div>
            <p style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>Pays</p>
            <p style={{ fontSize: "15px", fontWeight: "700", color: "#001459", margin: 0 }}>{countries.join(", ")}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px" }}>

          {/* Left - Description */}
          <div>
            {description && (
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ color: "#001459", fontSize: "22px", fontWeight: "700", marginBottom: "16px" }}>
                  A propos de {mainProgram.name}
                </h2>
                <div style={{ color: "#444", fontSize: "15px", lineHeight: "1.8" }}>
                  {description.split("\n").map((paragraph, i) => (
                    <p key={i} style={{ margin: "0 0 12px" }}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Universities offering this program */}
            <div>
              <h2 style={{ color: "#001459", fontSize: "22px", fontWeight: "700", marginBottom: "20px" }}>
                Universites proposant {mainProgram.name}
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {programs.map((prog) => (
                  <div key={prog.id} style={{
                    backgroundColor: "white", borderRadius: "14px", overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0",
                    display: "flex",
                  }}>
                    {prog.university.photo ? (
                      <img src={prog.university.photo} alt={prog.university.name} style={{
                        width: "200px", minHeight: "160px", objectFit: "cover",
                      }} />
                    ) : (
                      <div style={{
                        width: "200px", minHeight: "160px",
                        background: "linear-gradient(135deg, #001459, #000B2E)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ color: "#DDBA52", fontSize: "16px", fontWeight: "700", textAlign: "center", padding: "10px" }}>{prog.university.name}</span>
                      </div>
                    )}
                    <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <img src={`https://flagcdn.com/20x15/${prog.university.city.country.code.toLowerCase()}.png`} alt="" style={{ borderRadius: "2px" }} />
                          <span style={{ fontSize: "12px", color: "#888" }}>{prog.university.city.name}, {prog.university.city.country.name}</span>
                        </div>
                        <h3 style={{ color: "#001459", fontSize: "18px", fontWeight: "700", margin: "0 0 8px" }}>{prog.university.name}</h3>
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "8px" }}>
                          <span style={{ fontSize: "13px", color: "#666" }}>{prog.degree}</span>
                          <span style={{ fontSize: "13px", color: "#666" }}>Langue: {prog.language}</span>
                          <span style={{ fontSize: "13px", color: "#666" }}>Duree: {prog.duration} ans</span>
                        </div>
                        {prog.pricePerYear && (
                          <p style={{ fontSize: "16px", fontWeight: "700", color: "#DDBA52", margin: "0 0 4px" }}>
                            {prog.pricePerYear} {prog.currency}/an
                          </p>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                        <Link href={`/universites/${prog.universityId}?programme=${encodeURIComponent(prog.name.toLowerCase())}`} style={{
                          padding: "8px 16px", borderRadius: "8px", border: "1px solid #001459",
                          color: "#001459", textDecoration: "none", fontSize: "13px", fontWeight: "600",
                        }}>Voir l&apos;universite</Link>
                        <Link href={`/programmes?postuler=${prog.id}`} style={{
                          padding: "8px 16px", borderRadius: "8px", border: "none",
                          backgroundColor: "#DDBA52", color: "#001459", textDecoration: "none",
                          fontSize: "13px", fontWeight: "700",
                        }}>Postuler</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Sticky Sidebar */}
          <div>
            <div style={{
              position: "sticky", top: "90px",
              backgroundColor: "#001459", borderRadius: "16px", padding: "28px",
              color: "white",
            }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 4px", color: "#DDBA52" }}>
                Etudier {mainProgram.name}
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "0 0 20px" }}>
                Remplissez le formulaire pour etre contacte
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input placeholder="Nom complet" style={{
                  padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(255,255,255,0.1)", color: "white", fontSize: "13px", outline: "none",
                }} />
                <input placeholder="Email" type="email" style={{
                  padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(255,255,255,0.1)", color: "white", fontSize: "13px", outline: "none",
                }} />
                <input placeholder="Telephone" style={{
                  padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(255,255,255,0.1)", color: "white", fontSize: "13px", outline: "none",
                }} />
                <input placeholder="Ville" style={{
                  padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(255,255,255,0.1)", color: "white", fontSize: "13px", outline: "none",
                }} />
                <button style={{
                  padding: "12px", borderRadius: "8px", border: "none",
                  backgroundColor: "#DDBA52", color: "#001459", fontSize: "14px",
                  fontWeight: "700", cursor: "pointer", marginTop: "4px",
                }}>Postuler maintenant</button>
              </div>

              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0 0 8px" }}>Ce programme est disponible dans :</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {programs.map((p) => (
                    <span key={p.id} style={{
                      padding: "3px 10px", borderRadius: "12px", fontSize: "11px",
                      backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
                    }}>{p.university.city.country.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

