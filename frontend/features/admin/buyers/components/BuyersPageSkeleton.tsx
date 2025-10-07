"use client";
import React from "react";

const BuyersPageSkeleton = () => {
  return (
    <div className="p-6 overflow-y-scroll flex flex-col flex-1">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="h-8 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-64 mt-2 animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
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

      {/* Buyers grid skeleton */}
      <div className="flex-1 pb-1 my-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border bg-card p-6 space-y-4"
            >
              {/* Card header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
                  <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
                </div>
                <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
              </div>

              {/* Card content */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                </div>
              </div>

              {/* Card footer */}
              <div className="pt-2 border-t">
                <div className="h-3 bg-muted rounded w-16 animate-pulse mb-1"></div>
                <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
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
  );
};

export default BuyersPageSkeleton;
