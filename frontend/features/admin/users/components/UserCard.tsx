"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Calendar, Pencil } from "lucide-react";
import { User as UserType } from "@/types";
import CreateEditUserForm from "./CreateEditUserForm";
import { formatDate } from "@/utils/formatting";
import { cn } from "@/lib/utils";
import { useDeleteUser } from "../hooks/useUserHooks";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import RoleGuard from "@/features/shared/components/RoleGuard";
import { Button } from "@/components/ui/button";

type UserCardProps = {
  user: UserType;
};

const UserCard = ({ user }: UserCardProps) => {
  const { mutate: deleteUser } = useDeleteUser();
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive";
      case "manager":
        return "bg-chart-2/40 text-primary";
      case "viewer":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const renderPermissions = (role: string) => {
    switch (role) {
      case "admin":
        return 4;
      case "manager":
        return 3;
      case "viewer":
        return 1;
      default:
        return 1;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{user.username}</CardTitle>
          </div>
          <span
            className={cn(
              "px-2 py-1 text-xs rounded-full",
              getRoleColor(user.role)
            )}
          >
            {user.role}
          </span>
        </div>
        <CardDescription className="flex items-center space-x-1">
          <Mail className="w-4 h-4" />
          <span>{user.email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Permissions</p>
            <p className="font-medium">0{renderPermissions(user.role)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">User ID</p>
            <p className="font-medium text-xs">{user._id.slice(-8)}</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-1">Created</p>
          <p className="text-sm font-medium flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(user.createdAt)}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <RoleGuard requiredRole={["admin", "manager"]}>
            <CreateEditUserForm
              selectedUser={user}
              triggerButton={
                <Button variant="outline" size="sm" className="flex-1">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit User
                </Button>
              }
            />
          </RoleGuard>
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title="Delete User"
              description="Are you sure you want to delete this user?"
              confirmationText={user.username}
              onConfirm={() => deleteUser(user._id)}
            />
          </RoleGuard>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
