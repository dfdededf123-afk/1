import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Driver } from "@/integrations/supabase/types";
import { AssignExtraStaffDialog } from "@/components/drivers/AssignExtraStaffDialog";

export const Drivers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["drivers", "list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("id, first_name, last_name, email, license_number, status, license_expiry")
        .order("first_name");
      if (error) throw error;
      return data as Driver[];
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Autisti</h1>
          <p className="text-sm text-muted-foreground">Gestisci certificazioni, turni e disponibilità.</p>
        </div>
        <AssignExtraStaffDialog
          onAssign={async (email) => {
            const { data: userData } = await supabase.auth.getUser();
            await supabase.from("notifications").insert({
              title: "Invito inviato",
              message: `Invia credenziali a ${email}`,
              type: "info",
              user_id: userData.user?.id ?? "system",
            });
          }}
        />
      </div>
      <div className="overflow-hidden rounded-xl border bg-background">
        <table className="text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Nome</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Patente</th>
              <th className="px-4 py-3 text-left font-medium">Stato</th>
              <th className="px-4 py-3 text-left font-medium">Scadenza</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  Caricamento autisti...
                </td>
              </tr>
            )}
            {data?.map((driver) => (
              <tr key={driver.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">{driver.first_name} {driver.last_name}</td>
                <td className="px-4 py-3">{driver.email ?? "-"}</td>
                <td className="px-4 py-3">{driver.license_number}</td>
                <td className="px-4 py-3 capitalize">{driver.status.replace("_", " ")}</td>
                <td className="px-4 py-3">{new Date(driver.license_expiry).toLocaleDateString("it-IT")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
