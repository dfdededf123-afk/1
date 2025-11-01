import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AssignExtraStaffDialogProps {
  onAssign?: (email: string) => Promise<void> | void;
}

export const AssignExtraStaffDialog = ({ onAssign }: AssignExtraStaffDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!email) return;
    setLoading(true);
    await onAssign?.(email);
    setLoading(false);
    setEmail("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Invita supporto esterno</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invita autista esterno</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="driver@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Annulla</Button>
          <Button onClick={handleAssign} disabled={loading}>{loading ? "Invio..." : "Invia invito"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
