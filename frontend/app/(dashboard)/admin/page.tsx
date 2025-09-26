"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, Home, UserCheck, FileText } from "lucide-react";
import FarmsTab from "@/features/admin/components/FarmsTab";
import FlocksTab from "@/features/admin/components/FlocksTab";
import ShedsTab from "@/features/admin/components/ShedsTab";
import LedgersTab from "@/features/admin/components/LedgersTab";
import BuyersTab from "@/features/admin/components/BuyersTab";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";

const entitiesTabs = [
  {
    label: "Farms",
    value: "farms",
    icon: Building2,
    component: <FarmsTab />,
  },
  {
    label: "Flocks",
    value: "flocks",
    icon: Users,
    component: <FlocksTab />,
  },
  {
    label: "Sheds",
    value: "sheds",
    icon: Home,
    component: <ShedsTab />,
  },
  {
    label: "Buyers",
    value: "buyers",
    icon: UserCheck,
    component: <BuyersTab />,
  },
  {
    label: "Ledgers",
    value: "ledgers",
    icon: FileText,
    component: <LedgersTab />,
  },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("farms");
  const router = useRouter();

  useEffect(() => {
    router.push(`/admin?tab=${activeTab}`);
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-6 overflow-y-scroll flex flex-col gap-2 flex-1">
      <div className="flex items-center gap-2">
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-5 my-2">
          {entitiesTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2"
              asChild
            >
              <Link href={`/admin?tab=${tab.value}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="">
          {entitiesTabs.find((tab) => tab.value === activeTab)?.component}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
