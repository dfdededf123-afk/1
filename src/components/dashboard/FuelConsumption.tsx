import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface FuelPoint {
  date: string;
  consumption: number;
}

export const FuelConsumption = () => {
  const { data } = useQuery({
    queryKey: ["trips", "fuel"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("end_time, average_consumption")
        .not("average_consumption", "is", null)
        .order("end_time", { ascending: true });
      if (error) throw error;
      return data as { end_time: string; average_consumption: number }[];
    },
  });

  const chartData = useMemo<FuelPoint[]>(() => {
    return (
      data?.map((trip) => ({
        date: new Date(trip.end_time).toLocaleDateString("it-IT", { month: "short", day: "2-digit" }),
        consumption: trip.average_consumption,
      })) ?? []
    );
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumi medi</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, "dataMax"]} />
            <Tooltip contentStyle={{ background: "hsl(var(--background))", borderRadius: 8 }} />
            <Line type="monotone" dataKey="consumption" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
