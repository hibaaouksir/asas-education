"use client";

import { useRouter } from "next/navigation";

export default function ApplyButton({ studentId, studentName, docsComplete }: { studentId: string; studentName: string; docsComplete: boolean }) {
  const router = useRouter();

  const handleApply = async () => {
    if (!docsComplete) {
      alert(`Les documents de ${studentName} ne sont pas encore complets. Veuillez uploader au moins le releve de notes et le passeport avant de candidater.`);
      return;
    }

    if (!confirm(`Envoyer la candidature de ${studentName} a l'application ?`)) return;

    try {
      const res = await fetch(`/api/students/${studentId}/apply`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Candidature envoyee avec succes !");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleApply} style={{
      padding: "4px 12px", borderRadius: "6px", border: "none",
      backgroundColor: docsComplete ? "#DDBA52" : "#E0E0E0",
      color: docsComplete ? "#001459" : "#999",
      fontSize: "12px", fontWeight: "700", cursor: "pointer",
    }}>Apply</button>
  );
}