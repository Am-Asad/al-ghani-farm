"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardSkeleton = () => {
  return (
    <div className="p-6 overflow-y-scroll flex flex-col flex-1 space-y-6">
      {/* Page header skeleton */}
      <div>
        <div className="h-8 bg-muted animate-pulse rounded w-48 mb-2" />
        <div className="h-4 bg-muted animate-pulse rounded w-80" />
      </div>

      {/* Primary Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-1">
                  <div
                    className="h-4 bg-muted animate-pulse rounded w-24"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                  <div
                    className="h-8 bg-muted animate-pulse rounded w-16"
                    style={{ animationDelay: `${i * 0.1 + 0.1}s` }}
                  />
                  <div
                    className="h-3 bg-muted animate-pulse rounded w-32"
                    style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
                  />
                </div>
                <div
                  className="h-8 w-8 bg-muted animate-pulse rounded"
                  style={{ animationDelay: `${i * 0.1 + 0.15}s` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-muted animate-pulse rounded" />
                <div>
                  <div className="h-4 bg-muted animate-pulse rounded w-8 mb-1" />
                  <div className="h-3 bg-muted animate-pulse rounded w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Performance Card Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="h-6 bg-muted animate-pulse rounded w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="w-5 h-5 bg-muted animate-pulse rounded" />
                <div>
                  <div className="h-4 bg-muted animate-pulse rounded w-12 mb-1" />
                  <div className="h-3 bg-muted animate-pulse rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Card Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="h-6 bg-muted animate-pulse rounded w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-lg bg-muted/50 border"
              >
                <div className="w-6 h-6 bg-muted animate-pulse rounded mx-auto mb-2" />
                <div className="h-4 bg-muted animate-pulse rounded w-12 mx-auto mb-2" />
                <div className="h-6 bg-muted animate-pulse rounded w-16 mx-auto mb-1" />
                <div className="h-3 bg-muted animate-pulse rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="h-6 bg-muted animate-pulse rounded w-32" />
            </CardTitle>
            <div className="h-4 bg-muted animate-pulse rounded w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div
                    className="w-8 h-8 bg-muted animate-pulse rounded-full"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className="h-4 bg-muted animate-pulse rounded w-3/4"
                        style={{ animationDelay: `${i * 0.1 + 0.05}s` }}
                      />
                      <div
                        className="h-5 bg-muted animate-pulse rounded w-16"
                        style={{ animationDelay: `${i * 0.1 + 0.1}s` }}
                      />
                    </div>
                    <div
                      className="h-3 bg-muted animate-pulse rounded w-full"
                      style={{ animationDelay: `${i * 0.1 + 0.15}s` }}
                    />
                    <div className="flex items-center gap-4">
                      <div
                        className="h-3 bg-muted animate-pulse rounded w-20"
                        style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
                      />
                      <div
                        className="h-3 bg-muted animate-pulse rounded w-16"
                        style={{ animationDelay: `${i * 0.1 + 0.25}s` }}
                      />
                      <div
                        className="h-3 bg-muted animate-pulse rounded w-12"
                        style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Buyers Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="h-6 bg-muted animate-pulse rounded w-24" />
            </CardTitle>
            <div className="h-4 bg-muted animate-pulse rounded w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                    <div>
                      <div className="h-4 bg-muted animate-pulse rounded w-24 mb-1" />
                      <div className="h-3 bg-muted animate-pulse rounded w-20" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-muted animate-pulse rounded w-16 mb-1" />
                    <div className="h-3 bg-muted animate-pulse rounded w-12" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 bg-muted animate-pulse rounded w-28" />
          </CardTitle>
          <div className="h-4 bg-muted animate-pulse rounded w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-4 border border-border rounded-lg bg-muted/20"
              >
                <div className="w-6 h-6 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 bg-muted animate-pulse rounded w-20 mb-1" />
                <div className="h-3 bg-muted animate-pulse rounded w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSkeleton;
