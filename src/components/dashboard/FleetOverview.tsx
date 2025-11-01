import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle } from "@/integrations/supabase/types";

export const FleetOverview = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicles", "overview"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("id, license_plate, brand, model, status").limit(6);
      if (error) throw error;
      return data as Vehicle[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flotta recente</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Caricamento veicoli...</p>}
        {error && <p className="text-destructive">Impossibile caricare i veicoli.</p>}
        {!isLoading && !error && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="pb-2 font-medium text-muted-foreground">Targa</th>
                <th className="pb-2 font-medium text-muted-foreground">Modello</th>
                <th className="pb-2 font-medium text-muted-foreground">Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-muted/40">
                  <td className="py-2">{vehicle.license_plate}</td>
                  <td className="py-2">{vehicle.brand} {vehicle.model}</td>
                  <td className="py-2 capitalize">{vehicle.status.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};
