import React from "react";

const CardSkeleton = () => {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 animate-pulse">
      {/* Header section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-muted rounded"></div>
          <div className="h-5 bg-muted rounded w-20"></div>
        </div>
        <div className="h-6 bg-muted rounded-full w-16"></div>
      </div>

      {/* Email section */}
      <div className="flex items-center space-x-1 mb-6">
        <div className="w-4 h-4 bg-muted rounded"></div>
        <div className="h-4 bg-muted rounded w-32"></div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="h-3 bg-muted rounded w-16 mb-1"></div>
          <div className="h-4 bg-muted rounded w-4"></div>
        </div>
        <div>
          <div className="h-3 bg-muted rounded w-12 mb-1"></div>
          <div className="h-4 bg-muted rounded w-16"></div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t pt-4 mb-4">
        <div className="h-3 bg-muted rounded w-12 mb-1"></div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2">
        <div className="flex-1 h-8 bg-muted rounded"></div>
        <div className="flex-1 h-8 bg-muted rounded"></div>
      </div>
    </div>
  );
};

const CardsSkeleton = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Page header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-muted rounded w-20 mb-2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
        </div>
        <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
      </div>

      {/* Users grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default CardsSkeleton;
