import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Allocation } from "@/types";
import { Building2, Users, TrendingUp } from "lucide-react";

type AllocationsTableProps = {
  allocations: Allocation[];
  totalChicks: number;
};

const AllocationsTable = ({
  allocations,
  totalChicks,
}: AllocationsTableProps) => {
  if (!allocations || allocations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary" />
            <CardTitle>Allocations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No allocations found for this flock.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalAllocatedChicks = allocations.reduce(
    (sum, allocation) => sum + allocation.chicks,
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary" />
            <CardTitle>Allocations</CardTitle>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total Allocated:</span>
              <span className="font-medium">
                {totalAllocatedChicks.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total Chicks:</span>
              <span className="font-medium">
                {totalChicks.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allocations.map((allocation, index) => {
            const utilizationPercentage =
              allocation.shedId.capacity > 0
                ? Math.round(
                    (allocation.chicks / allocation.shedId.capacity) * 100
                  )
                : 0;

            return (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h4 className="font-medium text-lg">
                      {allocation.shedId.name}
                    </h4>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    Allocation #{index + 1}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Chicks Allocated */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Chicks Allocated</span>
                    </div>
                    <p className="text-xl font-semibold text-primary">
                      {allocation.chicks.toLocaleString()}
                    </p>
                  </div>

                  {/* Shed Capacity */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span>Shed Capacity</span>
                    </div>
                    <p className="text-xl font-semibold">
                      {allocation.shedId.capacity.toLocaleString()}
                    </p>
                  </div>

                  {/* Utilization */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>Utilization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xl font-semibold">
                        {utilizationPercentage}%
                      </p>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            utilizationPercentage >= 90
                              ? "bg-destructive"
                              : utilizationPercentage >= 70
                              ? "bg-chart-4"
                              : "bg-chart-2"
                          }`}
                          style={{
                            width: `${Math.min(utilizationPercentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shed ID: {allocation.shedId._id}</span>
                    <span>
                      Remaining Capacity:{" "}
                      {(
                        allocation.shedId.capacity - allocation.chicks
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Allocations</p>
              <p className="text-2xl font-bold text-primary">
                {allocations.length}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Allocation Status</p>
              <Badge
                variant={
                  totalAllocatedChicks === totalChicks
                    ? "default"
                    : "destructive"
                }
                className="text-sm mt-1"
              >
                {totalAllocatedChicks === totalChicks
                  ? "Complete"
                  : "Incomplete"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllocationsTable;
