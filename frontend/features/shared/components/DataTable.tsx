import React, { useState, useMemo, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

// Types for column configuration
export interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (props: { row: { original: T } }) => React.ReactNode;
  visible?: boolean;
  width?: string;
}

// Types for selection
export type SelectionMode = "single" | "multiple" | "none";

export interface SelectionState {
  selectedRows: Set<string>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

// Enhanced action interface that supports custom components
export interface RowAction<T> {
  label: string;
  value: string;
  variant?: "default" | "destructive";
  component?: (row: T) => React.ReactNode;
}

// Main DataTable props
export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  selectionMode?: SelectionMode;
  onSelectionChange?: (selectedRows: T[]) => void;
  onRowAction?: (action: string, row: T) => void;
  rowActions?: RowAction<T>[];
  customActions?: (row: T) => React.ReactNode;
  className?: string;
  emptyMessage?: string;
  showColumnVisibilityToggle?: boolean;
  deleteBulkRecords?: React.ReactNode;
  selectedRows?: T[];
}

const DataTable = <T,>({
  data,
  columns,
  getRowId,
  selectionMode = "multiple",
  onSelectionChange,
  onRowAction,
  rowActions = [],
  customActions,
  className = "",
  emptyMessage = "No data available",
  showColumnVisibilityToggle = true,
  deleteBulkRecords,
  selectedRows,
}: DataTableProps<T>) => {
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(() => {
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach((column) => {
      initialVisibility[column.id] = column.visible !== false; // Default to true unless explicitly set to false
    });
    return initialVisibility;
  });

  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedRows: new Set(),
    isAllSelected: false,
    isIndeterminate: false,
  });

  // Get visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter((column) => columnVisibility[column.id]);
  }, [columns, columnVisibility]);

  // Sync internal selection state with external selectedRows prop
  useEffect(() => {
    if (selectedRows) {
      const selectedRowIds = new Set(selectedRows.map(getRowId));
      const isAllSelected =
        selectedRowIds.size === data.length && data.length > 0;
      const isIndeterminate =
        selectedRowIds.size > 0 && selectedRowIds.size < data.length;

      setSelectionState({
        selectedRows: selectedRowIds,
        isAllSelected,
        isIndeterminate,
      });
    }
  }, [selectedRows, data, getRowId]);

  // Handle column visibility toggle
  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  // Handle show all columns
  const showAllColumns = () => {
    const allVisible: Record<string, boolean> = {};
    columns.forEach((column) => {
      allVisible[column.id] = true;
    });
    setColumnVisibility(allVisible);
  };

  // Handle hide all columns
  const hideAllColumns = () => {
    const allHidden: Record<string, boolean> = {};
    columns.forEach((column) => {
      allHidden[column.id] = false;
    });
    setColumnVisibility(allHidden);
  };

  // Handle row selection
  const handleRowSelect = (rowId: string, isSelected: boolean) => {
    const newSelectedRows = new Set(selectionState.selectedRows);

    if (isSelected) {
      newSelectedRows.add(rowId);
    } else {
      newSelectedRows.delete(rowId);
    }

    const isAllSelected = newSelectedRows.size === data.length;
    const isIndeterminate =
      newSelectedRows.size > 0 && newSelectedRows.size < data.length;

    setSelectionState({
      selectedRows: newSelectedRows,
      isAllSelected,
      isIndeterminate,
    });

    // Call onSelectionChange with selected row objects
    if (onSelectionChange) {
      const selectedRowObjects = data.filter((row) =>
        newSelectedRows.has(getRowId(row))
      );
      onSelectionChange(selectedRowObjects);
    }
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    const newSelectedRows = isSelected
      ? new Set(data.map(getRowId))
      : new Set<string>();

    setSelectionState({
      selectedRows: newSelectedRows,
      isAllSelected: isSelected,
      isIndeterminate: false,
    });

    if (onSelectionChange) {
      onSelectionChange(isSelected ? data : []);
    }
  };

  // Handle row action
  const handleRowAction = (action: string, row: T) => {
    if (onRowAction) {
      onRowAction(action, row);
    }
  };

  // Render cell content
  const renderCell = (column: Column<T>, row: T) => {
    if (column.cell) {
      return column.cell({ row: { original: row } });
    }

    if (column.accessorKey) {
      const value = row[column.accessorKey];
      return value?.toString() || "";
    }

    return "";
  };

  if (data.length === 0) {
    return (
      <div className={`rounded-lg border bg-card p-8 text-center ${className}`}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg w-full border bg-card overflow-hidden ${className}`}
    >
      {showColumnVisibilityToggle && (
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={showAllColumns}
            >
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={hideAllColumns}
            >
              Hide All
            </Button>
            <div className="flex gap-2 items-center">
              {selectedRows &&
                selectedRows.length > 0 &&
                deleteBulkRecords &&
                deleteBulkRecords}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Settings2 className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 max-h-48 overflow-y-auto"
            >
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={columnVisibility[column.id]}
                  onCheckedChange={() => toggleColumnVisibility(column.id)}
                >
                  {column.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="overflow-x-auto w-full">
        <table className="w-full table-auto min-w-max">
          <colgroup>
            {selectionMode !== "none" && <col className="w-12" />}
            {visibleColumns.map((column) => (
              <col key={column.id} style={{ width: column.width || "auto" }} />
            ))}
            {(rowActions.length > 0 || customActions) && (
              <col className="w-20" />
            )}
          </colgroup>
          <thead>
            <tr className="border-b">
              {selectionMode !== "none" && (
                <th className="p-4">
                  {selectionMode === "multiple" && (
                    <Checkbox
                      checked={
                        selectionState.isIndeterminate
                          ? "indeterminate"
                          : selectionState.isAllSelected
                      }
                      onCheckedChange={handleSelectAll}
                      className="h-4 w-4"
                    />
                  )}
                </th>
              )}
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className="p-4 text-left font-medium text-foreground"
                >
                  {column.header}
                </th>
              ))}
              {(rowActions.length > 0 || customActions) && (
                <th className="p-4 text-left font-medium text-foreground">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="overflow-hidden">
            {data.map((row) => {
              const rowId = getRowId(row);
              const isSelected = selectionState.selectedRows.has(rowId);

              return (
                <tr
                  key={rowId}
                  className={`border-b last:border-b-0 ${
                    isSelected ? "bg-muted/50" : "hover:bg-muted/50"
                  }`}
                >
                  {selectionMode !== "none" && (
                    <td className="p-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked: boolean) =>
                          handleRowSelect(rowId, checked)
                        }
                        className="h-4 w-4"
                      />
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td key={column.id} className="p-4 text-foreground">
                      {renderCell(column, row)}
                    </td>
                  ))}
                  {(rowActions.length > 0 || customActions) && (
                    <td className="p-4">
                      {customActions ? (
                        customActions(row)
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {rowActions.map((action) => (
                              <div key={action.value}>
                                {action.component ? (
                                  // Render custom component if provided
                                  <div onClick={(e) => e.stopPropagation()}>
                                    {action.component(row)}
                                  </div>
                                ) : (
                                  // Render default dropdown item
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRowAction(action.value, row)
                                    }
                                    className={
                                      action.variant === "destructive"
                                        ? "text-red-600"
                                        : ""
                                    }
                                  >
                                    {action.label}
                                  </DropdownMenuItem>
                                )}
                              </div>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
