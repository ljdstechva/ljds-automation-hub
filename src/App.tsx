import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/components/admin/AuthProvider";

import { EnvCheck } from "@/components/EnvCheck";
import LoadingScreen from "@/components/LoadingScreen";
import { ThemeProvider } from "@/components/ThemeProvider";
import { preloadImages } from "@/lib/utils";

// Import assets to preload
import laurenzForward from "@/assets/laurenz-forward-new.png";
import laurenzAway from "@/assets/laurenz-away-new.png";
import logoHorizontal from "@/assets/logo-horizontal.png";
import logoHorizontalLight from "@/assets/logo-horizontal-light.png";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await preloadImages([
          laurenzForward,
          laurenzAway,
          logoHorizontal,
          logoHorizontalLight,
        ], (progress) => {
            setLoadingProgress(progress);
        });
      } catch (error) {
        console.error("Failed to load images:", error);
        // Force progress to 100 to exit loading screen
        setLoadingProgress(100);
      }
    };

    loadAssets();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class">
        {isLoading ? (
          <LoadingScreen 
            onComplete={() => setIsLoading(false)} 
            progress={loadingProgress}
          />
        ) : (
          <EnvCheck>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </EnvCheck>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
