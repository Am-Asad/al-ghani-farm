"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building2,
  Feather,
  Warehouse,
  UserCheck,
  Receipt,
  BarChart3,
  // Settings,
  Shield,
} from "lucide-react";
import { useAuthContext } from "@/providers/AuthProvider";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Farms", href: "/farms", icon: Building2 },
  { name: "Flocks", href: "/flocks", icon: Feather },
  { name: "Sheds", href: "/sheds", icon: Warehouse },
  { name: "Buyers", href: "/buyers", icon: UserCheck },
  { name: "Ledgers", href: "/ledgers", icon: Receipt },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  {
    name: "Users",
    href: "/users",
    icon: UserCheck,
    requiredRole: ["admin", "manager"],
  },
  {
    name: "Admin",
    href: "/admin",
    icon: Shield,
    requiredRole: ["admin", "manager"],
  },
  // { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const { user } = useAuthContext();

  return (
    <nav className="flex-1 px-4 py-6 space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.includes(item.href);
        const isNotVisible =
          item.requiredRole && !item.requiredRole.includes(user?.role || "");
        if (isNotVisible) return null;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
