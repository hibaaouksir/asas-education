"use client";
import { useState } from "react";
import UserActions from "./UserActions";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  leadCount: number;
  studentCount: number;
};

const roleConfig: Record<string, { label: string; bg: string; color: string }> = {
  ADMIN: { label: "Admin", bg: "#FFEBEE", color: "#C62828" },
  APPLICATION: { label: "Application", bg: "#F3E5F5", color: "#7B1FA2" },
  CONSULTANT: { label: "Consultant", bg: "#E3F2FD", color: "#1565C0" },
  SUB_AGENT: { label: "Sous-Agent", bg: "#FFF3E0", color: "#E65100" },
};

const tabs = [
  { key: "", label: "Tous" },
  { key: "CONSULTANT", label: "Consultants" },
  { key: "SUB_AGENT", label: "Agents" },
  { key: "APPLICATION", label: "Application" },
  { key: "ADMIN", label: "Admin" },
];

export default function UserTable({ users }: { users: User[] }) {
  const [filter, setFilter] = useState("");

  const filtered = filter ? users.filter(u => u.role === filter) : users;

  return (
    <div>
      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        {tabs.map((tab) => {
          const count = tab.key ? users.filter(u => u.role === tab.key).length : users.length;
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                border: "none",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                backgroundColor: isActive ? "#001459" : "#F0F0F0",
                color: isActive ? "white" : "#666",
                transition: "all 0.2s",
              }}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "visible" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Nom</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Email</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Telephone</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Role</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Leads</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Etudiants</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun utilisateur dans cette categorie.</td></tr>
            ) : (
              filtered.map((user) => {
                const config = roleConfig[user.role] || roleConfig.CONSULTANT;
                return (
                  <tr key={user.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{user.firstName} {user.lastName}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{user.email}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{user.phone || "-"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                        backgroundColor: config.bg, color: config.color,
                      }}>{config.label}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{user.leadCount}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{user.studentCount}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                        backgroundColor: user.isActive ? "#E8F5E9" : "#FFEBEE",
                        color: user.isActive ? "#2E7D32" : "#C62828",
                      }}>{user.isActive ? "Actif" : "Inactif"}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <UserActions userId={user.id} userName={`${user.firstName} ${user.lastName}`} currentRole={user.role} isActive={user.isActive} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
