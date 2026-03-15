"use client";

import { useRouter } from "next/navigation";

type Props = {
  universityId: string;
  universityName: string;
};

export default function UniversityActions({ universityId, universityName }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Supprimer ${universityName} et tous ses programmes ?`)) return;
    try {
      await fetch(`/api/universities/${universityId}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <button onClick={() => router.push(`/dashboard/universities/${universityId}`)} style={{
        padding: "5px 12px", borderRadius: "6px", border: "1px solid #DDBA52",
        backgroundColor: "transparent", color: "#DDBA52", fontSize: "12px",
        fontWeight: "600", cursor: "pointer",
      }}>Modifier</button>
      <button onClick={handleDelete} style={{
        padding: "5px 12px", borderRadius: "6px", border: "1px solid #DD061A",
        backgroundColor: "transparent", color: "#DD061A", fontSize: "12px",
        fontWeight: "600", cursor: "pointer",
      }}>Supprimer</button>
    </div>
  );
}
