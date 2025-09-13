import React, { useState } from "react";
import { Shed as ShedType } from "@/types";
import { useParams } from "next/navigation";
import { useCreateShed } from "../hooks/useCreateShed";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  createEditShedSchema,
  CreateEditShedSchema,
} from "../schemas/createEditShedSchema";
import { useEditShed } from "../hooks/useEditShed";

type CreateEditShedFormProps = {
  selectedShed?: ShedType;
  triggerButton?: React.ReactNode;
};

const CreateEditShedForm = ({
  selectedShed,
  triggerButton,
}: CreateEditShedFormProps) => {
  const isEditMode = !!selectedShed;
  const { flockId } = useParams() as { flockId: string };
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const { mutate: createShed, isPending: isCreatePending } = useCreateShed();
  const { mutate: editShed, isPending: isEditPending } = useEditShed();

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
    const validatedData = createEditShedSchema.safeParse({
      name: rawData.name,
      totalChicks: Number(rawData.totalChicks),
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
        _id: selectedShed?._id,
        flockId: selectedShed?.flockId,
      } as Record<string, unknown>;
      editShed(payload as Omit<ShedType, "createdAt" | "updatedAt">);
    } else {
      const payload = { ...validatedData.data, flockId } as Record<
        string,
        unknown
      >;
      createShed(payload as Omit<ShedType, "createdAt" | "updatedAt">);
    }
    (e.target as HTMLFormElement).reset();
    setIsOpen(false);
  };

  const getFieldError = (fieldName: keyof CreateEditShedSchema) => {
    return validationErrors[fieldName as string] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="w-fit">
            <Building2 className="w-4 h-4 mr-2" />
            {isEditMode ? "Edit Shed" : "Add Shed"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full mb-2">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {isEditMode ? "Edit Shed" : "Add new Shed"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isEditMode
              ? "Edit the shed with appropriate values"
              : "Add a new shed to the system with appropriate values"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shed Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter shed name"
                defaultValue={selectedShed?.name || ""}
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
                Shed Name must be between 3 and 50 characters
              </p>
            )}
          </div>

          {/* Shed Total Chicks */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Total Chicks</Label>
            <Input
              id="totalChicks"
              name="totalChicks"
              type="number"
              defaultValue={
                selectedShed?.totalChicks ? selectedShed.totalChicks : 0
              }
            />
          </div>

          <DialogFooter className="gap-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEditPending || isCreatePending}>
              {isEditMode ? "Edit Shed" : "Add Shed"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditShedForm;
