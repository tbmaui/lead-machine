import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signInSchema, type SignInFormData } from "@/lib/auth-schemas";
import { supabaseConfig } from "@/integrations/supabase/client";

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword, onSignUp }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    
    try {
      const { user, error: authError } = await signIn(data.email, data.password);
      
      if (authError) {
        // Provide more user-friendly error messages
        let errorMessage = authError.message;
        
        if (authError.message.includes('Failed to fetch') || authError.message.includes('fetch')) {
          errorMessage = 'Unable to connect to authentication server. Please check your internet connection and try again.';
        } else if (authError.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        }
        
        setError(`${errorMessage} (${authError.message})`);
        return;
      }
      
      if (user) {
        onSuccess?.();
      }
    } catch (error) {
      // Handle network or other unexpected errors
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(`Network error: ${errorMessage}`);
      console.error('Login error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Sign In
        </CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
        
        {/* Debug Info - Always show in production if there are config issues */}
        {import.meta.env.PROD && (!supabaseConfig.url || !supabaseConfig.hasValidKey) && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold">Configuration Error Detected</div>
                <div className="text-sm space-y-1">
                  <div>Environment: <Badge variant="outline">{import.meta.env.MODE}</Badge></div>
                  <div>Supabase URL: <Badge variant={supabaseConfig.url ? 'default' : 'destructive'}>
                    {supabaseConfig.url ? 'Present' : 'Missing'}
                  </Badge></div>
                  <div>API Key: <Badge variant={supabaseConfig.hasValidKey ? 'default' : 'destructive'}>
                    {supabaseConfig.hasValidKey ? 'Valid' : 'Invalid'}
                  </Badge></div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Add ?debug=true to URL for more details
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={onForgotPassword}
            >
              Forgot password?
            </Button>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={onSignUp}
            >
              Create account
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}