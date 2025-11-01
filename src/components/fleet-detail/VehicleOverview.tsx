import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Vehicle } from "@/integrations/supabase/types";

interface VehicleOverviewProps {
  vehicle: Vehicle | null;
}

export const VehicleOverview = ({ vehicle }: VehicleOverviewProps) => {
  if (!vehicle) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dettagli veicolo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Seleziona un veicolo per visualizzare le informazioni.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{vehicle.brand} {vehicle.model}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Targa</p>
          <p className="font-medium">{vehicle.license_plate}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Anno</p>
          <p className="font-medium">{vehicle.year}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tipo</p>
          <p className="font-medium capitalize">{vehicle.vehicle_type}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Stato</p>
          <p className="font-medium capitalize">{vehicle.status.replace("_", " ")}</p>
        </div>
      </CardContent>
    </Card>
  );
};
