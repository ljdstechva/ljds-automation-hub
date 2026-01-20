
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const EnvCheck = ({ children }: { children: React.ReactNode }) => {
    if (!isSupabaseConfigured) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <Alert variant="destructive" className="max-w-md shadow-lg">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Configuration Missing</AlertTitle>
                    <AlertDescription className="mt-2 text-sm leading-relaxed">
                        <p className="mb-2"><strong>Supabase environment variables are not set.</strong></p>
                        <p>Please create a <code className="bg-muted px-1.5 py-0.5 rounded">.env</code> file in the project root with your credentials:</p>
                        <pre className="bg-muted p-2 rounded mt-2 text-xs overflow-x-auto">
                            VITE_SUPABASE_URL=...{'\n'}
                            VITE_SUPABASE_ANON_KEY=...
                        </pre>
                        <p className="mt-2 text-xs text-muted-foreground">Restart the dev server after adding the file.</p>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
    return <>{children}</>;
};
