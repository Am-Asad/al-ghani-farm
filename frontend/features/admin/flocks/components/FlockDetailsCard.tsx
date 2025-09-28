import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flock } from "@/types";
import { formatDate, formatSingleDigit } from "@/utils/formatting";
import { Building2, Users, Calendar, Hash } from "lucide-react";
import React from "react";

type FlockDetailsCardProps = {
  flock: Flock;
};

const FlockDetailsCard = ({ flock }: FlockDetailsCardProps) => {
  const totalAllocatedChicks =
    flock.allocations?.reduce(
      (sum, allocation) => sum + allocation.chicks,
      0
    ) || 0;

  const isAllocationComplete = totalAllocatedChicks === flock.totalChicks;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl">{flock.name}</CardTitle>
          </div>
          <Badge
            variant={flock.status === "active" ? "default" : "secondary"}
            className="text-sm"
          >
            {flock.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Start Date</span>
              </div>
              <p className="text-lg font-medium">
                {formatDate(flock.startDate)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>End Date</span>
              </div>
              <p className="text-lg font-medium">
                {flock?.endDate ? formatDate(flock?.endDate) : "N/A"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Created At</span>
              </div>
              <p className="text-lg font-medium">
                {formatDate(flock?.createdAt)}
              </p>
            </div>
          </div>

          {/* Farm Information */}
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Building2 className="w-4 h-4" />
              <span>Farm Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Farm Name</p>
                <p className="font-medium">{flock.farmId.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supervisor</p>
                <p className="font-medium">{flock.farmId.supervisor}</p>
              </div>
            </div>
          </div>

          {/* Chicks and Allocation Summary */}
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <Users className="w-4 h-4" />
              <span>Chicks & Allocation Summary</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Total Chicks
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {formatSingleDigit(flock.totalChicks?.toLocaleString() || 0)}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Hash className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Allocations
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {formatSingleDigit(
                    flock.allocations?.length?.toLocaleString() || 0
                  )}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Allocated Chicks
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {formatSingleDigit(totalAllocatedChicks.toLocaleString())}
                </p>
              </div>
            </div>

            {/* Allocation Status */}
            <div className="mt-4 text-center">
              <Badge
                variant={isAllocationComplete ? "default" : "destructive"}
                className="text-sm"
              >
                {isAllocationComplete
                  ? "Allocation Complete"
                  : "Allocation Incomplete"}
              </Badge>
              {!isAllocationComplete && (
                <p className="text-sm text-muted-foreground mt-2">
                  {flock.totalChicks - totalAllocatedChicks} chicks not
                  allocated
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlockDetailsCard;
