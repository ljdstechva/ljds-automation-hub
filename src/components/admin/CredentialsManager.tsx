
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, Award, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Credential {
    id: string;
    title: string;
    issuer: string;
    date_issued: string;
    image_url: string;
    link: string;
    created_at: string;
}

const CredentialsManager = () => {
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentCredential, setCurrentCredential] = useState<Partial<Credential>>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("credentials")
            .select("*")
            .order("date_issued", { ascending: false });

        if (error) {
            console.error("Error fetching credentials:", error);
            toast.error("Failed to load credentials");
        } else {
            setCredentials(data || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentCredential.title) {
            toast.error("Title is required");
            return;
        }

        try {
            if (isEditing && currentCredential.id) {
                const { error } = await supabase
                    .from("credentials")
                    .update({
                        title: currentCredential.title,
                        issuer: currentCredential.issuer,
                        date_issued: currentCredential.date_issued,
                        image_url: currentCredential.image_url,
                        link: currentCredential.link
                    })
                    .eq("id", currentCredential.id);

                if (error) throw error;
                toast.success("Credential updated successfully");
            } else {
                const { error } = await supabase
                    .from("credentials")
                    .insert([{
                        title: currentCredential.title,
                        issuer: currentCredential.issuer,
                        date_issued: currentCredential.date_issued,
                        image_url: currentCredential.image_url,
                        link: currentCredential.link
                    }]);

                if (error) throw error;
                toast.success("Credential added successfully");
            }

            setIsDialogOpen(false);
            fetchCredentials();
            setCurrentCredential({});
        } catch (error) {
            const message = error instanceof Error ? error.message : (error as { message?: string })?.message || "An unknown error occurred";
            toast.error("Error saving credential: " + message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this credential?")) return;

        const { error } = await supabase
            .from("credentials")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Error deleting credential");
        } else {
            toast.success("Credential deleted");
            fetchCredentials();
        }
    };

    const openAddDialog = () => {
        setCurrentCredential({});
        setIsEditing(false);
        setIsDialogOpen(true);
    };

    const openEditDialog = (cred: Credential) => {
        setCurrentCredential(cred);
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">My Credentials</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddDialog}>
                            <Plus className="mr-2 h-4 w-4" /> Add Credential
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? "Edit Credential" : "Add New Credential"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={currentCredential.title || ""}
                                    onChange={(e) => setCurrentCredential({ ...currentCredential, title: e.target.value })}
                                    placeholder="Certificate Name or Award"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="issuer">Issuer</Label>
                                <Input
                                    id="issuer"
                                    value={currentCredential.issuer || ""}
                                    onChange={(e) => setCurrentCredential({ ...currentCredential, issuer: e.target.value })}
                                    placeholder="Organization"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date">Date Issued</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={currentCredential.date_issued || ""}
                                    onChange={(e) => setCurrentCredential({ ...currentCredential, date_issued: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="image">Image/Logo URL</Label>
                                <Input
                                    id="image"
                                    value={currentCredential.image_url || ""}
                                    onChange={(e) => setCurrentCredential({ ...currentCredential, image_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="link">Verification Link</Label>
                                <Input
                                    id="link"
                                    value={currentCredential.link || ""}
                                    onChange={(e) => setCurrentCredential({ ...currentCredential, link: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Credential</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading credentials...</div>
            ) : credentials.length === 0 ? (
                <div className="border rounded-md p-8 text-center text-muted-foreground bg-card">
                    No credentials found.
                </div>
            ) : (
                <div className="border rounded-md overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Issuer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {credentials.map((cred) => (
                                <TableRow key={cred.id}>
                                    <TableCell>
                                        {cred.image_url ? (
                                            <img src={cred.image_url} alt={cred.title} className="h-10 w-10 rounded object-cover" />
                                        ) : (
                                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                                <Award className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{cred.title}</TableCell>
                                    <TableCell>{cred.issuer}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {cred.date_issued ? format(new Date(cred.date_issued), 'MMM yyyy') : 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(cred)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(cred.id)}>
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

export default CredentialsManager;
