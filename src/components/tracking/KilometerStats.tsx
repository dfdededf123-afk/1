import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KilometerStatsProps {
  total: number;
  averagePerTrip: number;
}

export const KilometerStats = ({ total, averagePerTrip }: KilometerStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiche chilometriche</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Totale km registrati</p>
          <p className="text-2xl font-semibold">{total.toLocaleString("it-IT")}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Media per viaggio</p>
          <p className="text-2xl font-semibold">{averagePerTrip.toLocaleString("it-IT")}</p>
        </div>
      </CardContent>
    </Card>
  );
};
