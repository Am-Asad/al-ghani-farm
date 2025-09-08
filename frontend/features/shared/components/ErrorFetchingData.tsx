import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type ErrorFeatchingDataProps = {
  title: string;
  description: string;
  buttonText: string;
  error: string;
};

const ErrorFeatchingData = ({
  title,
  description,
  buttonText,
  error,
}: ErrorFeatchingDataProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </div>
      <div className="py-12">
        <p className="text-muted-foreground">
          Failed to load {title}: {error}
        </p>
      </div>
    </div>
  );
};

export default ErrorFeatchingData;
