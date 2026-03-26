import { History, CloudSun } from "lucide-react";
import { cn } from "../lib/utils";
import { type LayoutProps } from "../types/types";

export function Layout({
  children,
  activeTab,
  onTabChange,
  locationName,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-xl tracking-tighter text-gray-800 leading-none">
                Weather
              </span>
              <span className="text-[8px] font-bold text-blue-600 tracking-[0.2em] leading-none mt-1">
                open-meteo api
              </span>
            </div>
          </div>

          <div className="flex items-center mx-auto sm:mx-0 gap-1.5 bg-gray-300  rounded-2xl border border-gray-200">
            <button
              onClick={() => onTabChange("current")}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5",
                activeTab === "current"
                  ? "bg-white text-blue-600 border-[1px] border-blue-500 shadow-sm"
                  : "text-gray-800",
              )}
            >
              <CloudSun size={18} />
              Forecast
            </button>
            <button
              onClick={() => onTabChange("historical")}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5",
                activeTab === "historical"
                  ? "bg-white text-blue-600 border-[1px] border-blue-500 shadow-sm"
                  : "text-gray-800",
              )}
            >
              <History size={18} />
              Historical
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                Location
              </span>
              <span className="text-xs font-bold text-gray-700 font-mono mt-1">
                {locationName || "Detecting..."}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">{children}</main>
    </div>
  );
}
