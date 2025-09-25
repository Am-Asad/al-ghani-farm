import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shed } from "@/types";
import { formatDate } from "@/utils/format-date";
import { Building2 } from "lucide-react";
import React from "react";

type ShedDetailsCardProps = {
  shed: Shed;
};

const ShedDetailsCard = ({ shed }: ShedDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">{shed.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Capacity</p>
            <p className="text-lg font-medium">
              {shed.capacity || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Farm</p>
            <p className="text-lg font-medium">{shed.farmId.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="text-lg font-medium">{formatDate(shed.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShedDetailsCard;
