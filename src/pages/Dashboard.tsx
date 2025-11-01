import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { FleetOverview } from "@/components/dashboard/FleetOverview";
import { FuelConsumption } from "@/components/dashboard/FuelConsumption";
import { RecentTrips } from "@/components/dashboard/RecentTrips";

export const Dashboard = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      <DashboardStats />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <FuelConsumption />
        <AIAssistant />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <FleetOverview />
        <RecentTrips />
      </div>
    </div>
  );
};
