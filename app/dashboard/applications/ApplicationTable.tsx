"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Application = {
  id: string; studentName: string; studentEmail: string;
  universityName: string; programName: string; department: string;
  degree: string; language: string; countryName: string;
  status: string; offerLetter: string; finalAdmission: string;
  source: string; createdAt: string;
};

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  APPLIED: { label: "Applied", bg: "#E3F2FD", color: "#1565C0" },
  RECEIVED: { label: "Received", bg: "#FFF3E0", color: "#E65100" },
  OFFER_LETTER: { label: "Offer Letter", bg: "#F3E5F5", color: "#7B1FA2" },
  PAID: { label: "Paid", bg: "#E8F5E9", color: "#2E7D32" },
  FINAL_ADMISSION: { label: "Final Admission", bg: "#E8F5E9", color: "#1B5E20" },
};

export default function ApplicationTable({ applications, isAdmin, role }: { applications: Application[]; isAdmin: boolean; role: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [uploading, setUploading] = useState("");

  const filtered = filter === "ALL" ? applications : applications.filter(a => a.status === filter);

  const counts = {
    ALL: applications.length,
    APPLIED: applications.filter(a => a.status === "APPLIED").length,
    RECEIVED: applications.filter(a => a.status === "RECEIVED").length,
    OFFER_LETTER: applications.filter(a => a.status === "OFFER_LETTER").length,
    PAID: applications.filter(a => a.status === "PAID").length,
    FINAL_ADMISSION: applications.filter(a => a.status === "FINAL_ADMISSION").length,
  };

  const canChangeStatus = role === "ADMIN" || role === "APPLICATION" || role === "CONSULTANT";
  const canUploadDocs = role === "ADMIN" || role === "APPLICATION";

  const getAllowedStatuses = () => {
    if (role === "ADMIN") return Object.keys(statusConfig);
    if (role === "APPLICATION") return ["APPLIED", "RECEIVED", "OFFER_LETTER", "FINAL_ADMISSION"];
    if (role === "CONSULTANT") return ["APPLIED", "RECEIVED", "OFFER_LETTER", "PAID", "FINAL_ADMISSION"];
    return [];
  };

  const allowedStatuses = getAllowedStatuses();

  const handleStatusChange = async (appId: string, newStatus: string) => {
    await fetch(`/api/applications/${appId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  };

  const handleUploadDoc = async (appId: string, field: string, file: File) => {
    setUploading(`${appId}-${field}`);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "asas_uploads");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/di2ekf6v5/auto/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: data.secure_url }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
    setUploading("");
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[{ key: "ALL", label: "Toutes" }, ...Object.entries(statusConfig).map(([key, val]) => ({ key, label: val.label }))].map(({ key, label }) => (
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
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Etudiant</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Universite</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Programme</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Niveau</th>
              {(role === "ADMIN" || role === "APPLICATION") && <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Source</th>}
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Statut</th>
              {canUploadDocs && <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Documents</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucune candidature.</td></tr>
            ) : (
              filtered.map((app) => {
                const config = statusConfig[app.status] || statusConfig.APPLIED;
                return (
                  <tr key={app.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#001459", margin: "0 0 2px" }}>{app.studentName}</p>
                      <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>{app.studentEmail}</p>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{app.universityName}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ fontSize: "13px", color: "#001459", fontWeight: "600", margin: "0 0 2px" }}>{app.programName}</p>
                      <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>{app.department}</p>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600", backgroundColor: "#E3F2FD", color: "#1565C0" }}>{app.degree}</span>
                    </td>
                    {(role === "ADMIN" || role === "APPLICATION") && (
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: "12px", color: "#888" }}>{app.source}</span>
                      </td>
                    )}
                    <td style={{ padding: "12px 16px" }}>
                      {canChangeStatus ? (
                        <select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value)} style={{
                          padding: "4px 10px", borderRadius: "20px", border: "none",
                          fontSize: "12px", fontWeight: "600", cursor: "pointer",
                          backgroundColor: config.bg, color: config.color,
                        }}>
                          {allowedStatuses.map((key) => (
                            <option key={key} value={key}>{statusConfig[key].label}</option>
                          ))}
                        </select>
                      ) : (
                        <span style={{
                          padding: "4px 12px", borderRadius: "20px", fontSize: "12px",
                          fontWeight: "600", backgroundColor: config.bg, color: config.color,
                        }}>{config.label}</span>
                      )}
                    </td>
                    {canUploadDocs && (
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "6px", flexDirection: "column" }}>
                          {app.offerLetter ? (
                            <a href={app.offerLetter} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#2E7D32", fontWeight: "600" }}>Offer Letter ✅</a>
                          ) : (
                            <label style={{ fontSize: "11px", color: "#DDBA52", fontWeight: "600", cursor: "pointer" }}>
                              {uploading === `${app.id}-offerLetter` ? "..." : "Upload Offer Letter"}
                              <input type="file" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleUploadDoc(app.id, "offerLetter", e.target.files[0])} />
                            </label>
                          )}
                          {app.finalAdmission ? (
                            <a href={app.finalAdmission} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#1B5E20", fontWeight: "600" }}>Final Admission ✅</a>
                          ) : (
                            <label style={{ fontSize: "11px", color: "#DDBA52", fontWeight: "600", cursor: "pointer" }}>
                              {uploading === `${app.id}-finalAdmission` ? "..." : "Upload Final Admission"}
                              <input type="file" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleUploadDoc(app.id, "finalAdmission", e.target.files[0])} />
                            </label>
                          )}
                        </div>
                      </td>
                    )}
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