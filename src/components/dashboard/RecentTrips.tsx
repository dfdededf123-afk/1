import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/utils";

interface RecentTrip {
  id: string;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string | null;
  distance_km: number | null;
}

export const RecentTrips = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["trips", "recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("id, start_location, end_location, start_time, end_time, distance_km")
        .order("start_time", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as RecentTrip[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Viaggi recenti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p>Caricamento viaggi...</p>}
        {!isLoading && data?.length === 0 && <p className="text-muted-foreground">Nessun viaggio registrato.</p>}
        {data?.map((trip) => (
          <div key={trip.id} className="rounded-lg border p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{trip.start_location} → {trip.end_location}</span>
              <span className="text-muted-foreground">{formatDate(trip.start_time)}</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {trip.distance_km ? `${trip.distance_km.toFixed(1)} km` : "Distanza non disponibile"}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
