import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const { data, error } = await supabase.functions.invoke("logi-agent", {
      body: { action: "general", data: { message: input } },
    });

    if (error) {
      setMessages([...newMessages, { role: "assistant", content: "Errore nella richiesta AI." }]);
    } else {
      setMessages([...newMessages, { role: "assistant", content: data?.message ?? "" }]);
    }

    setLoading(false);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Assistente AI</CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex-1 space-y-2 overflow-y-auto rounded-md border bg-muted/40 p-3 text-sm">
          {messages.length === 0 && <p className="text-muted-foreground">Fai una domanda per iniziare.</p>}
          {messages.map((message, index) => (
            <div key={index} className={message.role === "assistant" ? "text-primary" : "text-foreground"}>
              <strong>{message.role === "assistant" ? "AI" : "Tu"}:</strong> {message.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-md border bg-background px-3 py-2"
            placeholder="Chiedi all'assistente..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button onClick={handleSend} disabled={loading}>
            {loading ? "Invio..." : "Invia"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
