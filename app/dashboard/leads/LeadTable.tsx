"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string; firstName: string; lastName: string; email: string;
  phone: string; city: string; educationLevel: string; status: string;
  source: string; universityName: string; consultantId: string;
  consultantName: string; createdAt: string;
};
type Consultant = { id: string; name: string };

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  NEW: { label: "New", bg: "#E3F2FD", color: "#1565C0" },
  QUALIFYING: { label: "Qualifying", bg: "#FFF3E0", color: "#E65100" },
  QUALIFIED: { label: "Qualified", bg: "#F3E5F5", color: "#7B1FA2" },
  APPOINTMENT: { label: "Appointment", bg: "#E8F5E9", color: "#2E7D32" },
  DEAL: { label: "Deal", bg: "#FFEBEE", color: "#C62828" },
  NOT_INTERESTED: { label: "Not Interested", bg: "#F5F5F5", color: "#888" },
};

export default function LeadTable({ leads, consultants, isAdmin }: { leads: Lead[]; consultants: Consultant[]; isAdmin: boolean }) {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [converting, setConverting] = useState("");

  const filtered = filter === "ALL" ? leads : leads.filter(l => l.status === filter);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    await fetch(`/api/leads/${leadId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  };

  const handleAssign = async (leadId: string, consultantId: string) => {
    await fetch(`/api/leads/${leadId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consultantId }),
    });
    router.refresh();
  };

  const handleConvertToStudent = async (lead: Lead) => {
    setConverting(lead.id);
    try {
      await fetch("/api/leads/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
    setConverting("");
  };

  const counts = {
    ALL: leads.length,
    NEW: leads.filter(l => l.status === "NEW").length,
    QUALIFYING: leads.filter(l => l.status === "QUALIFYING").length,
    QUALIFIED: leads.filter(l => l.status === "QUALIFIED").length,
    APPOINTMENT: leads.filter(l => l.status === "APPOINTMENT").length,
    DEAL: leads.filter(l => l.status === "DEAL").length,
  };

  return (
    <div>
      {isAdmin && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <a href="/api/export?type=leads" style={{
            padding: "8px 16px", borderRadius: "8px", border: "1px solid #2E7D32",
            backgroundColor: "transparent", color: "#2E7D32", fontSize: "13px",
            fontWeight: "600", textDecoration: "none",
          }}>Export Excel</a>
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[{ key: "ALL", label: "Tous" }, ...Object.entries(statusConfig).map(([key, val]) => ({ key, label: val.label }))].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: "8px 16px", borderRadius: "20px", border: "none", fontSize: "13px",
            fontWeight: "600", cursor: "pointer",
            backgroundColor: filter === key ? "#001459" : "#f0f0f0",
            color: filter === key ? "white" : "#666",
          }}>{label} ({counts[key as keyof typeof counts] || 0})</button>
        ))}
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "visible" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Nom</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Email</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Ville</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Niveau</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Source</th>
              {isAdmin && <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Consultant</th>}
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={isAdmin ? 8 : 7} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucun lead.</td></tr>
            ) : (
              filtered.map((lead) => {
                const config = statusConfig[lead.status] || statusConfig.NEW;
                return (
                  <tr key={lead.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#001459" }}>{lead.firstName} {lead.lastName}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{lead.email}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{lead.city}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{lead.educationLevel}</td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#888" }}>{lead.source.replace("_", " ")}</td>
                    {isAdmin && (
                      <td style={{ padding: "12px 16px" }}>
                        <select value={lead.consultantId} onChange={(e) => handleAssign(lead.id, e.target.value)} style={{
                          padding: "4px 8px", borderRadius: "6px", border: "1px solid #ddd",
                          fontSize: "12px", cursor: "pointer",
                        }}>
                          <option value="">Non assigne</option>
                          {consultants.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </td>
                    )}
                    <td style={{ padding: "12px 16px" }}>
                      <select value={lead.status} onChange={(e) => handleStatusChange(lead.id, e.target.value)} style={{
                        padding: "4px 10px", borderRadius: "20px", border: "none",
                        fontSize: "12px", fontWeight: "600", cursor: "pointer",
                        backgroundColor: config.bg, color: config.color,
                      }}>
                        {Object.entries(statusConfig).map(([key, val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {lead.status === "DEAL" && (
                        <button onClick={() => handleConvertToStudent(lead)} disabled={converting === lead.id} style={{
                          padding: "6px 12px", borderRadius: "6px", border: "none",
                          backgroundColor: "#DDBA52", color: "#001459", fontSize: "11px",
                          fontWeight: "700", cursor: "pointer",
                          opacity: converting === lead.id ? 0.7 : 1,
                        }}>{converting === lead.id ? "..." : "→ Etudiant"}</button>
                      )}
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
