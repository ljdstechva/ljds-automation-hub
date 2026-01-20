
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, ExternalLink, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Project {
    id: string;
    title: string;
    description: string;
    image_url: string;
    link: string;
    category: string;
    created_at: string;
}

const ProjectsManager = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
    const [isEditing, setIsEditing] = useState(false);

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

    const handleSave = async () => {
        if (!currentProject.title) {
            toast.error("Title is required");
            return;
        }

        try {
            if (isEditing && currentProject.id) {
                const { error } = await supabase
                    .from("projects")
                    .update({
                        title: currentProject.title,
                        description: currentProject.description,
                        image_url: currentProject.image_url,
                        link: currentProject.link,
                        category: currentProject.category
                    })
                    .eq("id", currentProject.id);

                if (error) throw error;
                toast.success("Project updated successfully");
            } else {
                const { error } = await supabase
                    .from("projects")
                    .insert([{
                        title: currentProject.title,
                        description: currentProject.description,
                        image_url: currentProject.image_url,
                        link: currentProject.link,
                        category: currentProject.category
                    }]);

                if (error) throw error;
                toast.success("Project added successfully");
            }

            setIsDialogOpen(false);
            fetchProjects();
            setCurrentProject({});
        } catch (error) {
            const message = error instanceof Error ? error.message : (error as { message?: string })?.message || "An unknown error occurred";
            toast.error("Error saving project: " + message);
        }
    };

    const handleDelete = async (id: string) => {
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
    };

    const openEditDialog = (project: Project) => {
        setCurrentProject(project);
        setIsEditing(true);
        setIsDialogOpen(true);
    };

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
                    <DialogContent className="sm:max-w-[500px]">
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
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
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
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
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
                                        {project.image_url ? (
                                            <img src={project.image_url} alt={project.title} className="h-10 w-10 rounded object-cover" />
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
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                                View <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(project.id)}>
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
