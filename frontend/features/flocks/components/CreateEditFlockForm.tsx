"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { Flock as FlockType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateEditFlockSchema } from "../schemas/createEditFlockSchema";
import { useCreateFlock } from "../hooks/useCreateFlock";
import { useEditFlock } from "../hooks/useEditFlock";
import { createEditFlockSchema } from "../schemas/createEditFlockSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";

type CreateEditFlockFormProps = {
  selectedFlock?: FlockType;
  triggerButton?: React.ReactNode;
};

const CreateEditFlockForm = ({
  selectedFlock,
  triggerButton,
}: CreateEditFlockFormProps) => {
  const isEditMode = !!selectedFlock;
  const { farmId } = useParams() as { farmId: string };
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const { mutate: createFlock, isPending: isCreatePending } = useCreateFlock();
  const { mutate: editFlock, isPending: isEditPending } = useEditFlock();

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
    const validatedData = createEditFlockSchema.safeParse({
      name: rawData.name,
      status: rawData.status,
      startDate: rawData.startDate,
      endDate: rawData.endDate,
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
      const payload = {
        ...validatedData.data,
        _id: selectedFlock?._id,
        farmId: selectedFlock?.farmId,
      } as Record<string, unknown>;
      editFlock(
        payload as Omit<
          FlockType,
          "totalChicks" | "shedsCount" | "createdAt" | "updatedAt"
        >
      );
    } else {
      const payload = { ...validatedData.data, farmId: farmId } as Record<
        string,
        unknown
      >;
      createFlock(payload as Omit<FlockType, "createdAt" | "updatedAt">);
    }
    (e.target as HTMLFormElement).reset();
    setIsOpen(false);
  };

  const getFieldError = (fieldName: keyof CreateEditFlockSchema) => {
    return validationErrors[fieldName as string] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="w-fit">
            <Building2 className="w-4 h-4 mr-2" />
            {isEditMode ? "Edit Flock" : "Add Flock"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full mb-2">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {isEditMode ? "Edit Flock" : "Add new Flock"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isEditMode
              ? "Edit the flock with appropriate values"
              : "Add a new flock to the system with appropriate values"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Flock Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter flock name"
                defaultValue={selectedFlock?.name || ""}
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
                Flock Name must be between 3 and 50 characters
              </p>
            )}
          </div>

          {/* Flock Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              defaultValue={selectedFlock?.status || "active"}
            >
              <SelectTrigger>
                <SelectValue defaultValue="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Flock Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={
                selectedFlock?.startDate
                  ? new Date(selectedFlock.startDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
            />
          </div>

          {/* Flock End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={
                selectedFlock?.endDate
                  ? new Date(selectedFlock.endDate).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEditPending || isCreatePending}>
              {isEditMode ? "Edit Flock" : "Create Flock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditFlockForm;
