import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/utils";

interface MaintenanceRecord {
  id: string;
  date: string;
  description: string;
  km_at_maintenance: number;
  cost: number | null;
}

interface MaintenanceHistoryProps {
  vehicleId: string | null;
}

export const MaintenanceHistory = ({ vehicleId }: MaintenanceHistoryProps) => {
  const { data } = useQuery({
    queryKey: ["maintenance-records", vehicleId],
    enabled: Boolean(vehicleId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_records")
        .select("id, date, description, km_at_maintenance, cost")
        .eq("vehicle_id", vehicleId)
        .order("date", { ascending: false });
      if (error) throw error;
      return data as MaintenanceRecord[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storico manutenzioni</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!vehicleId && <p className="text-muted-foreground">Nessun veicolo selezionato.</p>}
        {vehicleId && data?.length === 0 && <p className="text-muted-foreground">Nessuna manutenzione registrata.</p>}
        {data?.map((record) => (
          <div key={record.id} className="rounded-md border p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{record.description}</span>
              <span className="text-muted-foreground">{formatDate(record.date)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Km: {record.km_at_maintenance}</p>
            {record.cost && <p className="text-xs text-muted-foreground">Costo: €{record.cost.toFixed(2)}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
