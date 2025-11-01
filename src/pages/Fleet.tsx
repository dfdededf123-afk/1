import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle } from "@/integrations/supabase/types";
import { VehicleFormDialog } from "@/components/fleet/VehicleFormDialog";
import { Link } from "react-router-dom";

export const Fleet = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["vehicles", "list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, license_plate, brand, model, status, current_km")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Vehicle[];
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestione flotta</h1>
          <p className="text-sm text-muted-foreground">Visualizza, modifica e aggiungi veicoli all'inventario.</p>
        </div>
        <VehicleFormDialog onSaved={() => queryClient.invalidateQueries({ queryKey: ["vehicles"] })} />
      </div>
      <div className="overflow-hidden rounded-xl border bg-background">
        <table className="text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Targa</th>
              <th className="px-4 py-3 text-left font-medium">Modello</th>
              <th className="px-4 py-3 text-left font-medium">Stato</th>
              <th className="px-4 py-3 text-left font-medium">Km attuali</th>
              <th className="px-4 py-3 text-left font-medium">Dettaglio</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  Caricamento veicoli...
                </td>
              </tr>
            )}
            {data?.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">{vehicle.license_plate}</td>
                <td className="px-4 py-3">{vehicle.brand} {vehicle.model}</td>
                <td className="px-4 py-3 capitalize">{vehicle.status.replace("_", " ")}</td>
                <td className="px-4 py-3">{vehicle.current_km.toLocaleString("it-IT")}</td>
                <td className="px-4 py-3">
                  <Link className="text-primary underline" to={`/fleet/${vehicle.id}`}>
                    Apri scheda
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
