import { useMemo, useRef, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, Award, Calendar, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format, isValid, parseISO } from "date-fns";

interface Credential {
  id: string;
  title: string;
  issuer: string;
  provider: string;
  date_issued: string;
  image_url: string;
  credential_id: string;
  categories: string[];
  skills: string[];
  link: string;
  external_url: string;
  created_at: string;
}

const CredentialsManager = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCredential, setCurrentCredential] = useState<Partial<Credential>>({});
  const [isEditing, setIsEditing] = useState(false);
  const initialCredentialRef = useRef<Partial<Credential>>({});

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
      const normalized = (data || []).map((credential) => ({
        ...credential,
        issuer: credential.issuer || credential.provider || "",
        provider: credential.provider || credential.issuer || "",
        link: credential.link || credential.external_url || "",
        external_url: credential.external_url || credential.link || "",
        categories: credential.categories || [],
        skills: credential.skills || [],
        credential_id: credential.credential_id || "",
      }));
      setCredentials(normalized);
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
        .from("credential-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || undefined,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("credential-images")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Unable to retrieve image URL.");
      }

      setCurrentCredential({ ...currentCredential, image_url: publicUrlData.publicUrl });
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

    if (!currentCredential.title) {
      toast.error("Title is required");
      return;
    }

    const normalizedCategories = (currentCredential.categories || [])
      .map((category) => category.trim())
      .filter(Boolean);
    const normalizedSkills = (currentCredential.skills || [])
      .map((skill) => skill.trim())
      .filter(Boolean);

    try {
      if (isEditing && currentCredential.id) {
        const { error } = await supabase
          .from("credentials")
          .update({
            title: currentCredential.title,
            issuer: currentCredential.issuer,
            provider: currentCredential.provider,
            date_issued: currentCredential.date_issued,
            image_url: currentCredential.image_url,
            credential_id: currentCredential.credential_id,
            categories: normalizedCategories,
            skills: normalizedSkills,
            link: currentCredential.link,
            external_url: currentCredential.external_url,
          })
          .eq("id", currentCredential.id);

        if (error) throw error;
        toast.success("Credential updated successfully");
      } else {
        const { error } = await supabase
          .from("credentials")
          .insert([
            {
              title: currentCredential.title,
              issuer: currentCredential.issuer,
              provider: currentCredential.provider,
              date_issued: currentCredential.date_issued,
              image_url: currentCredential.image_url,
              credential_id: currentCredential.credential_id,
              categories: normalizedCategories,
              skills: normalizedSkills,
              link: currentCredential.link,
              external_url: currentCredential.external_url,
            },
          ]);

        if (error) throw error;
        toast.success("Credential added successfully");
      }

      setIsDialogOpen(false);
      fetchCredentials();
      setCurrentCredential({});
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || "An unknown error occurred";
      toast.error("Error saving credential: " + message);
    }
  };

  const handleDelete = async (id: string) => {
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !data.session) {
      toast.error("Your session expired. Please sign in again.");
      return;
    }

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
    initialCredentialRef.current = {};
  };

  const openEditDialog = (cred: Credential) => {
    setCurrentCredential(cred);
    setIsEditing(true);
    setIsDialogOpen(true);
    initialCredentialRef.current = cred;
  };

  const serializeCredential = (credential: Partial<Credential>) =>
    JSON.stringify({
      title: credential.title || "",
      issuer: credential.issuer || "",
      provider: credential.provider || "",
      date_issued: credential.date_issued || "",
      image_url: credential.image_url || "",
      credential_id: credential.credential_id || "",
      categories: credential.categories || [],
      skills: credential.skills || [],
      link: credential.link || "",
      external_url: credential.external_url || "",
    });

  const isDirty = useMemo(() => {
    return (
      serializeCredential(currentCredential) !==
      serializeCredential(initialCredentialRef.current)
    );
  }, [currentCredential]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">My Certificates</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add Certificate
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
              <DialogTitle>{isEditing ? "Edit Certificate" : "Add New Certificate"}</DialogTitle>
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
                  placeholder="Issuing organization"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  value={currentCredential.provider || ""}
                  onChange={(e) => setCurrentCredential({ ...currentCredential, provider: e.target.value })}
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
                <Label htmlFor="credentialId">Credential ID</Label>
                <Input
                  id="credentialId"
                  value={currentCredential.credential_id || ""}
                  onChange={(e) => setCurrentCredential({ ...currentCredential, credential_id: e.target.value })}
                  placeholder="Certificate or credential ID"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="categories">Categories (comma separated)</Label>
                <Input
                  id="categories"
                  value={(currentCredential.categories || []).join(", ")}
                  onChange={(e) =>
                    setCurrentCredential({
                      ...currentCredential,
                      categories: e.target.value
                        .split(",")
                        .map((category) => category.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Automation, AI, No-Code"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="skills">Skills Covered (one per line)</Label>
                <Textarea
                  id="skills"
                  value={(currentCredential.skills || []).join("\n")}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setCurrentCredential({
                      ...currentCredential,
                      skills: e.target.value
                        .split("\n")
                        .map((skill) => skill.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Skill 1\nSkill 2"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image/Logo URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={currentCredential.image_url || ""}
                    onChange={(e) => setCurrentCredential({ ...currentCredential, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                  <div className="relative">
                    <input
                      type="file"
                      id="credentialImageUpload"
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
                      onClick={() => document.getElementById("credentialImageUpload")?.click()}
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
                <Label htmlFor="link">Credential Link</Label>
                <Input
                  id="link"
                  value={currentCredential.link || ""}
                  onChange={(e) => setCurrentCredential({ ...currentCredential, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="externalUrl">External URL</Label>
                <Input
                  id="externalUrl"
                  value={currentCredential.external_url || ""}
                  onChange={(e) => setCurrentCredential({ ...currentCredential, external_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
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
                  <TableCell>{cred.issuer || cred.provider}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {(() => {
                        if (!cred.date_issued) {
                          return "N/A";
                        }
                        const issuedDate = parseISO(cred.date_issued);
                        return isValid(issuedDate) ? format(issuedDate, "MMM yyyy") : "N/A";
                      })()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(cred)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(cred.id)}
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

export default CredentialsManager;
