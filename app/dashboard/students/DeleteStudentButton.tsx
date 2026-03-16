"use client";

import { useRouter } from "next/navigation";

export default function DeleteStudentButton({ studentId, studentName }: { studentId: string; studentName: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Supprimer l etudiant "${studentName}" ? Cette action est irreversible.`)) return;
    try {
      await fetch(`/api/students/${studentId}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleDelete} style={{
      padding: "6px 14px", borderRadius: "6px", border: "1px solid #DD061A",
      backgroundColor: "transparent", color: "#DD061A", fontSize: "12px",
      fontWeight: "600", cursor: "pointer",
    }}>Supprimer</button>
  );
}
