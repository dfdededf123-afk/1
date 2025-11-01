import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface KilometerHistoryProps {
  data: { date: string; kilometers: number }[];
}

export const KilometerHistory = ({ data }: KilometerHistoryProps) => {
  const chartData = useMemo(() => data ?? [], [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend chilometraggio</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--background))", borderRadius: 8 }} />
            <Area type="monotone" dataKey="kilometers" stroke="hsl(var(--primary))" fill="url(#colorKm)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
