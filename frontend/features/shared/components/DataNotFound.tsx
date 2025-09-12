import React from "react";

type DataNotFoundProps = {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
};

const DataNotFound = ({ title, icon, children }: DataNotFoundProps) => {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {icon}
      <div className="">
        <p className="text-muted-foreground">No {title} found</p>
      </div>
      {children}
    </div>
  );
};

export default DataNotFound;
