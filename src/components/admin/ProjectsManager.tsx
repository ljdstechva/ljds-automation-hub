import { useMemo, useRef, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, ExternalLink, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  preview_image: string;
  link: string;
  category: string;
  time_saved: string;
  cost_saved: string;
  tags: string[];
  video_url: string;
  detailed_description: string[];
  created_at: string;
}

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [isEditing, setIsEditing] = useState(false);
  const initialProjectRef = useRef<Partial<Project>>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !data.session) {
        throw new Error("Your session expired. Please sign in again.");
      }

      const fileExt = file.name.split(".").pop() || "bin";
      const uniqueId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const filePath = `${data.session.user.id}/${uniqueId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || undefined,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Unable to retrieve image URL.");
      }

      setCurrentProject({ ...currentProject, preview_image: publicUrlData.publicUrl });
      toast.success("Image uploaded successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error uploading image";
      toast.error(message);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !data.session) {
      toast.error("Your session expired. Please sign in again.");
      return;
    }

    if (!currentProject.title) {
      toast.error("Title is required");
      return;
    }

    const normalizedTags = (currentProject.tags || []).map((tag) => tag.trim()).filter(Boolean);
    const normalizedDetails = (currentProject.detailed_description || []).map((point) => point.trim()).filter(Boolean);

    try {
      if (isEditing && currentProject.id) {
        const { error } = await supabase
          .from("projects")
          .update({
            title: currentProject.title,
            description: currentProject.description,
            image_url: currentProject.image_url,
            preview_image: currentProject.preview_image,
            link: currentProject.link,
            category: currentProject.category,
            time_saved: currentProject.time_saved,
            cost_saved: currentProject.cost_saved,
            tags: normalizedTags,
            video_url: currentProject.video_url,
            detailed_description: normalizedDetails,
          })
          .eq("id", currentProject.id);

        if (error) throw error;
        toast.success("Project updated successfully");
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([
            {
              title: currentProject.title,
              description: currentProject.description,
              image_url: currentProject.image_url,
              preview_image: currentProject.preview_image,
              link: currentProject.link,
              category: currentProject.category,
              time_saved: currentProject.time_saved,
              cost_saved: currentProject.cost_saved,
              tags: normalizedTags,
              video_url: currentProject.video_url,
              detailed_description: normalizedDetails,
            },
          ]);

        if (error) throw error;
        toast.success("Project added successfully");
      }

      setIsDialogOpen(false);
      fetchProjects();
      setCurrentProject({});
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || "An unknown error occurred";
      toast.error("Error saving project: " + message);
    }
  };

  const handleDelete = async (id: string) => {
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !data.session) {
      toast.error("Your session expired. Please sign in again.");
      return;
    }

    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error deleting project");
    } else {
      toast.success("Project deleted");
      fetchProjects();
    }
  };

  const openAddDialog = () => {
    setCurrentProject({});
    setIsEditing(false);
    setIsDialogOpen(true);
    initialProjectRef.current = {};
  };

  const openEditDialog = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
    setIsDialogOpen(true);
    initialProjectRef.current = project;
  };

  const serializeProject = (project: Partial<Project>) =>
    JSON.stringify({
      title: project.title || "",
      description: project.description || "",
      image_url: project.image_url || "",
      preview_image: project.preview_image || "",
      link: project.link || "",
      category: project.category || "",
      time_saved: project.time_saved || "",
      cost_saved: project.cost_saved || "",
      tags: project.tags || [],
      video_url: project.video_url || "",
      detailed_description: project.detailed_description || [],
    });

  const isDirty = useMemo(() => {
    return serializeProject(currentProject) !== serializeProject(initialProjectRef.current);
  }, [currentProject]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">My Projects</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[500px]"
            onPointerDownOutside={(event) => {
              if (isDirty) {
                event.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={currentProject.title || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                  placeholder="Project Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={currentProject.category || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                  placeholder="e.g., Web App, Mobile, Branding"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={currentProject.description || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  placeholder="Project details..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeSaved">Time Saved</Label>
                <Input
                  id="timeSaved"
                  value={currentProject.time_saved || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, time_saved: e.target.value })}
                  placeholder="e.g., 5-10 hours per week"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="costSaved">Cost Impact</Label>
                <Input
                  id="costSaved"
                  value={currentProject.cost_saved || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, cost_saved: e.target.value })}
                  placeholder="e.g., Reduced manual support costs"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={(currentProject.tags || []).join(", ")}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean),
                    })
                  }
                  placeholder="n8n, OpenAI, Webhook"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={currentProject.video_url || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, video_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="previewImage">Preview Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="previewImage"
                    value={currentProject.preview_image || ""}
                    onChange={(e) => setCurrentProject({ ...currentProject, preview_image: e.target.value })}
                    placeholder="https://..."
                  />
                  <div className="relative">
                    <input
                      type="file"
                      id="imageUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => document.getElementById("imageUpload")?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={currentProject.image_url || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="link">Project Link</Label>
                <Input
                  id="link"
                  value={currentProject.link || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="details">Detailed Description (one per line)</Label>
                <Textarea
                  id="details"
                  value={(currentProject.detailed_description || []).join("\n")}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      detailed_description: e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Step-by-step details..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="border rounded-md p-8 text-center text-muted-foreground bg-card">
          No projects found.
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    {project.preview_image || project.image_url ? (
                      <img
                        src={project.preview_image || project.image_url}
                        alt={project.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
