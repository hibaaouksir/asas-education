"use client";

import Link from "next/link";

export default function Navbar() {
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

      <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
        <Link href="/programmes" style={{ color: "#001459", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
          Programmes
        </Link>
        <Link href="/destinations" style={{ color: "#001459", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
          Destinations
        </Link>
        <Link href="/universites" style={{ color: "#001459", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
          Universites
        </Link>
        <Link href="/blog" style={{ color: "#001459", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
          Blog
        </Link>
        <Link href="/contact" style={{ color: "#001459", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
          Contact
        </Link>
        <Link href="#booking" style={{
          backgroundColor: "#DDBA52",
          color: "#001459",
          padding: "10px 20px",
          borderRadius: "6px",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: "bold",
        }}>
          Prenez un RDV
        </Link>
      </div>
    </nav>
  );
}
