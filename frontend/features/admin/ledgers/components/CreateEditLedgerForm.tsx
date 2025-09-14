import { LedgerResponse } from "@/types";
import React, { useState, useEffect } from "react";
import { useGetAllEntities } from "../../hooks/useGetAllEntities";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";

type CreateEditLedgerFormProps = {
  selectedLedger?: LedgerResponse;
  triggerButton?: React.ReactNode;
};

const CreateEditLedgerForm = ({
  selectedLedger,
  triggerButton,
}: CreateEditLedgerFormProps) => {
  const { data: entities } = useGetAllEntities();
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [selectedFarm, setSelectedFarm] = useState<string>("");
  const [selectedFlock, setSelectedFlock] = useState<string>("");
  const [selectedShed, setSelectedShed] = useState<string>("");
  const [selectedBuyer, setSelectedBuyer] = useState<string>("");

  const isEditMode = !!selectedLedger;
  const allFarmsForDropdown = entities?.data?.farms || [];
  const allFlocksForDropdown = entities?.data?.flocks || [];
  const allShedsForDropdown = entities?.data?.sheds || [];
  const allBuyersForDropdown = entities?.data?.buyers || [];

  // Show only those flocks that are associated with the selected farm
  const filteredFlocksForDropdown = allFlocksForDropdown.filter(
    (flock) => flock?.farmId === selectedFarm
  );

  // Show only those sheds that are associated with the selected flock
  const filteredShedsForDropdown = allShedsForDropdown.filter(
    (shed) => shed?.flockId === selectedFlock
  );

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
      setSelectedFlock("");
      setSelectedShed("");
    }
  }, [selectedFarm, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
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
      } else if (filteredFlocksForDropdown.length === 0) {
        errors.flockId = "No flocks available for the selected farm";
      } else {
        errors.flockId = "Please select a flock";
      }
    }

    if (!selectedShed) {
      if (!selectedFlock) {
        errors.shedId = "Please select a flock first";
      } else if (filteredShedsForDropdown.length === 0) {
        errors.shedId = "No sheds available for the selected flock";
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
        date: validatedData.data.date.toISOString(),
      };
      editLedger(payload);
    } else {
      const payload = {
        ...validatedData.data,
        date: validatedData.data.date.toISOString(),
      };
      createLedger(payload);
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

      <DialogContent>
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
              <Select
                value={selectedFarm}
                onValueChange={(value) => setSelectedFarm(value)}
              >
                <SelectTrigger
                  className={cn(
                    getFieldError("farmId") ? "border-destructive" : "",
                    "w-full"
                  )}
                >
                  <SelectValue placeholder="Select farm" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto w-full">
                  {allFarmsForDropdown.map((farm) => (
                    <SelectItem key={farm._id} value={farm._id}>
                      {farm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError("farmId") && (
                <p className="text-xs text-destructive">
                  {getFieldError("farmId")}
                </p>
              )}
            </div>

            {/* Flock Id */}
            <div className="space-y-2">
              <Label>Flock *</Label>
              <Select
                value={selectedFlock}
                onValueChange={(value) => setSelectedFlock(value)}
                disabled={
                  !selectedFarm || filteredFlocksForDropdown.length === 0
                }
              >
                <SelectTrigger
                  className={cn(
                    getFieldError("flockId") ? "border-destructive" : "",
                    "w-full"
                  )}
                >
                  <SelectValue
                    placeholder={
                      !selectedFarm
                        ? "Select farm first"
                        : filteredFlocksForDropdown.length === 0
                        ? "No flocks available"
                        : "Select flock"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto w-full">
                  {filteredFlocksForDropdown.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No flocks found for this farm
                    </div>
                  ) : (
                    filteredFlocksForDropdown.map((flock) => (
                      <SelectItem key={flock._id} value={flock._id}>
                        {flock.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {getFieldError("flockId") && (
                <p className="text-xs text-destructive">
                  {getFieldError("flockId")}
                </p>
              )}
              {selectedFarm && filteredFlocksForDropdown.length === 0 && (
                <p className="text-xs text-destructive">
                  ⚠️ No flocks are available for the selected farm. Please
                  select a different farm or create flocks for this farm first.
                </p>
              )}
            </div>

            {/* Shed Id */}
            <div className="space-y-2">
              <Label>Shed *</Label>
              <Select
                value={selectedShed}
                onValueChange={(value) => setSelectedShed(value)}
                disabled={
                  !selectedFlock || filteredShedsForDropdown.length === 0
                }
              >
                <SelectTrigger
                  className={cn(
                    getFieldError("shedId") ? "border-destructive" : "",
                    "w-full"
                  )}
                >
                  <SelectValue
                    placeholder={
                      !selectedFlock
                        ? "Select flock first"
                        : filteredShedsForDropdown.length === 0
                        ? "No sheds available"
                        : "Select shed"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto w-full">
                  {filteredShedsForDropdown.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No sheds found for this flock
                    </div>
                  ) : (
                    filteredShedsForDropdown.map((shed) => (
                      <SelectItem key={shed._id} value={shed._id}>
                        {shed.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {getFieldError("shedId") && (
                <p className="text-xs text-destructive">
                  {getFieldError("shedId")}
                </p>
              )}
              {selectedFlock && filteredShedsForDropdown.length === 0 && (
                <p className="text-xs text-destructive">
                  ⚠️ No sheds are available for the selected flock. Please
                  select a different flock or create sheds for this flock first.
                </p>
              )}
            </div>

            {/* Buyer Id */}
            <div className="space-y-2">
              <Label>Buyer *</Label>
              <Select
                value={selectedBuyer}
                onValueChange={(value) => setSelectedBuyer(value)}
              >
                <SelectTrigger
                  className={cn(
                    getFieldError("buyerId") ? "border-destructive" : "",
                    "w-full"
                  )}
                >
                  <SelectValue placeholder="Select buyer" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto w-full">
                  {allBuyersForDropdown.map((buyer) => (
                    <SelectItem key={buyer._id} value={buyer._id}>
                      {buyer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            {/* Net Weight */}
            <div className="space-y-2">
              <Label htmlFor="netWeight">Net Weight *</Label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="netWeight"
                  name="netWeight"
                  type="number"
                  placeholder="Enter net weight"
                  defaultValue={selectedLedger?.netWeight || 0}
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("netWeight") ? "border-destructive" : ""
                  }`}
                />
              </div>
              {getFieldError("netWeight") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("netWeight")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Net Weight = Gross Weight - Empty Vehicle Weight
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

            {/* Total Amount */}
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount *</Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="totalAmount"
                  name="totalAmount"
                  type="number"
                  placeholder="Enter total amount"
                  defaultValue={selectedLedger?.totalAmount || 0}
                  autoFocus={false}
                  className={`pl-10 ${
                    getFieldError("totalAmount") ? "border-destructive" : ""
                  }`}
                />
              </div>
              {getFieldError("totalAmount") ? (
                <p className="text-xs text-destructive">
                  {getFieldError("totalAmount")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Total amount = Net Weight * Rate
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
