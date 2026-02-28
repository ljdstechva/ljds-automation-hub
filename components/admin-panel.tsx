"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PortfolioData, Project, Certificate } from "@/lib/portfolio-data";
import { 
  addProject, updateProject, deleteProject, 
  addCertificate, updateCertificate, deleteCertificate 
} from "@/lib/actions";
import { logoutAdmin } from "@/lib/admin-auth-actions";
import { ZapIcon, AwardIcon, CloseIcon } from "./icons";

export default function AdminPanel({ initialData }: { initialData: PortfolioData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "certificates">("projects");
  const [editingProject, setEditingProject] = useState<{ id: string; project: Project } | null>(null);
  const [editingCert, setEditingCert] = useState<{ id: string; cert: Certificate } | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // Real-time image preview (controlled by input)
  const [customPreviewUrl, setCustomPreviewUrl] = useState("");

  const displayPreviewUrl = customPreviewUrl || (editingProject?.project.previewImage) || (editingCert?.cert.imageUrl) || "";

  const closeModal = () => {
    setIsAdding(false);
    setEditingProject(null);
    setEditingCert(null);
    setCustomPreviewUrl("");
    setActionError(null);
  };

  const runAdminAction = async (callback: () => Promise<void>) => {
    setActionError(null);
    setIsSubmitting(true);
    try {
      await callback();
      closeModal();
      router.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "An unexpected admin error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProject: Project = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      timeSaved: formData.get("timeSaved") as string,
      costSaved: formData.get("costSaved") as string,
      tags: (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean),
      videoUrl: formData.get("videoUrl") as string,
      previewImage: formData.get("previewImage") as string,
      detailedDescription: (formData.get("detailedDescription") as string).split("\n").filter(d => d.trim()),
    };

    await runAdminAction(async () => {
      if (editingProject) {
        await updateProject(editingProject.id, newProject);
        return;
      }
      await addProject(newProject);
    });
  };

  const handleAddCert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCert: Certificate = {
      id: editingCert ? editingCert.id : `cert-${Date.now()}`,
      title: formData.get("title") as string,
      provider: formData.get("provider") as string,
      issuedDate: formData.get("issuedDate") as string,
      credentialId: formData.get("credentialId") as string,
      categories: (formData.get("categories") as string).split(",").map(t => t.trim()).filter(Boolean),
      skills: (formData.get("skills") as string).split(",").map(s => s.trim()).filter(Boolean),
      imageUrl: formData.get("imageUrl") as string,
      externalUrl: formData.get("externalUrl") as string,
    };

    await runAdminAction(async () => {
      if (editingCert) {
        await updateCertificate(editingCert.id, newCert);
        return;
      }
      await addCertificate(newCert);
    });
  };

  return (
    <div className="admin-grid">
      <aside className="admin-sidebar">
        <button 
          className={`admin-nav-item ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => { setActiveTab("projects"); }}
        >
          <ZapIcon className="icon" style={{marginRight: "0.5rem"}} />
          Projects
        </button>
        <button 
          className={`admin-nav-item ${activeTab === "certificates" ? "active" : ""}`}
          onClick={() => { setActiveTab("certificates"); }}
        >
          <AwardIcon className="icon" style={{marginRight: "0.5rem"}} />
          Certificates
        </button>
      </aside>

      <main className="admin-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2>{activeTab === "projects" ? "Manage Projects" : "Manage Certificates"}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <form action={logoutAdmin}>
              <button type="submit" className="admin-button secondary">Logout</button>
            </form>
            <button className="admin-button" onClick={() => setIsAdding(true)} disabled={isSubmitting}>
              + Add {activeTab === "projects" ? "Project" : "Certificate"}
            </button>
          </div>
        </div>

        {actionError && <p className="admin-error">{actionError}</p>}

        <div className="admin-list">
          {activeTab === "projects" ? (
            initialData.projects.map((project) => (
              <div key={project.id} className="list-item">
                <div className="list-item-info">
                  <strong>{project.title}</strong>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                    {project.tags.slice(0, 3).map(tag => <span key={tag} className="badge">{tag}</span>)}
                  </div>
                </div>
                <div className="list-item-actions">
                  <button className="admin-button secondary" onClick={() => setEditingProject({ id: project.id!, project })} disabled={isSubmitting}>Edit</button>
                  <button className="admin-button secondary" style={{ color: "var(--accent)" }} onClick={async () => {
                    if(confirm("Delete this project?")) {
                      await runAdminAction(async () => {
                        await deleteProject(project.id!);
                      });
                    }
                  }} disabled={isSubmitting}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            initialData.certificates.map((cert) => (
              <div key={cert.id} className="list-item">
                <div className="list-item-info">
                  <strong>{cert.title}</strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{cert.provider}</span>
                </div>
                <div className="list-item-actions">
                  <button className="admin-button secondary" onClick={() => setEditingCert({ id: cert.id, cert })} disabled={isSubmitting}>Edit</button>
                  <button className="admin-button secondary" style={{ color: "var(--accent)" }} onClick={async () => {
                    if(confirm("Delete this certificate?")) {
                      await runAdminAction(async () => {
                        await deleteCertificate(cert.id);
                      });
                    }
                  }} disabled={isSubmitting}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating Modal */}
        {(isAdding || editingProject || editingCert) && (
          <div className="admin-modal-overlay" onClick={(e) => { if(e.target === e.currentTarget) closeModal(); }}>
            <div className="admin-modal-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h3>{editingProject || editingCert ? "Edit" : "Add New"} {activeTab === "projects" ? "Project" : "Certificate"}</h3>
                <button className="icon-button" onClick={closeModal} disabled={isSubmitting}>
                  <CloseIcon className="icon" />
                </button>
              </div>

              {actionError && <p className="admin-error">{actionError}</p>}

              {activeTab === "projects" ? (
                <form onSubmit={handleAddProject} className="admin-form">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div>
                      <div className="form-group">
                        <label>Title</label>
                        <input name="title" defaultValue={editingProject?.project.title} required placeholder="Project Name" />
                      </div>
                      <div className="form-group">
                        <label>Description (Short)</label>
                        <textarea name="description" defaultValue={editingProject?.project.description} required rows={3} />
                      </div>
                      <div className="form-group">
                        <label>Time Saved</label>
                        <input name="timeSaved" defaultValue={editingProject?.project.timeSaved} placeholder="e.g. 5 hours per week" />
                      </div>
                      <div className="form-group">
                        <label>Cost Saved</label>
                        <input name="costSaved" defaultValue={editingProject?.project.costSaved} placeholder="e.g. $500 per month" />
                      </div>
                      <div className="form-group">
                        <label>Tags (comma separated)</label>
                        <input name="tags" defaultValue={editingProject?.project.tags.join(", ")} placeholder="n8n, AI, Automation" />
                      </div>
                    </div>
                    <div>
                      <div className="form-group">
                        <label>Preview Image URL</label>
                        <input 
                          name="previewImage" 
                          defaultValue={editingProject?.project.previewImage} 
                          onChange={(e) => setCustomPreviewUrl(e.target.value)}
                        />
                        <div className="image-preview-container">
                          {displayPreviewUrl ? (
                            <Image 
                              src={displayPreviewUrl} 
                              alt="Project Preview" 
                              width={300}
                              height={200}
                              style={{ objectFit: "cover", width: "100%", height: "100%" }}
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL'; }} 
                            />
                          ) : (
                            <div className="image-preview-placeholder">Image Preview</div>
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Video URL</label>
                        <input name="videoUrl" defaultValue={editingProject?.project.videoUrl} placeholder="Google Drive / YouTube Link" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Detailed Description (one per line)</label>
                    <textarea name="detailedDescription" defaultValue={editingProject?.project.detailedDescription.join("\n")} rows={5} />
                  </div>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button type="submit" className="admin-button" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Project"}</button>
                    <button type="button" className="admin-button secondary" onClick={closeModal} disabled={isSubmitting}>Cancel</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddCert} className="admin-form">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div>
                      <div className="form-group">
                        <label>Title</label>
                        <input name="title" defaultValue={editingCert?.cert.title} required />
                      </div>
                      <div className="form-group">
                        <label>Provider</label>
                        <input name="provider" defaultValue={editingCert?.cert.provider} required />
                      </div>
                      <div className="form-group">
                        <label>Issued Date</label>
                        <input name="issuedDate" defaultValue={editingCert?.cert.issuedDate} />
                      </div>
                      <div className="form-group">
                        <label>Credential ID</label>
                        <input name="credentialId" defaultValue={editingCert?.cert.credentialId} />
                      </div>
                      <div className="form-group">
                        <label>Categories (comma separated)</label>
                        <input name="categories" defaultValue={editingCert?.cert.categories.join(", ")} />
                      </div>
                    </div>
                    <div>
                      <div className="form-group">
                        <label>Image URL</label>
                        <input 
                          name="imageUrl" 
                          defaultValue={editingCert?.cert.imageUrl} 
                          onChange={(e) => setCustomPreviewUrl(e.target.value)}
                        />
                        <div className="image-preview-container">
                          {displayPreviewUrl ? (
                            <Image 
                              src={displayPreviewUrl} 
                              alt="Certificate Preview" 
                              width={300}
                              height={200}
                              style={{ objectFit: "cover", width: "100%", height: "100%" }}
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL'; }} 
                            />
                          ) : (
                            <div className="image-preview-placeholder">Image Preview</div>
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <input name="skills" defaultValue={editingCert?.cert.skills.join(", ")} />
                      </div>
                      <div className="form-group">
                        <label>External URL</label>
                        <input name="externalUrl" defaultValue={editingCert?.cert.externalUrl} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button type="submit" className="admin-button" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Certificate"}</button>
                    <button type="button" className="admin-button secondary" onClick={closeModal} disabled={isSubmitting}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
