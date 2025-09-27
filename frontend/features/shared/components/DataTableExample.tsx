"use client";
import React from "react";
import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Example data type
type ExampleData = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
};

// Example data
const exampleData: ExampleData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "inactive",
    createdAt: "2024-01-16",
  },
];

const DataTableExample = () => {
  // Example 1: Using traditional rowActions (dropdown menu)
  const traditionalActions = [
    { label: "View", value: "view" },
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete", variant: "destructive" as const },
  ];

  const handleTraditionalAction = (action: string, row: ExampleData) => {
    console.log(`Traditional action: ${action}`, row);
    alert(`${action} action for ${row.name}`);
  };

  // Example 2: Using customActions with inline buttons
  const renderInlineButtons = (row: ExampleData) => {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => alert(`View ${row.name}`)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => alert(`Edit ${row.name}`)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => alert(`Delete ${row.name}`)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Example 3: Using customActions with text links
  const renderTextLinks = (row: ExampleData) => {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => alert(`View ${row.name}`)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View
        </button>
        <button
          onClick={() => alert(`Edit ${row.name}`)}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => alert(`Delete ${row.name}`)}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    );
  };

  // Example 4: Using customActions with custom dropdown
  const renderCustomDropdown = (row: ExampleData) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => alert(`View ${row.name}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert(`Edit ${row.name}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Item
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => alert(`Delete ${row.name}`)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Example 5: Using customActions with conditional rendering
  const renderConditionalActions = (row: ExampleData) => {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => alert(`View ${row.name}`)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
        {row.status === "active" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alert(`Edit ${row.name}`)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => alert(`Delete ${row.name}`)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

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
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      id: "createdAt",
      header: "Created At",
      accessorKey: "createdAt" as keyof ExampleData,
      visible: true,
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">DataTable Custom Actions Examples</h1>

      {/* Example 1: Traditional rowActions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          1. Traditional rowActions (Dropdown Menu)
        </h2>
        <DataTable
          data={exampleData}
          columns={columns}
          getRowId={(row) => row.id}
          rowActions={traditionalActions}
          onRowAction={handleTraditionalAction}
          emptyMessage="No data available"
        />
      </div>

      {/* Example 2: Custom inline buttons */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          2. Custom Actions - Inline Icon Buttons
        </h2>
        <DataTable
          data={exampleData}
          columns={columns}
          getRowId={(row) => row.id}
          customActions={renderInlineButtons}
          emptyMessage="No data available"
        />
      </div>

      {/* Example 3: Custom text links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          3. Custom Actions - Text Links
        </h2>
        <DataTable
          data={exampleData}
          columns={columns}
          getRowId={(row) => row.id}
          customActions={renderTextLinks}
          emptyMessage="No data available"
        />
      </div>

      {/* Example 4: Custom dropdown */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          4. Custom Actions - Custom Dropdown
        </h2>
        <DataTable
          data={exampleData}
          columns={columns}
          getRowId={(row) => row.id}
          customActions={renderCustomDropdown}
          emptyMessage="No data available"
        />
      </div>

      {/* Example 5: Conditional actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          5. Custom Actions - Conditional Rendering
        </h2>
        <DataTable
          data={exampleData}
          columns={columns}
          getRowId={(row) => row.id}
          customActions={renderConditionalActions}
          emptyMessage="No data available"
        />
      </div>
    </div>
  );
};

export default DataTableExample;
