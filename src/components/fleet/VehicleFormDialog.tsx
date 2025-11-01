import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const vehicleSchema = z.object({
  license_plate: z.string().min(6, "Inserire una targa valida"),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.coerce.number().min(1980).max(new Date().getFullYear()),
  vehicle_type: z.enum(["truck", "van", "trailer"]),
  fuel_type: z.enum(["diesel", "gasoline", "electric", "hybrid"]),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

interface VehicleFormDialogProps {
  onSaved?: () => void;
}

export const VehicleFormDialog = ({ onSaved }: VehicleFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicle_type: "truck",
      fuel_type: "diesel",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    const { error } = await supabase.from("vehicles").insert(values);
    setLoading(false);
    if (!error) {
      setOpen(false);
      form.reset();
      onSaved?.();
    } else {
      form.setError("license_plate", { message: error.message });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Aggiungi veicolo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuovo veicolo</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Targa</label>
            <input className="w-full rounded-md border px-3 py-2" {...form.register("license_plate")} />
            {form.formState.errors.license_plate && (
              <p className="text-xs text-destructive">{form.formState.errors.license_plate.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Marca</label>
              <input className="w-full rounded-md border px-3 py-2" {...form.register("brand")} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Modello</label>
              <input className="w-full rounded-md border px-3 py-2" {...form.register("model")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Anno</label>
              <input type="number" className="w-full rounded-md border px-3 py-2" {...form.register("year", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo</label>
              <select className="w-full rounded-md border px-3 py-2" {...form.register("vehicle_type")}>
                <option value="truck">Camion</option>
                <option value="van">Furgone</option>
                <option value="trailer">Rimorchio</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Carburante</label>
              <select className="w-full rounded-md border px-3 py-2" {...form.register("fuel_type")}>
                <option value="diesel">Diesel</option>
                <option value="gasoline">Benzina</option>
                <option value="hybrid">Ibrido</option>
                <option value="electric">Elettrico</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit" disabled={loading}>{loading ? "Salvataggio..." : "Salva"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
