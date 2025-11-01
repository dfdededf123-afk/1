import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

const StatCard = ({ title, value, subtitle }: StatCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-semibold">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </CardContent>
  </Card>
);

export const DashboardStats = () => {
  const { data: fleetCount } = useQuery({
    queryKey: ["vehicles", "count"],
    queryFn: async () => {
      const { count } = await supabase.from("vehicles").select("id", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: driverCount } = useQuery({
    queryKey: ["drivers", "count"],
    queryFn: async () => {
      const { count } = await supabase.from("drivers").select("id", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: monthlyExpenses } = useQuery({
    queryKey: ["expenses", "monthly"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("amount")
        .gte("date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      if (error) throw error;
      return data?.reduce((total, expense) => total + (expense.amount ?? 0), 0) ?? 0;
    },
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Veicoli attivi" value={String(fleetCount ?? "-")} />
      <StatCard title="Autisti" value={String(driverCount ?? "-")} />
      <StatCard title="Spese mese" value={formatCurrency(monthlyExpenses ?? 0)} />
      <StatCard title="Utilizzo flotta" value="82%" subtitle="Ultimi 7 giorni" />
    </div>
  );
};
