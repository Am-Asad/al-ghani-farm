"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Building2 } from "lucide-react";
import { useCreateFarm } from "../hooks/useCreateFarm";
import {
  CreateEditFarmSchema,
  createEditFarmSchema,
} from "../schemas/createEditFarmSchema";
import { Farm as FarmType } from "@/types";
import { useEditFarm } from "../hooks/useEditFarm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CreateEditFarmFormProps = {
  selectedFarm?: FarmType;
  triggerButton?: React.ReactNode;
};

const CreateEditFarmForm = ({
  selectedFarm,
  triggerButton,
}: CreateEditFarmFormProps) => {
  const isEditMode = !!selectedFarm;
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const { mutate: createFarm, isPending: isCreatePending } = useCreateFarm();
  const { mutate: editFarm, isPending: isEditPending } = useEditFarm();

  const handleClose = () => {
    setIsOpen(false);
    setValidationErrors({});
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Clear previous validation errors
    setValidationErrors({});

    // Get form data using FormData API
    const formData = new FormData(e.target as HTMLFormElement);
    const rawData = Object.fromEntries(formData) as Record<string, string>;

    // Validate with Zod schema
    const validatedData = createEditFarmSchema.safeParse({
      name: rawData.name,
      supervisor: rawData.supervisor,
    });
    if (!validatedData.success) {
      const formatted: Record<string, string> = {};
      validatedData.error.issues.forEach((err) => {
        formatted[err.path[0] as string] = err.message;
      });
      setValidationErrors(formatted);
      return;
    }

    if (isEditMode) {
      const payload = { ...validatedData.data } as Record<string, unknown>;
      editFarm({
        ...(payload as typeof validatedData.data),
        _id: selectedFarm?._id,
      } as Omit<FarmType, "createdAt" | "updatedAt">);
    } else {
      const payload = { ...validatedData.data } as Record<string, unknown>;
      createFarm(payload as Omit<FarmType, "_id" | "createdAt" | "updatedAt">);
    }
    (e.target as HTMLFormElement).reset();
    setIsOpen(false);
  };

  const getFieldError = (fieldName: keyof CreateEditFarmSchema) => {
    return validationErrors[fieldName as string] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="w-fit">
            <Building2 className="w-4 h-4 mr-2" />
            {isEditMode ? "Edit Farm" : "Add Farm"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full mb-2">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {isEditMode ? "Edit Farm" : "Add new Farm"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isEditMode
              ? "Edit the farm with appropriate values"
              : "Add a new farm to the system with appropriate values"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter farm name"
                defaultValue={selectedFarm?.name || ""}
                autoFocus={false}
                className={`pl-10 ${
                  getFieldError("name") ? "border-destructive" : ""
                }`}
              />
            </div>
            {getFieldError("name") ? (
              <p className="text-xs text-destructive">
                {getFieldError("name")}
              </p>
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
                defaultValue={selectedFarm?.supervisor || ""}
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

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEditPending || isCreatePending}>
              {isEditMode ? "Edit Farm" : "Create Farm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditFarmForm;
