"use client";
import React from "react";

const TableSkeleton = () => {
  return (
    <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="h-9 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-9 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            <div className="h-9 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-9 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="flex-1 overflow-y-scroll pb-1 mt-4">
        <div className="rounded-lg border bg-white">
          {/* Table header */}
          <div className="border-b">
            <div className="flex items-center p-4 gap-4">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          </div>

          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b last:border-b-0">
              <div className="flex items-center p-4 gap-4">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
