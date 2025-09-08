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
import { editUserSchema } from "@/features/users/schemas/editUserSchema";
import { User as UserType } from "@/types/user-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditUser } from "@/features/users/hooks/useEditUser";

type EditUserFormProps = {
  selectedUser: UserType;
};

const EditUserForm = ({ selectedUser }: EditUserFormProps) => {
  const { mutate: editUser } = useEditUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Clear previous validation errors
    setValidationErrors({});

    // Get form data using FormData API
    const formData = new FormData(e.target as HTMLFormElement);
    const rawData = Object.fromEntries(formData) as Record<string, string>;

    // Convert empty password string to undefined
    if (rawData.password === "") {
      delete rawData.password;
    }

    // Validate with Zod schema
    const validatedData = editUserSchema.safeParse(rawData);
    if (!validatedData.success) {
      const formatted: Record<string, string> = {};
      validatedData.error.issues.forEach((err) => {
        formatted[err.path[0] as string] = err.message;
      });
      setValidationErrors(formatted);
      toast.error("Edit user failed", { id: "editUser" });
    } else {
      setValidationErrors({});
      toast.success("Edit user successful", { id: "editUser" });

      // Only include password if it's provided and not empty
      const userData: Partial<
        Omit<UserType, "createdAt" | "updatedAt" | "permissions">
      > = {
        _id: selectedUser._id,
        username: validatedData.data.username,
        email: validatedData.data.email,
        role: validatedData.data.role,
      };

      // Only include password if it's provided and not empty
      if (
        validatedData.data.password &&
        validatedData.data.password.trim() !== ""
      ) {
        userData.password = validatedData.data.password;
      }

      editUser(
        userData as Omit<UserType, "createdAt" | "updatedAt" | "permissions">
      );
      (e.target as HTMLFormElement).reset();
      setIsOpen(false);
    }
  };

  const getFieldError = (
    fieldName: keyof EditUserFormProps["selectedUser"]
  ) => {
    return validationErrors[fieldName as string] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <UserPlus className="w-4 h-4 mr-2" />
          Edit User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full mb-2">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-center">Edit User</DialogTitle>
          <DialogDescription className="text-center">
            Edit the user with appropriate values
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
                defaultValue={selectedUser.username}
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
                defaultValue={selectedUser.email}
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
            <Label htmlFor="password">Password (optional)</Label>
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

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={selectedUser.role}>
              <SelectTrigger>
                <SelectValue defaultValue="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Edit User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserForm;
