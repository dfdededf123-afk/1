import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/utils";

interface DocumentItem {
  id: string;
  type: string;
  file_name: string;
  status: string;
  date: string | null;
}

interface DocumentsListProps {
  vehicleId: string | null;
}

export const DocumentsList = ({ vehicleId }: DocumentsListProps) => {
  const { data } = useQuery({
    queryKey: ["documents", vehicleId],
    enabled: Boolean(vehicleId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("id, type, file_name, status, date")
        .eq("vehicle_id", vehicleId)
        .order("date", { ascending: false });
      if (error) throw error;
      return data as DocumentItem[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documenti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {!vehicleId && <p className="text-muted-foreground">Seleziona un veicolo per visualizzare i documenti.</p>}
        {vehicleId && data?.length === 0 && <p className="text-muted-foreground">Nessun documento caricato.</p>}
        {data?.map((document) => (
          <div key={document.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{document.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {document.type.toUpperCase()} · {document.date ? formatDate(document.date) : "Data sconosciuta"}
              </p>
            </div>
            <span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">{document.status}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
