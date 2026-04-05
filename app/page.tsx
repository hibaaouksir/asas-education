"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "12px 48px" : "20px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: scrolled ? "rgba(0, 20, 89, 0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        borderBottom: scrolled ? "1px solid rgba(221, 186, 82, 0.15)" : "none",
      }}
    >
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "42px",
          height: "42px",
          border: "2px solid #DDBA52",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          <span style={{ color: "#DDBA52", fontWeight: "800", fontSize: "14px", letterSpacing: "1px" }}>
            A
          </span>
        </div>
        <div>
          <div style={{ color: "#DDBA52", fontSize: "18px", fontWeight: "700", letterSpacing: "2px", lineHeight: "1" }}>
            ASAS
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase" }}>
            For Education
          </div>
        </div>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
        {["Programmes", "Destinations", "Universites", "Contact"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            style={{
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              transition: "color 0.3s",
              position: "relative",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#DDBA52")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
          >
            {item}
          </Link>
        ))}
        <Link
          href="#booking"
          style={{
            background: "linear-gradient(135deg, #DDBA52, #C4A243)",
            color: "#001459",
            padding: "10px 24px",
            borderRadius: "50px",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            transition: "transform 0.3s, box-shadow 0.3s",
            boxShadow: "0 4px 15px rgba(221, 186, 82, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(221, 186, 82, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(221, 186, 82, 0.3)";
          }}
        >
          Prenez un RDV
        </Link>
      </div>
    </nav>
  );
}

function HeroSection() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(160deg, #000B2E 0%, #001459 40%, #002080 70%, #001459 100%)",
      }}
    >
      {/* Decorative elements */}
      <div style={{
        position: "absolute",
        top: "-20%",
        right: "-10%",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(221,186,82,0.08) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        left: "-5%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(221,186,82,0.05) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute",
        top: "20%",
        left: "10%",
        width: "1px",
        height: "120px",
        background: "linear-gradient(to bottom, transparent, rgba(221,186,82,0.3), transparent)",
      }} />
      <div style={{
        position: "absolute",
        top: "40%",
        right: "15%",
        width: "1px",
        height: "80px",
        background: "linear-gradient(to bottom, transparent, rgba(221,186,82,0.2), transparent)",
      }} />

      <div
        style={{
          textAlign: "center",
          maxWidth: "900px",
          padding: "0 24px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{
          display: "inline-block",
          padding: "8px 20px",
          border: "1px solid rgba(221,186,82,0.3)",
          borderRadius: "50px",
          marginBottom: "32px",
          fontSize: "12px",
          color: "#DDBA52",
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}>
          Your stepping stone to success
        </div>

        <h1 style={{
          color: "white",
          fontSize: "clamp(36px, 5.5vw, 72px)",
          fontWeight: "800",
          lineHeight: "1.1",
          marginBottom: "24px",
          letterSpacing: "-1px",
        }}>
          Votre tremplin{" "}
          <span style={{
            background: "linear-gradient(135deg, #DDBA52, #F0D78C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            vers le succes
          </span>
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.65)",
          fontSize: "clamp(16px, 1.8vw, 20px)",
          lineHeight: "1.8",
          marginBottom: "48px",
          maxWidth: "700px",
          margin: "0 auto 48px",
        }}>
          Etudiez en Allemagne, Hongrie, Turquie, Malaisie, aux Emirats arabes unis
          et dans d&apos;autres destinations prestigieuses.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="#about"
            style={{
              background: "linear-gradient(135deg, #DDBA52, #C4A243)",
              color: "#001459",
              padding: "16px 40px",
              borderRadius: "50px",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 25px rgba(221, 186, 82, 0.35)",
              transition: "all 0.3s",
            }}
          >
            En savoir plus
          </Link>
          <Link
            href="/programmes"
            style={{
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",
              padding: "16px 40px",
              borderRadius: "50px",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              transition: "all 0.3s",
            }}
          >
            Nos programmes
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}>
        <div style={{
          width: "24px",
          height: "40px",
          border: "2px solid rgba(255,255,255,0.2)",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "center",
          paddingTop: "8px",
        }}>
          <div style={{
            width: "3px",
            height: "8px",
            backgroundColor: "#DDBA52",
            borderRadius: "2px",
            animation: "scrollBounce 2s infinite",
          }} />
        </div>
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { number: "3000+", label: "Admissions reussies" },
    { number: "7+", label: "Annees d'expertise" },
    { number: "50+", label: "Universites partenaires" },
    { number: "15+", label: "Pays de destination" },
  ];

  return (
    <section style={{
      background: "linear-gradient(135deg, #DDBA52, #C4A243)",
      padding: "60px 48px",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "32px",
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              color: "#001459",
              fontSize: "clamp(32px, 3.5vw, 48px)",
              fontWeight: "800",
              lineHeight: "1",
              marginBottom: "8px",
            }}>
              {stat.number}
            </div>
            <div style={{
              color: "rgba(0, 20, 89, 0.7)",
              fontSize: "14px",
              fontWeight: "500",
              letterSpacing: "0.5px",
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" style={{
      padding: "120px 48px",
      backgroundColor: "#FAFAFA",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{
            color: "#DDBA52",
            fontSize: "12px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "16px",
            fontWeight: "600",
          }}>
            A propos
          </div>
          <h2 style={{
            color: "#001459",
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: "800",
            lineHeight: "1.2",
            marginBottom: "20px",
          }}>
            Empowering students to{" "}
            <span style={{ color: "#DDBA52" }}>study abroad</span>
          </h2>
          <p style={{
            color: "#666",
            fontSize: "17px",
            lineHeight: "1.8",
            maxWidth: "750px",
            margin: "0 auto",
          }}>
            ASAS For Education est un cabinet de conseil de premier plan, dedie a
            transformer vos projets d&apos;etudes internationales en realite. Grace
            a notre vaste reseau de partenaires prestigieux a travers le monde.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "32px",
        }}>
          {[
            {
              icon: "🎓",
              title: "Expertise prouvee",
              desc: "Plus de 3 000 admissions reussies a notre actif, avec un taux de satisfaction exceptionnel.",
              accent: "#DDBA52",
            },
            {
              icon: "🌍",
              title: "Reseau mondial",
              desc: "Des partenariats strategiques avec des universites d'elite sur plusieurs continents.",
              accent: "#001459",
            },
            {
              icon: "🤝",
              title: "Accompagnement complet",
              desc: "Un soutien de l'inscription jusqu'a l'obtention de votre diplome et au-dela.",
              accent: "#DD061A",
            },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "white",
                padding: "40px 32px",
                borderRadius: "16px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                borderTop: `3px solid ${card.accent}`,
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.04)";
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>{card.icon}</div>
              <h3 style={{ color: "#001459", fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>
                {card.title}
              </h3>
              <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.7" }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "56px" }}>
          <Link
            href="/programmes"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #001459, #002080)",
              color: "white",
              padding: "16px 40px",
              borderRadius: "50px",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "600",
              boxShadow: "0 4px 20px rgba(0,20,89,0.25)",
              transition: "all 0.3s",
            }}
          >
            Recherchez votre programme →
          </Link>
        </div>
      </div>
    </section>
  );
}

function DestinationsSection() {
  const destinations = [
    { country: "Turquie", flag: "🇹🇷", universities: "50+", color: "#E30A17" },
    { country: "Allemagne", flag: "🇩🇪", universities: "20+", color: "#FFCE00" },
    { country: "Hongrie", flag: "🇭🇺", universities: "15+", color: "#477050" },
    { country: "Malaisie", flag: "🇲🇾", universities: "10+", color: "#010066" },
    { country: "EAU", flag: "🇦🇪", universities: "12+", color: "#00732F" },
    { country: "Chypre du Nord", flag: "🇨🇾", universities: "8+", color: "#D5832B" },
  ];

  return (
    <section style={{
      padding: "120px 48px",
      background: "linear-gradient(160deg, #001459 0%, #000B2E 100%)",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{
            color: "#DDBA52",
            fontSize: "12px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "16px",
            fontWeight: "600",
          }}>
            Destinations
          </div>
          <h2 style={{
            color: "white",
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: "800",
            marginBottom: "16px",
          }}>
            Explorez nos destinations
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>
            Des opportunites d&apos;etudes dans les meilleurs pays du monde
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}>
          {destinations.map((dest, i) => (
            <Link
              key={i}
              href={`/destinations/${dest.country.toLowerCase()}`}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "32px",
                textDecoration: "none",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(221,186,82,0.08)";
                e.currentTarget.style.borderColor = "rgba(221,186,82,0.3)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span style={{ fontSize: "48px" }}>{dest.flag}</span>
              <div>
                <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>
                  {dest.country}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                  {dest.universities} universites
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    city: "", level: "", sessionType: "online",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #E0E0E0",
    borderRadius: "10px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    transition: "border-color 0.3s",
    outline: "none",
    backgroundColor: "#FAFAFA",
  };

  return (
    <section id="booking" style={{
      padding: "120px 48px",
      backgroundColor: "white",
    }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            color: "#DDBA52",
            fontSize: "12px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "16px",
            fontWeight: "600",
          }}>
            Consultation gratuite
          </div>
          <h2 style={{
            color: "#001459",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: "800",
            marginBottom: "12px",
          }}>
            Reservez votre seance d&apos;orientation
          </h2>
          <p style={{ color: "#888", fontSize: "15px" }}>
            30 minutes de consultation individuelle — en ligne ou dans nos bureaux
          </p>
        </div>

        <form
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
            border: "1px solid #F0F0F0",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Nom *</label>
              <input type="text" required style={inputStyle} placeholder="Votre nom" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Prenom *</label>
              <input type="text" required style={inputStyle} placeholder="Votre prenom" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Email *</label>
            <input type="email" required style={inputStyle} placeholder="votre@email.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Telephone *</label>
            <input type="tel" required style={inputStyle} placeholder="+212 6XX XXX XXX" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Ville *</label>
              <input type="text" required style={inputStyle} placeholder="Votre ville" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Niveau scolaire *</label>
              <select required style={{ ...inputStyle, cursor: "pointer" }} value={formData.level} onChange={(e) => handleChange("level", e.target.value)}>
                <option value="">Selectionnez</option>
                <option value="bac">Baccalaureat</option>
                <option value="licence">Licence</option>
                <option value="master">Master</option>
                <option value="doctorat">Doctorat</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Type de seance *</label>
            <div style={{ display: "flex", gap: "12px" }}>
              {["online", "office"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange("sessionType", type)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: formData.sessionType === type ? "2px solid #DDBA52" : "1px solid #E0E0E0",
                    backgroundColor: formData.sessionType === type ? "rgba(221,186,82,0.08)" : "white",
                    color: formData.sessionType === type ? "#001459" : "#888",
                    fontSize: "14px",
                    fontWeight: formData.sessionType === type ? "600" : "400",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  {type === "online" ? "💻 En ligne" : "🏢 Au bureau"}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #DDBA52, #C4A243)",
              color: "#001459",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 20px rgba(221, 186, 82, 0.3)",
              transition: "all 0.3s",
            }}
          >
            Reserver ma consultation gratuite
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      backgroundColor: "#000B2E",
      color: "white",
      padding: "80px 48px 30px",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: "48px",
        marginBottom: "60px",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              border: "2px solid #DDBA52",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{ color: "#DDBA52", fontWeight: "800", fontSize: "12px" }}>A</span>
            </div>
            <span style={{ color: "#DDBA52", fontSize: "16px", fontWeight: "700", letterSpacing: "2px" }}>
              ASAS FOR EDUCATION
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: "1.8", maxWidth: "300px" }}>
            Your stepping stone to success. Nous aidons les etudiants a trouver
            l&apos;universite de leurs reves a l&apos;etranger.
          </p>
        </div>

        <div>
          <h4 style={{ color: "#DDBA52", fontSize: "13px", letterSpacing: "2px", marginBottom: "20px", textTransform: "uppercase" }}>Navigation</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Programmes", "Destinations", "Universites", "Blog"].map((link) => (
              <Link key={link} href={`/${link.toLowerCase()}`} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "14px", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#DDBA52")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {link}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ color: "#DDBA52", fontSize: "13px", letterSpacing: "2px", marginBottom: "20px", textTransform: "uppercase" }}>Contact</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
            <span>contact@asasforeducation.com</span>
            <span>+212 6 00 00 00 00</span>
            <span>Meknes, Morocco</span>
          </div>
        </div>

        <div>
          <h4 style={{ color: "#DDBA52", fontSize: "13px", letterSpacing: "2px", marginBottom: "20px", textTransform: "uppercase" }}>Suivez-nous</h4>
          <div style={{ display: "flex", gap: "12px" }}>
            {["Instagram", "Facebook", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  fontSize: "12px",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#DDBA52";
                  e.currentTarget.style.color = "#DDBA52";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                }}
              >
                {social[0]}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "24px",
        textAlign: "center",
        fontSize: "13px",
        color: "rgba(255,255,255,0.25)",
      }}>
        © 2026 ASAS For Education. All rights reserved.
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <DestinationsSection />
      <BookingSection />
      <Footer />
    </div>
  );
}
