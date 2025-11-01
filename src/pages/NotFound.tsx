import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">La pagina richiesta non è stata trovata.</p>
      <Button asChild>
        <Link to="/">Torna alla dashboard</Link>
      </Button>
    </div>
  );
};
