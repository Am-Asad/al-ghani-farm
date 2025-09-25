import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FarmDetails } from "@/types";
import { formatDate } from "@/utils/format-date";
import { formatSingleDigit } from "@/utils/format-single-digit";
import { Building2 } from "lucide-react";
import React from "react";

type FarmDetailsCardProps = {
  farm: FarmDetails;
};

const FarmDetailsCard = ({ farm }: FarmDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">{farm.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Supervisor</p>
            <p className="text-lg font-medium">{farm.supervisor}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Flocks</p>
            <p className="text-lg font-medium">
              {formatSingleDigit(farm.totalFlocks || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Sheds</p>
            <p className="text-lg font-medium">
              {formatSingleDigit(farm.totalSheds || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="text-lg font-medium">{formatDate(farm.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmDetailsCard;
