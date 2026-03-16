import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import LandingForm from "./LandingForm";

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = await prisma.source.findUnique({ where: { slug } });

  if (!source || !source.isActive) return notFound();

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", minHeight: "100vh", background: "linear-gradient(160deg, #001459 0%, #000B2E 50%, #001459 100%)" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Image src="/images/logo.png" alt="ASAS" width={80} height={80} style={{ objectFit: "contain", marginBottom: "16px" }} />
          <h1 style={{ color: "#DDBA52", fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>ASAS For Education</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: "1.6" }}>
            Votre tremplin vers le succes. Remplissez le formulaire et nous vous contacterons dans les plus brefs delais.
          </p>
        </div>

        <LandingForm sourceId={source.id} sourceName={source.name} />

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "24px" }}>
          © 2026 ASAS For Education. Tous droits reserves.
        </p>
      </div>
    </div>
  );
}
