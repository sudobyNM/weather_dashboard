import React from "react";
import { cn } from "../lib/utils";

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export function WeatherCard({ title, value, unit, icon, description, className }: WeatherCardProps) {
  return (
    <div className={cn("bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between transition-all hover:border-blue-200 hover:shadow-md", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="meta-label">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold data-value text-gray-900">{value}</span>
            {unit && <span className="text-sm font-medium text-gray-400 font-mono">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className="p-2.5 bg-blue-50/50 rounded-xl text-blue-600">
            {icon}
          </div>
        )}
      </div>
      {description && (
        <div className="mt-4 pt-4 border-t border-gray-50">
          <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-blue-400" />
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
