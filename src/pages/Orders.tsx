import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Orders = () => {
  const orders = [
    { id: "ORD-204", client: "Logistica Roma", status: "in_progress", distance: 540 },
    { id: "ORD-205", client: "Nord Cargo", status: "planned", distance: 320 },
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Ordini e viaggi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-xs text-muted-foreground">Cliente: {order.client}</p>
              </div>
              <div className="text-right">
                <p className="capitalize">{order.status.replace("_", " ")}</p>
                <p className="text-xs text-muted-foreground">{order.distance} km</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
