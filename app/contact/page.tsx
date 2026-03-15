import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />

      <section style={{ padding: "60px 40px", backgroundColor: "#001459", textAlign: "center" }}>
        <h1 style={{ color: "#DDBA52", fontSize: "36px", fontWeight: "700", marginBottom: "10px" }}>Contactez-nous</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>Nous sommes la pour vous aider dans votre projet d etudes</p>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div>
            <h2 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Nos coordonnees</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>📍</div>
                <div>
                  <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: "0 0 4px" }}>Adresse</h3>
                  <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>Av atlas, imm 19, appt 7<br />Agdal, Rabat, Maroc</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>✉️</div>
                <div>
                  <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: "0 0 4px" }}>Email</h3>
                  <a href="mailto:Contact@asasforeducation.com" style={{ color: "#DDBA52", fontSize: "14px", textDecoration: "none" }}>Contact@asasforeducation.com</a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#F3E5F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>📱</div>
                <div>
                  <h3 style={{ color: "#001459", fontSize: "16px", fontWeight: "700", margin: "0 0 4px" }}>Reseaux sociaux</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <a href="https://www.facebook.com/profile.php?id=61551878318212" target="_blank" rel="noopener noreferrer" style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>Facebook</a>
                    <a href="https://www.instagram.com/asasforeducation" target="_blank" rel="noopener noreferrer" style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>Instagram — @asasforeducation</a>
                    <a href="https://www.linkedin.com/company/asas-for-education" target="_blank" rel="noopener noreferrer" style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Horaires d ouverture</h2>
            <div style={{
              backgroundColor: "white", padding: "24px", borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { day: "Lundi - Vendredi", hours: "9h00 - 18h00" },
                  { day: "Samedi", hours: "9h00 - 13h00" },
                  { day: "Dimanche", hours: "Ferme" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? "1px solid #f0f0f0" : "none" }}>
                    <span style={{ color: "#001459", fontSize: "14px", fontWeight: "600" }}>{item.day}</span>
                    <span style={{ color: item.hours === "Ferme" ? "#C62828" : "#2E7D32", fontSize: "14px", fontWeight: "600" }}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "24px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.5!2d-6.8498!3d33.9947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU5JzQxLjAiTiA2wrA1MCc1OS4zIlc!5e0!3m2!1sfr!2sma!4v1"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
