"use client";

import { useRouter } from "next/navigation";

export default function DeleteBlogButton({ blogId, blogTitle }: { blogId: string; blogTitle: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Supprimer l article "${blogTitle}" ?`)) return;
    try {
      await fetch(`/api/blog/${blogId}`, { method: "DELETE" });
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
