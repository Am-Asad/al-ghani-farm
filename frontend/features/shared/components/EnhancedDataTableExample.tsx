"use client";
import React from "react";
import DataTable, { RowAction } from "./DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  Share,
  Archive,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Example data type
type ExampleData = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: "admin" | "user" | "moderator";
  createdAt: string;
};

// Example data
const exampleData: ExampleData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    role: "admin",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "inactive",
    role: "user",
    createdAt: "2024-01-16",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "pending",
    role: "moderator",
    createdAt: "2024-01-17",
  },
];

const EnhancedDataTableExample = () => {
  // Example 1: Mixed actions (some with custom components, some without)
  const mixedActions: RowAction<ExampleData>[] = [
    {
      label: "View Details",
      value: "view",
      component: (row: ExampleData) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => alert(`Viewing ${row.name}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      ),
    },
    {
      label: "Edit",
      value: "edit",
      // No component - will use default dropdown item
    },
    {
      label: "Toggle Status",
      value: "toggle",
      component: (row: ExampleData) => (
        <div className="flex items-center justify-between w-full px-2 py-1.5">
          <span className="text-sm">Toggle Status</span>
          <Switch
            checked={row.status === "active"}
            onCheckedChange={(checked) =>
              alert(
                `${row.name} status changed to ${
                  checked ? "active" : "inactive"
                }`
              )
            }
          />
        </div>
      ),
    },
    {
      label: "Delete",
      value: "delete",
      variant: "destructive",
      component: (row: ExampleData) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-600 hover:text-red-800"
          onClick={() => alert(`Delete ${row.name}`)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </Button>
      ),
    },
  ];

  // Example 2: Complex actions with multiple components
  const complexActions: RowAction<ExampleData>[] = [
    {
      label: "Quick Actions",
      value: "quick",
      component: (row: ExampleData) => (
        <div className="p-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={row.status === "active" ? "default" : "secondary"}>
              {row.status}
            </Badge>
            <Badge variant="outline">{row.role}</Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => alert(`Copy ${row.name}`)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => alert(`Download ${row.name}`)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => alert(`Share ${row.name}`)}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      label: "Edit User",
      value: "edit",
      component: (row: ExampleData) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => alert(`Edit ${row.name}`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </Button>
      ),
    },
    {
      label: "Archive",
      value: "archive",
      component: (row: ExampleData) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-orange-600 hover:text-orange-800"
          onClick={() => alert(`Archive ${row.name}`)}
        >
          <Archive className="mr-2 h-4 w-4" />
          Archive User
        </Button>
      ),
    },
  ];

  // Example 3: Conditional actions based on row data
  const conditionalActions: RowAction<ExampleData>[] = [
    {
      label: "View",
      value: "view",
      component: (row: ExampleData) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => alert(`View ${row.name}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Profile
        </Button>
      ),
    },
    // Only show edit for admins and moderators
    ...(exampleData.some(
      (row) => row.role === "admin" || row.role === "moderator"
    )
      ? [
          {
            label: "Edit",
            value: "edit",
            component: (row: ExampleData) =>
              row.role === "admin" || row.role === "moderator" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => alert(`Edit ${row.name}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </Button>
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No permission to edit
                </div>
              ),
          },
        ]
      : []),
    {
      label: "Delete",
      value: "delete",
      variant: "destructive",
      component: (row: ExampleData) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-600 hover:text-red-800"
          onClick={() => alert(`Delete ${row.name}`)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </Button>
      ),
    },
  ];

  const columns = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name" as keyof ExampleData,
      visible: true,
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email" as keyof ExampleData,
      visible: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status" as keyof ExampleData,
      visible: true,
      cell: ({ row }: { row: { original: ExampleData } }) => (
        <Badge
          variant={
            row.original.status === "active"
              ? "default"
              : row.original.status === "inactive"
              ? "destructive"
              : "secondary"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role" as keyof ExampleData,
      visible: true,
      cell: ({ row }: { row: { original: ExampleData } }) => (
        <Badge variant="outline">{row.original.role}</Badge>
      ),
    },
    {
      id: "createdAt",
      header: "Created At",
      accessorKey: "createdAt" as keyof ExampleData,
      visible: true,
    },
  ];

  const handleRowAction = (action: string, row: ExampleData) => {
    console.log(`Action: ${action}`, row);
    // Handle actions that don't have custom components
    if (action === "edit") {
      alert(`Edit action for ${row.name}`);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">
        Enhanced DataTable Dropdown Actions
      </h1>

      {/* Example 1: Mixed actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          1. Mixed Actions (Custom + Default)
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Some actions use custom components, others use default dropdown items
        </p>
        <DataTable
          data={exampleData}
          columns={columns}
          getRowId={(row) => row.id}
          rowActions={mixedActions}
          onRowAction={handleRowAction}
          emptyMessage="No data available"
        />
      </div>

      {/* Example 2: Complex actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          2. Complex Actions with Multiple Components
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Actions with rich content including badges, buttons, and interactive
          elements
        </p>
        <DataTable
          data={exampleData}
          columns={columns}
          getRowId={(row) => row.id}
          rowActions={complexActions}
          onRowAction={handleRowAction}
          emptyMessage="No data available"
        />
      </div>

      {/* Example 3: Conditional actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          3. Conditional Actions Based on Row Data
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Actions that change based on the row data (e.g., permissions, status)
        </p>
        <DataTable
          data={exampleData}
          columns={columns}
          getRowId={(row) => row.id}
          rowActions={conditionalActions}
          onRowAction={handleRowAction}
          emptyMessage="No data available"
        />
      </div>
    </div>
  );
};

export default EnhancedDataTableExample;
