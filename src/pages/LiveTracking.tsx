import { useMemo, useState } from "react";
import { MapView } from "@/components/tracking/MapView";
import { VehicleSelector } from "@/components/tracking/VehicleSelector";
import { KilometerStats } from "@/components/tracking/KilometerStats";

export const LiveTracking = () => {
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  const coordinates = useMemo<[number, number][]>(
    () => [
      [12.4964, 41.9028],
      [9.19, 45.4642],
      [14.2681, 40.8518],
    ],
    []
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tracking in tempo reale</h1>
          <p className="text-sm text-muted-foreground">Monitora posizione e performance dei veicoli.</p>
        </div>
        <div className="w-full max-w-sm">
          <VehicleSelector value={vehicleId} onChange={setVehicleId} />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="h-[420px] overflow-hidden rounded-xl border">
          <MapView coordinates={coordinates} />
        </div>
        <KilometerStats total={125430} averagePerTrip={640} />
      </div>
    </div>
  );
};
