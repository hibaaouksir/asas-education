"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        padding: "8px 20px", borderRadius: "6px",
        border: "1px solid #ddd", backgroundColor: "white",
        color: "#666", fontSize: "13px", cursor: "pointer",
      }}
    >
      Deconnexion
    </button>
  );
}
