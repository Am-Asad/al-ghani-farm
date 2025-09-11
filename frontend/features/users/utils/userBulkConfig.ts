import { z } from "zod";
import type { CSVConfig } from "@/utils/csvParser";

// Schema for a single CSV row representing a user
export const userRecordSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .trim(),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(100, "Password must be at most 100 characters"),
  role: z.enum(["admin", "manager", "viewer"], {
    message: "Role is required",
  }),
});

export type UserRecord = z.infer<typeof userRecordSchema>;

// Accept multiple header variants to be resilient to CSVs from different sources
export const userHeaders: Record<keyof UserRecord, string[]> = {
  username: ["username", "user_name", "user name", "name"],
  email: ["email", "email_address", "email address"],
  password: ["password", "pwd", "pass"],
  role: ["role", "user_role", "user role"],
} as const;

export const userCSVConfig: CSVConfig<UserRecord> = {
  schema: userRecordSchema,
  headers: userHeaders,
  entityName: "user",
};

export const userColumns = [
  { key: "username" as const, label: "Username" },
  { key: "email" as const, label: "Email" },
  { key: "role" as const, label: "Role" },
];

export const userTemplateHeaders = ["username", "email", "password", "role"];
export const userSampleData = [
  "jane_doe",
  "jane@example.com",
  "pass123",
  "viewer",
];

// Transform parsed CSV rows into API payload shape
export const transformUserRecordsToAPI = (
  rows: UserRecord[]
): Array<Pick<UserRecord, "username" | "email" | "password" | "role">> =>
  rows.map((r) => ({
    username: r.username,
    email: r.email,
    password: r.password,
    role: r.role,
  }));
