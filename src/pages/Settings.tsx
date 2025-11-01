import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Settings = () => {
  const [company, setCompany] = useState("LogiTrack Demo");
  const [timezone, setTimezone] = useState("Europe/Rome");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Impostazioni</h1>
        <p className="text-sm text-muted-foreground">Configura preferenze organizzative e integrazioni.</p>
      </div>
      <div className="space-y-4 rounded-xl border bg-background p-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome azienda</label>
          <input className="w-full rounded-md border px-3 py-2" value={company} onChange={(event) => setCompany(event.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Fuso orario</label>
          <select className="w-full rounded-md border px-3 py-2" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
            <option value="Europe/Rome">Europe/Rome</option>
            <option value="Europe/Berlin">Europe/Berlin</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <Button className="mt-4 w-full sm:w-auto">Salva modifiche</Button>
      </div>
    </div>
  );
};
