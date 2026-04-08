"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 769);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const links = [
    { href: "/programmes", label: "Programmes" },
    { href: "/destinations", label: "Destinations" },
    { href: "/universites", label: "Universites" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav style={{
      backgroundColor: "white",
      padding: isMobile ? "0 16px" : "0 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "70px",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      fontFamily: "Poppins, sans-serif",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/asas-logo.svg" alt="ASAS" style={{ height: "50px", objectFit: "contain" }} />
      </Link>

      {/* Desktop menu */}
      {!isMobile && (
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={{ color: "#001459", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>{l.label}</Link>
          ))}
          <Link href="/#booking" style={{
            backgroundColor: "#DDBA52", color: "#001459", padding: "10px 20px",
            borderRadius: "6px", textDecoration: "none", fontSize: "14px", fontWeight: "bold",
          }}>Prenez un RDV</Link>
        </div>
      )}

      {/* Hamburger button - mobile only */}
      {isMobile && (
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", gap: "5px", padding: "8px",
        }}>
          <span style={{ width: "24px", height: "3px", backgroundColor: "#001459", borderRadius: "2px", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ width: "24px", height: "3px", backgroundColor: "#001459", borderRadius: "2px", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: "24px", height: "3px", backgroundColor: "#001459", borderRadius: "2px", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      )}

      {/* Mobile menu dropdown */}
      {isMobile && menuOpen && (
        <div style={{
          position: "absolute", top: "70px", left: 0, right: 0,
          backgroundColor: "white", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          display: "flex", flexDirection: "column", padding: "16px 24px", gap: "4px",
          zIndex: 999,
        }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              color: "#001459", textDecoration: "none", fontSize: "15px", fontWeight: "600",
              padding: "12px 0", borderBottom: "1px solid #f0f0f0",
            }}>{l.label}</Link>
          ))}
          <Link href="/#booking" onClick={() => setMenuOpen(false)} style={{
            backgroundColor: "#DDBA52", color: "#001459", padding: "12px 20px",
            borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: "bold",
            textAlign: "center", marginTop: "8px",
          }}>Prenez un RDV</Link>
        </div>
      )}
    </nav>
  );
}
