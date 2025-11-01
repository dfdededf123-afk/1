import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface DriverAssignment {
  id: string;
  assignment_type: string;
  assigned_at: string;
  drivers: {
    first_name: string;
    last_name: string;
  } | null;
}

interface DriverAssignmentsProps {
  vehicleId: string | null;
}

export const DriverAssignments = ({ vehicleId }: DriverAssignmentsProps) => {
  const { data } = useQuery({
    queryKey: ["driver-assignments", vehicleId],
    enabled: Boolean(vehicleId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("driver_assignments")
        .select("id, assignment_type, assigned_at, drivers(first_name, last_name)")
        .eq("vehicle_id", vehicleId)
        .is("unassigned_at", null);
      if (error) throw error;
      return data as DriverAssignment[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assegnazioni attive</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!vehicleId && <p className="text-muted-foreground">Seleziona un veicolo per continuare.</p>}
        {vehicleId && data?.length === 0 && <p className="text-muted-foreground">Nessun autista assegnato.</p>}
        {data?.map((assignment) => (
          <div key={assignment.id} className="rounded-md border p-3">
            <p className="font-medium">{assignment.drivers ? `${assignment.drivers.first_name} ${assignment.drivers.last_name}` : "Autista sconosciuto"}</p>
            <p className="text-xs text-muted-foreground capitalize">{assignment.assignment_type}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
