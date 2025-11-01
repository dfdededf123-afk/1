import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ExpensesBreakdownProps {
  data: { type: string; amount: number }[];
}

export const ExpensesBreakdown = ({ data }: ExpensesBreakdownProps) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ripartizione spese</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {data.length === 0 && <p className="text-muted-foreground">Nessun costo registrato per il veicolo selezionato.</p>}
        {data.map((item) => (
          <div key={item.type} className="flex items-center justify-between">
            <span className="capitalize">{item.type}</span>
            <span className="font-medium">{formatCurrency(item.amount)}</span>
          </div>
        ))}
        {data.length > 0 && (
          <div className="flex items-center justify-between border-t pt-3 font-semibold">
            <span>Totale</span>
            <span>{formatCurrency(total)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
