"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, Trash2, AlertCircle } from "lucide-react";
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
import { createEditFlockSchema } from "../schemas/createEditFlockSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllEntities } from "@/features/admin/hooks/useGetAllEntities";
import { useGetAllSheds } from "@/features/admin/sheds/hooks/useGetAllSheds";
import { useCreateFlock } from "../hooks/useCreateFlock";
import { useEditFlock } from "../hooks/useEditFlock";
import { Alert, AlertDescription } from "@/components/ui/alert";

type CreateEditFlockFormProps = {
  selectedFlock?: FlockType;
  triggerButton?: React.ReactNode;
};

type Allocation = {
  shedId: string;
  chicks: number;
};

const CreateEditFlockForm = ({
  selectedFlock,
  triggerButton,
}: CreateEditFlockFormProps) => {
  const { data: entities } = useGetAllEntities();
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [selectedFarm, setSelectedFarm] = useState<string>(
    selectedFlock?.farmId || ""
  );
  const [totalChicks, setTotalChicks] = useState<number>(
    selectedFlock?.totalChicks || 0
  );
  const [allocations, setAllocations] = useState<Allocation[]>(
    selectedFlock?.allocations || []
  );

  const isEditMode = !!selectedFlock;
  const allFarmsForDropdown = entities?.data?.farms || [];

  // Get sheds for the selected farm
  const { data: shedsData } = useGetAllSheds(selectedFarm);
  const availableSheds = shedsData?.data || [];

  const { mutate: createFlock, isPending: isCreatePending } = useCreateFlock();
  const { mutate: editFlock, isPending: isEditPending } = useEditFlock();

  // Reset form when farm changes
  useEffect(() => {
    if (!isEditMode) {
      setAllocations([]);
      setTotalChicks(0);
    }
  }, [selectedFarm, isEditMode]);

  const handleClose = () => {
    setIsOpen(false);
    setValidationErrors({});
    setAllocations(selectedFlock?.allocations || []);
    setTotalChicks(selectedFlock?.totalChicks || 0);
  };

  // Add new allocation
  const addAllocation = () => {
    if (availableSheds.length > 0) {
      const firstAvailableShed = availableSheds.find(
        (shed) =>
          !allocations.some((allocation) => allocation.shedId === shed._id)
      );
      if (firstAvailableShed) {
        setAllocations([
          ...allocations,
          { shedId: firstAvailableShed._id, chicks: 0 },
        ]);
      }
    }
  };

  // Remove allocation
  const removeAllocation = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  // Update allocation
  const updateAllocation = (
    index: number,
    field: keyof Allocation,
    value: string | number
  ) => {
    const newAllocations = [...allocations];
    newAllocations[index] = { ...newAllocations[index], [field]: value };
    setAllocations(newAllocations);
  };

  // Get available sheds for dropdown (not already allocated)
  const getAvailableShedsForAllocation = (currentIndex: number) => {
    return availableSheds.filter(
      (shed) =>
        !allocations.some(
          (allocation, index) =>
            allocation.shedId === shed._id && index !== currentIndex
        )
    );
  };

  // Calculate total allocated chicks
  const totalAllocatedChicks = allocations.reduce(
    (sum, allocation) => sum + allocation.chicks,
    0
  );

  // Get shed capacity
  const getShedCapacity = (shedId: string) => {
    const shed = availableSheds.find((s) => s._id === shedId);
    return shed?.capacity || 0;
  };

  // Validate allocations
  const validateAllocations = () => {
    const errors: Record<string, string> = {};

    if (allocations.length === 0) {
      errors.allocations = "At least one allocation is required";
      return errors;
    }

    // Check if total allocated equals total chicks
    if (totalAllocatedChicks !== totalChicks) {
      errors.allocations = `Total allocated chicks (${totalAllocatedChicks}) must equal total chicks (${totalChicks})`;
    }

    // Check shed capacity limits
    allocations.forEach((allocation, index) => {
      const capacity = getShedCapacity(allocation.shedId);
      if (capacity > 0 && allocation.chicks > capacity) {
        errors[
          `allocation_${index}`
        ] = `Cannot exceed shed capacity of ${capacity}`;
      }
    });

    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Clear previous validation errors
    setValidationErrors({});
    const errors: Record<string, string> = {};

    if (!selectedFarm) {
      errors.farmId = "Please select a farm";
    }

    // Validate allocations
    const allocationErrors = validateAllocations();
    Object.assign(errors, allocationErrors);

    // Get form data using FormData API
    const formData = new FormData(e.target as HTMLFormElement);
    const rawData = Object.fromEntries(formData) as Record<string, string>;

    // Validate with Zod schema
    const validatedData = createEditFlockSchema.safeParse({
      name: rawData.name,
      status: rawData.status,
      startDate: rawData.startDate,
      endDate: rawData.endDate,
      totalChicks: totalChicks,
      allocations: allocations,
      farmId: selectedFarm,
    });

    if (!validatedData.success) {
      const formatted: Record<string, string> = {};
      validatedData.error.issues.forEach((err) => {
        formatted[err.path[0] as string] = err.message;
      });
      setValidationErrors(formatted);
      return;
    }

    // If there are any errors, set them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (isEditMode) {
      const payload = {
        ...validatedData.data,
        _id: selectedFlock?._id,
      } as Record<string, unknown>;
      editFlock(payload as Omit<FlockType, "createdAt" | "updatedAt">);
    } else {
      const payload = { ...validatedData.data } as Record<string, unknown>;
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

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full mb-2">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {isEditMode ? "Edit Flock" : "Add new Flock"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isEditMode
              ? "Edit the flock with appropriate values and allocations"
              : "Add a new flock to the system with shed allocations"}
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
              <SelectTrigger
                className={`${
                  getFieldError("status") ? "border-destructive" : ""
                }`}
              >
                <SelectValue defaultValue="Select status" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("status") ? (
              <p className="text-xs text-destructive">
                {getFieldError("status")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Please select a status
              </p>
            )}
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
              className={`${
                getFieldError("startDate") ? "border-destructive" : ""
              }`}
            />
            {getFieldError("startDate") ? (
              <p className="text-xs text-destructive">
                {getFieldError("startDate")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Start date is required
              </p>
            )}
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
              className={`${
                getFieldError("endDate") ? "border-destructive" : ""
              }`}
            />
            {getFieldError("endDate") && (
              <p className="text-xs text-destructive">
                {getFieldError("endDate")}
              </p>
            )}
          </div>

          {/* Farm Id */}
          <div className="space-y-2">
            <Label htmlFor="farmId">Farm</Label>
            <Select
              value={selectedFarm}
              onValueChange={(value) => setSelectedFarm(value)}
            >
              <SelectTrigger
                className={`${
                  getFieldError("farmId") ? "border-destructive" : ""
                }`}
              >
                <SelectValue placeholder="Select farm" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {allFarmsForDropdown.map((farm) => (
                  <SelectItem key={farm._id} value={farm._id}>
                    {farm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError("farmId") ? (
              <p className="text-xs text-destructive">
                {getFieldError("farmId")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Please select a farm
              </p>
            )}
          </div>

          {/* Total Chicks */}
          <div className="space-y-2">
            <Label htmlFor="totalChicks">Total Chicks</Label>
            <Input
              id="totalChicks"
              name="totalChicks"
              type="number"
              min="0"
              value={totalChicks}
              onChange={(e) => setTotalChicks(Number(e.target.value))}
              placeholder="Enter total number of chicks"
              className={`${
                getFieldError("totalChicks") ? "border-destructive" : ""
              }`}
            />
            {getFieldError("totalChicks") ? (
              <p className="text-xs text-destructive">
                {getFieldError("totalChicks")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Total number of chicks in this flock
              </p>
            )}
          </div>

          {/* Allocations Section */}
          {selectedFarm && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  Shed Allocations
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAllocation}
                  disabled={
                    availableSheds.length === 0 ||
                    allocations.length >= availableSheds.length
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Allocation
                </Button>
              </div>

              {availableSheds.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No sheds available for the selected farm. Please create
                    sheds first.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {allocations.map((allocation, index) => {
                    const availableShedsForThis =
                      getAvailableShedsForAllocation(index);
                    availableSheds.find((s) => s._id === allocation.shedId);
                    const capacity = getShedCapacity(allocation.shedId);

                    return (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            Allocation {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeAllocation(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Shed</Label>
                            <Select
                              value={allocation.shedId}
                              onValueChange={(value) =>
                                updateAllocation(index, "shedId", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select shed" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableShedsForThis.map((shed) => (
                                  <SelectItem key={shed._id} value={shed._id}>
                                    {shed.name}{" "}
                                    {shed.capacity
                                      ? `(Capacity: ${shed.capacity})`
                                      : ""}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Chicks</Label>
                            <Input
                              type="number"
                              min="0"
                              max={capacity > 0 ? capacity : undefined}
                              value={allocation.chicks}
                              onChange={(e) =>
                                updateAllocation(
                                  index,
                                  "chicks",
                                  Number(e.target.value)
                                )
                              }
                              placeholder="Number of chicks"
                            />
                            {capacity > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Max capacity: {capacity}
                              </p>
                            )}
                          </div>
                        </div>

                        {validationErrors[`allocation_${index}`] && (
                          <p className="text-xs text-destructive">
                            {validationErrors[`allocation_${index}`]}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Allocation Summary */}
                  {allocations.length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Allocated:</span>
                        <span className="font-medium">
                          {totalAllocatedChicks}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Chicks:</span>
                        <span className="font-medium">{totalChicks}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Remaining:</span>
                        <span
                          className={
                            totalChicks - totalAllocatedChicks === 0
                              ? "text-green-600"
                              : "text-destructive"
                          }
                        >
                          {totalChicks - totalAllocatedChicks}
                        </span>
                      </div>
                    </div>
                  )}

                  {validationErrors.allocations && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {validationErrors.allocations}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          )}

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
