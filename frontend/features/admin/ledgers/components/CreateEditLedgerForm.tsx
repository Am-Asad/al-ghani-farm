import { Ledger, LedgerPayload } from "@/types";
import React, { useState, useEffect } from "react";
// import { useGetAllEntities } from "../../hooks/useGetAllEntities";
import { useEditLedger } from "../hooks/useEditLedger";
import { useCreateLedger } from "../hooks/useCreateLedger";
import {
  CreateEditLedgerSchema,
  createEditLedgerSchema,
} from "../schemas/createEditLedgerSchema";
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
import {
  Building2,
  Truck,
  User,
  Phone,
  Calculator,
  Weight,
  Calendar,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import EntitySelect from "@/features/shared/components/EntitySelect";
import { useGetFarmsDropdown } from "@/features/admin/farms/hooks/useGetFarmsDropdown";
import { useGetFlocksDropdown } from "@/features/admin/flocks/hooks/useGetFlocksDropdown";
import { useGetShedsDropdown } from "@/features/admin/sheds/hooks/useGetShedsDropdown";
import { useGetBuyersDropdown } from "@/features/admin/buyers/hooks/useGetBuyersDropdown";

type CreateEditLedgerFormProps = {
  selectedLedger?: Ledger;
  triggerButton?: React.ReactNode;
};

const CreateEditLedgerForm = ({
  selectedLedger,
  triggerButton,
}: CreateEditLedgerFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [selectedFarm, setSelectedFarm] = useState<string>("");
  const [selectedFlock, setSelectedFlock] = useState<string>("");
  const [selectedShed, setSelectedShed] = useState<string>("");
  const [selectedBuyer, setSelectedBuyer] = useState<string>("");

  const isEditMode = !!selectedLedger;
  const { mutate: createLedger, isPending: isCreatePending } =
    useCreateLedger();
  const { mutate: editLedger, isPending: isEditPending } = useEditLedger();

  // Initialize form state when editing
  useEffect(() => {
    if (isEditMode && selectedLedger) {
      setSelectedFarm(selectedLedger.farmId._id);
      setSelectedFlock(selectedLedger.flockId._id);
      setSelectedShed(selectedLedger.shedId._id);
      setSelectedBuyer(selectedLedger.buyerId._id);
    }
  }, [isEditMode, selectedLedger]);

  // Reset dependent dropdowns when parent selection changes
  useEffect(() => {
    if (!isEditMode) {
      // Reset flock and shed when farm changes
      setSelectedFlock("");
      setSelectedShed("");
    }
  }, [selectedFarm, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      // Reset shed when flock changes (if needed for business logic)
      setSelectedShed("");
    }
  }, [selectedFlock, isEditMode]);

  const handleClose = () => {
    setIsOpen(false);
    setValidationErrors({});
    // Reset form state when closing
    if (!isEditMode) {
      setSelectedFarm("");
      setSelectedFlock("");
      setSelectedShed("");
      setSelectedBuyer("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Clear previous validation errors
    setValidationErrors({});

    // Check for empty dropdowns and show meaningful errors
    const errors: Record<string, string> = {};

    if (!selectedFarm) {
      errors.farmId = "Please select a farm";
    }

    if (!selectedFlock) {
      if (!selectedFarm) {
        errors.flockId = "Please select a farm first";
      } else {
        errors.flockId = "Please select a flock";
      }
    }

    if (!selectedShed) {
      if (!selectedFarm) {
        errors.shedId = "Please select a farm first";
      } else {
        errors.shedId = "Please select a shed";
      }
    }

    if (!selectedBuyer) {
      errors.buyerId = "Please select a buyer";
    }

    // Get form data using FormData API
    const formData = new FormData(e.target as HTMLFormElement);
    const rawData = Object.fromEntries(formData) as Record<string, string>;
    rawData.netWeight = String(
      Number(rawData.grossWeight) - Number(rawData.emptyVehicleWeight)
    );
    rawData.totalAmount = String(
      Number(rawData.netWeight) * Number(rawData.rate)
    );

    // Validate with Zod schema
    const validatedData = createEditLedgerSchema.safeParse({
      farmId: selectedFarm,
      flockId: selectedFlock,
      shedId: selectedShed,
      buyerId: selectedBuyer,
      vehicleNumber: rawData.vehicleNumber,
      driverName: rawData.driverName,
      driverContact: rawData.driverContact,
      accountantName: rawData.accountantName,
      emptyVehicleWeight: Number(rawData.emptyVehicleWeight),
      grossWeight: Number(rawData.grossWeight),
      netWeight: Number(rawData.netWeight),
      numberOfBirds: Number(rawData.numberOfBirds),
      rate: Number(rawData.rate),
      totalAmount: Number(rawData.totalAmount),
      amountPaid: Number(rawData.amountPaid),
      date: rawData.date,
    });

    if (!validatedData.success) {
      const formatted: Record<string, string> = {};
      validatedData.error.issues.forEach((err) => {
        formatted[err.path[0] as string] = err.message;
      });
      setValidationErrors(formatted);
      return;
    }

    if (isEditMode && selectedLedger) {
      const payload = {
        ...validatedData.data,
        _id: selectedLedger._id,
        farmId: validatedData.data.farmId,
        flockId: validatedData.data.flockId,
        shedId: validatedData.data.shedId,
        buyerId: validatedData.data.buyerId,
        date: validatedData.data.date.toISOString(),
      };
      editLedger(
        payload as unknown as Omit<LedgerPayload, "createdAt" | "updatedAt">
      );
    } else {
      const payload = {
        ...validatedData.data,
        farmId: validatedData.data.farmId,
        flockId: validatedData.data.flockId,
        shedId: validatedData.data.shedId,
        buyerId: validatedData.data.buyerId,
        date: validatedData.data.date.toISOString(),
      };
      createLedger(
        payload as unknown as Omit<
          LedgerPayload,
          "_id" | "createdAt" | "updatedAt"
        >
      );
    }

    (e.target as HTMLFormElement).reset();
    setIsOpen(false);
  };

  const getFieldError = (fieldName: keyof CreateEditLedgerSchema) => {
    return validationErrors[fieldName as string] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="w-fit">
            <Calculator className="w-4 h-4 mr-2" />
            {isEditMode ? "Edit Ledger" : "Add Ledger"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full mb-2">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {isEditMode ? "Edit Ledger Entry" : "Add new Ledger Entry"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isEditMode
              ? "Edit the ledger entry with appropriate values"
              : "Add a new ledger entry to the system with appropriate values"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Farm Id */}
            <div className="space-y-2">
              <Label>Farm *</Label>
              <EntitySelect
                entityType="farms"
                fetchHook={useGetFarmsDropdown}
                placeholder="Select farm"
                value={selectedFarm}
                onChange={(v) => setSelectedFarm(v)}
                popoverContentClassName="w-full"
                className={`${
                  getFieldError("farmId") ? "border-destructive" : ""
                }`}
              />
              {getFieldError("farmId") && (
                <p className="text-xs text-destructive">
                  {getFieldError("farmId")}
                </p>
              )}
            </div>

            {/* Flock Id */}
            <div className="space-y-2">
              <Label>Flock *</Label>
              <EntitySelect
                entityType="flocks"
                fetchHook={useGetFlocksDropdown}
                placeholder="Select flock"
                value={selectedFlock}
                onChange={(v) => setSelectedFlock(v)}
                farmId={selectedFarm}
                popoverContentClassName="w-full"
                className={`${
                  getFieldError("flockId") ? "border-destructive" : ""
                }`}
              />
              {getFieldError("flockId") && (
                <p className="text-xs text-destructive">
                  {getFieldError("flockId")}
                </p>
              )}
              {selectedFarm && !selectedFlock && (
                <p className="text-xs text-destructive">
                  ⚠️ No flocks are available for the selected farm. Please
                  select a different farm or create flocks for this farm first.
                </p>
              )}
            </div>

            {/* Shed Id */}
            <div className="space-y-2">
              <Label>Shed *</Label>
              <EntitySelect
                entityType="sheds"
                fetchHook={useGetShedsDropdown}
                placeholder="Select shed"
                value={selectedShed}
                onChange={(v) => setSelectedShed(v)}
                farmId={selectedFarm}
                popoverContentClassName="w-full"
                className={`${
                  getFieldError("shedId") ? "border-destructive" : ""
                }`}
              />
              {getFieldError("shedId") && (
                <p className="text-xs text-destructive">
                  {getFieldError("shedId")}
                </p>
              )}
              {selectedFarm && !selectedShed && (
                <p className="text-xs text-destructive">
                  ⚠️ No sheds are available for the selected farm. Please select
                  a different farm or create sheds for this farm first.
                </p>
              )}
            </div>

            {/* Buyer Id */}
            <div className="space-y-2">
              <Label>Buyer *</Label>
              <EntitySelect
                entityType="buyers"
                fetchHook={useGetBuyersDropdown}
                placeholder="Select buyer"
                value={selectedBuyer}
                onChange={(v) => setSelectedBuyer(v)}
                popoverContentClassName="w-full"
                className={`${
                  getFieldError("buyerId") ? "border-destructive" : ""
                }`}
              />
              {getFieldError("buyerId") && (
                <p className="text-xs text-destructive">
                  {getFieldError("buyerId")}
                </p>
              )}
            </div>

            {/* Vehicle Number */}
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="vehicleNumber"
                  name="vehicleNumber"
                  type="text"
                  placeholder="Enter vehicle number"
                  defaultValue={selectedLedger?.vehicleNumber || ""}
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("vehicleNumber") ? "border-destructive" : ""
                  }`}
                />
              </div>
              {getFieldError("vehicleNumber") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("vehicleNumber")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Vehicle Number must be between 3 and 20 characters
                </p>
              )}
            </div>

            {/* Driver Name */}
            <div className="space-y-2">
              <Label htmlFor="driverName">Driver Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="driverName"
                  name="driverName"
                  type="text"
                  placeholder="Enter driver name"
                  defaultValue={selectedLedger?.driverName || ""}
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("driverName") ? "border-destructive" : ""
                  }`}
                />
              </div>
              {getFieldError("driverName") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("driverName")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Driver Name must be between 3 and 100 characters
                </p>
              )}
            </div>

            {/* Driver Contact */}
            <div className="space-y-2">
              <Label htmlFor="driverContact">Driver Contact *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="driverContact"
                  name="driverContact"
                  type="text"
                  placeholder="Enter driver contact"
                  defaultValue={selectedLedger?.driverContact || ""}
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("driverContact") ? "border-destructive" : ""
                  }`}
                />
              </div>
              {getFieldError("driverContact") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("driverContact")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Driver Contact must be a valid contact number
                </p>
              )}
            </div>

            {/* Accountant Name */}
            <div className="space-y-2">
              <Label htmlFor="accountantName">Accountant Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="accountantName"
                  name="accountantName"
                  type="text"
                  placeholder="Enter accountant name"
                  defaultValue={selectedLedger?.accountantName || ""}
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("accountantName") ? "border-destructive" : ""
                  }`}
                />
              </div>
              {getFieldError("accountantName") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("accountantName")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Accountant Name must be between 3 and 100 characters
                </p>
              )}
            </div>

            {/* Empty Vehicle Weight */}
            <div className="space-y-2">
              <Label htmlFor="emptyVehicleWeight">Empty Vehicle Weight *</Label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="emptyVehicleWeight"
                  name="emptyVehicleWeight"
                  type="number"
                  placeholder="Enter empty vehicle weight"
                  min={0}
                  defaultValue={selectedLedger?.emptyVehicleWeight || 0}
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("emptyVehicleWeight")
                      ? "border-destructive"
                      : ""
                  }`}
                />
              </div>
              {getFieldError("emptyVehicleWeight") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("emptyVehicleWeight")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Empty Vehicle Weight must be a positive number
                </p>
              )}
            </div>

            {/* Gross Weight */}
            <div className="space-y-2">
              <Label htmlFor="grossWeight">Gross Weight *</Label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="grossWeight"
                  name="grossWeight"
                  type="number"
                  placeholder="Enter gross weight"
                  min={0}
                  defaultValue={selectedLedger?.grossWeight || 0}
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("grossWeight") ? "border-destructive" : ""
                  }`}
                />
              </div>
              {getFieldError("grossWeight") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("grossWeight")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Gross Weight must be a positive number
                </p>
              )}
            </div>

            {/* Number of Birds */}
            <div className="space-y-2">
              <Label htmlFor="numberOfBirds">Number of Birds *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="numberOfBirds"
                  name="numberOfBirds"
                  type="number"
                  placeholder="Enter number of birds"
                  min={0}
                  defaultValue={selectedLedger?.numberOfBirds || 0}
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("numberOfBirds") ? "border-destructive" : ""
                  }`}
                />
              </div>
              {getFieldError("numberOfBirds") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("numberOfBirds")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Number of Birds must be a whole number and a positive number
                </p>
              )}
            </div>

            {/* Rate */}
            <div className="space-y-2">
              <Label htmlFor="rate">Rate *</Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="rate"
                  name="rate"
                  type="number"
                  min={0}
                  placeholder="Enter rate"
                  defaultValue={selectedLedger?.rate || 0}
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("rate") ? "border-destructive" : ""
                  }`}
                />
              </div>
              {getFieldError("rate") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("rate")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Rate must be a positive number
                </p>
              )}
            </div>

            {/* Amount Paid */}
            <div className="space-y-2">
              <Label htmlFor="amountPaid">Amount Paid *</Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amountPaid"
                  name="amountPaid"
                  type="number"
                  placeholder="Enter amount paid"
                  min={0}
                  defaultValue={selectedLedger?.amountPaid || 0}
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("amountPaid") ? "border-destructive" : ""
                  }`}
                />
              </div>
              {getFieldError("amountPaid") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("amountPaid")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Amount Paid must be a positive number and less than or equal
                  to total amount
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="date"
                  name="date"
                  type="date"
                  placeholder="Enter date"
                  defaultValue={
                    selectedLedger?.date
                      ? selectedLedger.date.split("T")[0]
                      : ""
                  }
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("date") ? "border-destructive" : ""
                  }`}
                />
              </div>
              {getFieldError("date") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("date")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Date must be a valid date
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEditPending || isCreatePending}>
              {isEditMode ? "Update Ledger" : "Create Ledger"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditLedgerForm;
