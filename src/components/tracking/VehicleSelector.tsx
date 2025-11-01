import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle } from "@/integrations/supabase/types";

interface VehicleSelectorProps {
  value: string | null;
  onChange: (vehicleId: string | null) => void;
}

export const VehicleSelector = ({ value, onChange }: VehicleSelectorProps) => {
  const { data } = useQuery({
    queryKey: ["vehicles", "selector"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("id, license_plate, brand, model").order("brand");
      if (error) throw error;
      return data as Vehicle[];
    },
  });

  return (
    <select
      className="w-full rounded-md border px-3 py-2 text-sm"
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value || null)}
    >
      <option value="">Seleziona veicolo</option>
      {data?.map((vehicle) => (
        <option key={vehicle.id} value={vehicle.id}>
          {vehicle.brand} {vehicle.model} · {vehicle.license_plate}
        </option>
      ))}
    </select>
  );
};
