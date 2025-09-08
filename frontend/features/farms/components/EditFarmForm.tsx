"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock, Building2, PersonStanding } from "lucide-react";
import { toast } from "sonner";
import { editFarmSchema } from "@/features/farms/schemas/editFarmSchema";
import { useEditFarm } from "../hooks/useEditFarm";
import { Farm as FarmType } from "@/types/farm-types";

type EditFarmFormProps = {
  selectedFarm: FarmType;
};

const EditFarmForm = ({ selectedFarm }: EditFarmFormProps) => {
  const { mutate: editFarm } = useEditFarm();
  const [isOpen, setIsOpen] = useState(false);
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
    const validatedData = editFarmSchema.safeParse({
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
      toast.error("Edit farm failed", { id: "editFarm" });
    } else {
      setValidationErrors({});
      toast.success("Edit farm successful", { id: "editFarm" });

      const farmData: Partial<Omit<FarmType, "createdAt" | "updatedAt">> = {
        _id: selectedFarm._id,
        name: validatedData.data.name,
        supervisor: validatedData.data.supervisor,
        totalSheds: validatedData.data.totalSheds,
      };

      editFarm(farmData as Omit<FarmType, "createdAt" | "updatedAt">);
      (e.target as HTMLFormElement).reset();
      setIsOpen(false);
    }
  };

  const getFieldError = (
    fieldName: keyof EditFarmFormProps["selectedFarm"]
  ) => {
    return validationErrors[fieldName as string] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <Building2 className="w-4 h-4 mr-2" />
          Edit Farm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full mb-2">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-center">Edit User</DialogTitle>
          <DialogDescription className="text-center">
            Edit the user with appropriate values
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
                placeholder="Enter username"
                defaultValue={selectedFarm.name}
                autoFocus={false}
                className={`pl-10 ${
                  getFieldError("name") ? "border-destructive" : ""
                }`}
                required
              />
            </div>
            {getFieldError("name") ? (
              <p className="text-xs text-destructive">
                {getFieldError("name")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Farm name must be between 3 and 50 characters
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisor">Supervisor</Label>
            <div className="relative">
              <PersonStanding className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="supervisor"
                name="supervisor"
                type="text"
                placeholder="Enter supervisor name"
                defaultValue={selectedFarm.supervisor}
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
                defaultValue={selectedFarm.totalSheds.toString()}
                autoFocus={false}
                className={`pl-10 pr-10 ${
                  getFieldError("totalSheds") ? "border-destructive" : ""
                }`}
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

          <DialogFooter className="gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Edit User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFarmForm;
