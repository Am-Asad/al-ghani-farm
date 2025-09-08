"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useCreateFarm } from "@/features/farms/hooks/useCreateFarm";
import {
  CreateFarmFormData,
  createFarmSchema,
} from "@/features/farms/schemas/createFarmSchema";

type CreateFarmFormProps = {
  onSuccess?: () => void;
};

const CreateFarmForm = ({ onSuccess }: CreateFarmFormProps) => {
  const { mutate: createFarm } = useCreateFarm();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Clear previous validation errors
    setValidationErrors({});

    // Get form data using FormData API
    const formData = new FormData(e.target as HTMLFormElement);
    const rawData = Object.fromEntries(formData) as Record<string, string>;

    // Validate with Zod schema
    const validatedData = createFarmSchema.safeParse({
      name: rawData.name,
      supervisor: rawData.supervisor,
      totalSheds: parseInt(rawData.totalSheds),
    });
    if (!validatedData.success) {
      const formatted: Record<string, string> = {};
      validatedData.error.issues.forEach((err) => {
        formatted[err.path[0] as string] = err.message;
      });
      setValidationErrors(formatted);
      toast.error("Farm creation failed", { id: "createFarm" });
    } else {
      setValidationErrors({});
      toast.success("Farm creation successful", { id: "createFarm" });
      createFarm(validatedData.data);
      (e.target as HTMLFormElement).reset();
      onSuccess?.();
    }
  };

  const getFieldError = (fieldName: keyof CreateFarmFormData) => {
    return validationErrors[fieldName as string] || "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter farm name"
            autoFocus={false}
            className={`pl-10 ${
              getFieldError("name") ? "border-destructive" : ""
            }`}
            required
          />
        </div>
        {getFieldError("name") ? (
          <p className="text-xs text-destructive">{getFieldError("name")}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Farm Name must be between 3 and 50 characters
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="supervisor">Supervisor</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="supervisor"
            name="supervisor"
            type="text"
            placeholder="Enter supervisor name"
            autoFocus={false}
            className={`pl-10 ${
              getFieldError("supervisor") ? "border-destructive" : ""
            }`}
            required
          />
        </div>
        {getFieldError("supervisor") ? (
          <p className="text-xs text-destructive">
            {getFieldError("supervisor")}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Supervisor must be a valid name
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalSheds">Total Sheds</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="totalSheds"
            name="totalSheds"
            type="number"
            placeholder="Enter total sheds"
            autoFocus={false}
            className={`pl-10 pr-10 ${
              getFieldError("totalSheds") ? "border-destructive" : ""
            }`}
            required
          />
        </div>
        {getFieldError("totalSheds") ? (
          <p className="text-xs text-destructive">
            {getFieldError("totalSheds")}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Total sheds must be at least 1
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Create Farm</Button>
      </div>
    </form>
  );
};

export default CreateFarmForm;
