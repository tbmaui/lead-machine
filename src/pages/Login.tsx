import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UnauthenticatedLayout } from "@/components/auth/UnauthenticatedLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthDebugInfo } from "@/components/debug/AuthDebugInfo";

type AuthView = "login" | "register" | "forgot-password";

export default function Login() {
  const [view, setView] = useState<AuthView>("login");
  const navigate = useNavigate();
  const location = useLocation();

  // Force light mode on login page
  useEffect(() => {
    const originalTheme = document.documentElement.classList.contains('dark');
    document.documentElement.classList.remove('dark');
    
    // Cleanup: restore theme when leaving login page
    return () => {
      if (originalTheme) {
        document.documentElement.classList.add('dark');
      }
    };
  }, []);

  const handleAuthSuccess = () => {
    // Always redirect to landing page after successful login
    navigate("/", { replace: true });
  };

  const renderForm = () => {
    switch (view) {
      case "register":
        return (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onSignIn={() => setView("login")}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordForm
            onBack={() => setView("login")}
          />
        );
      default:
        return (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onForgotPassword={() => setView("forgot-password")}
            onSignUp={() => setView("register")}
          />
        );
    }
  };

  return (
    <UnauthenticatedLayout>
      {renderForm()}
      <AuthDebugInfo />
    </UnauthenticatedLayout>
  );
}