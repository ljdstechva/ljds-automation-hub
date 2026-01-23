import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

type CheckStatus = "idle" | "pending" | "ok" | "error";

interface CheckResult {
  label: string;
  status: CheckStatus;
  details?: string;
}

const initialChecks: Record<string, CheckResult> = {
  env: {
    label: "Supabase env configured",
    status: "idle",
  },
  session: {
    label: "Authenticated session",
    status: "idle",
  },
  projectBucket: {
    label: "project-images bucket access",
    status: "idle",
  },
  credentialBucket: {
    label: "credential-images bucket access",
    status: "idle",
  },
};

const formatStatus = (status: CheckStatus) => {
  switch (status) {
    case "ok":
      return "OK";
    case "error":
      return "Error";
    case "pending":
      return "Running";
    default:
      return "Idle";
  }
};

const statusClassName = (status: CheckStatus) => {
  switch (status) {
    case "ok":
      return "text-emerald-600";
    case "error":
      return "text-destructive";
    case "pending":
      return "text-muted-foreground";
    default:
      return "text-muted-foreground";
  }
};

const UploadDiagnostics = () => {
  const [checks, setChecks] = useState(initialChecks);
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setRunning(true);
    setChecks((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = { ...next[key], status: "pending", details: undefined };
      });
      return next;
    });

    const nextChecks: Record<string, CheckResult> = { ...initialChecks };

    if (!isSupabaseConfigured) {
      nextChecks.env.status = "error";
      nextChecks.env.details = "Missing Supabase URL or anon key.";
    } else {
      nextChecks.env.status = "ok";
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      nextChecks.session.status = "error";
      nextChecks.session.details = sessionError.message;
    } else if (!sessionData.session) {
      nextChecks.session.status = "error";
      nextChecks.session.details = "No active session. Sign in to upload.";
    } else {
      nextChecks.session.status = "ok";
      nextChecks.session.details = `User ${sessionData.session.user.email || sessionData.session.user.id}`;
    }

    const checkBucket = async (bucketId: string, targetKey: keyof typeof nextChecks) => {
      const { error } = await supabase.storage.from(bucketId).list("", { limit: 1 });
      if (error) {
        nextChecks[targetKey].status = "error";
        nextChecks[targetKey].details = error.message;
      } else {
        nextChecks[targetKey].status = "ok";
        nextChecks[targetKey].details = "Accessible";
      }
    };

    await Promise.all([
      checkBucket("project-images", "projectBucket"),
      checkBucket("credential-images", "credentialBucket"),
    ]);

    setChecks(nextChecks);
    setLastRun(new Date().toLocaleString());
    setRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Upload Diagnostics</CardTitle>
          <p className="text-sm text-muted-foreground">
            Quick checks for auth and storage access.
          </p>
        </div>
        <Button variant="outline" onClick={runDiagnostics} disabled={running}>
          {running ? "Running..." : "Run Diagnostics"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">
          {lastRun ? `Last run: ${lastRun}` : "Not run yet"}
        </div>
        <div className="space-y-2">
          {Object.entries(checks).map(([key, result]) => (
            <div key={key} className="flex flex-col gap-1 rounded-md border border-border/60 px-3 py-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{result.label}</span>
                <span className={`text-xs font-semibold uppercase tracking-wide ${statusClassName(result.status)}`}>
                  {formatStatus(result.status)}
                </span>
              </div>
              {result.details && (
                <div className="text-xs text-muted-foreground break-words">
                  {result.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadDiagnostics;
