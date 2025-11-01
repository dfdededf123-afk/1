import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Vehicle } from "@/integrations/supabase/types";

interface FuelAnalysisProps {
  vehicle: Vehicle | null;
}

export const FuelAnalysis = ({ vehicle }: FuelAnalysisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisi consumi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {!vehicle && <p className="text-muted-foreground">Seleziona un veicolo per analizzare i consumi.</p>}
        {vehicle && (
          <>
            <div className="flex items-center justify-between">
              <span>Consumo medio</span>
              <span className="font-medium">{vehicle.consumption_mixed ? `${vehicle.consumption_mixed} L/100km` : "N/D"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Km attuali</span>
              <span className="font-medium">{vehicle.current_km.toLocaleString("it-IT")}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              I dati vengono aggregati automaticamente dai viaggi registrati e possono essere integrati da AI o fonti esterne.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
