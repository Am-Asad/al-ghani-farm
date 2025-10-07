"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSummary } from "../hooks/useDashboardData";
import { formatAmount } from "@/utils/formatting";
import { Users, Package, FileText } from "lucide-react";

type TopBuyersProps = {
  data: DashboardSummary;
  isLoading?: boolean;
};

const TopBuyers = ({ data, isLoading }: TopBuyersProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Buyers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 bg-muted animate-pulse rounded w-24" />
                    <div className="h-3 bg-muted animate-pulse rounded w-16" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-20" />
                  <div className="h-3 bg-muted animate-pulse rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.topBuyers || data.topBuyers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Buyers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p>No buyer data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Buyers</CardTitle>
        <p className="text-sm text-muted-foreground">
          Top performing buyers by revenue
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.topBuyers.map((buyer, index) => (
            <div
              key={buyer.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{buyer.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {buyer.transactionCount} transactions
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">
                  {formatAmount(buyer.totalAmount)}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Package className="w-3 h-3" />
                  {buyer.totalBirds.toLocaleString()} birds
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopBuyers;
