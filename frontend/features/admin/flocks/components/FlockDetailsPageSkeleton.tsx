"use client";
import React from "react";

const FlockDetailsPageSkeleton = () => {
  return (
    <div className="p-6 overflow-y-scroll flex flex-col flex-1 space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        {/* Flock Details Card Skeleton */}
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
                <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
              </div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
            </div>

            {/* Card Content */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-24 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-24 animate-pulse"></div>
                </div>
              </div>

              {/* Farm Information */}
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="h-4 bg-muted rounded w-20 animate-pulse mb-2"></div>
                    <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-muted rounded w-20 animate-pulse mb-2"></div>
                    <div className="h-5 bg-muted rounded w-28 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Chicks and Allocation Summary */}
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-48 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
                  </div>
                </div>

                {/* Allocation Status */}
                <div className="mt-4 text-center">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-40 animate-pulse mx-auto mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters skeleton */}
        <div className="space-y-4 p-4 bg-card border border-border rounded-lg shadow-sm">
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

        {/* Ledgers Table Skeleton */}
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border bg-card p-6 space-y-4"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
                        <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
                      <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>

                  {/* Key Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-12 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-12 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="h-3 bg-muted rounded w-20 animate-pulse mb-1"></div>
                        <div className="h-5 bg-muted rounded w-24 animate-pulse"></div>
                      </div>
                      <div className="text-center">
                        <div className="h-3 bg-muted rounded w-20 animate-pulse mb-1"></div>
                        <div className="h-5 bg-muted rounded w-24 animate-pulse"></div>
                      </div>
                      <div className="text-center">
                        <div className="h-3 bg-muted rounded w-16 animate-pulse mb-1"></div>
                        <div className="h-5 bg-muted rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
                    <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
  );
};

export default FlockDetailsPageSkeleton;
