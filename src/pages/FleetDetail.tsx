import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle } from "@/integrations/supabase/types";
import { VehicleOverview } from "@/components/fleet-detail/VehicleOverview";
import { DriverAssignments } from "@/components/fleet-detail/DriverAssignments";
import { MaintenanceHistory } from "@/components/fleet-detail/MaintenanceHistory";
import { FuelAnalysis } from "@/components/fleet-detail/FuelAnalysis";
import { KilometerHistory } from "@/components/fleet-detail/KilometerHistory";
import { ExpensesBreakdown } from "@/components/fleet-detail/ExpensesBreakdown";
import { DocumentsList } from "@/components/fleet-detail/DocumentsList";

export const FleetDetail = () => {
  const { id } = useParams();

  const { data: vehicle } = useQuery({
    queryKey: ["vehicle", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Vehicle;
    },
  });

  const expensesData = useMemo(() => (
    [
      { type: "fuel", amount: 1230 },
      { type: "maintenance", amount: 860 },
      { type: "toll", amount: 210 },
    ]
  ), []);

  const kilometerData = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, index) => ({
        date: new Date(new Date().setMonth(new Date().getMonth() - (5 - index))).toLocaleDateString("it-IT", {
          month: "short",
        }),
        kilometers: 2500 + index * 150,
      })),
    []
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <VehicleOverview vehicle={vehicle ?? null} />
          <FuelAnalysis vehicle={vehicle ?? null} />
        </div>
        <DriverAssignments vehicleId={vehicle?.id ?? null} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <MaintenanceHistory vehicleId={vehicle?.id ?? null} />
        <DocumentsList vehicleId={vehicle?.id ?? null} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <KilometerHistory data={kilometerData} />
        <ExpensesBreakdown data={expensesData} />
      </div>
    </div>
  );
};
