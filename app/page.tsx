"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

function TopBar() {
  return (
    <div style={{
      backgroundColor: "#000B2E",
      padding: "8px 48px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid rgba(221,186,82,0.1)",
      fontSize: "13px",
    }}>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.6)" }}>✉ Contact@asasforeducation.com</span>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
        <span style={{ color: "rgba(255,255,255,0.6)" }}>📍 Av atlas, imm 19, appt 7 Agdal, Rabat</span>
      </div>
      <div style={{ display: "flex", gap: "16px" }}>
        {[
          { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61551878318212" },
          { name: "Instagram", url: "https://www.instagram.com/asasforeducation" },
          { name: "LinkedIn", url: "https://www.linkedin.com/company/asas-for-education" },
        ].map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "12px", transition: "color 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#DDBA52")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >{s.name}</a>
        ))}
      </div>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav style={{
      position: scrolled ? "fixed" : "relative",
      top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "8px 48px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: scrolled ? "rgba(0,20,89,0.98)" : "white",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "all 0.4s ease",
      boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.15)" : "0 1px 0 rgba(0,0,0,0.05)",
    }}>
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
        <Image src="/images/logo.png" alt="ASAS For Education" width={90} height={90} style={{ objectFit: "contain" }} />
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        {[
          { label: "Programmes", href: "/programmes" },
          { label: "Destinations", href: "/destinations" },
          { label: "Universites", href: "/universites" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "/contact" },
        ].map((item) => (
          <Link key={item.label} href={item.href} style={{
            color: scrolled ? "rgba(255,255,255,0.85)" : "#001459",
            textDecoration: "none", fontSize: "14px", fontWeight: "600", transition: "color 0.3s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#DDBA52")}
            onMouseLeave={(e) => (e.currentTarget.style.color = scrolled ? "rgba(255,255,255,0.85)" : "#001459")}
          >{item.label}</Link>
        ))}
        <Link href="#booking" style={{
          background: "linear-gradient(135deg, #DDBA52, #C4A243)",
          color: "#001459", padding: "12px 28px", borderRadius: "50px",
          textDecoration: "none", fontSize: "14px", fontWeight: "700",
          boxShadow: "0 4px 15px rgba(221,186,82,0.3)", transition: "transform 0.3s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >Prenez un RDV</Link>
      </div>
    </nav>
  );
}

function FloatingLogo() {
  return (
    <div style={{
      position: "fixed",
      bottom: "30px",
      right: "30px",
      zIndex: 999,
      width: "65px",
      height: "65px",
      borderRadius: "50%",
      backgroundColor: "white",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "transform 0.3s, box-shadow 0.3s",
      border: "2px solid #DDBA52",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 25px rgba(221,186,82,0.3)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)"; }}
    >
      <Image src="/images/logo.png" alt="ASAS" width={45} height={45} style={{ objectFit: "contain" }} />
    </div>
  );
}

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const slides = [
    {
      image: "/images/hero1.jpg",
      subtitle: "Votre avenir commence ici",
      title: "ETUDIER A L'ETRANGER AVEC ASAS FOR EDUCATION",
      desc: "Nous accompagnons les etudiants vers les meilleures universites en Turquie, Allemagne, Hongrie, Malaisie et bien plus encore.",
      btn1: { text: "Postulez maintenant", href: "#booking" },
      btn2: { text: "En savoir plus", href: "#about" },
    },
    {
      image: "/images/hero2.jpg",
      subtitle: "7 ans d'expertise - 3000+ admissions",
      title: "VOTRE TREMPLIN VERS LE SUCCES",
      desc: "De la medecine aux sciences culinaires, quel que soit le programme que vous souhaitez etudier, nous vous aiderons dans votre admission.",
      btn1: { text: "Nos programmes", href: "/programmes" },
      btn2: { text: "Contactez-nous", href: "/contact" },
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFadeIn(true);
      }, 600);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    if (index === current) return;
    setFadeIn(false);
    setTimeout(() => {
      setCurrent(index);
      setFadeIn(true);
    }, 400);
  };

  return (
    <section style={{ position: "relative", height: "85vh", minHeight: "550px", overflow: "hidden" }}>
      {slides.map((slide, i) => (
        <div key={i} style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          opacity: current === i ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover", backgroundPosition: "center top",
            transform: current === i ? "scale(1.05)" : "scale(1)",
            transition: "transform 8s ease-out",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            background: "linear-gradient(to right, rgba(0,8,30,0.92) 0%, rgba(0,15,60,0.8) 35%, rgba(0,8,30,0.65) 100%)",
          }} />
        </div>
      ))}

      <div style={{
        position: "relative", zIndex: 10, height: "100%",
        display: "flex", alignItems: "center",
        padding: "0 80px", maxWidth: "1400px", margin: "0 auto",
      }}>
        <div style={{
          maxWidth: "650px",
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateX(0)" : "translateX(-30px)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px",
            backgroundColor: "rgba(221,186,82,0.15)",
            border: "1px solid rgba(221,186,82,0.3)",
            borderRadius: "4px", marginBottom: "20px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#DDBA52" }} />
            <span style={{ fontSize: "12px", color: "#DDBA52", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              {slides[current].subtitle}
            </span>
          </div>

          <h1 style={{
            color: "white",
            fontSize: "clamp(32px, 4.5vw, 56px)",
            fontWeight: "900", lineHeight: "1.1",
            marginBottom: "20px", letterSpacing: "-0.5px",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}>
            {slides[current].title}
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: "16px", lineHeight: "1.8",
            marginBottom: "32px", maxWidth: "520px",
            textShadow: "0 1px 8px rgba(0,0,0,0.2)",
          }}>
            {slides[current].desc}
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link href={slides[current].btn1.href} style={{
              background: "linear-gradient(135deg, #DDBA52, #C4A243)",
              color: "#001459", padding: "14px 32px", borderRadius: "4px",
              textDecoration: "none", fontSize: "14px", fontWeight: "700",
              boxShadow: "0 4px 20px rgba(221,186,82,0.3)", transition: "all 0.3s",
            }}>{slides[current].btn1.text}</Link>
            <Link href={slides[current].btn2.href} style={{
              border: "2px solid rgba(255,255,255,0.4)",
              color: "white", padding: "14px 32px", borderRadius: "4px",
              textDecoration: "none", fontSize: "14px", fontWeight: "600",
              transition: "all 0.3s", backdropFilter: "blur(4px)",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}>{slides[current].btn2.text}</Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button onClick={() => goToSlide(current === 0 ? slides.length - 1 : current - 1)} style={{
        position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)",
        zIndex: 10, width: "48px", height: "48px", borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(0,0,0,0.2)",
        color: "white", fontSize: "20px", cursor: "pointer", transition: "all 0.3s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#DDBA52"; e.currentTarget.style.backgroundColor = "rgba(221,186,82,0.2)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.2)"; }}
      >&#8249;</button>

      <button onClick={() => goToSlide((current + 1) % slides.length)} style={{
        position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)",
        zIndex: 10, width: "48px", height: "48px", borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(0,0,0,0.2)",
        color: "white", fontSize: "20px", cursor: "pointer", transition: "all 0.3s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#DDBA52"; e.currentTarget.style.backgroundColor = "rgba(221,186,82,0.2)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.2)"; }}
      >&#8250;</button>

      {/* Dots on the right */}
      <div style={{
        position: "absolute", right: "50px", top: "50%",
        transform: "translateY(-50%)", zIndex: 10,
        display: "flex", flexDirection: "column", gap: "12px",
      }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)} style={{
            width: current === i ? "14px" : "10px",
            height: current === i ? "14px" : "10px",
            borderRadius: "50%",
            border: current === i ? "2px solid #DDBA52" : "2px solid rgba(255,255,255,0.4)",
            backgroundColor: current === i ? "#DDBA52" : "transparent",
            cursor: "pointer", transition: "all 0.3s", padding: 0,
          }} />
        ))}
      </div>

      {/* Counter bottom left */}
      <div style={{
        position: "absolute", bottom: "40px", left: "80px", zIndex: 10,
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <span style={{ color: "#DDBA52", fontSize: "28px", fontWeight: "800" }}>0{current + 1}</span>
        <div style={{ width: "40px", height: "2px", backgroundColor: "rgba(255,255,255,0.3)" }} />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px" }}>0{slides.length}</span>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { number: "3000+", label: "Admissions reussies", icon: "🎓" },
    { number: "7+", label: "Annees d'expertise", icon: "📅" },
    { number: "50+", label: "Universites partenaires", icon: "🏛" },
    { number: "15+", label: "Pays de destination", icon: "🌍" },
  ];

  return (
    <section style={{ background: "linear-gradient(135deg, #DDBA52, #C4A243)", padding: "50px 48px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "6px" }}>{stat.icon}</div>
            <div style={{ color: "#001459", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: "800", lineHeight: "1", marginBottom: "6px" }}>{stat.number}</div>
            <div style={{ color: "rgba(0,20,89,0.7)", fontSize: "13px", fontWeight: "500" }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" style={{ padding: "100px 48px", backgroundColor: "#FAFAFA" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ color: "#DDBA52", fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "14px", fontWeight: "600" }}>A propos</div>
          <h2 style={{ color: "#001459", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: "800", lineHeight: "1.2", marginBottom: "16px" }}>
            Empowering students to <span style={{ color: "#DDBA52" }}>study abroad</span>
          </h2>
          <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.8", maxWidth: "700px", margin: "0 auto" }}>
            ASAS For Education est un cabinet de conseil de premier plan, dedie a transformer vos projets
            d&apos;etudes internationales en realite. Grace a notre vaste reseau de partenaires prestigieux.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
          {[
            { icon: "🎓", title: "Expertise prouvee", desc: "Plus de 3 000 admissions reussies a notre actif, avec un taux de satisfaction exceptionnel.", accent: "#DDBA52" },
            { icon: "🌍", title: "Reseau mondial", desc: "Des partenariats strategiques avec des universites d'elite sur plusieurs continents.", accent: "#001459" },
            { icon: "🤝", title: "Accompagnement complet", desc: "Un soutien de l'inscription jusqu'a l'obtention de votre diplome et au-dela.", accent: "#DD061A" },
          ].map((card, i) => (
            <div key={i} style={{
              backgroundColor: "white", padding: "36px 28px", borderRadius: "14px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)", borderTop: `3px solid ${card.accent}`,
              transition: "transform 0.3s, box-shadow 0.3s", cursor: "default",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)"; }}
            >
              <div style={{ fontSize: "44px", marginBottom: "16px" }}>{card.icon}</div>
              <h3 style={{ color: "#001459", fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>{card.title}</h3>
              <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.7" }}>{card.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link href="/programmes" style={{
            display: "inline-block", background: "linear-gradient(135deg, #001459, #002080)",
            color: "white", padding: "14px 36px", borderRadius: "50px",
            textDecoration: "none", fontSize: "14px", fontWeight: "600",
            boxShadow: "0 4px 20px rgba(0,20,89,0.25)",
          }}>Recherchez votre programme →</Link>
        </div>
      </div>
    </section>
  );
}

function DestinationsSection() {
  const [destinations, setDestinations] = useState<{id: string; name: string; code: string; universityCount: number}[]>([]);
  useEffect(() => {
    fetch("/api/public/countries").then(r => r.json()).then(data => setDestinations(data)).catch(() => {});
  }, []);
  if (destinations.length === 0) return null;
  return (
    <section style={{ padding: "100px 48px", background: "linear-gradient(160deg, #001459 0%, #000B2E 100%)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ color: "#DDBA52", fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "14px", fontWeight: "600" }}>Destinations</div>
          <h2 style={{ color: "white", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: "800", marginBottom: "12px" }}>Explorez nos destinations</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px" }}>Des opportunites dans les meilleurs pays du monde</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {destinations.map((dest) => (
            <Link key={dest.id} href={`/universites?pays=${dest.name.toLowerCase()}`} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px", padding: "28px", textDecoration: "none",
              transition: "all 0.4s", display: "flex", alignItems: "center", gap: "18px",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(221,186,82,0.08)"; e.currentTarget.style.borderColor = "rgba(221,186,82,0.3)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <img src={`https://flagcdn.com/48x36/${dest.code.toLowerCase()}.png`} alt={dest.name} style={{ borderRadius: "4px", width: "48px", height: "36px" }} />
              <div>
                <div style={{ color: "white", fontSize: "17px", fontWeight: "700", marginBottom: "4px" }}>{dest.name}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{dest.universityCount} universite{dest.universityCount !== 1 ? "s" : ""}</div>
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
    firstName: "", lastName: "", email: "", phone: "", city: "", level: "", sessionType: "online",
  });
  const handleChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName, lastName: formData.lastName,
          email: formData.email, phone: formData.phone,
          city: formData.city, educationLevel: formData.level,
          sessionType: formData.sessionType, sourceName: "Site Web",
        }),
      });
      setBookingDone(true);
    } catch (err) { console.error(err); }
    setBookingLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", border: "1px solid #E0E0E0",
    borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" as const,
    outline: "none", backgroundColor: "#FAFAFA", transition: "border-color 0.3s",
  };

  return (
    <section id="booking" style={{ padding: "100px 48px", backgroundColor: "white" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ color: "#DDBA52", fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "14px", fontWeight: "600" }}>Consultation gratuite</div>
          <h2 style={{ color: "#001459", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: "800", marginBottom: "10px" }}>
            Reservez votre seance d&apos;orientation
          </h2>
          <p style={{ color: "#888", fontSize: "14px" }}>30 minutes de consultation individuelle — en ligne ou dans nos bureaux</p>
        </div>
        <form onSubmit={handleBookingSubmit} style={{
          backgroundColor: "white", padding: "36px", borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.06)", border: "1px solid #F0F0F0",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Nom *</label>
              <input type="text" required style={inputStyle} placeholder="Votre nom" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Prenom *</label>
              <input type="text" required style={inputStyle} placeholder="Votre prenom" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Email *</label>
            <input type="email" required style={inputStyle} placeholder="votre@email.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Telephone *</label>
            <input type="tel" required style={inputStyle} placeholder="+212 6XX XXX XXX" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Ville *</label>
              <input type="text" required style={inputStyle} placeholder="Votre ville" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Niveau scolaire *</label>
              <select required style={{ ...inputStyle, cursor: "pointer" }} value={formData.level} onChange={(e) => handleChange("level", e.target.value)}>
                <option value="">Selectionnez</option>
                <option value="bac">Baccalaureat</option>
                <option value="licence">Licence</option>
                <option value="master">Master</option>
                <option value="doctorat">Doctorat</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#444", fontWeight: "600" }}>Type de seance *</label>
            <div style={{ display: "flex", gap: "12px" }}>
              {[{ val: "online", label: "💻 En ligne" }, { val: "office", label: "🏢 Au bureau" }].map((t) => (
                <button key={t.val} type="button" onClick={() => handleChange("sessionType", t.val)} style={{
                  flex: 1, padding: "12px", borderRadius: "8px",
                  border: formData.sessionType === t.val ? "2px solid #DDBA52" : "1px solid #E0E0E0",
                  backgroundColor: formData.sessionType === t.val ? "rgba(221,186,82,0.08)" : "white",
                  color: formData.sessionType === t.val ? "#001459" : "#888",
                  fontSize: "14px", fontWeight: formData.sessionType === t.val ? "600" : "400",
                  cursor: "pointer", transition: "all 0.3s",
                }}>{t.label}</button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={bookingLoading} style={{
            width: "100%", padding: "15px",
            background: bookingDone ? "#E8F5E9" : "linear-gradient(135deg, #DDBA52, #C4A243)",
            color: bookingDone ? "#2E7D32" : "#001459", border: "none", borderRadius: "10px",
            fontSize: "15px", fontWeight: "700", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(221,186,82,0.3)", transition: "all 0.3s",
            opacity: bookingLoading ? 0.7 : 1,
          }}>{bookingLoading ? "Envoi..." : bookingDone ? "✅ Demande envoyee avec succes !" : "Reserver ma consultation gratuite"}</button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: "#000B2E", color: "white", padding: "70px 48px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "50px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <Image src="/images/logo.png" alt="ASAS" width={50} height={50} style={{ objectFit: "contain" }} />
            <span style={{ color: "#DDBA52", fontSize: "15px", fontWeight: "700", letterSpacing: "1.5px" }}>ASAS FOR EDUCATION</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: "1.8", maxWidth: "280px" }}>
            Your stepping stone to success. Nous aidons les etudiants a trouver l&apos;universite de leurs reves.
          </p>
        </div>
        <div>
          <h4 style={{ color: "#DDBA52", fontSize: "12px", letterSpacing: "2px", marginBottom: "18px", textTransform: "uppercase" }}>Navigation</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {["Programmes", "Destinations", "Universites", "Blog"].map((link) => (
              <Link key={link} href={`/${link.toLowerCase()}`} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "13px", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#DDBA52")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >{link}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ color: "#DDBA52", fontSize: "12px", letterSpacing: "2px", marginBottom: "18px", textTransform: "uppercase" }}>Contact</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
            <span>Contact@asasforeducation.com</span>
            <span>Av atlas, imm 19, appt 7</span>
            <span>Agdal, Rabat</span>
          </div>
        </div>
        <div>
          <h4 style={{ color: "#DDBA52", fontSize: "12px", letterSpacing: "2px", marginBottom: "18px", textTransform: "uppercase" }}>Suivez-nous</h4>
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "Fb", url: "https://www.facebook.com/profile.php?id=61551878318212" },
              { label: "Ig", url: "https://www.instagram.com/asasforeducation" },
              { label: "In", url: "https://www.linkedin.com/company/asas-for-education" },
            ].map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                width: "38px", height: "38px", borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "12px",
                fontWeight: "600", transition: "all 0.3s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#DDBA52"; e.currentTarget.style.color = "#DDBA52"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
              >{s.label}</a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px", textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
        © 2026 ASAS For Education. All rights reserved.
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <TopBar />
      <Navbar />
      <HeroSlider />
      <StatsSection />
      <AboutSection />
      <DestinationsSection />
      <BookingSection />
      <Footer />
      <FloatingLogo />
    </div>
  );
}
