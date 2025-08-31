import { ReactNode } from "react";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

interface UnauthenticatedLayoutProps {
  children: ReactNode;
}

export function UnauthenticatedLayout({ children }: UnauthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Logo />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Lead Machine</h1>
              <p className="text-muted-foreground mt-2">
                Professional lead generation platform
              </p>
            </div>
            
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}