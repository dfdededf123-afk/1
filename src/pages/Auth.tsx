import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setMessage(error ? error.message : "Controlla la tua email per il link di accesso");
  };

  const handleSignup = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setMessage(error ? error.message : "Registrazione completata. Verifica la tua email.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20">
      <div className="w-full max-w-md rounded-xl border bg-background p-8 shadow">
        <h1 className="text-2xl font-semibold">Accedi a LogiTrack</h1>
        <p className="mt-2 text-sm text-muted-foreground">Gestisci flotte, autisti e percorsi in un'unica piattaforma.</p>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleLogin} disabled={loading}>
              Accedi
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleSignup} disabled={loading}>
              Registrati
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
