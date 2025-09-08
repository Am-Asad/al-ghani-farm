"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/features/shared/components/Navigation";
import { Building2, X } from "lucide-react";
import { User } from "lucide-react";
import { LogOut } from "lucide-react";
import { useAuthContext } from "@/providers/AuthProvider";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user, logout } = useAuthContext();

  return (
    <div
      className={cn(
        `fixed inset-y-0 left-0 z-50 w-64 flex flex-col justify-between bg-sidebar border-r border-sidebar-border transform transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-0`,
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between py-5 px-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <Building2 className="w-8 h-8 text-sidebar-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">
            AL GHANI
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <Navigation />

      <div className="p-5 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 rounded-md">
          <div className="w-8 h-8 bg-sidebar-primary/10 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground">
              {user?.username || "John Doe"}
            </p>
            <p className="text-xs text-sidebar-foreground/70">
              {user?.email || "john.doe@example.com"}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="" onClick={logout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
