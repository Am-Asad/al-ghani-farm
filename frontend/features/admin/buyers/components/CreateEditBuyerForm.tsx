"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Building2 } from "lucide-react";
import { Buyer as BuyerType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEditBuyer, useCreateBuyer } from "../hooks/useBuyerHooks";
import {
  createEditBuyerSchema,
  CreateEditBuyerSchema,
} from "../schemas/createEditBuyerSchema";

type CreateEditBuyerFormProps = {
  selectedBuyer?: BuyerType;
  triggerButton?: React.ReactNode;
};

const CreateEditBuyerForm = ({
  selectedBuyer,
  triggerButton,
}: CreateEditBuyerFormProps) => {
  const isEditMode = !!selectedBuyer;
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const { mutate: createBuyer, isPending: isCreatePending } = useCreateBuyer();
  const { mutate: editBuyer, isPending: isEditPending } = useEditBuyer();

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
    const validatedData = createEditBuyerSchema.safeParse({
      name: rawData.name,
      contactNumber: rawData.contactNumber,
      address: rawData.address,
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
      editBuyer({
        ...(payload as typeof validatedData.data),
        _id: selectedBuyer?._id,
      } as Omit<BuyerType, "createdAt" | "updatedAt">);
    } else {
      const payload = { ...validatedData.data } as Record<string, unknown>;
      createBuyer(
        payload as Omit<BuyerType, "_id" | "createdAt" | "updatedAt">
      );
    }
    (e.target as HTMLFormElement).reset();
    setIsOpen(false);
  };

  const getFieldError = (fieldName: keyof CreateEditBuyerSchema) => {
    return validationErrors[fieldName as string] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="w-fit">
            <Building2 className="w-4 h-4 mr-2" />
            {isEditMode ? "Edit Buyer" : "Add Buyer"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full mb-2">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {isEditMode ? "Edit Buyer" : "Add new Buyer"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isEditMode
              ? "Edit the buyer with appropriate values"
              : "Add a new buyer to the system with appropriate values"}
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
                placeholder="Enter buyer name"
                defaultValue={selectedBuyer?.name || ""}
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
                Buyer Name must be between 3 and 100 characters
              </p>
            )}
          </div>

          {/* Buyer Contact Number */}
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="contactNumber"
                name="contactNumber"
                type="text"
                placeholder="Enter contact number"
                defaultValue={selectedBuyer?.contactNumber || ""}
                autoFocus={false}
                className={`pl-10 ${
                  getFieldError("contactNumber") ? "border-destructive" : ""
                }`}
              />
            </div>
            {getFieldError("contactNumber") ? (
              <p className="text-xs text-destructive">
                {getFieldError("contactNumber")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Buyer Contact Number must be a valid Pakistani contact number
              </p>
            )}
          </div>

          {/* Buyer Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Enter address"
                defaultValue={selectedBuyer?.address || ""}
                autoFocus={false}
                className={`pl-10 ${
                  getFieldError("address") ? "border-destructive" : ""
                }`}
              />
            </div>
            {getFieldError("address") ? (
              <p className="text-xs text-destructive">
                {getFieldError("address")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Buyer Address must be a valid address
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEditPending || isCreatePending}>
              {isEditMode ? "Edit Buyer" : "Create Buyer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditBuyerForm;
