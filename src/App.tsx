import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthenticatedLayout } from "@/components/auth/AuthenticatedLayout";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DataProcessingAgreement from "./pages/DataProcessingAgreement";

const queryClient = new QueryClient();

const App = () => {
  const [restoredSearch, setRestoredSearch] = useState<{job: any, leads: any[]} | null>(null);

  const handleRestoreSearch = (job: any, leads: any[]) => {
    setRestoredSearch({job, leads});
  };

  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/data-processing-agreement" element={<DataProcessingAgreement />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout onRestoreSearch={handleRestoreSearch}>
                    <Index />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout onRestoreSearch={handleRestoreSearch}>
                    <Search 
                      restoredSearch={restoredSearch}
                      onSearchRestored={() => setRestoredSearch(null)}
                    />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
