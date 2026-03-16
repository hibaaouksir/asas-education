"use client";

import { useRouter } from "next/navigation";

export default function DeleteSourceButton({ sourceId, sourceName }: { sourceId: string; sourceName: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Supprimer la source "${sourceName}" ?`)) return;
    try {
      await fetch(`/api/sources/${sourceId}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleDelete} style={{
      padding: "4px 10px", borderRadius: "6px", border: "1px solid #DD061A",
      backgroundColor: "transparent", color: "#DD061A", fontSize: "12px",
      fontWeight: "600", cursor: "pointer",
    }}>Supprimer</button>
  );
}
