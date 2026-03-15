"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserActions({ userId, userName, currentRole, isActive }: { userId: string; userName: string; currentRole: string; isActive: boolean }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Supprimer l utilisateur "${userName}" ? Cette action est irreversible.`)) return;
    try {
      await fetch(`/api/agents?id=${userId}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeRole = async (newRole: string) => {
    try {
      await fetch("/api/agents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      setShowMenu(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async () => {
    try {
      await fetch("/api/agents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, isActive: !isActive }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: "relative", display: "flex", gap: "6px", alignItems: "center" }}>
      <button onClick={() => setShowMenu(!showMenu)} style={{
        padding: "4px 10px", borderRadius: "6px", border: "1px solid #ddd",
        backgroundColor: "white", color: "#001459", fontSize: "12px",
        fontWeight: "600", cursor: "pointer",
      }}>Role ▼</button>

      {showMenu && (
        <div style={{
          position: "absolute", top: "100%", left: 0, marginTop: "4px",
          backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 50, overflow: "hidden", minWidth: "140px",
        }}>
          {["ADMIN", "APPLICATION", "CONSULTANT", "SUB_AGENT"].map((role) => (
            <button key={role} onClick={() => handleChangeRole(role)} style={{
              display: "block", width: "100%", padding: "8px 14px", border: "none",
              backgroundColor: currentRole === role ? "#f5f5f5" : "white",
              color: "#001459", fontSize: "12px", fontWeight: currentRole === role ? "700" : "400",
              cursor: "pointer", textAlign: "left",
            }}>{role}</button>
          ))}
        </div>
      )}

      <button onClick={handleToggleActive} style={{
        padding: "4px 10px", borderRadius: "6px", border: "1px solid",
        borderColor: isActive ? "#E65100" : "#2E7D32",
        backgroundColor: "transparent",
        color: isActive ? "#E65100" : "#2E7D32",
        fontSize: "11px", fontWeight: "600", cursor: "pointer",
      }}>{isActive ? "Desactiver" : "Activer"}</button>

      <button onClick={handleDelete} style={{
        padding: "4px 10px", borderRadius: "6px", border: "1px solid #DD061A",
        backgroundColor: "transparent", color: "#DD061A", fontSize: "11px",
        fontWeight: "600", cursor: "pointer",
      }}>Supprimer</button>
    </div>
  );
}
