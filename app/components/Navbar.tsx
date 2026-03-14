"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      backgroundColor: "#001459",
      padding: "0 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "70px",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      fontFamily: "Poppins, sans-serif",
    }}>
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ color: "#DDBA52", fontSize: "22px", fontWeight: "bold", letterSpacing: "1px" }}>
          ASAS
        </span>
        <span style={{ color: "white", fontSize: "12px", lineHeight: "1.2" }}>
          FOR EDUCATION
        </span>
      </Link>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "32px",
      }}>
        <Link href="/programmes" style={{ color: "white", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
          Programmes
        </Link>
        <Link href="/destinations" style={{ color: "white", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
          Destinations
        </Link>
        <Link href="/universites" style={{ color: "white", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
          Universites
        </Link>
        <Link href="/contact" style={{ color: "white", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
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
