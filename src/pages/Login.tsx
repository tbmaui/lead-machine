import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UnauthenticatedLayout } from "@/components/auth/UnauthenticatedLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

type AuthView = "login" | "register" | "forgot-password";

export default function Login() {
  const [view, setView] = useState<AuthView>("login");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
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
    </UnauthenticatedLayout>
  );
}