
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectsManager from "@/components/admin/ProjectsManager";
import CredentialsManager from "@/components/admin/CredentialsManager";

const Dashboard = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your portfolio content from here.
                </p>
            </div>

            <Tabs defaultValue="projects" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="projects">My Projects</TabsTrigger>
                    <TabsTrigger value="credentials">My Credentials</TabsTrigger>
                </TabsList>
                <TabsContent value="projects" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Projects</CardTitle>
                            <CardDescription>
                                Manage your showcase projects.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProjectsManager />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="credentials" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Credentials</CardTitle>
                            <CardDescription>
                                Manage your certificates and awards.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CredentialsManager />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Dashboard;
