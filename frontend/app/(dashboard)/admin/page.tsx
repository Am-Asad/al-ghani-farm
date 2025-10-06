"use client";

import React, { useEffect, useState } from "react";
import { Building2, Users, Home, UserCheck, FileText } from "lucide-react";
import FarmsTab from "@/features/admin/components/FarmsTab";
import FlocksTab from "@/features/admin/components/FlocksTab";
import ShedsTab from "@/features/admin/components/ShedsTab";
import LedgersTab from "@/features/admin/components/LedgersTab";
import BuyersTab from "@/features/admin/components/BuyersTab";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import GenericTabs from "@/features/shared/components/GenericTabs";

const entitiesTabs = [
  {
    label: "Farms",
    value: "farms",
    icon: <Building2 className="w-4 h-4" />,
    component: <FarmsTab />,
  },
  {
    label: "Flocks",
    value: "flocks",
    icon: <Users className="w-4 h-4" />,
    component: <FlocksTab />,
  },
  {
    label: "Sheds",
    value: "sheds",
    icon: <Home className="w-4 h-4" />,
    component: <ShedsTab />,
  },
  {
    label: "Buyers",
    value: "buyers",
    icon: <UserCheck className="w-4 h-4" />,
    component: <BuyersTab />,
  },
  {
    label: "Ledgers",
    value: "ledgers",
    icon: <FileText className="w-4 h-4" />,
    component: <LedgersTab />,
  },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("farms");
  const router = useRouter();
  const { user } = useAuthContext();
  const isViewer = user?.role === "viewer";

  useEffect(() => {
    router.push(`/admin?tab=${activeTab}`);
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isViewer) {
      router.push("/dashboard");
    }
  }, [isViewer, router]);

  return (
    <div className="p-6 overflow-y-scroll flex flex-col gap-6 flex-1">
      <div className="flex items-center gap-2">
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <GenericTabs
        tabs={entitiesTabs}
        defaultValue="farms"
        value={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
};

export default AdminPage;
