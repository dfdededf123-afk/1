import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];

export const useAuth = () => {
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
};
