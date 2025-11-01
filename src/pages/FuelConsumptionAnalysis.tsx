import { FuelConsumption } from "@/components/dashboard/FuelConsumption";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FuelConsumptionAnalysis = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Analisi consumi carburante</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Questa sezione aggrega i dati storici di consumo carburante per individuare anomalie e ottimizzazioni.
          </p>
        </CardContent>
      </Card>
      <FuelConsumption />
    </div>
  );
};
