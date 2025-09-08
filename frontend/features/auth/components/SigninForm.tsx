"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { SigninFormData, signinSchema } from "@/lib/validations/signinSchema";
import { toast } from "sonner";
import { useSigninUser } from "@/features/auth/hooks/useSigninUser";

export const SignInForm = () => {
  const { mutate: signinUser, isPending } = useSigninUser();
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleSubmit = (e: React.FormEvent) => {
    toast.loading("Signing in...", { id: "signin" });
    e.preventDefault();
    // Clear previous validation errors
    setValidationErrors({});

    // Get form data using FormData API
    const formData = new FormData(e.target as HTMLFormElement);
    const rawData = Object.fromEntries(formData);

    // Validate with Zod schema
    const validatedData = signinSchema.safeParse(rawData);
    if (!validatedData.success) {
      const formatted: Record<string, string> = {};
      validatedData.error.issues.forEach((err) => {
        formatted[err.path[0] as string] = err.message;
      });
      setValidationErrors(formatted);
      toast.error("Sign in failed", { id: "signin" });
    } else {
      setValidationErrors({});
      toast.success("Sign in successful", { id: "signin" });
      signinUser(validatedData.data);
      (e.target as HTMLFormElement).reset();
    }
  };

  const getFieldError = (fieldName: keyof SigninFormData) => {
    return validationErrors[fieldName] || "";
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center text-sm">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="Enter your email"
                className={`pl-10 ${
                  getFieldError("email") ? "border-destructive" : ""
                }`}
                required
              />
            </div>
            {getFieldError("email") ? (
              <p className="text-xs text-destructive">
                {getFieldError("email")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Email must be a valid email address
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`pl-10 pr-10 ${
                  getFieldError("password") ? "border-destructive" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {getFieldError("password") ? (
              <p className="text-xs text-destructive">
                {getFieldError("password")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Password must be at least 3 characters long
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
