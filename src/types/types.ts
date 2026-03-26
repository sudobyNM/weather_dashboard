export interface LayoutProps {
  children: React.ReactNode;
  activeTab: "current" | "historical";
  onTabChange: (tab: "current" | "historical") => void;
  locationName?: string;
}


