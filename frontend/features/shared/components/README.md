# Reusable Bulk Upload System

This directory contains a generic, reusable bulk upload system that can be used across different modules in the application.

## Components Overview

### 1. `BulkUpload.tsx`

The main component that orchestrates the entire bulk upload process. It handles:

- File selection and validation
- CSV parsing using the generic parser
- Data preview and validation
- Upload functionality

### 2. `BulkDataPreview.tsx`

A generic component that displays:

- Parse results summary (total, valid, invalid rows)
- Validation errors with helpful tips
- Data preview table
- Action buttons (upload or download template)

### 3. `useBulkUpload.ts`

A generic React Query hook that handles:

- API calls for bulk creation
- Loading states and toast notifications
- Query invalidation after successful uploads
- Error handling

## How to Use

### Step 1: Create Configuration Files

For each entity (e.g., farms, users), create a configuration file:

```typescript
// features/[entity]/config/[entity]BulkConfig.ts
import { z } from "zod";
import { CSVConfig } from "@/utils/generic-csv-parser";

// 1. Define the schema for your entity
export const entityRecordSchema = z.object({
  name: z.string().min(3).max(50),
  // ... other fields
});

// 2. Define header variations for CSV parsing
export const entityHeaders = {
  name: ["name", "entity_name", "entity name"],
  // ... other fields with their variations
} as const;

// 3. Create CSV configuration
export const entityCSVConfig: CSVConfig<EntityRecord> = {
  schema: entityRecordSchema,
  headers: entityHeaders,
  entityName: "entity",
};

// 4. Define columns for data preview
export const entityColumns = [
  { key: "name" as keyof EntityRecord, label: "Name" },
  // ... other columns
];

// 5. Template configuration
export const entityTemplateHeaders = ["name", "field2", "field3"];
export const entitySampleData = ["Sample Name", "Sample Value", "Sample Value"];

// 6. Transform function (optional)
export function transformEntityRecordsToAPI(records: EntityRecord[]) {
  return records.map((record) => ({
    // Transform to API format
  }));
}
```

### Step 2: Create the Bulk Upload Component

```typescript
// features/[entity]/components/Create[Entity]Bulk.tsx
import React from "react";
import BulkUpload from "@/features/shared/components/BulkUpload";
import {
  entityCSVConfig,
  entityColumns,
  entityTemplateHeaders,
  entitySampleData,
  transformEntityRecordsToAPI,
  EntityRecord,
} from "../config/entityBulkConfig";
import { queryKeys } from "@/lib/query-client";

type CreateEntityBulkProps = {
  onSuccess?: () => void;
};

const CreateEntityBulk = ({ onSuccess }: CreateEntityBulkProps) => {
  return (
    <BulkUpload<EntityRecord>
      entityName="entity"
      csvConfig={entityCSVConfig}
      uploadConfig={{
        endpoint: "entities",
        queryKey: [...queryKeys.entities],
        transformData: transformEntityRecordsToAPI, // optional
        successMessage: (count) =>
          `Successfully created ${count} entity${count > 1 ? "s" : ""}`,
        loadingMessage: "Creating entities in bulk...",
        errorMessage: "Failed to create entities",
      }}
      columns={entityColumns}
      templateHeaders={entityTemplateHeaders}
      sampleData={entitySampleData}
      onSuccess={onSuccess}
      uploadTitle="Upload Entity Data"
      uploadDescription="Upload a CSV or Excel file with entity information"
    />
  );
};

export default CreateEntityBulk;
```

### Step 3: Integrate with Header Component

```typescript
// features/[entity]/components/[Entity]Header.tsx
import CreateEntityBulk from "./CreateEntityBulk";
import CreateSingleBulkFormDialog from "@/features/shared/components/CreateSingleBulkFormDialog";

// In your header component:
<CreateSingleBulkFormDialog
  trigger={<Button>Add Entity</Button>}
  entityType="entity"
  isOpen={isOpen}
  setIsOpen={setIsOpen}
  SingleEntityForm={<CreateEntityForm onSuccess={handleSuccess} />}
  BulkEntityForm={<CreateEntityBulk onSuccess={handleSuccess} />}
/>;
```

## Features

### CSV Parsing

- Supports CSV and Excel files (.csv, .xlsx, .xls)
- Flexible header mapping (e.g., "name", "entity_name", "entity name")
- Zod-based validation with detailed error messages
- Handles missing headers and invalid data gracefully

### Data Preview

- Shows parse results summary
- Displays validation errors with helpful tips
- Preview table with first 10 records
- Download template functionality

### Upload Process

- Loading states and progress indicators
- Toast notifications for success/error
- Automatic query invalidation
- Form reset after successful upload

### Error Handling

- File type validation
- CSV parsing errors
- Data validation errors
- API errors with user-friendly messages

## Configuration Options

### CSVConfig

```typescript
type CSVConfig<T> = {
  schema: z.ZodSchema<T>; // Zod schema for validation
  headers: Record<keyof T, string[]>; // Header variations
  entityName: string; // Entity name for error messages
};
```

### UploadConfig

```typescript
type BulkUploadConfig<T, R> = {
  endpoint: string; // API endpoint (e.g., "farms")
  queryKey: string[]; // Query key for invalidation
  entityName: string; // Entity name for messages
  transformData?: (data: T[]) => R[]; // Optional data transformation
  successMessage?: (count: number) => string; // Custom success message
  errorMessage?: string; // Custom error message
  loadingMessage?: string; // Custom loading message
};
```

## Examples

See the following implementations:

- `features/farms/config/farmBulkConfig.ts` - Farm configuration
- `features/farms/components/CreateFarmBulk.tsx` - Farm bulk upload
- `features/users/config/userBulkConfig.ts` - User configuration
- `features/users/components/CreateUserBulk.tsx` - User bulk upload

## Benefits

1. **Reusability**: Single implementation for all entities
2. **Type Safety**: Full TypeScript support with generics
3. **Consistency**: Uniform UX across all modules
4. **Maintainability**: Centralized logic, easy to update
5. **Flexibility**: Configurable for different data structures
6. **Error Handling**: Comprehensive validation and user feedback
