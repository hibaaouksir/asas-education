import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "#001459",
      color: "white",
      padding: "60px 40px 30px",
      fontFamily: "Poppins, sans-serif",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <div>
          <h3 style={{ color: "#DDBA52", fontSize: "20px", marginBottom: "16px" }}>
            ASAS FOR EDUCATION
          </h3>
          <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#ccc" }}>
            Your stepping stone to success. We help students find their dream university abroad.
          </p>
        </div>

        <div>
          <h4 style={{ color: "#DDBA52", fontSize: "16px", marginBottom: "16px" }}>Quick Links</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link href="/programmes" style={{ color: "#ccc", textDecoration: "none", fontSize: "14px" }}>Programmes</Link>
            <Link href="/destinations" style={{ color: "#ccc", textDecoration: "none", fontSize: "14px" }}>Destinations</Link>
            <Link href="/universites" style={{ color: "#ccc", textDecoration: "none", fontSize: "14px" }}>Universites</Link>
            <Link href="/contact" style={{ color: "#ccc", textDecoration: "none", fontSize: "14px" }}>Contact</Link>
          </div>
        </div>

        <div>
          <h4 style={{ color: "#DDBA52", fontSize: "16px", marginBottom: "16px" }}>Contact</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#ccc" }}>
            <span>Email: contact@asasforeducation.com</span>
            <span>Phone: +212 6 00 00 00 00</span>
            <span>Meknes, Morocco</span>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: "1px solid #333",
        marginTop: "40px",
        paddingTop: "20px",
        textAlign: "center",
        fontSize: "13px",
        color: "#888",
      }}>
        &copy; 2026 ASAS For Education. All rights reserved.
      </div>
    </footer>
  );
}
