"use client";
import React from "react";

const FarmDetailsPageSkeleton = () => {
  return (
    <div className="p-6 overflow-y-scroll flex flex-col flex-1 space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        {/* Farm Details Card Skeleton */}
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            {/* Card Header */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
            </div>

            {/* Card Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="h-4 bg-muted rounded w-20 animate-pulse mb-2"></div>
                <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-muted rounded w-24 animate-pulse mb-2"></div>
                <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-muted rounded w-20 animate-pulse mb-2"></div>
                <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-muted rounded w-20 animate-pulse mb-2"></div>
                <div className="h-6 bg-muted rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="rounded-lg border bg-card">
          {/* Tab Headers */}
          <div className="border-b border-border">
            <div className="flex space-x-8 px-6">
              <div className="flex items-center space-x-2 py-4">
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2 py-4">
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2 py-4">
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                <div className="h-5 bg-muted rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Filters skeleton */}
              <div className="space-y-4 p-4 bg-muted/30 border border-border rounded-lg">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="h-9 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-muted rounded w-8 animate-pulse"></div>
                    <div className="h-9 bg-muted rounded w-32 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-muted rounded w-12 animate-pulse"></div>
                    <div className="h-9 bg-muted rounded w-32 animate-pulse"></div>
                    <div className="h-9 bg-muted rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-9 bg-muted rounded w-16 animate-pulse"></div>
                    <div className="h-9 bg-muted rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Content grid skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-card p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
                        <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
                      </div>
                      <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="h-3 bg-muted rounded w-16 animate-pulse mb-1"></div>
                      <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                    </div>

                    <div className="flex space-x-2">
                      <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
                      <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                  <div className="h-9 bg-muted rounded w-20 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-9 bg-muted rounded w-16 animate-pulse"></div>
                  <div className="h-9 bg-muted rounded w-16 animate-pulse"></div>
                  <div className="h-9 bg-muted rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmDetailsPageSkeleton;
