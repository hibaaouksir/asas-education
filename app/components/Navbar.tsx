"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      backgroundColor: "white",
      padding: "0 40px",
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
        <img src="/images/logo.png" alt="ASAS" style={{ height: "50px", objectFit: "contain" }} />
      </Link>

      {/* Desktop menu */}
      <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
        <Link href="/programmes" style={{ color: "#001459", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>Programmes</Link>
        <Link href="/destinations" style={{ color: "#001459", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>Destinations</Link>
        <Link href="/universites" style={{ color: "#001459", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>Universites</Link>
        <Link href="/blog" style={{ color: "#001459", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>Blog</Link>
        <Link href="/contact" style={{ color: "#001459", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>Contact</Link>
        <Link href="/#booking" style={{
          backgroundColor: "#DDBA52", color: "#001459", padding: "10px 20px",
          borderRadius: "6px", textDecoration: "none", fontSize: "14px", fontWeight: "bold",
        }}>Prenez un RDV</Link>
      </div>

      {/* Hamburger button */}
      <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
        display: "none", background: "none", border: "none", cursor: "pointer",
        flexDirection: "column", gap: "5px", padding: "8px",
      }}>
        <span style={{ width: "24px", height: "3px", backgroundColor: "#001459", borderRadius: "2px", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
        <span style={{ width: "24px", height: "3px", backgroundColor: "#001459", borderRadius: "2px", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
        <span style={{ width: "24px", height: "3px", backgroundColor: "#001459", borderRadius: "2px", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile" style={{
          position: "absolute", top: "70px", left: 0, right: 0,
          backgroundColor: "white", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          display: "flex", flexDirection: "column", padding: "16px 24px", gap: "4px",
          zIndex: 999,
        }}>
          <Link href="/programmes" onClick={() => setMenuOpen(false)} style={{ color: "#001459", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>Programmes</Link>
          <Link href="/destinations" onClick={() => setMenuOpen(false)} style={{ color: "#001459", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>Destinations</Link>
          <Link href="/universites" onClick={() => setMenuOpen(false)} style={{ color: "#001459", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>Universites</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} style={{ color: "#001459", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>Blog</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ color: "#001459", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>Contact</Link>
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
