import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Buyer } from "@/types";
import { formatDate } from "@/utils/format-date";
import { Building2 } from "lucide-react";
import React from "react";

type BuyerDetailsCardProps = {
  buyer: Buyer;
};

const BuyerDetailsCard = ({ buyer }: BuyerDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">{buyer.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Contact Number</p>
            <p className="text-lg font-medium">{buyer.contactNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="text-lg font-medium">{buyer.address}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="text-lg font-medium">{formatDate(buyer.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuyerDetailsCard;
