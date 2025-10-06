"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

type GenericTabsProps = {
  tabs: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    component: React.ReactNode;
  }[];
  defaultValue: string;
  value?: string;
  onChange?: (value: string) => void;
};

const GenericTabs = ({
  tabs,
  defaultValue,
  value,
  onChange,
}: GenericTabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue);
  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : internalActiveTab;

  const handleTabChange = (tabValue: string) => {
    if (isControlled) {
      onChange?.(tabValue);
    } else {
      setInternalActiveTab(tabValue);
    }
  };

  return (
    <>
      <div
        className={cn(
          "w-full bg-muted text-muted-foreground flex flex-col gap-2 rounded-lg p-1",
          "sm:inline-flex sm:flex-row sm:gap-0 sm:h-9 sm:items-center sm:justify-center sm:p-[3px]"
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:border-ring focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4",
              "sm:h-[calc(100%-1px)] sm:w-auto sm:flex-1",
              "text-foreground dark:text-muted-foreground",
              activeTab === tab.value &&
                "bg-background text-foreground dark:text-foreground border-input dark:bg-input/30 shadow-sm"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.find((tab) => tab.value === activeTab)?.component}
    </>
  );
};

export default GenericTabs;
