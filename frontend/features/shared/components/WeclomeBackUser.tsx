"use client";
import { useAuthContext } from "@/providers/AuthProvider";
import React from "react";

const WeclomeBackUser = () => {
  const { user } = useAuthContext();
  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-muted-foreground">
        Welcome back, {user?.username || "John Doe"}
      </div>
    </div>
  );
};

export default WeclomeBackUser;
