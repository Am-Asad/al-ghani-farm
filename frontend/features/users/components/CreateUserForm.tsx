"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { signupSchema } from "@/lib/validations/signupSchema";
import { useSignupUser } from "@/features/auth/hooks/useSignupUser";

type CreateUserFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const CreateUserForm = () => {
  const { mutate: signupUser } = useSignupUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Clear previous validation errors
    setValidationErrors({});

    // Get form data using FormData API
    const formData = new FormData(e.target as HTMLFormElement);
    const rawData = Object.fromEntries(formData);

    // Validate with Zod schema
    const validatedData = signupSchema.safeParse(rawData);
    if (!validatedData.success) {
      const formatted: Record<string, string> = {};
      validatedData.error.issues.forEach((err) => {
        formatted[err.path[0] as string] = err.message;
      });
      setValidationErrors(formatted);
      toast.error("Sign up failed", { id: "signup" });
    } else {
      setValidationErrors({});
      toast.success("Sign up successful", { id: "signup" });
      signupUser(validatedData.data);
      (e.target as HTMLFormElement).reset();
      setIsOpen(false);
    }
  };

  const getFieldError = (fieldName: keyof CreateUserFormData) => {
    return validationErrors[fieldName as string] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full mb-2">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-center">Create New User</DialogTitle>
          <DialogDescription className="text-center">
            Add a new user to the system with appropriate values
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                autoFocus={false}
                className={`pl-10 ${
                  getFieldError("username") ? "border-destructive" : ""
                }`}
                required
              />
            </div>
            {getFieldError("username") ? (
              <p className="text-xs text-destructive">
                {getFieldError("username")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Username must be between 3 and 50 characters
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                autoFocus={false}
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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoFocus={false}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                autoFocus={false}
                className={`pl-10 pr-10 ${
                  getFieldError("confirmPassword") ? "border-destructive" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {getFieldError("confirmPassword") && (
              <p className="text-xs text-destructive">
                {getFieldError("confirmPassword")}
              </p>
            )}
          </div>

          <DialogFooter className="gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserForm;
