"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useState } from "react";

type ConfirmationDialogProps = {
  title: string;
  description: string;
  trigger?: React.ReactNode;
  confirmationText: string;
  onConfirm?: () => void;
};

const ConfirmationDialog = ({
  title,
  description,
  confirmationText,
  onConfirm,
  trigger,
}: ConfirmationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState<string>("");

  const isAllowedToDelete = (confirmationText: string) => {
    return text.toLowerCase().trim() === confirmationText.toLowerCase().trim();
  };

  const handleConfirm = () => {
    if (!isAllowedToDelete(confirmationText)) return;
    onConfirm?.();
    setIsOpen(false);
    setText("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size="sm" variant="outline" className="flex-1">
            <Trash className="w-4 h-4 mr-2" />
            {title}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          <AlertDialogDescription>
            Enter the <span className="font-bold">ID:{confirmationText}</span>{" "}
            to confirm deletion
          </AlertDialogDescription>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={confirmationText}
            className="mt-4"
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            variant="destructive"
            disabled={!isAllowedToDelete(confirmationText) || !onConfirm}
            onClick={() => handleConfirm()}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
