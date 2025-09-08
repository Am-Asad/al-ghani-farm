"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Users,
  Truck,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Farms",
      value: "24",
      change: "+2",
      changeType: "positive" as const,
      icon: Building2,
      description: "Active poultry farms",
    },
    {
      title: "Active Flocks",
      value: "18",
      change: "+3",
      changeType: "positive" as const,
      icon: Users,
      description: "Currently raising birds",
    },
    {
      title: "Available Vehicles",
      value: "12",
      change: "-1",
      changeType: "negative" as const,
      icon: Truck,
      description: "Ready for transport",
    },
    {
      title: "This Month's Ledgers",
      value: "156",
      change: "+23",
      changeType: "positive" as const,
      icon: FileText,
      description: "Transaction records",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "New flock started at AL GHANI 3",
      time: "2 hours ago",
      type: "flock",
    },
    {
      id: 2,
      action: "Vehicle assignment completed",
      time: "4 hours ago",
      type: "vehicle",
    },
    {
      id: 3,
      action: "Ledger #156 created",
      time: "6 hours ago",
      type: "ledger",
    },
    { id: 4, action: "Farm status updated", time: "1 day ago", type: "farm" },
  ];

  return (
    <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your poultry operations
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-2">
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="h-4 w-4 text-chart-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span
                    className={`text-sm ${
                      stat.changeType === "positive"
                        ? "text-chart-4"
                        : "text-destructive"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    from last month
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 text-left border border-border rounded-lg hover:bg-accent transition-colors">
                <Building2 className="w-6 h-6 text-primary mb-2" />
                <div className="text-sm font-medium">Add Farm</div>
                <div className="text-xs text-muted-foreground">
                  Register new farm
                </div>
              </button>

              <button className="p-4 text-left border border-border rounded-lg hover:bg-accent transition-colors">
                <Users className="w-6 h-6 text-primary mb-2" />
                <div className="text-sm font-medium">Start Flock</div>
                <div className="text-xs text-muted-foreground">
                  Begin new flock
                </div>
              </button>

              <button className="p-4 text-left border border-border rounded-lg hover:bg-accent transition-colors">
                <FileText className="w-6 h-6 text-primary mb-2" />
                <div className="text-sm font-medium">Create Ledger</div>
                <div className="text-xs text-muted-foreground">
                  New transaction
                </div>
              </button>

              <button className="p-4 text-left border border-border rounded-lg hover:bg-accent transition-colors">
                <Truck className="w-6 h-6 text-primary mb-2" />
                <div className="text-sm font-medium">Assign Vehicle</div>
                <div className="text-xs text-muted-foreground">
                  Transport setup
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
