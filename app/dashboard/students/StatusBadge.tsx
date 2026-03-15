"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  EN_ATTENTE: { label: "En attente", bg: "#FFF3E0", color: "#E65100" },
  EN_COURS: { label: "En cours", bg: "#E3F2FD", color: "#1565C0" },
  VALIDE: { label: "Valide", bg: "#E8F5E9", color: "#2E7D32" },
  REFUSE: { label: "Refuse", bg: "#FFEBEE", color: "#C62828" },
};

export default function StatusBadge({ studentId, currentStatus, canChange }: { studentId: string; currentStatus: string; canChange: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const config = statusConfig[currentStatus] || statusConfig.EN_ATTENTE;

  const handleChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await fetch(`/api/students/${studentId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!canChange) {
    return (
      <span style={{
        padding: "4px 12px", borderRadius: "20px", fontSize: "12px",
        fontWeight: "600", backgroundColor: config.bg, color: config.color,
      }}>{config.label}</span>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        padding: "4px 12px", borderRadius: "20px", fontSize: "12px",
        fontWeight: "600", backgroundColor: config.bg, color: config.color,
        border: "none", cursor: "pointer",
      }}>{config.label} ▼</button>

      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, marginTop: "4px",
          backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 50, overflow: "hidden", minWidth: "140px",
        }}>
          {Object.entries(statusConfig).map(([key, val]) => (
            <button key={key} onClick={() => handleChange(key)} disabled={loading} style={{
              display: "block", width: "100%", padding: "8px 14px", border: "none",
              backgroundColor: currentStatus === key ? "#f5f5f5" : "white",
              color: val.color, fontSize: "12px", fontWeight: "600",
              cursor: "pointer", textAlign: "left",
            }}>{val.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}
