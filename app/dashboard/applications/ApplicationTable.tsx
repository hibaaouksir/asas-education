"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Application = {
  id: string; studentId: string; studentName: string; studentEmail: string; studentPhoto: string;
  universityName: string; programName: string; department: string;
  degree: string; language: string; countryName: string;
  status: string; offerLetter: string; finalAdmission: string;
  source: string; createdAt: string; isUpdated: boolean;
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

  const filtered = filter === "ALL" ? applications : filter === "UPDATED" ? applications.filter(a => a.isUpdated) : applications.filter(a => a.status === filter);

  const counts = {
    ALL: applications.length,
    APPLIED: applications.filter(a => a.status === "APPLIED").length,
    RECEIVED: applications.filter(a => a.status === "RECEIVED").length,
    OFFER_LETTER: applications.filter(a => a.status === "OFFER_LETTER").length,
    PAID: applications.filter(a => a.status === "PAID").length,
    FINAL_ADMISSION: applications.filter(a => a.status === "FINAL_ADMISSION").length,
  };
  const updatedCount = applications.filter(a => a.isUpdated).length;

  const canChangeStatus = role === "ADMIN" || role === "APPLICATION";
  const canUploadDocs = role === "ADMIN" || role === "APPLICATION";

  const getAllowedStatuses = () => {
    if (role === "ADMIN") return Object.keys(statusConfig);
    if (role === "APPLICATION") return ["APPLIED", "RECEIVED", "OFFER_LETTER", "PAID", "FINAL_ADMISSION"];
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
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      window.alert("Seuls les fichiers PDF sont acceptes pour ce document.");
      return;
    }
    setUploading(`${appId}-${field}`);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "asas_uploads");
    formData.append("resource_type", "raw");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/di2ekf6v5/raw/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        await fetch(`/api/applications/${appId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: data.secure_url }),
        });
        router.refresh();
      } else {
        window.alert("Erreur lors de l'upload: " + (data.error?.message || "Erreur inconnue"));
      }
    } catch (err) {
      console.error(err);
      window.alert("Erreur de connexion");
    }
    setUploading("");
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[{ key: "ALL", label: "Toutes" }, { key: "UPDATED", label: "Mis a jour" }, ...Object.entries(statusConfig).map(([key, val]) => ({ key, label: val.label }))].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: "8px 16px", borderRadius: "20px", border: "none", fontSize: "13px",
            fontWeight: "600", cursor: "pointer",
            backgroundColor: filter === key ? (key === "UPDATED" ? "#E65100" : "#001459") : (key === "UPDATED" && updatedCount > 0 ? "#FFF3E0" : "#f0f0f0"),
            color: filter === key ? "white" : (key === "UPDATED" && updatedCount > 0 ? "#E65100" : "#666"),
          }}>{label} ({key === "UPDATED" ? updatedCount : (counts[key as keyof typeof counts] || 0)})</button>
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
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Documents</th>
              {(role === "CONSULTANT" || role === "SUB_AGENT") && <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Aucune candidature.</td></tr>
            ) : (
              filtered.map((app) => {
                const config = statusConfig[app.status] || statusConfig.APPLIED;
                return (
                  <tr key={app.id} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <a href={`/dashboard/students/${app.studentId}/profile`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                        {app.studentPhoto ? (
                          <img src={app.studentPhoto} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "2px solid #DDBA52" }} />
                        ) : (
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#ccc" }}>👤</div>
                        )}
                        <div>
                         <p style={{ fontSize: "14px", fontWeight: "600", color: "#001459", margin: "0 0 2px" }}>
                            {app.studentName}
                            {app.isUpdated && <span style={{ marginLeft: "8px", padding: "2px 8px", borderRadius: "10px", fontSize: "9px", fontWeight: "700", backgroundColor: "#FFF3E0", color: "#E65100" }}>Mis a jour</span>}
                          </p>
                          <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>{app.studentEmail}</p>
                        </div>
                      </a>
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
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{
                            padding: "4px 12px", borderRadius: "20px", fontSize: "12px",
                            fontWeight: "600", backgroundColor: config.bg, color: config.color,
                          }}>{config.label}</span>
                          {(role === "CONSULTANT" || role === "SUB_AGENT") && app.status === "OFFER_LETTER" && (
                            <button onClick={() => handleStatusChange(app.id, "PAID")} style={{
                              padding: "4px 10px", borderRadius: "6px", border: "1px solid #2E7D32",
                              backgroundColor: "transparent", color: "#2E7D32", fontSize: "10px",
                              fontWeight: "700", cursor: "pointer",
                            }}>Marquer Paye</button>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "6px", flexDirection: "column" }}>
                        {/* Offer Letter */}
                        {app.offerLetter ? (
                          <a href={app.offerLetter} target="_blank" rel="noopener noreferrer" download style={{
                            fontSize: "11px", color: "#2E7D32", fontWeight: "600",
                            textDecoration: "none", display: "flex", alignItems: "center", gap: "4px",
                          }}>📄 Offer Letter ✅</a>
                        ) : canUploadDocs && app.status === "OFFER_LETTER" ? (
                          <label style={{ fontSize: "11px", color: "#DDBA52", fontWeight: "600", cursor: "pointer" }}>
                            {uploading === `${app.id}-offerLetter` ? "Upload..." : "📤 Upload Offer Letter (PDF)"}
                            <input type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleUploadDoc(app.id, "offerLetter", e.target.files[0])} />
                          </label>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#ccc" }}>Offer Letter: en attente</span>
                        )}

                        {/* Final Admission */}
                        {app.finalAdmission ? (
                          <a href={app.finalAdmission} target="_blank" rel="noopener noreferrer" download style={{
                            fontSize: "11px", color: "#1B5E20", fontWeight: "600",
                            textDecoration: "none", display: "flex", alignItems: "center", gap: "4px",
                          }}>📄 Final Admission ✅</a>
                        ) : canUploadDocs && app.status === "FINAL_ADMISSION" ? (
                          <label style={{ fontSize: "11px", color: "#DDBA52", fontWeight: "600", cursor: "pointer" }}>
                            {uploading === `${app.id}-finalAdmission` ? "Upload..." : "📤 Upload Final Admission (PDF)"}
                            <input type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleUploadDoc(app.id, "finalAdmission", e.target.files[0])} />
                          </label>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#ccc" }}>Final Admission: en attente</span>
                        )}
                      </div>
                    </td>
                    {(role === "CONSULTANT" || role === "SUB_AGENT") && (
                      <td style={{ padding: "12px 16px" }}>
                        <a href={`/dashboard/students/${app.studentId}?from=applications`} style={{
                          padding: "6px 12px", borderRadius: "6px", border: "1px solid #DDBA52",
                          color: "#DDBA52", textDecoration: "none", fontSize: "12px", fontWeight: "600",
                        }}>Modifier docs</a>
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
