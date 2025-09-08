"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/features/shared/components/Sidebar";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";
import WeclomeBackUser from "@/features/shared/components/WeclomeBackUser";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <AuthProvider>
      <div className="min-h-screen md:h-screen overflow-hidden bg-background flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Main content */}
        <div className="flex flex-col flex-1">
          {/* Top header */}
          <header className="bg-background border-b border-gray-300 flex items-center justify-between py-4 px-6">
            <div className="flex items-center gap-4 justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <WeclomeBackUser />
            </div>
            <ThemeToggle />
          </header>

          {/* Page content */}
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
