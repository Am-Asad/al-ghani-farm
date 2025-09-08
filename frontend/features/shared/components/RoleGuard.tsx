"use client";
import React from "react";
import { useAuthContext } from "@/providers/AuthProvider";

type AllowedRoles = "admin" | "manager" | "viewer";

type RoleGuardProps = {
  requiredRole: AllowedRoles[];
  children: React.ReactNode;
};

const RoleGuard = ({ requiredRole, children }: RoleGuardProps) => {
  const { user } = useAuthContext();
  const userRole = user?.role as string;
  const isAuthorized = checkRole(userRole, requiredRole as AllowedRoles[]);
  return isAuthorized ? children : null;
};

export default RoleGuard;

const checkRole = (userRole: string, requiredRole: AllowedRoles[]) => {
  return requiredRole.includes(userRole as AllowedRoles);
};
