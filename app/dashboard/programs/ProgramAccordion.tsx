"use client";

import { useState } from "react";

export default function ProgramAccordion({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: "18px", color: "#001459", padding: "4px",
        transition: "transform 0.3s",
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "28px", height: "28px", borderRadius: "6px",
        backgroundColor: open ? "#E3F2FD" : "#F5F5F5",
      }}>
        ▶
      </button>
      {open && (
        <div style={{ marginTop: "12px" }}>
          {children}
        </div>
      )}
    </div>
  );
}
