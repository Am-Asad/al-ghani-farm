import React from "react";
import { Loader2, Wheat, Truck, Users, BarChart3 } from "lucide-react";

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-8">
        {/* Main Logo/Icon Section */}
        <div className="relative">
          {/* Animated background circle */}
          <div className="absolute inset-0 w-24 h-24 bg-primary/20 rounded-full animate-pulse opacity-20"></div>

          {/* Central farm icon */}
          <div className="relative w-24 h-24 bg-card rounded-full shadow-lg flex items-center justify-center border-4 border-border">
            <Wheat className="w-12 h-12 text-primary animate-bounce" />
          </div>

          {/* Rotating icons around the center */}
          <div className="absolute inset-0 w-24 h-24">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <Truck
                className="w-6 h-6 text-chart-1 animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
              <Users
                className="w-6 h-6 text-chart-2 animate-spin"
                style={{
                  animationDuration: "3s",
                  animationDirection: "reverse",
                }}
              />
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
              <BarChart3
                className="w-6 h-6 text-chart-3 animate-spin"
                style={{ animationDuration: "4s" }}
              />
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
              <Loader2
                className="w-6 h-6 text-chart-4 animate-spin"
                style={{ animationDuration: "2s" }}
              />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            AL GHANI POULTRY SERVICES
          </h2>
          <p className="text-muted-foreground animate-pulse">
            Loading your farm management system...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-chart-5 rounded-full opacity-60 animate-bounce"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
