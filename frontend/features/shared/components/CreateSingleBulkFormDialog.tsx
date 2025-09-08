"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Plus, Upload } from "lucide-react";

type CreateSingleBulkFormDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  trigger: React.ReactNode;
  entityType: string;
  SingleEntityForm: React.ReactNode;
  BulkEntityForm: React.ReactNode;
};

const CreateSingleBulkFormDialog = ({
  trigger,
  entityType,
  SingleEntityForm,
  BulkEntityForm,
  isOpen,
  setIsOpen,
}: CreateSingleBulkFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl h-[90vh] max-h-fit overflow-y-auto flex flex-col gap-[16px]">
        <DialogHeader className="h-fit">
          <div className="flex items-center justify-center w-10 h-10 mx-auto bg-primary/10 rounded-full mb-2">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-center">
            Create New{" "}
            {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose how you want to add {entityType}s to the system
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Single {entityType}
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Create {entityType}s in Bulk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-2">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium">
                  Single{" "}
                  {entityType.charAt(0).toUpperCase() + entityType.slice(1)}{" "}
                  Creation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add one {entityType} at a time with detailed information
                </p>
              </div>
              {SingleEntityForm}
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium">
                  Bulk{" "}
                  {entityType.charAt(0).toUpperCase() + entityType.slice(1)}s{" "}
                  Creation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload multiple {entityType}s at once using a file or form
                </p>
              </div>
              {BulkEntityForm}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSingleBulkFormDialog;
