import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flock } from "@/types";
import { formatDate } from "@/utils/format-date";
import { Building2 } from "lucide-react";
import React from "react";

type FlockDetailsCardProps = {
  flock: Flock;
};

const FlockDetailsCard = ({ flock }: FlockDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">{flock.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="text-lg font-medium">{formatDate(flock.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="text-lg font-medium">
              {flock?.endDate ? formatDate(flock?.endDate) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="text-lg font-medium">
              {formatDate(flock?.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlockDetailsCard;
