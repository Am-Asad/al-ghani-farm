# Reusable Bulk Upload System

This directory contains a generic, reusable bulk upload system that can be used across different modules in the application.

## Components Overview

### 1. `BulkCreate.tsx`

An entity-agnostic wrapper around `BulkUpload` that exposes a concise API for CSV/Excel driven bulk creation. Prefer using `BulkCreate` in your features.

### 2. `BulkUpload.tsx`

The lower-level component that orchestrates the upload flow (file selection, parse, preview, upload).

### 3. `BulkDataPreview.tsx`

Displays parse results, validation errors, preview table, and actions.

### 4. `useBulkUpload.ts`

React Query mutation for bulk creation with toasts and cache invalidation.

## How to Use

### Step 1: Create Configuration Files

For each entity (e.g., farms, users), create a configuration file:

```typescript
// features/[entity]/utils/[entity]BulkConfig.ts
import { z } from "zod";
import { CSVConfig } from "@/utils/csvParser";

export const entityRecordSchema = z.object({
  name: z.string().min(3).max(50).trim(),
});

export type EntityRecord = z.infer<typeof entityRecordSchema>;

export const entityHeaders: Record<keyof EntityRecord, string[]> = {
  name: ["name", "entity_name", "entity name"],
} as const;

export const entityCSVConfig: CSVConfig<EntityRecord> = {
  schema: entityRecordSchema,
  headers: entityHeaders,
  entityName: "entity",
};

export const entityColumns = [{ key: "name" as const, label: "Name" }];

export const entityTemplateHeaders = ["name"];
export const entitySampleData = ["Sample Name"];

export const transformEntityRecordsToAPI = (rows: EntityRecord[]) =>
  rows.map((r) => ({ name: r.name }));
```

### Step 2: Use `BulkCreate` in your feature component

```tsx
import BulkCreate from "@/features/shared/components/BulkCreate";
import {
  entityCSVConfig,
  entityColumns,
  entityTemplateHeaders,
  entitySampleData,
  transformEntityRecordsToAPI,
} from "@/features/[entity]/utils/[entity]BulkConfig";

export const CreateBulkEntities = () => (
  <BulkCreate
    entityName="entity"
    csvConfig={entityCSVConfig}
    uploadConfig={{
      endpoint: "entities",
      queryKey: ["entities"],
      transformData: transformEntityRecordsToAPI,
      loadingMessage: "Creating entities in bulk...",
    }}
    columns={entityColumns}
    templateHeaders={entityTemplateHeaders}
    sampleData={entitySampleData}
  />
);
```

### Step 3: Integrate with `CreateSingleBulkFormDialog`

```tsx
import CreateSingleBulkFormDialog from "@/features/shared/components/CreateSingleBulkFormDialog";
import { CreateBulkEntities } from "./CreateBulkEntities";

<CreateSingleBulkFormDialog
  trigger={<Button>Add Entity</Button>}
  entityType="entity"
  isOpen={isOpen}
  setIsOpen={setIsOpen}
  SingleEntityForm={<CreateEntityForm onSuccess={handleSuccess} />}
  BulkEntityForm={<CreateBulkEntities />}
/>;
```

## Concrete Examples

### Farms

See `features/farms/utils/farmBulkConfig.ts` for a complete config. Use it with:

```tsx
import BulkCreate from "@/features/shared/components/BulkCreate";
import {
  farmCSVConfig,
  farmColumns,
  farmTemplateHeaders,
  farmSampleData,
  transformFarmRecordsToAPI,
} from "@/features/farms/utils/farmBulkConfig";

export const CreateBulkFarms = () => (
  <BulkCreate
    entityName="farm"
    csvConfig={farmCSVConfig}
    uploadConfig={{
      endpoint: "farms",
      queryKey: ["farms"],
      transformData: transformFarmRecordsToAPI,
      loadingMessage: "Creating farms in bulk...",
    }}
    columns={farmColumns}
    templateHeaders={farmTemplateHeaders}
    sampleData={farmSampleData}
  />
);
```

### Users (example)

Create a `features/users/utils/userBulkConfig.ts` similar to farms:

```ts
import { z } from "zod";
import type { CSVConfig } from "@/utils/csvParser";

export const userRecordSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.string().email().trim(),
  role: z.enum(["admin", "supervisor", "farmer"]),
});

export type UserRecord = z.infer<typeof userRecordSchema>;

export const userHeaders: Record<keyof UserRecord, string[]> = {
  name: ["name", "full_name", "full name"],
  email: ["email", "email_address", "email address"],
  role: ["role", "user_role", "user role"],
};

export const userCSVConfig: CSVConfig<UserRecord> = {
  schema: userRecordSchema,
  headers: userHeaders,
  entityName: "user",
};

export const userColumns = [
  { key: "name" as const, label: "Name" },
  { key: "email" as const, label: "Email" },
  { key: "role" as const, label: "Role" },
];

export const userTemplateHeaders = ["name", "email", "role"];
export const userSampleData = ["Jane Doe", "jane@example.com", "farmer"];

export const transformUserRecordsToAPI = (rows: UserRecord[]) =>
  rows.map((r) => ({ name: r.name, email: r.email, role: r.role }));
```

Use it:

```tsx
import BulkCreate from "@/features/shared/components/BulkCreate";
import {
  userCSVConfig,
  userColumns,
  userTemplateHeaders,
  userSampleData,
  transformUserRecordsToAPI,
} from "@/features/users/utils/userBulkConfig";

export const CreateBulkUsers = () => (
  <BulkCreate
    entityName="user"
    csvConfig={userCSVConfig}
    uploadConfig={{
      endpoint: "users",
      queryKey: ["users"],
      transformData: transformUserRecordsToAPI,
      loadingMessage: "Creating users in bulk...",
    }}
    columns={userColumns}
    templateHeaders={userTemplateHeaders}
    sampleData={userSampleData}
  />
);
```

## Notes

- Validation is enforced via Zod in `csvConfig.schema`.
- Header variations are handled via `csvConfig.headers`.
- `transformData` maps parsed rows to your API payload.
- Cache invalidation is controlled with `uploadConfig.queryKey`.
