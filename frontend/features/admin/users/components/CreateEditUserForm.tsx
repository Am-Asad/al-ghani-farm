"use client";
import React, { useState } from "react";
import { createEditUserSchema } from "../schemas/createEditUserSchema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { User as UserType } from "@/types";
import { useEditUser } from "../hooks/useUserHooks";
import { useCreateUser } from "../hooks/useUserHooks";
import { CreateEditUserSchema } from "../schemas/createEditUserSchema";

type CreateEditUserFormProps = {
  selectedUser?: UserType;
  triggerButton?: React.ReactNode;
};

const CreateEditUserForm = ({
  selectedUser,
  triggerButton,
}: CreateEditUserFormProps) => {
  const isEditMode = !!selectedUser;
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const { mutate: createUser, isPending: isCreatePending } = useCreateUser();
  const { mutate: editUser, isPending: isEditPending } = useEditUser();

  const handleClose = () => {
    setIsOpen(false);
    setValidationErrors({});
    setShowPassword(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Clear previous validation errors
    setValidationErrors({});

    // Get form data using FormData API
    const formData = new FormData(e.target as HTMLFormElement);
    const rawData = Object.fromEntries(formData);

    // Validate with Zod schema
    const validatedData = createEditUserSchema(isEditMode).safeParse(rawData);
    if (!validatedData.success) {
      const formatted: Record<string, string> = {};
      validatedData.error.issues.forEach((err) => {
        formatted[err.path[0] as string] = err.message;
      });
      setValidationErrors(formatted);
      return;
    }

    if (isEditMode) {
      const payload = { ...validatedData.data } as Record<string, unknown>;
      if (payload.password === "") delete payload.password;
      editUser({
        ...(payload as typeof validatedData.data),
        _id: selectedUser?._id,
      } as Omit<UserType, "createdAt" | "updatedAt">);
    } else {
      const payload = { ...validatedData.data } as Record<string, unknown>;
      createUser(payload as Omit<UserType, "_id" | "createdAt" | "updatedAt">);
    }
    (e.target as HTMLFormElement).reset();
    setIsOpen(false);
  };

  const getFieldError = (fieldName: keyof CreateEditUserSchema) => {
    return validationErrors[fieldName as string] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="w-fit">
            <UserPlus className="w-4 h-4 mr-2" />
            {isEditMode ? "Edit User" : "Add User"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full mb-2">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {isEditMode ? "Edit User" : "Add new User"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isEditMode
              ? "Edit the user with appropriate values"
              : "Add a new user to the system with appropriate values"}
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
                defaultValue={selectedUser?.username || ""}
                autoFocus={false}
                className={`pl-10 ${
                  getFieldError("username") ? "border-destructive" : ""
                }`}
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
                defaultValue={selectedUser?.email || ""}
                autoFocus={false}
                className={`pl-10 ${
                  getFieldError("email") ? "border-destructive" : ""
                }`}
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
                defaultValue={""}
                autoFocus={false}
                className={`pl-10 pr-10 ${
                  getFieldError("password") ? "border-destructive" : ""
                }`}
                required={!isEditMode}
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
            <Select name="role" defaultValue={selectedUser?.role || "viewer"}>
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

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEditPending || isCreatePending}>
              {isEditMode ? "Edit User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditUserForm;
